import { env } from "./env";
import nodemailer from "nodemailer";
import { notification } from "./notification";

const { email } = env;

const transporter = nodemailer.createTransport(email);

// const transporter = nodemailer.createTransport({ SES: sesClient });

transporter.verify().catch(notification.error);

export { transporter };
