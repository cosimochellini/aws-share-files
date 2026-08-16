import { beforeEach, describe, expect, it, vi } from 'vitest';

import { converter } from '../../src/services/converter.service';
import { notification } from '../../src/instances/notification';
import type { ConversionRequest } from '../../src/types/converter.types';

const fetchMock = vi.fn();

const PRESIGNED_URL = 'https://test-bucket.s3.eu-south-1.amazonaws.com/author/book.docx?X-Amz-Signature=test';

/**
 * src/services/converter.service.ts presigns the input link through the real S3 client.
 * Signing is offline, but the signature and its timestamp change on every run, so the
 * client is mocked to keep the request-body assertions deterministic.
 */
const awsMock = vi.hoisted(() => ({ getSignedUrl: vi.fn() }));

vi.mock('../../src/instances/aws', () => ({ s3Client: awsMock }));

const headers = {
  'Content-Type': 'application/json',
  'x-oc-api-key': 'test-converter-key',
};

const credentials = {
  accesskeyid: 'test-access-key-id',
  secretaccesskey: 'test-secret-access-key',
};

const lastPostBody = (): ConversionRequest => {
  const [, init] = fetchMock.mock.calls[0] as [string, { body: string }];

  return JSON.parse(init.body) as ConversionRequest;
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'job-1' }) });
  awsMock.getSignedUrl.mockResolvedValue(PRESIGNED_URL);
});

describe('converter.getConversionStatus', () => {
  it('GETs the job endpoint with the api-key headers', async () => {
    await expect(converter.getConversionStatus('job-1')).resolves.toEqual({ id: 'job-1' });

    // the caller always appends `?` + the (here empty) query string
    expect(fetchMock).toHaveBeenCalledWith(
      'https://converter.example.test/jobs/job-1?',
      { headers },
    );
  });
});

describe('converter.convertFile', () => {
  it('POSTs the job to the converter endpoint', async () => {
    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .resolves.toEqual({ id: 'job-1' });

    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: unknown; method: string }];

    expect(url).toBe('https://converter.example.test/jobs');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual(headers);
  });

  it('describes the input as a presigned link rather than bucket credentials', async () => {
    await converter.convertFile({ file: 'author/book.docx', target: 'pdf' });

    expect(awsMock.getSignedUrl).toHaveBeenCalledWith('author/book.docx', 3600);

    expect(lastPostBody().input).toEqual([
      { type: 'remote', source: PRESIGNED_URL },
    ]);
  });

  it('rejects without calling the converter when the link cannot be signed', async () => {
    const error = new Error('cannot sign');

    awsMock.getSignedUrl.mockRejectedValue(error);

    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .rejects.toBe(error);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never puts the bucket credentials in the input block', async () => {
    await converter.convertFile({ file: 'author/book.docx', target: 'pdf' });

    expect(JSON.stringify(lastPostBody().input)).not.toContain('test-secret-access-key');
    expect(JSON.stringify(lastPostBody().input)).not.toContain('test-access-key-id');
  });

  it('targets the output at the same key with the extension swapped', async () => {
    await converter.convertFile({ file: 'author/book.docx', target: 'pdf' });

    expect(lastPostBody().conversion).toEqual([
      {
        target: 'pdf',
        output_target: [
          {
            credentials,
            type: 'amazons3',
            parameters: {
              region: 'eu-south-1',
              bucket: 'test-bucket',
              file: 'author/book.pdf',
            },
          },
        ],
      },
    ]);
  });

  it('replaces only the last extension of a dotted file name', async () => {
    await converter.convertFile({ file: 'author/my.book.v2.docx', target: 'epub' });

    expect(lastPostBody().conversion[0]?.output_target[0]?.parameters.file)
      .toBe('author/my.book.v2.epub');
  });

  it('appends the extension when the file name has none', async () => {
    await converter.convertFile({ file: 'author/book', target: 'pdf' });

    expect(lastPostBody().conversion[0]?.output_target[0]?.parameters.file)
      .toBe('author/book.pdf');
  });

  it('ignores dots in the folder when the file name has no extension', async () => {
    await converter.convertFile({ file: 'J.R.R. Tolkien/book', target: 'pdf' });

    expect(lastPostBody().conversion[0]?.output_target[0]?.parameters.file)
      .toBe('J.R.R. Tolkien/book.pdf');
  });

  it('still replaces the extension under a dotted folder', async () => {
    await converter.convertFile({ file: 'J.R.R. Tolkien/book.docx', target: 'pdf' });

    expect(lastPostBody().conversion[0]?.output_target[0]?.parameters.file)
      .toBe('J.R.R. Tolkien/book.pdf');
  });
});

describe('converter API failures', () => {
  beforeEach(() => {
    vi.spyOn(notification, 'error').mockImplementation(() => {});
  });

  it('routes a failed status request to notification.error and rethrows it', async () => {
    const error = new Error('status unreachable');

    fetchMock.mockRejectedValue(error);

    await expect(converter.getConversionStatus('job-1')).rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });

  it('routes a failed conversion request to notification.error and rethrows it', async () => {
    const error = new Error('convert unreachable');

    fetchMock.mockRejectedValue(error);

    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });

  it('rethrows a json() parse failure as well', async () => {
    const error = new Error('bad payload');

    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.reject(error) });

    await expect(converter.getConversionStatus('job-1')).rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });

  it('rethrows a json() parse failure on the POST path too', async () => {
    const error = new Error('bad payload');

    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.reject(error) });

    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });

  it('reports an error status instead of parsing the error body as a job', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) });

    await expect(converter.getConversionStatus('job-1'))
      .rejects.toThrowError('the converter API answered jobs/job-1 with 500');

    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .rejects.toThrowError('the converter API answered jobs with 500');

    expect(notification.error).toHaveBeenCalledTimes(2);
  });
});
