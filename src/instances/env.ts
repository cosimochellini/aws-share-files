function str(value: string | undefined) {
  if (value) return value;

  const callerFunction = paramName(arguments.callee);

  throw new Error("Missing value for " + callerFunction);
}

function arr(value: string | undefined) {
  if (value) return value.split(",");

  const callerFunction = paramName(arguments.callee);

  throw new Error("Missing value for " + callerFunction);
}

function int(value: string | undefined) {
  if (value) return parseInt(value, 10);

  const callerFunction = paramName(arguments.callee);

  throw new Error("Missing value for " + callerFunction);
}

function paramName(func: Function) {
  return func
    .toString()
    .replace(/[/][/].*$/gm, "") // strip single-line comments
    .replace(/\s+/g, "") // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
    .split("){", 1)[0]
    .replace(/^[^(]*[(]/, "") // extract the parameters
    .replace(/=[^,]+/g, "") // strip any ES6 defaults
    .split(",")
    .filter(Boolean); // split & filter [""]
}

export const env = {
  get aws() {
    return {
      bucket: str(process.env.S3_BUCKET),
      region: str(process.env.S3_REGION),
      accessKeyId: str(process.env.S3_ACCESS_KEY_ID),
      secretAccessKey: str(process.env.S3_SECRET_ACCESS_KEY),
    };
  },

  get info() {
    return {
      appTitle: str(process.env.APP_TITLE),
      appLogoUrl: str(process.env.APP_LOGO_URL),
      appIconUrl: str(process.env.APP_ICON_URL),
    };
  },

  get content() {
    return {
      baseUrl: str(process.env.CONTENT_API_URL),
      invalidWords: arr(process.env.CONTENT_INVALID_WORDS),
    };
  },

  get email() {
    return {
      signature: str(process.env.EMAIL_SIGNATURE),
      host: str(process.env.EMAIL_HOST),
      port: int(process.env.EMAIL_PORT),
      auth: {
        user: str(process.env.EMAIL_USER),
        pass: str(process.env.EMAIL_PASSWORD),
      },
    };
  },

  get converter() {
    return {
      apiKey: str(process.env.CONVERTER_API_KEY),
      baseUrl: str(process.env.CONVERTER_API_URL),
      header: str(process.env.CONVERTER_API_HEADER),
    };
  },

  get emailProvider() {
    const { email } = this;
    return {
      server: `smtp://${email.auth.user}:${email.auth.pass}@${email.host}:${email.port}`,
      from: email.signature,
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
};
