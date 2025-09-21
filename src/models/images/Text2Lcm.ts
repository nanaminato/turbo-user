export interface Text2Lcm {
  model_name?: string;
  prompt: string;
  negative_prompt?: string;
  height: number;
  width: number;
  loras?: Lora[];
  embeddings?: Embedding[];
  image_num: number;
  steps: number;
  seed: number;
  guidance_scale: number;
  clip_skip?: number;
}

export interface Lora {
  model_name?: string;
  strength?: number | undefined;
}

export interface Embedding {
  model_name?: string;
}
