export const formatter = {
  dateFormatter(date: string | Date | null | undefined): string {
    return new Date(date ?? "").toLocaleDateString();
  },
};
