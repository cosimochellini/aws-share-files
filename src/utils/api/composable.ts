import { Session } from 'next-auth';
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

import { env } from '../../instances/env';
import { retrieveError } from '../retrieveError';
import type { BaseResponse } from '../../types/generic';

export const defaultBehavior = <T>(
  apiFn: (
    req: NextApiRequest,
    res: BaseResponse,
    session: Session | null
  ) => T | Promise<T>,
  options = { shouldAuthenticate: true },
) => async (req: NextApiRequest, res: BaseResponse) => {
    let currentSession: Session | null = null;
    try {
      if (options?.shouldAuthenticate) {
        const session = await getSession({ req });

        if (!session) {
          return res
            .status(401)
            .json({ error: 'You must be logged in to access this page.' });
        }

        if (!env.auth.emails.includes(session.user?.email ?? '')) {
          return res
            .status(403)
            .json({ error: 'You are not authorized to access this page.' });
        }

        currentSession = session;
      }

      const ret = apiFn(req, res, currentSession);

      const data = ret instanceof Promise ? await ret : ret;

      return res.status(200).json(data);
    } catch (e) {
      return res.status(400).json({ error: retrieveError(e) });
    }
  };
