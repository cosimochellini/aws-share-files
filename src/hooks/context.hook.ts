import theme from "../themes";
import { Theme } from "@mui/material";
import { S3Folder } from "../classes/S3Folder";
import { UserEmail } from "../types/dynamo.types";
import { createContext, useContext } from "react";

export const defaultContext = {
  theme: theme.dark,
  setTheme: (t: Theme) => {},
  emails: null as UserEmail[] | null,
  setEmails: (emails: UserEmail[] | null) => {},
  folders: null as S3Folder[] | null,
  setFolders: (folders: S3Folder[] | null) => {},
};

export const Context = createContext(defaultContext);

export const useCurrentContext = () => useContext(Context);
