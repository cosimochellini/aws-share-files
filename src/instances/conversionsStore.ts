import { UnReactiveStore } from "../classes/UnReactiveStore";

export const conversionStore = new UnReactiveStore(
  "LS_CONVERSIONS",
  [] as string[]
);
