import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

let loading = false;

export const useS3Folders = () => {
  const { folders, setFolders } = useCurrentContext();

  const loadFolders = useCallback(
    (force: boolean = false) => {
      if (loading || (folders && !force)) return;

      loading = true;

      functions.s3
        .root()
        .then((folders) => setFolders(folders))
        .catch(notification.error)
        .finally(() => (loading = false));
    },
    [folders, setFolders]
  );

  useEffect(() => {
    loadFolders();
  }, [folders, loadFolders]);

  const refreshFolders = () => {
    loadFolders(true);
  };

  return { folders, refreshFolders };
};
