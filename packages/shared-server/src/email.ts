import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import { MJMLParsingOptions } from 'mjml-core';
import { compile } from 'handlebars';
import { Email } from 'node-mailjet';
import { MailService } from '@sendgrid/mail';
import { Transporter } from 'nodemailer';

export const generateEmailFromTemplate = (templateName: string, options: { context: any, handlebarsOptions: RuntimeOptions, mjmlOption: MJMLParsingOptions}) => {
  const p = path.join(__dirname, 'mjmls', `${templateName}.mjml`);
  if (!fs.existsSync(p)) new Error(`Email template was not found! (${templateName})`);
  const content = fs.readFileSync(p, 'utf8');
  const compiled = compile(content)(options.context, options.handlebarsOptions);
  return mjml2html(compiled, options.mjmlOption);
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  from: EmailRecipient;
  to: EmailRecipient;
  subject: string;
  text: string;
  html: string;
}

export const mailjetSendEmail = async (options: EmailOptions) => {
  const mailjet = await getMailjet();
  return mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [{
        From: {
          Email: options.from.email,
          Name: options.from.name,
        },
        To: [{
          Email: options.to.email,
          Name: options.to.name,
        }],
        Subject: options.subject,
        TextPart: options.text,
        HTMLPart: options.html,
      }]
    })
}

export const sendgridSendEmail = async (options: EmailOptions) => {
  const sgMail = await getSendgrid();
  return sgMail
    .send({
      from: options.from,
      to: options.to,
      html: options.html,
      subject: options.subject,
      text: options.text,
    });
}

export const smtpSendEmail = async (options: EmailOptions) => {
  const nodemailer = await getNodemailer();
  return nodemailer.sendMail({
    from: options.from.name ? { address: options.from.email, name: options.from.name } : options.from.email,
    to: options.to.name ? { address: options.to.email, name: options.to.name } : options.to.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
}

export const sendEmail = (smtp: 'MAILJET' | 'SENDGRID' | 'NODEMAILER', options: EmailOptions) => {
  switch(smtp) {
    case 'MAILJET':
      return mailjetSendEmail(options);
    case 'SENDGRID':
      return sendgridSendEmail(options);
    case 'NODEMAILER':
      return smtpSendEmail(options);
  }
}

let _mailjet: Email.Client;
export const getMailjet = async () => {
  if (_mailjet) return _mailjet;
  return _mailjet = (await import('node-mailjet')).connect(process.env.MJ_APIKEY_PUBLIC!, process.env.MJ_APIKEY_PRIVATE!);
}

let _sgMail: MailService;
export const getSendgrid = async () => {
  if (_sgMail) return _sgMail;
  _sgMail = (await import('@sendgrid/mail')).default;
  _sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  return _sgMail;
}

let _nodemailer: Transporter;
export const getNodemailer = async () => {
  if (_nodemailer) return _nodemailer;
  return _nodemailer = (await import('nodemailer'))
    .createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });
}