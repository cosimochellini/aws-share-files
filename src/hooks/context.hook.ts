import theme from "../themes";
import { Theme } from "@mui/material";
import { Nullable } from "../types/generic";
import { S3Folder } from "../classes/S3Folder";
import { UserEmail } from "../types/dynamo.types";
import { createContext, useContext } from "react";

export const defaultContext = {
  theme: theme.dark,
  setTheme: (t: Theme) => {},
  emails: null as Nullable<UserEmail[]>,
  setEmails: (emails: Nullable<UserEmail[]>) => {},
  folders: null as Nullable<S3Folder[]>,
  setFolders: (folders: Nullable<S3Folder[]>) => {},
};

export const Context = createContext(defaultContext);

export const useCurrentContext = () => useContext(Context);
