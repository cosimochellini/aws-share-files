const intln = new Intl.DateTimeFormat("en-US");

export const formatter = {
  dateFormatter(date: string | Date | null | undefined): string {
    return intln.format(new Date(date ?? ""));
  },
};
