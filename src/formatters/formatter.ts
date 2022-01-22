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
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 3600 * 24,
    weeks: 3600 * 24 * 7,
    months: 3600 * 24 * 30,
    years: 3600 * 24 * 365,
} as Record<Intl.RelativeTimeFormatUnit, number>;

const parse = (date: datable): Date => new Date(date ?? "");

export const formatter = {
    dateFormatter(date: datable): string {
        return dateIntLn.format(parse(date));
    },

    relativeFormatter(date: datable): string {
        const secondsElapsed = (parse(date).getTime() - Date.now()) / 1000;

        for (const key in ranges) {
            const typedKey = key as keyof typeof ranges;

            if (ranges[typedKey] < Math.abs(secondsElapsed)) {
                const delta = secondsElapsed / ranges[typedKey];

                return rtf.format(Math.round(delta), typedKey);
            }
        }
        return "";
    },

    timeFormatter(date: datable): string {
        const time = parse(date);
        const hours = time.getHours();
        const minutes = time.getMinutes();

        return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""
            }${minutes}`;
    },

    fileFormatter(bytes: number): string {
        if (bytes == 0) return "0 Byte";

        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return Math.round(bytes / Math.pow(1024, i)) + " " + fileSizes[i];
    },
};
