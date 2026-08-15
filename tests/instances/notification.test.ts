import { afterEach, describe, expect, it, vi } from 'vitest';

import type { notificationData } from '../../src/instances/notification';

/**
 * The mitt bus is a module singleton and `notification` exposes no `off`, so every test
 * re-imports the module to get a bus with no leftover subscribers.
 */
const freshNotification = () => {
  vi.resetModules();

  return import('../../src/instances/notification');
};

afterEach(() => {
  vi.resetModules();
});

describe('notification.onShow', () => {
  it('receives every show payload', async () => {
    const { notification, notificationType } = await freshNotification();

    const received: notificationData[] = [];
    notification.onShow((data) => received.push(data));

    notification.show(notificationType.info, 'first');
    notification.show(notificationType.warning, 'second');

    expect(received).toEqual([
      { type: notificationType.info, message: 'first' },
      { type: notificationType.warning, message: 'second' },
    ]);
  });

  it('fans out to every subscriber', async () => {
    const { notification, notificationType } = await freshNotification();

    const first = vi.fn();
    const second = vi.fn();

    notification.onShow(first);
    notification.onShow(second);

    notification.success('done');

    expect(first).toHaveBeenCalledWith({ type: notificationType.success, message: 'done' });
    expect(second).toHaveBeenCalledWith({ type: notificationType.success, message: 'done' });
  });
});

describe('notification levels', () => {
  it('success emits the success type', async () => {
    const { notification, notificationType } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.success('saved');

    expect(listener).toHaveBeenCalledWith({ type: notificationType.success, message: 'saved' });
  });

  it('info emits the info type', async () => {
    const { notification, notificationType } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.info('heads up');

    expect(listener).toHaveBeenCalledWith({ type: notificationType.info, message: 'heads up' });
  });

  it('warning emits the warning type', async () => {
    const { notification, notificationType } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.warning('careful');

    expect(listener).toHaveBeenCalledWith({ type: notificationType.warning, message: 'careful' });
  });
});

describe('notification.error', () => {
  it('logs and emits the message of an Error', async () => {
    const { notification, notificationType } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    const error = new Error('it broke');
    notification.error(error);

    expect(console.error).toHaveBeenCalledWith(error);
    expect(listener).toHaveBeenCalledWith({
      type: notificationType.error,
      message: 'it broke',
    });
  });

  it('passes a plain string through untouched', async () => {
    const { notification, notificationType } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.error('plain failure');

    expect(listener).toHaveBeenCalledWith({
      type: notificationType.error,
      message: 'plain failure',
    });
  });

  it('json-stringifies an object payload', async () => {
    const { notification } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.error({ code: 500 });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ message: JSON.stringify({ code: 500 }, null, 2) }),
    );
  });

  it('falls back to "Unknown error" for primitives retrieveError cannot read', async () => {
    const { notification } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    notification.error(42);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Unknown error' }),
    );
  });

  it('still logs but does not emit when there is no window', async () => {
    const { notification } = await freshNotification();

    const listener = vi.fn();
    notification.onShow(listener);

    vi.stubGlobal('window', undefined);

    notification.error(new Error('server side failure'));

    expect(console.error).toHaveBeenCalledWith(new Error('server side failure'));
    expect(listener).not.toHaveBeenCalled();
  });
});
