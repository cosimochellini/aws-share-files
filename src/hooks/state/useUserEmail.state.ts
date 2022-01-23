import { byBoolean, byValue } from "sort-es";
import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { notification } from "../../instances/notification";

let loading = false;

export const useUserEmail = () => {

    const { emails, setEmails } = useCurrentContext();

    const loadEmails = useCallback(
        async (options = { force: false }) => {
            if (loading || (emails && !options?.force)) return;

            loading = true;

            await functions.email
                .getEmails()
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
        return loadEmails({ force: true });
    };

    return { emails, refreshEmails };
};
