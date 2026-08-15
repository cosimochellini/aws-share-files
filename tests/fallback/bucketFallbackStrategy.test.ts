import { describe, expect, it, vi } from 'vitest';

import { bucket } from '../../src/services/bucket.service';
import { bucketFallbackStrategy } from '../../src/fallback/bucketFallbackStrategy';

describe('bucketFallbackStrategy', () => {
  it('hands the real bucket service to the callback and returns its value', async () => {
    const actions = vi.fn().mockResolvedValue({ ok: true });

    const result = await bucketFallbackStrategy(actions);

    expect(actions).toHaveBeenCalledWith(bucket);
    expect(result).toEqual({ ok: true });
  });

  it('awaits the callback rather than returning the raw promise', async () => {
    const result = await bucketFallbackStrategy(async (dep) => typeof dep.getAllFiles);

    expect(result).toBe('function');
  });

  it('normalises a rejected callback into an { error } payload', async () => {
    const result = await bucketFallbackStrategy(() => Promise.reject(new Error('s3 is down')));

    expect(result).toEqual({ error: 's3 is down' });
  });

  it('normalises a synchronously thrown error into an { error } payload', async () => {
    const result = await bucketFallbackStrategy(() => {
      throw new Error('boom');
    });

    expect(result).toEqual({ error: 'boom' });
  });

  it('stringifies non-Error rejections through retrieveError', async () => {
    const result = await bucketFallbackStrategy(() => Promise.reject('plain string failure'));

    expect(result).toEqual({ error: 'plain string failure' });
  });
});
