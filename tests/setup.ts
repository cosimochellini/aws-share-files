import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * src/instances/env.ts and src/instances/env.public.ts both read process.env eagerly at
 * module evaluation and call .split(',') between them on three of the values. If any of
 * them is missing, importing *anything* that transitively reaches either module throws a
 * TypeError before a single test can run.
 *
 * These assignments run at the top of the setup file, so they land before the module
 * graph under test is evaluated. Keep this list in sync with both env modules.
 */
export const testEnv = {
  S3_BUCKET: 'test-bucket',
  S3_REGION: 'eu-south-1',
  S3_ACCESS_KEY_ID: 'test-access-key-id',
  S3_SECRET_ACCESS_KEY: 'test-secret-access-key',

  APP_TITLE: 'Test App',
  APP_LOGO_URL: 'https://example.test/logo.png',
  APP_ICON_URL: 'https://example.test/icon.png',

  CONTENT_API_URL: 'https://content.example.test',
  CONTENT_INVALID_WORDS: 'ita,eng,epub',

  EMAIL_SIGNATURE: 'Test App <noreply@example.test>',
  EMAIL_HOST: 'smtp.example.test',
  EMAIL_PORT: '587',
  EMAIL_USER: 'noreply@example.test',
  EMAIL_PASSWORD: 'test-password',

  CONVERTER_API_KEY: 'test-converter-key',
  CONVERTER_API_URL: 'https://converter.example.test/',
  CONVERTER_API_HEADER: 'x-oc-api-key',
  CONVERTER_API_EXTENSION: 'pdf,epub,mobi',

  AUTH_AUTHORIZED_EMAILS: 'allowed@example.test,second@example.test',

  NEXTAUTH_URL: 'http://localhost:6969',
  NEXTAUTH_SECRET: 'test-nextauth-secret',
} as const;

Object.assign(process.env, testEnv);

const TEST_MESSAGE_ID = 'test-message-id';

/**
 * src/instances/transporter.ts calls nodemailer.createTransport(...).verify() at module
 * scope, which would attempt a real SMTP handshake during the test run. Mocked globally
 * so no test can accidentally reach the network.
 *
 * The transport is a single hoisted object rather than one built inside the factory, so
 * src/instances/transporter.ts can capture it once at import time and every test can
 * still reach the same instance afterwards.
 */
const nodemailerMock = vi.hoisted(() => {
  const transport = {
    verify: vi.fn(),
    sendMail: vi.fn(),
  };

  return { transport, createTransport: vi.fn(() => transport) };
});

vi.mock('nodemailer', () => ({
  // src/instances/transporter.ts uses a default import; next-auth's email provider
  // imports a named createTransport. Both shapes have to be present.
  default: { createTransport: nodemailerMock.createTransport },
  createTransport: nodemailerMock.createTransport,
}));

// jsdom does not implement matchMedia, which src/services/device.service.ts relies on.
const matchMediaMock = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
} as unknown as MediaQueryList);

beforeEach(() => {
  // verify and sendMail are created as bare vi.fn() above, so this is where they get an
  // implementation at all. It has to be a beforeEach rather than part of the factory
  // because tests are free to override them: src/instances/transporter.ts calls verify()
  // at module scope, and an unarmed mock returns undefined there, so the .catch() chained
  // onto it throws a TypeError that transporter.ts's try/catch then swallows.
  nodemailerMock.createTransport.mockReturnValue(nodemailerMock.transport);
  nodemailerMock.transport.verify.mockResolvedValue(true);
  nodemailerMock.transport.sendMail.mockResolvedValue({ messageId: TEST_MESSAGE_ID });

  vi.stubGlobal('matchMedia', vi.fn(matchMediaMock));
  window.matchMedia = vi.fn(matchMediaMock);

  // src/instances/notification.ts always console.error()s; keep the output readable
  // while still letting tests assert on it.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // @testing-library/react only registers its own cleanup when `afterEach` is a global,
  // and vitest.config.mts sets `globals: false`. Without this call every render() and
  // renderHook() tree stays mounted in document.body for the rest of the file, so a hook
  // holding a timer or a resize listener would keep firing into later tests.
  cleanup();

  vi.unstubAllGlobals();
  window.localStorage.clear();
});
