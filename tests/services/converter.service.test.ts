import { beforeEach, describe, expect, it, vi } from 'vitest';

import { converter } from '../../src/services/converter.service';
import { notification } from '../../src/instances/notification';
import type { ConversionRequest } from '../../src/types/converter.types';

const fetchMock = vi.fn();

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
  fetchMock.mockResolvedValue({ json: () => Promise.resolve({ id: 'job-1' }) });
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

  it('describes the S3 input with the bucket credentials', async () => {
    await converter.convertFile({ file: 'author/book.docx', target: 'pdf' });

    expect(lastPostBody().input).toEqual([
      {
        credentials,
        type: 'cloud',
        source: 'amazons3',
        parameters: {
          bucket: 'test-bucket',
          region: 'eu-south-1',
          file: 'author/book.docx',
        },
      },
    ]);
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

    fetchMock.mockResolvedValue({ json: () => Promise.reject(error) });

    await expect(converter.getConversionStatus('job-1')).rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });

  it('rethrows a json() parse failure on the POST path too', async () => {
    const error = new Error('bad payload');

    fetchMock.mockResolvedValue({ json: () => Promise.reject(error) });

    await expect(converter.convertFile({ file: 'author/book.docx', target: 'pdf' }))
      .rejects.toBe(error);

    expect(notification.error).toHaveBeenCalledWith(error);
  });
});
