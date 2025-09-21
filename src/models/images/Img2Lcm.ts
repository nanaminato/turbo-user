import {Embedding, Lora} from "./Text2Lcm";

export interface Img2Lcm {
  model_name: string;
  input_image: string;// base64
  prompt: string;
  negative_prompt: string;
  image_num: number;
  sd_vae: string;
  loras?: Lora[];
  embeddings?: Embedding[];
  steps: number;
  guidance_scale: number;
  seed: number;
  clip_skip?: number;
  strength?: number;
}
