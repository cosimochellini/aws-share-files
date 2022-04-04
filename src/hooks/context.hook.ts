import theme from "../themes";
import { createContext, useContext } from "react";
import type { Theme } from "../../src/barrel/mui.barrel";
import { ConverterResponse } from "../types/converter.types";

export const defaultContext = {
  theme: theme.dark,
  setTheme: (t: Theme) => {},

  jobs: [] as ConverterResponse[],
  setJobs: (jobs: ConverterResponse[]) => {},
};

export const Context = createContext(defaultContext);

export const useCurrentContext = () => useContext(Context);
