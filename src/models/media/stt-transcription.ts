export interface OpenAiTranscriptionRequest {
  file: string | null;
  model: string | null;
  language?: string | null;
  prompt?: string | null;
  temperature: number;
  response_format?: string | null;
  suffix: string | null;
}
