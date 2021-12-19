import { byBoolean, byValue } from "sort-es";
import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

let loading = false;

export const useUserEmail = () => {
  const { emails, setEmails } = useCurrentContext();

  const loadEmails = useCallback(
    (force: boolean = false) => {
      if (loading || (emails && !force)) return;

      loading = true;

      functions.email
        .getEmails("cosimo.chellini@gmail.com")
        .then((emails) =>
          setEmails(emails.sort(byValue((x) => x.default, byBoolean())))
        )
        .catch(notification.error)
        .finally(() => (loading = false));
    },
    [emails, setEmails]
  );

  useEffect(() => {
    loadEmails();
  }, [emails, loadEmails]);

  const refreshEmails = () => {
    loadEmails(true);
  };

  return { emails, refreshEmails };
};
