import { env } from "../instances/env";
import { ServiceMapper } from "../types/generic";
import { notification } from "../instances/notification";
import { ConversionRequest, ConverterResponse } from "../types/converter.types";

const { baseUrl, apiKey, header } = env.converter;
const { bucket, region, accessKeyId, secretAccessKey } = env.aws;

const headers = { "Content-Type": "application/json", [header]: apiKey };

const credentials = {
  accesskeyid: accessKeyId,
  secretaccesskey: secretAccessKey,
};

const replaceExtension = (file: string, ext: string) =>
  file.slice(0, file.lastIndexOf(".")) + "." + ext;

const converterApiCaller = <T>(section: string, query = {}) => {
  const url = baseUrl + section + "?" + new URLSearchParams(query).toString();
  return fetch(url, { headers })
    .then((res) => res.json())
    .catch(notification.error) as Promise<T>;
};

converterApiCaller.post = <T>(section: string, body: {} = {}) => {
  const url = env.converter.baseUrl + section;

  return fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch(notification.error) as Promise<T>;
};

export type fileConversion = {
  file: string;
  target: string;
};

export const converter = {
  convertFile({ file, target }: fileConversion) {
    const body: ConversionRequest = {
      input: [
        {
          credentials,
          type: "cloud",
          source: "amazons3",
          parameters: { bucket, region, file },
        },
      ],
      conversion: [
        {
          target,
          output_target: [
            {
              credentials,
              type: "amazons3",
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

    return converterApiCaller.post<ConverterResponse>(`jobs`, body);
  },

  getConversionStatus(id: string) {
    return converterApiCaller<ConverterResponse>(`jobs/${id}`);
  },
};

export type contentTypes = ServiceMapper<typeof converter>;
