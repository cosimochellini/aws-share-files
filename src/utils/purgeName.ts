export const purgeName = (name: string = ""): string => {
  const plainName = removeExtension(name);

  return plainName
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll(".", " ")
    .replaceAll("  ", " ");
};

const removeExtension = (name: string): string => {
  return name.replace(/\.[^/.]+$/, "");
};
