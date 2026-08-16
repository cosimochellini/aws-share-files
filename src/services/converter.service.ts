import { env } from '../instances/env';
import type { ServiceArguments, ServiceMapper } from '../types/generic';
import type { ConversionRequest, ConverterResponse } from '../types/converter.types';
import { jsonOrThrow, reportAndRethrow } from '../utils/apiResponse';

const { baseUrl, apiKey, header } = env.converter;
const {
  bucket, region, accessKeyId, secretAccessKey,
} = env.aws;

const headers = { 'Content-Type': 'application/json', [header]: apiKey };

const credentials = {
  accesskeyid: accessKeyId,
  secretaccesskey: secretAccessKey,
};

const replaceExtension = (file: string, ext: string) => {
  const slashIndex = file.lastIndexOf('/');
  const dotIndex = file.lastIndexOf('.');

  // the dot has to belong to the file name: keys are grouped by author, and author folders
  // are full of dots ('J.R.R. Tolkien/book')
  const hasExtension = dotIndex > slashIndex;

  return `${hasExtension ? file.slice(0, dotIndex) : file}.${ext}`;
};

const converterApiCaller = <T>(section: string, query = {}) => {
  const url = `${baseUrl + section}?${new URLSearchParams(query).toString()}`;
  return fetch(url, { headers })
    .then(jsonOrThrow('converter', section))
    .catch(reportAndRethrow) as Promise<T>;
};

converterApiCaller.post = <T>(section: string, body = {}) => {
  const url = env.converter.baseUrl + section;

  return fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(jsonOrThrow('converter', section))
    .catch(reportAndRethrow) as Promise<T>;
};

type fileConverter = {
  file: string;
  target: string;
};

export const converter = {
  convertFile({ file, target }: fileConverter) {
    const body: ConversionRequest = {
      input: [
        {
          credentials,
          type: 'cloud',
          source: 'amazons3',
          parameters: { bucket, region, file },
        },
      ],
      conversion: [
        {
          target,
          output_target: [
            {
              credentials,
              type: 'amazons3',
              parameters: {
                region,
                bucket,
                file: replaceExtension(file, target),
              },
            },
          ],
        },
      ],
    };

    return converterApiCaller.post<ConverterResponse>('jobs', body);
  },

  getConversionStatus(id: string) {
    return converterApiCaller<ConverterResponse>(`jobs/${id}`);
  },
};

export type converterTypes = ServiceMapper<typeof converter>;

export type converterArgs = ServiceArguments<typeof converter>;
