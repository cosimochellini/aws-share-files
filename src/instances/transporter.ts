import nodemailer from 'nodemailer';

import { env } from './env';
import { notification } from './notification';

const { email } = env;

// const transporter = nodemailer.createTransport({ SES: sesClient });
const transporter = nodemailer.createTransport(email);

try {
  transporter.verify?.()?.catch?.(notification.error);
} catch (error) {
  notification.error(error);
}

export { transporter };
