import { NextApiRequest } from "next";
import { env } from "../../instances/env";
import { getSession } from "next-auth/react"
import { retrieveError } from "../retrieveError";
import type { BaseResponse } from "../../types/generic";

export const defaultBehavior = (
    apiFn: (req: NextApiRequest, res: BaseResponse) => unknown | Promise<unknown>,
    options = { shouldAuthenticate: false },
) => {
    return async (req: NextApiRequest, res: BaseResponse) => {
        try {
            if (options?.shouldAuthenticate) {
                const session = await getSession({ req })

                if (!session) return res.status(401).json({ error: "You must be logged in to access this page." })

                if (!env.auth.emails.includes(session.user?.email ?? ""))
                    return res.status(403).json({ error: "You are not authorized to access this page." })
            }
            const ret = apiFn(req, res);

            const data = ret instanceof Promise ? await ret : ret;

            res.status(200).json(data);
        } catch (e) {
            res.status(400).json({ error: retrieveError(e) });
        }
    };
};
