import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '../../src/instances/env';

describe('env parsing', () => {
  it('exposes the aws credentials', () => {
    expect(env.aws).toEqual({
      bucket: 'test-bucket',
      region: 'eu-south-1',
      accessKeyId: 'test-access-key-id',
      secretAccessKey: 'test-secret-access-key',
    });
  });

  it('exposes the app info', () => {
    expect(env.info).toEqual({
      appTitle: 'Test App',
      appLogoUrl: 'https://example.test/logo.png',
      appIconUrl: 'https://example.test/icon.png',
    });
  });

  it('splits the comma separated content blacklist', () => {
    expect(env.content.baseUrl).toBe('https://content.example.test');
    expect(env.content.invalidWords).toEqual(['ita', 'eng', 'epub']);
  });

  it('parses the smtp port as a number', () => {
    expect(env.email).toEqual({
      service: 'Gmail',
      signature: 'Test App <noreply@example.test>',
      host: 'smtp.example.test',
      port: 587,
      auth: {
        user: 'noreply@example.test',
        pass: 'test-password',
      },
    });
    expect(typeof env.email.port).toBe('number');
  });

  it('splits the comma separated converter extensions', () => {
    expect(env.converter).toEqual({
      apiKey: 'test-converter-key',
      baseUrl: 'https://converter.example.test/',
      header: 'x-oc-api-key',
      extensions: ['pdf', 'epub', 'mobi'],
    });
  });

  it('splits the comma separated authorised emails', () => {
    expect(env.auth.emails).toEqual(['allowed@example.test', 'second@example.test']);
  });
});

describe('env.emailProvider', () => {
  it('builds an smtp connection string from the email settings', () => {
    expect(env.emailProvider).toEqual({
      server: 'smtp://noreply@example.test:test-password@smtp.example.test:587',
      from: 'Test App <noreply@example.test>',
    });
  });
});

describe('env.defaultManifest', () => {
  it('derives the pwa manifest from the app info', () => {
    expect(env.defaultManifest).toEqual({
      name: 'Test App',
      short_name: 'Test App',
      start_url: '/files/',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'https://example.test/logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    });
  });
});

describe('env re-evaluation', () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
    vi.resetModules();
  });

  it('reads process.env fresh on every module evaluation', async () => {
    process.env.APP_TITLE = 'Another App';
    process.env.EMAIL_PORT = '2525';
    process.env.CONTENT_INVALID_WORDS = 'fra';
    process.env.AUTH_AUTHORIZED_EMAILS = 'only@example.test';

    vi.resetModules();

    const { env: reloaded } = await import('../../src/instances/env');

    expect(reloaded.info.appTitle).toBe('Another App');
    expect(reloaded.defaultManifest.short_name).toBe('Another App');
    expect(reloaded.email.port).toBe(2525);
    expect(reloaded.emailProvider.server).toContain(':2525');
    expect(reloaded.content.invalidWords).toEqual(['fra']);
    expect(reloaded.auth.emails).toEqual(['only@example.test']);
  });
});
