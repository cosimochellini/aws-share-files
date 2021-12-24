import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

let loading = false;

export const useS3Folders = () => {
  const { folders, setFolders } = useCurrentContext();

  const loadFolders = useCallback(
    async (force: boolean = false) => {
      if (loading || (folders && !force)) return;

      loading = true;

      await functions.s3
        .files()
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
    setFolders(undefined);

    return loadFolders(true);
  };

  return { folders, refreshFolders };
};
