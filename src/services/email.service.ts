import { env } from "../instances/env";
import { bucket } from "./bucket.service";
import { FileInfo } from "../classes/FileInfo";
import { ServiceMapper } from "../types/generic";
import { transporter } from "../instances/transporter";

export const email = {
  async sendFile(to: string, fileKey: string) {
    const content = (await bucket.downloadFile(fileKey)).stream();

    const fileInfo = new FileInfo(fileKey);

    const ret = await transporter.sendMail({
      to,
      from: env.email.signature,
      subject: "New file sent ✔", // Subject line
      html: "<b>There is a test. It's about sending emails, check it out!</b>", // html body
      attachments: [
        {
          content,
          filename: fileInfo.CompleteName,
          contentType: `application/${fileInfo.Extension}`,
        },
      ],
    });

    return ret;
  },
};

export type emailTypes = ServiceMapper<typeof email>;
