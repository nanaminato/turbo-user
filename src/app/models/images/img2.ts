import {Embedding, Lora} from "./Text2Lcm";
import {Controlnet} from "./text2";

export interface Img2 {
  extra?: any;
  request: Image2Request;
}

export interface Image2Request {
  model_name?: string;
  image_base64: string;
  prompt: string;
  negative_prompt: string;
  sd_vae?: string;
  controlnet?: Controlnet;
  loras: Lora[];
  embeddings: Embedding[];
  height: number;
  width: number;
  image_num: number;
  steps: number;
  seed: number;
  clip_skip?: number;
  guidance_scale: number;
  sampler_name: string;
  strength?: number;
}
