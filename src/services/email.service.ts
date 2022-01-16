import { env } from "../instances/env";
import { bucket } from "./bucket.service";
import { FileInfo } from "../classes/FileInfo";
import { transporter } from "../instances/transporter";
import { ServiceArguments, ServiceMapper } from "../types/generic";

export const email = {
  async sendFile({ to, fileKey }: { to: string; fileKey: string }) {
    // const content = (await bucket.downloadFile(fileKey)).stream();
    const { signedUrl } = bucket.getShareableUrl({ key: fileKey, expires: 1 });

    const fileInfo = new FileInfo(fileKey);

    const ret = await transporter.sendMail({
      to,
      from: env.sendgrid.email,
      subject: "New file sent ✔", // Subject line
      html: `<b> You've received a new file from ${env.info.appTitle}, enjoy! </b>`, // html body
      attachments: [
        {
          path: signedUrl,
          filename: fileInfo.CompleteName,
          contentType: `application/${fileInfo.Extension}`,
        },
      ],
    });

    return ret;
  },
};

export type emailTypes = ServiceMapper<typeof email>;

export type emailArguments = ServiceArguments<typeof email>;
