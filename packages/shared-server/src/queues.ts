import { createQueueManager } from "./QueueManager";
import { EmailOptions, generateEmailFromTemplate, sendEmail, SMTPProvider } from "./email";
import { Job } from "bullmq";

const defaultSMTPProvider: SMTPProvider = 'NODEMAILER';

export interface TemplatedEmailData {
  email: Omit<EmailOptions, 'html'>;
  template: {
    name: string;
    language?: string;
    context?: Record<string, any>;
  }
}

export type EmailData = {
  email: EmailOptions;
} | TemplatedEmailData;


const queues = {
    email: {
      enableQueueSchedule: true,
      operations: {
        send: {
          async processor(job: Job<EmailData[]>) {
            const emails = job.data.map((e: any) => {
              if (!e.email.html && !e.template.name) throw new Error('Email is missing html or template name!');
              if (e.email.html) return e.email;
              return {
                ...e.email,
                html: generateEmailFromTemplate(e.template.name, { context: e.template.context }),
              }
            })
            await sendEmail(defaultSMTPProvider, emails);
          },
        }
      }
    },
} as const;

export const createAppQueueManager = () => createQueueManager<typeof queues>({ queues });