import crate from 'zustand';
import { byBoolean, byValue } from 'sort-es';

import { UserEmail } from '../types/dynamo.types';
import { functions } from '../instances/functions';
import { notification } from '../instances/notification';

interface EmailsStore {
  emails: UserEmail[];

  loading: boolean;

  loadEmails: (force?: boolean) => Promise<void>;

  refreshEmails: (reset?: boolean) => Promise<void>;

  addEmail: (email: UserEmail) => Promise<void>;

  deleteEmail: (email: UserEmail) => Promise<void>;
}

export const useEmailsStore = crate<EmailsStore>((set, get) => ({
  emails: [],
  loading: false,

  loadEmails: async (force = false) => {
    const { emails, loading } = get();

    if ((emails?.length || loading) && !force) return;

    set({ loading: true });

    await functions.email
      .getEmails()
      .then((emails) => {
        emails.sort(byValue((x) => x.default, byBoolean()));

        set({ emails });
      })
      .catch(notification.error)
      .finally(() => set({ loading: false }));
  },

  refreshEmails: async (reset = false) => {
    const { loadEmails } = get();

    if (reset) set({ emails: [] });

    await loadEmails(true);
  },

  addEmail: async (email: UserEmail) => {
    const { refreshEmails } = get();

    await functions.email
      .addEmail(email)
      .then(() => refreshEmails())
      .catch(notification.error);
  },

  deleteEmail: async (email: UserEmail) => {
    const { refreshEmails } = get();

    await functions.email
      .deleteEmail(email)
      .then(() => refreshEmails())
      .catch(notification.error);
  },
}));
