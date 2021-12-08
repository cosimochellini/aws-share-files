import { env } from "../instances/env";
import { ServiceMapper } from "../types/generic";
import { transporter } from "../instances/transporter";

const { signature } = env.email;

export const email = {
  sendEmail(to: string, fileKey?: string) {
    return transporter
      .sendMail({
        from: signature,
        to,
        subject: "New file sent ✔", // Subject line
        html: "<b>There is a test. It's about sending emails, check it out!</b>", // html body
      })
      .catch(console.error);
  },
};

export type emailTypes = ServiceMapper<typeof email>;
