export const env = {
  aws: {
    bucket: process.env.S3_BUCKET as string,
    region: process.env.S3_REGION as string,
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  info: {
    appTitle: process.env.APP_TITLE as string,
  },
  content: {
    baseUrl: process.env.CONTENT_API_URL as string,
    invalidWords: ["z_lib", "org"],
  },
  email: {
    signature: process.env.EMAIL_SIGNATURE as string,
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string),
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  },
  get emailProvider() {
    const { email } = this;
    return {
      server: `smtp://${email.auth.user}:${email.auth.pass}@${email.host}:${email.port}`,
      from: email.signature,
    };
  },
};
