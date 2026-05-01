export interface GptImageCreateRequest {
  model?: string;
  background?: string;
  prompt: string;
  n?: number;
  size?: string;
  quality?: string;
  response_format?: string;
  output_format?: string;
  moderation?: string;
  style?: string;
}
export interface GptImageResponse {
  created: number;
  data: ImageDataResult[];
  usage: string;
  result: string;
  results: string[];
  background?: string;
  outputFormat?: string;
  quality?: string;
  size?: string;
  objectTypeName?: string;
  streamEvent?: string;
  isDelta: boolean;
  successful: boolean;
  error: string;
  httpStatusCode: number;
}

export interface ImageDataResult {
  url: string;
  b64Json: string;
  revisedPrompt: string;
}
