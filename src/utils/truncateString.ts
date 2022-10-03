export function truncateString(str: string, num = 30) {
  if (str.length < num) return str;

  return `${str.slice(0, num)}...`;
}
