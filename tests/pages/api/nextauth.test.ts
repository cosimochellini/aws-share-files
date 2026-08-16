import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-auth', () => ({
  default: vi.fn(() => vi.fn()),
}));

vi.mock('next-auth/providers/email', () => ({
  default: vi.fn((options: unknown) => ({ id: 'email', type: 'email', options })),
}));

vi.mock('@next-auth/dynamodb-adapter', () => ({
  DynamoDBAdapter: vi.fn(() => ({ adapter: 'dynamodb' })),
}));

vi.mock('../../../src/instances/aws', () => ({
  dynamoDbClient: { client: 'dynamo' },
  s3Client: { client: 's3' },
}));

/**
 * The route calls NextAuth() at module scope, so the module has to be evaluated inside the
 * test - `clearMocks` wipes the call history recorded by a top level import.
 */
const loadRoute = async () => {
  vi.resetModules();

  const nextAuth = (await import('next-auth')).default as unknown as Mock;
  const emailProvider = (await import('next-auth/providers/email')).default as unknown as Mock;
  const { DynamoDBAdapter } = await import('@next-auth/dynamodb-adapter');
  const { dynamoDbClient } = await import('../../../src/instances/aws');

  await import('../../../pages/api/auth/[...nextauth]');

  const [options] = nextAuth.mock.calls[0] ?? [];

  return {
    nextAuth,
    emailProvider,
    dynamoDbAdapter: DynamoDBAdapter as unknown as Mock,
    dynamoDbClient,
    options,
  };
};

describe('pages/api/auth/[...nextauth]', () => {
  it('builds the NextAuth handler exactly once', async () => {
    const { nextAuth, options } = await loadRoute();

    expect(nextAuth).toHaveBeenCalledTimes(1);
    expect(options).toBeDefined();
  });

  it('registers the email provider built from the env configuration', async () => {
    const { emailProvider, options } = await loadRoute();

    expect(emailProvider).toHaveBeenCalledTimes(1);
    expect(emailProvider).toHaveBeenCalledWith({
      server: 'smtp://noreply@example.test:test-password@smtp.example.test:587',
      from: 'Test App <noreply@example.test>',
    });

    expect(options.providers).toEqual([emailProvider.mock.results[0]?.value]);
  });

  it('wires the dynamodb adapter to the shared client', async () => {
    const { dynamoDbAdapter, dynamoDbClient, options } = await loadRoute();

    expect(dynamoDbAdapter).toHaveBeenCalledWith(dynamoDbClient, { tableName: 'next-auth' });
    expect(options.adapter).toEqual({ adapter: 'dynamodb' });
  });

  it('signs the session with the nextauth secret', async () => {
    const { options } = await loadRoute();

    expect(options.secret).toBe('test-nextauth-secret');
  });

  it('forces a jwt session with the documented lifetimes', async () => {
    const { options } = await loadRoute();

    expect(options.session).toEqual({
      strategy: 'jwt',
      maxAge: 12 * 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    });
  });

  it('exports the handler returned by NextAuth', async () => {
    vi.resetModules();

    const nextAuth = (await import('next-auth')).default as unknown as Mock;
    const route = await import('../../../pages/api/auth/[...nextauth]');

    expect(route.default).toBe(nextAuth.mock.results[0]?.value);
  });
});
