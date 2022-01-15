import { env } from "./env";
import nodemailer from "nodemailer";
import { notification } from "./notification";
import sgTransport from "nodemailer-sendgrid";

const { email } = env;

const transporter = nodemailer.createTransport(sgTransport({ apiKey: env.sendgrid.apiKey }));

// const transporter = nodemailer.createTransport({ SES: sesClient });

transporter.verify().catch(notification.error);

export { transporter };
