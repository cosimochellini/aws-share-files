import theme from "../themes";
import { Theme } from "@mui/material";
import { UserEmail } from "../types/dynamo.types";
import { createContext, useContext } from "react";

export const defaultContext = {
  theme: theme.dark,
  setTheme: (t: Theme) => {},
  emails: [] as UserEmail[],
  setEmails: (emails: UserEmail[]) => {},
};

export const Context = createContext(defaultContext);

export const useCurrentContext = () => useContext(Context);
