import { describe, expect, it, vi } from 'vitest';

import { functions } from '../../src/instances/functions';

const { caller } = vi.hoisted(() => ({
  caller: Object.assign(vi.fn(), { post: vi.fn(), formData: vi.fn() }),
}));

vi.mock('../../src/utils/functionCaller', () => ({ caller }));

describe('functions.s3', () => {
  it('files() hits the files route with no payload', () => {
    functions.s3.files();

    expect(caller).toHaveBeenCalledWith('s3/files.function');
  });

  it('uploadFile() goes through the multipart caller', () => {
    const payload = {
      name: 'book',
      author: 'author',
      extension: 'pdf',
      file: new File(['content'], 'book.pdf'),
    };

    functions.s3.uploadFile(payload);

    expect(caller.formData).toHaveBeenCalledWith('s3/uploadFile.function', payload);
  });

  it('shareableUrl() forwards the whole request', () => {
    functions.s3.shareableUrl({ key: 'author/book.pdf', expires: 30 });

    expect(caller).toHaveBeenCalledWith('s3/shareableUrl.function', {
      key: 'author/book.pdf',
      expires: 30,
    });
  });

  it('deleteFile() wraps the key in an object', () => {
    functions.s3.deleteFile('author/book.pdf');

    expect(caller).toHaveBeenCalledWith('s3/deleteFile.function', { key: 'author/book.pdf' });
  });
});

describe('functions.content', () => {
  it('findFirst() wraps the query', () => {
    functions.content.findFirst('dune');

    expect(caller).toHaveBeenCalledWith('content/findFirst.function', { query: 'dune' });
  });

  it('findAllContent() wraps the query', () => {
    functions.content.findAllContent('dune');

    expect(caller).toHaveBeenCalledWith('content/findAll.function', { query: 'dune' });
  });
});

describe('functions.email', () => {
  it('sendFile() forwards the whole request', () => {
    functions.email.sendFile({ to: 'someone@example.test', fileKey: 'author/book.pdf' });

    expect(caller).toHaveBeenCalledWith('email/sendFile.function', {
      to: 'someone@example.test',
      fileKey: 'author/book.pdf',
    });
  });

  it('getEmails() sends an empty query', () => {
    functions.email.getEmails();

    expect(caller).toHaveBeenCalledWith('email/getEmails.function', {});
  });

  it('addEmail() posts the item', () => {
    const item = { user: 'owner@example.test', email: 'friend@example.test' };

    functions.email.addEmail(item);

    expect(caller.post).toHaveBeenCalledWith('email/addEmail.function', { item });
  });

  it('deleteEmail() posts the item', () => {
    const item = { pk: 'pk-1', sk: 'owner@example.test' };

    functions.email.deleteEmail(item);

    expect(caller.post).toHaveBeenCalledWith('email/deleteEmail.function', { item });
  });
});

describe('functions.convert', () => {
  it('getConversionStatus() wraps the id', () => {
    functions.convert.getConversionStatus('job-1');

    expect(caller).toHaveBeenCalledWith('converter/getConversion.function', { id: 'job-1' });
  });

  it('convert() forwards file and target', () => {
    functions.convert.convert({ file: 'author/book.docx', target: 'pdf' });

    expect(caller).toHaveBeenCalledWith('converter/convert.function', {
      file: 'author/book.docx',
      target: 'pdf',
    });
  });
});
