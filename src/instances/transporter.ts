import { env } from "./env";
import nodemailer from "nodemailer";
import { notification } from "./notification";
import sgTransport from "nodemailer-sendgrid";

const { email } = env;

const transporter = nodemailer.createTransport(sgTransport({ apiKey: env.sendgrid.apiKey }));

// const transporter = nodemailer.createTransport({ SES: sesClient });

try {

    transporter.verify?.()?.catch?.(console.error);
} catch (error) {
    console.error(error);

}

export { transporter };
