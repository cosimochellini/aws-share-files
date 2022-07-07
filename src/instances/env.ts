export const env = {
  get aws() {
    return {
      bucket: process.env.S3_BUCKET as string,
      region: process.env.S3_REGION as string,
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    };
  },

  get info() {
    return {
      appTitle: process.env.APP_TITLE as string,
      appLogoUrl: process.env.APP_LOGO_URL as string,
      appIconUrl: process.env.APP_ICON_URL as string,
    };
  },

  get content() {
    return {
      baseUrl: process.env.CONTENT_API_URL as string,
      invalidWords: (process.env.CONTENT_INVALID_WORDS as string).split(","),
    };
  },

  get email() {
    return {
      service: "Gmail",
      signature: process.env.EMAIL_SIGNATURE as string,
      host: process.env.EMAIL_HOST as string,
      port: parseInt(process.env.EMAIL_PORT as string, 10),
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASSWORD as string,
      },
    };
  },

  get converter() {
    return {
      apiKey: process.env.CONVERTER_API_KEY as string,
      baseUrl: process.env.CONVERTER_API_URL as string,
      header: process.env.CONVERTER_API_HEADER as string,
      extensions: (process.env.CONVERTER_API_EXTENSION as string).split(","),
    };
  },

  get emailProvider() {
    const { email } = this;
    return {
      server: `smtp://${email.auth.user}:${email.auth.pass}@${email.host}:${email.port}`,
      from: email.signature,
    };
  },

  get sendgrid() {
    return {
      apiKey: process.env.SEND_GRID_API_KEY as string,
      email: process.env.SEND_GRID_EMAIL as string,
    };
  },

  get defaultManifest() {
    const { info } = this;
    return {
      name: info.appTitle,
      short_name: info.appTitle,
      start_url: "/files/",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: info.appLogoUrl,
          sizes: "192x192",
          type: "image/png",
        },
      ],
    };
  },

  get auth() {
    return {
      emails: (process.env.AUTH_AUTHORIZED_EMAILS as string).split(","),
    };
  },
};
