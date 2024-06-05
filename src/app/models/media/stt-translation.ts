export interface OpenAiTranslationRequest {
  file: string | null;
  model: string | null;
  prompt?: string | null;
  temperature: number;
  response_format?: string | null;
  suffix: string | null;
}
