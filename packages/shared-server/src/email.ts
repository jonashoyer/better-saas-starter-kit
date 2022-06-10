import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import { MJMLParsingOptions } from 'mjml-core';
import { compile } from 'handlebars';
import { Email } from 'node-mailjet';
import { MailService } from '@sendgrid/mail';
import { Transporter } from 'nodemailer';
import { asArray } from 'shared';

export const generateEmailFromTemplate = (templateName: string, options: { language?: string, context?: any, handlebarsOptions?: RuntimeOptions, mjmlOption?: MJMLParsingOptions}) => {
  const p = path.join(__dirname, 'mjmls', options.language ?? 'en', `${templateName}.mjml`);
  if (!fs.existsSync(p)) new Error(`Email template was not found! (${templateName})`);
  const content = fs.readFileSync(p, 'utf8');
  const compiled = compile(content)(options.context, options.handlebarsOptions);
  const { html, errors } = mjml2html(compiled, options.mjmlOption);
  if (errors.length > 0) throw errors;
  return html;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  from: EmailRecipient;
  to: EmailRecipient;
  subject: string;
  text?: string;
  html: string;
}

export type SMTPProvider = 'MAILJET' | 'SENDGRID' | 'NODEMAILER';

export const sendEmail = (smtp: SMTPProvider, options: EmailOptions | EmailOptions[]) => {
  const payload = asArray(options);
  switch(smtp) {
    case 'MAILJET':
      return mailjetSendEmail(payload);
    case 'SENDGRID':
      return sendgridSendEmail(payload);
    case 'NODEMAILER':
      return smtpSendEmail(payload);
  }
}


export const mailjetSendEmail = async (options: EmailOptions[]) => {
  const mailjet = await getMailjet();
  return mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: options.map(e => ([{
        From: {
          Email: e.from.email,
          Name: e.from.name,
        },
        To: [{
          Email: e.to.email,
          Name: e.to.name,
        }],
        Subject: e.subject,
        TextPart: e.text,
        HTMLPart: e.html,
      }]))
    })
}

export const sendgridSendEmail = async (options: EmailOptions[]) => {
  const sgMail = await getSendgrid();
  return sgMail
    .send(options.map(e => ({
      from: e.from,
      to: e.to,
      html: e.html,
      subject: e.subject,
      text: e.text,
    })))
}

export const smtpSendEmail = async (options: EmailOptions[]) => {
  const nodemailer = await getNodemailer();
  const result = await Promise.allSettled(
    options.map(e => 
      nodemailer.sendMail({
        from: e.from.name ? { address: e.from.email, name: e.from.name } : e.from.email,
        to: e.to.name ? { address: e.to.email, name: e.to.name } : e.to.email,
        subject: e.subject,
        text: e.text,
        html: e.html,
      })
    )
  )

  const rejected = result.filter(r => r.status === 'rejected');
  if (rejected.length > 0) throw new Error((rejected[0] as any).reason);
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
      secure: process.env.SMTP_SECURE == 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });
}