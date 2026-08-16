import { publicEnv } from './env.public';

/**
 * The server half of the configuration: every value here is either a credential or a
 * detail the browser has no business knowing.
 *
 * Import it only from server-side code -- pages/api/**, the services those routes call,
 * and the build scripts. A client component that imports this module drags all of it into
 * the browser bundle. The browser-safe values live in env.public.ts and are re-used below
 * so the two files never restate the same process.env read.
 */
export const env = {
  aws: {
    bucket: process.env.S3_BUCKET as string,
    region: process.env.S3_REGION as string,
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },

  info: publicEnv.info,

  content: {
    baseUrl: process.env.CONTENT_API_URL as string,
    invalidWords: publicEnv.content.invalidWords,
  },

  email: {
    service: 'Gmail',
    signature: process.env.EMAIL_SIGNATURE as string,
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  },

  converter: {
    apiKey: process.env.CONVERTER_API_KEY as string,
    baseUrl: process.env.CONVERTER_API_URL as string,
    header: process.env.CONVERTER_API_HEADER as string,
    extensions: (process.env.CONVERTER_API_EXTENSION as string).split(','),
  },

  get emailProvider() {
    const { email } = this;
    return {
      server: `smtp://${email.auth.user}:${email.auth.pass}@${email.host}:${email.port}`,
      from: email.signature,
    };
  },

  auth: {
    emails: (process.env.AUTH_AUTHORIZED_EMAILS as string).split(','),
    secret: process.env.NEXTAUTH_SECRET as string,
  },
} as const;
