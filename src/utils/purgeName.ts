import { env } from "../instances/env";

const { invalidWords } = env.content;

export const purgeName = (name: string = ""): string => {
  let plainName = removeExtension(name);

  for (const word of invalidWords) {
    plainName = plainName.replace(new RegExp(word, "gi"), "");
  }

  return plainName
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll(".", " ")
    .replaceAll("  ", " ");
};

const removeExtension = (name: string): string => {
  return name.replace(/\.[^/.]+$/, "");
};
