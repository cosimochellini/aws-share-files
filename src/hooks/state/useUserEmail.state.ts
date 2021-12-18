import { byBoolean, byValue } from "sort-es";
import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

export const useUserEmail = () => {
  const { emails, setEmails } = useCurrentContext();

  const loadEmails = useCallback(
    (force: boolean = false) => {
      if (emails && !force) return;

      functions.email
        .getEmails("cosimo.chellini@gmail.com")
        .then((emails) =>
          setEmails(emails.sort(byValue((x) => x.default, byBoolean())))
        )
        .catch(notification.error);
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
