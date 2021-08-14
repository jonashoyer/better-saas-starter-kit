import { QueueManagerEntity, QueueManagerReturn } from "./QueueManager";
import { QueueManager } from "./QueueManager";
import { EmailOptions, generateEmailFromTemplate, sendEmail, SMTPProvider } from "./email";

const defaultSMTPProvider: SMTPProvider = 'MAILJET';

export function createQueue<T = any, R = any, N extends string = string>(args?: QueueManagerEntity<T, R, N>): QueueManagerEntity<T, R, N> {
  return args ?? {};
}

export interface TemplatedEmailData {
  email: Omit<EmailOptions, 'html'>;
  template: {
    name: string;
    context?: Record<string, any>;
  }
}

export type EmailData = {
  email: EmailOptions;
} | TemplatedEmailData;

export type QueueManagerType = QueueManagerReturn<{
  email: QueueManagerEntity<EmailData[], void, 'send'>;
}>;

export const createQueueMananger = () => {
  return QueueManager({
    queues: {
      email: createQueue<EmailData[], void, 'send'>(),
    },
    processors: {
      async email(job) {
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
    },
  })
}