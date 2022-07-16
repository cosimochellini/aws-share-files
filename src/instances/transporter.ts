import { env } from "./env";
import nodemailer from "nodemailer";
import { notification } from "./notification";

const { email } = env;

// const transporter = nodemailer.createTransport({ SES: sesClient });
const transporter = nodemailer.createTransport(email);

try {
  transporter.verify?.()?.catch?.(notification.error);
} catch (error) {
  console.error(error);
}

export { transporter };
