export interface DallE{
  model?: string;
  prompt: string;
  n?: number;
  size?: string;
  quality?: string;
  response_format?: string;
  style?: string;
}
export interface DallE3Response {
  results: ImageDataResult[];
  created: number;
}

export interface ImageDataResult {
  url: string;
  b64: string;
  revisedPrompt: string;
}
