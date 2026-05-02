export interface APIMartGPTImage2OfficialRequest {
  model?: string;
  prompt: string; // Required
  size?: string;
  resolution?: string;
  quality?: string;
  background?: string;
  moderation?: string;
  output_format?: string;
  n?: number;
  image_urls?: string[] | null;
  mask_url?: string | null;
}

export interface APIMartGPTImage2Request {
  model: string;
  prompt: string;
  n?: number;
  size?: string;
  resolution?: string;
  image_urls: string[] | null;
  official_fallback?: boolean;
}
//task-response
export interface APIMartGPTImage2Data{
  status: string;
  task_id: string;
}
export interface APIMartTaskError {
  code: string;
  message: string;
  type: string;
}
//task-id
export interface APIMartGPTImage2Response {
  code?: number | null;
  data?: APIMartGPTImage2Data[] | null;
  error?: APIMartTaskError | null;
}

export interface APIMartImageItem{
  url: string[];
  expiresAt: number;
}


