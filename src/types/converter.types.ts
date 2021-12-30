export enum StatusCode {
  downloading = "downloading",
  converting = "converting",
  completed = "completed",
  failed = "failed",
}

export interface StatusResponse {
  code: StatusCode;
  info: string;
}

export interface ParametersResponse {
  bucket: string;
  file: string;
  region: string;
}

export interface OutputTargetResponse {
  type: string;
  parameters: ParametersResponse;
  credentials: any[];
  status: string;
  modified_at: Date;
  created_at: Date;
}

export interface ConversionResponse {
  id: string;
  target: string;
  category: string;
}

export interface InputResponse {
  id: string;
  type: string;
  status: string;
  source: string;
  engine: string;
  options: any[];
  filename: string;
  size: number;
  hash: string;
  checksum: string;
  content_type: string;
  created_at: Date;
  modified_at: Date;
  parameters: ParametersResponse;
}

export interface ConverterResponse {
  id: string;
  token: string;
  type: string;
  status: StatusResponse;
  errors: any[];
  warnings: any[];
  process: boolean;
  fail_on_input_error: boolean;
  fail_on_conversion_error: boolean;
  conversion: ConversionResponse[];
  limits: any[];
  input: InputResponse[];
  output: any[];
  callback: string;
  notify_status: boolean;
  server: string;
  spent: number;
  created_at: Date;
  modified_at: Date;
}

export interface ParametersRequest {
  bucket: string;
  file: string;
  region: string;
}

export interface CredentialsRequest {
  accesskeyid: string;
  secretaccesskey: string;
}

export interface InputRequest {
  type: string;
  source: string;
  parameters: ParametersRequest;
  credentials: CredentialsRequest;
}

export interface OutputTargetRequest {
  type: string;
  parameters: ParametersRequest;
  credentials: CredentialsRequest;
}

export interface ConverterRequest {
  category?: string;
  target: string;
  output_target: OutputTargetRequest[];
}

export interface ConversionRequest {
  input: InputRequest[];
  conversion: ConverterRequest[];
}
