const intLn = new Intl.DateTimeFormat("en-US");

export const formatter = {
  dateFormatter(date: string | Date | null | undefined): string {
    return intLn.format(new Date(date ?? ""));
  },
};
