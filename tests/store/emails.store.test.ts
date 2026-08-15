import { renderHook, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { functions } from '../../src/instances/functions';
import { notification } from '../../src/instances/notification';
import type { UserEmail } from '../../src/types/dynamo.types';
import { useEmailsStore, useEmailsStoreLoader } from '../../src/store/emails.store';

vi.mock('../../src/instances/functions', () => ({
  functions: {
    email: {
      getEmails: vi.fn(),
      addEmail: vi.fn(),
      deleteEmail: vi.fn(),
    },
  },
}));

const getEmails = vi.mocked(functions.email.getEmails);
// both resolve with a dynamodb command output, which the store never looks at
const addEmail = functions.email.addEmail as unknown as Mock;
const deleteEmail = functions.email.deleteEmail as unknown as Mock;

const buildEmail = (email: string, isDefault = false): UserEmail => ({
  pk: `pk-${email}`,
  sk: `sk-${email}`,
  user: 'owner@example.test',
  email,
  description: `description of ${email}`,
  default: isDefault,
});

const initialState = useEmailsStore.getState();

describe('emails.store', () => {
  beforeEach(() => {
    useEmailsStore.setState({ ...initialState, emails: [], loading: false }, true);

    getEmails.mockResolvedValue([]);
    addEmail.mockResolvedValue(undefined);
    deleteEmail.mockResolvedValue(undefined);
  });

  describe('loadEmails', () => {
    it('fetches and sorts the default email first', async () => {
      const plain = buildEmail('plain@example.test');
      const primary = buildEmail('primary@example.test', true);

      getEmails.mockResolvedValue([plain, primary]);

      await useEmailsStore.getState().loadEmails();

      expect(getEmails).toHaveBeenCalledTimes(1);
      expect(useEmailsStore.getState().emails).toEqual([primary, plain]);
      expect(useEmailsStore.getState().loading).toBe(false);
    });

    it('toggles loading while the request is in flight', async () => {
      let loadingDuringFetch = false;

      getEmails.mockImplementation(async () => {
        loadingDuringFetch = useEmailsStore.getState().loading;
        return [];
      });

      await useEmailsStore.getState().loadEmails();

      expect(loadingDuringFetch).toBe(true);
      expect(useEmailsStore.getState().loading).toBe(false);
    });

    it('does not refetch when emails are already loaded', async () => {
      useEmailsStore.setState({ emails: [buildEmail('cached@example.test')] });

      await useEmailsStore.getState().loadEmails();

      expect(getEmails).not.toHaveBeenCalled();
    });

    it('does not refetch while a load is already in flight', async () => {
      useEmailsStore.setState({ loading: true });

      await useEmailsStore.getState().loadEmails();

      expect(getEmails).not.toHaveBeenCalled();
      expect(useEmailsStore.getState().loading).toBe(true);
    });

    it('refetches when forced even with emails already present', async () => {
      const cached = buildEmail('cached@example.test');
      const fresh = buildEmail('fresh@example.test');

      useEmailsStore.setState({ emails: [cached] });
      getEmails.mockResolvedValue([fresh]);

      await useEmailsStore.getState().loadEmails(true);

      expect(getEmails).toHaveBeenCalledTimes(1);
      expect(useEmailsStore.getState().emails).toEqual([fresh]);
    });

    it('refetches when forced even while loading', async () => {
      useEmailsStore.setState({ loading: true });

      await useEmailsStore.getState().loadEmails(true);

      expect(getEmails).toHaveBeenCalledTimes(1);
    });

    it('notifies and clears loading when the fetch rejects', async () => {
      const error = new Error('boom');
      const errorSpy = vi.spyOn(notification, 'error');

      getEmails.mockRejectedValue(error);

      await useEmailsStore.getState().loadEmails();

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(useEmailsStore.getState().emails).toEqual([]);
      expect(useEmailsStore.getState().loading).toBe(false);
    });
  });

  describe('refreshEmails', () => {
    it('forces a refetch keeping the current list until it resolves', async () => {
      const cached = buildEmail('cached@example.test');
      const fresh = buildEmail('fresh@example.test');

      useEmailsStore.setState({ emails: [cached] });

      let emailsDuringFetch: UserEmail[] = [];

      getEmails.mockImplementation(async () => {
        emailsDuringFetch = useEmailsStore.getState().emails;
        return [fresh];
      });

      await useEmailsStore.getState().refreshEmails();

      expect(emailsDuringFetch).toEqual([cached]);
      expect(useEmailsStore.getState().emails).toEqual([fresh]);
    });

    it('clears the list first when reset is requested', async () => {
      const cached = buildEmail('cached@example.test');
      const fresh = buildEmail('fresh@example.test');

      useEmailsStore.setState({ emails: [cached] });

      let emailsDuringFetch: UserEmail[] = [cached];

      getEmails.mockImplementation(async () => {
        emailsDuringFetch = useEmailsStore.getState().emails;
        return [fresh];
      });

      await useEmailsStore.getState().refreshEmails(true);

      expect(emailsDuringFetch).toEqual([]);
      expect(useEmailsStore.getState().emails).toEqual([fresh]);
    });
  });

  describe('addEmail', () => {
    it('calls the api and refreshes the list', async () => {
      const created = buildEmail('created@example.test');

      getEmails.mockResolvedValue([created]);

      await useEmailsStore.getState().addEmail(created);

      expect(addEmail).toHaveBeenCalledWith(created);
      expect(getEmails).toHaveBeenCalledTimes(1);
      expect(useEmailsStore.getState().emails).toEqual([created]);
    });

    it('notifies and does not refresh when the api rejects', async () => {
      const error = new Error('cannot add');
      const errorSpy = vi.spyOn(notification, 'error');

      addEmail.mockRejectedValue(error);

      await useEmailsStore.getState().addEmail(buildEmail('nope@example.test'));

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(getEmails).not.toHaveBeenCalled();
    });
  });

  describe('deleteEmail', () => {
    it('calls the api and refreshes the list', async () => {
      const removed = buildEmail('removed@example.test');

      useEmailsStore.setState({ emails: [removed] });
      getEmails.mockResolvedValue([]);

      await useEmailsStore.getState().deleteEmail(removed);

      expect(deleteEmail).toHaveBeenCalledWith(removed);
      expect(getEmails).toHaveBeenCalledTimes(1);
      expect(useEmailsStore.getState().emails).toEqual([]);
    });

    it('notifies and does not refresh when the api rejects', async () => {
      const error = new Error('cannot delete');
      const errorSpy = vi.spyOn(notification, 'error');

      deleteEmail.mockRejectedValue(error);

      await useEmailsStore.getState().deleteEmail(buildEmail('nope@example.test'));

      expect(errorSpy).toHaveBeenCalledWith(error);
      expect(getEmails).not.toHaveBeenCalled();
    });
  });

  describe('useEmailsStoreLoader', () => {
    it('loads the emails on mount and returns the store', async () => {
      const loaded = buildEmail('loaded@example.test');

      getEmails.mockResolvedValue([loaded]);

      const { result } = renderHook(() => useEmailsStoreLoader());

      await waitFor(() => {
        expect(getEmails).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(useEmailsStore.getState().emails).toEqual([loaded]);
      });

      expect(result.current).toBe(useEmailsStore);
    });

    it('does not load again when the emails are already there', async () => {
      useEmailsStore.setState({ emails: [buildEmail('cached@example.test')] });

      renderHook(() => useEmailsStoreLoader());

      await waitFor(() => {
        expect(useEmailsStore.getState().loading).toBe(false);
      });

      expect(getEmails).not.toHaveBeenCalled();
    });
  });
});
