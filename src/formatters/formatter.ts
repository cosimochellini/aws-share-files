import { Nullable } from "../types/generic";

type datable = Nullable<string | Date>;

const defaultLang = "en-US";
const fileSizes = ["Bytes", "KB", "MB", "GB", "TB"];

const dateIntLn = new Intl.DateTimeFormat(defaultLang, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const rtf = new Intl.RelativeTimeFormat(defaultLang, {
  localeMatcher: "best fit", // other values: "lookup"
  numeric: "always", // other values: "auto"
  style: "long", // other values: "short" or "narrow"
});

const ranges = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1,
} as any;

const parse = (date: datable): Date => new Date(date ?? "");

export const formatter = {
  dateFormatter(date: datable): string {
    return dateIntLn.format(parse(date));
  },
  relativeFormatter(date: datable): string {
    const secondsElapsed = (parse(date).getTime() - Date.now()) / 1000;
    for (let key in ranges) {
      if (ranges[key] < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / ranges[key];
        return rtf.format(Math.round(delta), key as any);
      }
    }
    return "";
  },
  fileFormatter(bytes: number): string {
    if (bytes == 0) return "0 Byte";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return Math.round(bytes / Math.pow(1024, i)) + " " + fileSizes[i];
  },
};
