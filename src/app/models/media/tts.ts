export interface TtsRequest{
  model: string;
  input: string;
  voice: string;
  response_format?: string;
  speed?: number;
}
export interface TtsResponse{
  base64: string;
  type: string;
}
