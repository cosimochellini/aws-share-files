import { env } from "./env";
import nodemailer from "nodemailer";

const { email } = env;

const transporter = nodemailer.createTransport(email);

transporter.verify().then(console.log).catch(console.error);

export { transporter };
