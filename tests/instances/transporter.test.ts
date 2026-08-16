import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '../../src/instances/env';

type TransportMock = {
  createTransport: Mock
  verify: Mock
  sendMail: Mock
};

/**
 * `src/instances/transporter.ts` does all of its work at module scope, so every case has to
 * reset the registry, install its own nodemailer double, and re-import the module. The spy
 * on `notification.error` has to be attached to the *same* module generation the transporter
 * will import, hence the import order below.
 */
const loadTransporter = async (verify: Mock): Promise<{
  transport: TransportMock
  error: Mock
}> => {
  vi.resetModules();

  const sendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
  const createTransport = vi.fn(() => ({ verify, sendMail }));

  vi.doMock('nodemailer', () => ({
    default: { createTransport },
    createTransport,
  }));

  const { notification } = await import('../../src/instances/notification');
  const error = vi.spyOn(notification, 'error').mockImplementation(() => {}) as unknown as Mock;

  await import('../../src/instances/transporter');

  return { transport: { createTransport, verify, sendMail }, error };
};

afterEach(() => {
  vi.doUnmock('nodemailer');
  vi.resetModules();
});

describe('transporter', () => {
  it('creates the transport from the email env block and verifies it on import', async () => {
    const verify = vi.fn().mockResolvedValue(true);

    const { transport, error } = await loadTransporter(verify);

    expect(transport.createTransport).toHaveBeenCalledTimes(1);
    expect(transport.createTransport).toHaveBeenCalledWith(env.email);
    expect(verify).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  it('exports the object nodemailer handed back', async () => {
    const verify = vi.fn().mockResolvedValue(true);

    vi.resetModules();

    const sendMail = vi.fn();
    const created = { verify, sendMail };
    const createTransport = vi.fn(() => created);

    vi.doMock('nodemailer', () => ({ default: { createTransport }, createTransport }));

    const { transporter } = await import('../../src/instances/transporter');

    expect(transporter).toBe(created);
  });

  it('reports an async verify() rejection through notification.error', async () => {
    const failure = new Error('smtp handshake failed');
    const verify = vi.fn().mockRejectedValue(failure);

    const { error } = await loadTransporter(verify);

    // let the rejected verify() promise settle
    await Promise.resolve();
    await Promise.resolve();

    expect(error).toHaveBeenCalledWith(failure);
  });

  it('reports a synchronous verify() throw through the try/catch', async () => {
    const failure = new Error('transport misconfigured');
    const verify = vi.fn(() => {
      throw failure;
    });

    const { error } = await loadTransporter(verify);

    expect(error).toHaveBeenCalledWith(failure);
  });
});
