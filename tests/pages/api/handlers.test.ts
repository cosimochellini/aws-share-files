import type { NextApiRequest } from 'next';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseResponse } from '../../../src/types/generic';
import type { UserEmail } from '../../../src/types/dynamo.types';
import { bucket } from '../../../src/services/bucket.service';
import { content } from '../../../src/services/content.service';
import { converter } from '../../../src/services/converter.service';
import { email } from '../../../src/services/email.service';
import { userEmails } from '../../../src/services/userEmails.service';
import { fileHandler } from '../../../src/utils/api/fileHandler';

import filesHandler from '../../../pages/api/s3/files.function';
import shareableUrlHandler from '../../../pages/api/s3/shareableUrl.function';
import deleteFileHandler from '../../../pages/api/s3/deleteFile.function';
import uploadFileHandler, { config as uploadFileConfig } from '../../../pages/api/s3/uploadFile.function';
import findFirstHandler from '../../../pages/api/content/findFirst.function';
import findAllHandler from '../../../pages/api/content/findAll.function';
import convertHandler from '../../../pages/api/converter/convert.function';
import getConversionHandler from '../../../pages/api/converter/getConversion.function';
import sendFileHandler from '../../../pages/api/email/sendFile.function';
import getEmailsHandler from '../../../pages/api/email/getEmails.function';
import addEmailHandler from '../../../pages/api/email/addEmail.function';
import deleteEmailHandler from '../../../pages/api/email/deleteEmail.function';
import testHandler from '../../../pages/api/test';

vi.mock('next-auth/react', () => ({ getSession: vi.fn() }));

vi.mock('../../../src/services/bucket.service', () => ({
  bucket: {
    getAllFiles: vi.fn(),
    getShareableUrl: vi.fn(),
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
  },
}));

vi.mock('../../../src/services/content.service', () => ({
  content: {
    findFirstContent: vi.fn(),
    findAllContent: vi.fn(),
  },
}));

vi.mock('../../../src/services/converter.service', () => ({
  converter: {
    convertFile: vi.fn(),
    getConversionStatus: vi.fn(),
  },
}));

vi.mock('../../../src/services/email.service', () => ({
  email: {
    sendFile: vi.fn(),
  },
}));

vi.mock('../../../src/services/userEmails.service', () => ({
  userEmails: {
    getEmails: vi.fn(),
    addEmail: vi.fn(),
    deleteEmail: vi.fn(),
  },
}));

vi.mock('../../../src/utils/api/fileHandler', () => ({ fileHandler: vi.fn() }));

const AUTHORIZED_EMAIL = 'allowed@example.test';

const mocked = {
  getSession: getSession as unknown as Mock,
  getAllFiles: bucket.getAllFiles as unknown as Mock,
  getShareableUrl: bucket.getShareableUrl as unknown as Mock,
  uploadFile: bucket.uploadFile as unknown as Mock,
  deleteFile: bucket.deleteFile as unknown as Mock,
  findFirstContent: content.findFirstContent as unknown as Mock,
  findAllContent: content.findAllContent as unknown as Mock,
  convertFile: converter.convertFile as unknown as Mock,
  getConversionStatus: converter.getConversionStatus as unknown as Mock,
  sendFile: email.sendFile as unknown as Mock,
  getEmails: userEmails.getEmails as unknown as Mock,
  addEmail: userEmails.addEmail as unknown as Mock,
  deleteEmail: userEmails.deleteEmail as unknown as Mock,
  fileHandler: fileHandler as unknown as Mock,
};

const buildSession = (userEmail: string) => ({
  user: { email: userEmail },
  expires: '2999-01-01T00:00:00.000Z',
} as Session);

const createReq = (init: {
  query?: Record<string, string>;
  body?: Record<string, unknown>;
} = {}) => ({
  query: init.query ?? {},
  body: init.body ?? {},
} as unknown as NextApiRequest);

const createRes = () => {
  const status = vi.fn();
  const json = vi.fn();

  const res = { status, json };

  status.mockReturnValue(res);
  json.mockReturnValue(res);

  return res;
};

const asRes = (res: ReturnType<typeof createRes>) => res as unknown as BaseResponse;

const expectOk = (res: ReturnType<typeof createRes>, data: unknown) => {
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(data);
};

describe('pages/api handlers', () => {
  beforeEach(() => {
    mocked.getSession.mockResolvedValue(buildSession(AUTHORIZED_EMAIL));
  });

  describe('s3/files.function', () => {
    it('returns every folder from the bucket', async () => {
      const folders = [{ FolderName: 'docs', Files: [] }];

      mocked.getAllFiles.mockResolvedValue(folders);

      const res = createRes();

      await filesHandler(createReq(), asRes(res));

      expect(mocked.getAllFiles).toHaveBeenCalledTimes(1);
      expectOk(res, folders);
    });
  });

  describe('s3/shareableUrl.function', () => {
    it('forwards the requested expiration', async () => {
      mocked.getShareableUrl.mockResolvedValue('https://signed.example.test/a');

      const res = createRes();

      await shareableUrlHandler(
        createReq({ query: { key: 'docs/book.pdf', expires: '60' } }),
        asRes(res),
      );

      expect(mocked.getShareableUrl).toHaveBeenCalledWith({
        key: 'docs/book.pdf',
        expires: 60,
      });
      expectOk(res, 'https://signed.example.test/a');
    });

    it('defaults the expiration to 10 when the query omits it', async () => {
      mocked.getShareableUrl.mockResolvedValue('https://signed.example.test/b');

      const res = createRes();

      await shareableUrlHandler(createReq({ query: { key: 'docs/book.pdf' } }), asRes(res));

      expect(mocked.getShareableUrl).toHaveBeenCalledWith({
        key: 'docs/book.pdf',
        expires: 10,
      });
      expectOk(res, 'https://signed.example.test/b');
    });
  });

  describe('s3/deleteFile.function', () => {
    it('deletes the requested key', async () => {
      mocked.deleteFile.mockResolvedValue({ deleted: true });

      const res = createRes();

      await deleteFileHandler(createReq({ query: { key: 'docs/book.pdf' } }), asRes(res));

      expect(mocked.deleteFile).toHaveBeenCalledWith('docs/book.pdf');
      expectOk(res, { deleted: true });
    });

    it('answers 400 when the bucket rejects', async () => {
      mocked.deleteFile.mockRejectedValue(new Error('bucket exploded'));

      const res = createRes();

      await deleteFileHandler(createReq({ query: { key: 'docs/book.pdf' } }), asRes(res));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'bucket exploded' });
    });
  });

  describe('s3/uploadFile.function', () => {
    it('spreads the parsed body and appends the parsed file', async () => {
      const file = Buffer.from('file-content');
      const body = { name: 'Dune', author: 'Herbert', extension: 'pdf' };

      mocked.fileHandler.mockResolvedValue({
        form: { fields: {}, files: {} },
        body,
        getFile: async () => file,
      });

      mocked.uploadFile.mockResolvedValue({ uploaded: true });

      const req = createReq();
      const res = createRes();

      await uploadFileHandler(req, asRes(res));

      expect(mocked.fileHandler).toHaveBeenCalledWith(req);
      expect(mocked.uploadFile).toHaveBeenCalledWith({ ...body, file });
      expectOk(res, { uploaded: true });
    });

    it('disables the next body parser so formidable can stream the request', () => {
      expect(uploadFileConfig).toEqual({ api: { bodyParser: false } });
    });
  });

  describe('content/findFirst.function', () => {
    it('looks up the first matching volume', async () => {
      const volume = { title: 'Dune' };

      mocked.findFirstContent.mockResolvedValue(volume);

      const res = createRes();

      await findFirstHandler(createReq({ query: { query: 'dune' } }), asRes(res));

      expect(mocked.findFirstContent).toHaveBeenCalledWith('dune');
      expectOk(res, volume);
    });
  });

  describe('content/findAll.function', () => {
    it('looks up every matching volume', async () => {
      const volumes = [{ title: 'Dune' }, { title: 'Dune Messiah' }];

      mocked.findAllContent.mockResolvedValue(volumes);

      const res = createRes();

      await findAllHandler(createReq({ query: { query: 'dune' } }), asRes(res));

      expect(mocked.findAllContent).toHaveBeenCalledWith('dune');
      expectOk(res, volumes);
    });
  });

  describe('converter/convert.function', () => {
    it('starts a conversion for the given file and target', async () => {
      const job = { id: 'job-1' };

      mocked.convertFile.mockResolvedValue(job);

      const res = createRes();

      await convertHandler(
        createReq({ query: { file: 'docs/book.epub', target: 'pdf' } }),
        asRes(res),
      );

      expect(mocked.convertFile).toHaveBeenCalledWith({
        file: 'docs/book.epub',
        target: 'pdf',
      });
      expectOk(res, job);
    });
  });

  describe('converter/getConversion.function', () => {
    it('reads the status of a conversion', async () => {
      const job = { id: 'job-1', status: { code: 'completed' } };

      mocked.getConversionStatus.mockResolvedValue(job);

      const res = createRes();

      await getConversionHandler(createReq({ query: { id: 'job-1' } }), asRes(res));

      expect(mocked.getConversionStatus).toHaveBeenCalledWith('job-1');
      expectOk(res, job);
    });
  });

  describe('email/sendFile.function', () => {
    it('sends the file to the requested recipient', async () => {
      mocked.sendFile.mockResolvedValue({ messageId: 'test-message-id' });

      const res = createRes();

      await sendFileHandler(
        createReq({ query: { to: 'friend@example.test', fileKey: 'docs/book.pdf' } }),
        asRes(res),
      );

      expect(mocked.sendFile).toHaveBeenCalledWith({
        to: 'friend@example.test',
        fileKey: 'docs/book.pdf',
      });
      expectOk(res, { messageId: 'test-message-id' });
    });
  });

  describe('email/getEmails.function', () => {
    it('reads the emails of the logged in user', async () => {
      const emails = [{ email: 'friend@example.test' }];

      mocked.getEmails.mockResolvedValue(emails);

      const res = createRes();

      await getEmailsHandler(createReq(), asRes(res));

      expect(mocked.getEmails).toHaveBeenCalledWith(AUTHORIZED_EMAIL);
      expectOk(res, emails);
    });

    it('uses whichever authorized email is logged in', async () => {
      mocked.getSession.mockResolvedValue(buildSession('second@example.test'));
      mocked.getEmails.mockResolvedValue([]);

      const res = createRes();

      await getEmailsHandler(createReq(), asRes(res));

      expect(mocked.getEmails).toHaveBeenCalledWith('second@example.test');
      expectOk(res, []);
    });

    /*
     * The `trowIfNull(session?.user?.email)` throw is unreachable through the route:
     * defaultBehavior already answers 401 for a missing session and 403 for any email
     * outside AUTH_AUTHORIZED_EMAILS, and the empty string is not part of that list, so
     * by the time the handler runs `session.user.email` is guaranteed to be a real value.
     */
  });

  describe('email/addEmail.function', () => {
    it('injects the logged in user into the stored item', async () => {
      const item = {
        email: 'friend@example.test',
        description: 'a friend',
        default: false,
      };

      mocked.addEmail.mockResolvedValue({ added: true });

      const res = createRes();

      await addEmailHandler(createReq({ body: { item } }), asRes(res));

      expect(mocked.addEmail).toHaveBeenCalledWith({ ...item, user: AUTHORIZED_EMAIL });
      expectOk(res, { added: true });
    });
  });

  describe('email/deleteEmail.function', () => {
    it('deletes the item coming from the body', async () => {
      const item = {
        pk: 'pk-1',
        sk: AUTHORIZED_EMAIL,
        user: AUTHORIZED_EMAIL,
        email: 'friend@example.test',
        description: 'a friend',
        default: false,
      } as UserEmail;

      mocked.deleteEmail.mockResolvedValue({ deleted: true });

      const res = createRes();

      await deleteEmailHandler(createReq({ body: { item } }), asRes(res));

      expect(mocked.deleteEmail).toHaveBeenCalledWith(item);
      expectOk(res, { deleted: true });
    });
  });

  describe('test', () => {
    it('echoes the query parameter back', async () => {
      const res = createRes();

      await testHandler(createReq({ query: { query: 'ping' } }), asRes(res));

      expectOk(res, { query: 'ping' });
    });

    it('echoes undefined when the query parameter is missing', async () => {
      const res = createRes();

      await testHandler(createReq(), asRes(res));

      expectOk(res, { query: undefined });
    });
  });

  describe('authentication', () => {
    it('answers 401 when there is no session', async () => {
      mocked.getSession.mockResolvedValue(null);

      const res = createRes();

      await filesHandler(createReq(), asRes(res));

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You must be logged in to access this page.',
      });
      expect(mocked.getAllFiles).not.toHaveBeenCalled();
    });

    it('answers 403 when the email is not allow-listed', async () => {
      mocked.getSession.mockResolvedValue(buildSession('stranger@example.test'));

      const res = createRes();

      await filesHandler(createReq(), asRes(res));

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You are not authorized to access this page.',
      });
      expect(mocked.getAllFiles).not.toHaveBeenCalled();
    });

    it('answers 403 when the session carries no email at all', async () => {
      mocked.getSession.mockResolvedValue({ expires: '2999-01-01T00:00:00.000Z' } as Session);

      const res = createRes();

      await getEmailsHandler(createReq(), asRes(res));

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mocked.getEmails).not.toHaveBeenCalled();
    });
  });
});
