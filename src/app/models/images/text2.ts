import {Embedding, Lora} from "./Text2Lcm";

export interface Text2 {
  extra?: any;
  request: Text2Request;
}

export interface Text2Request {
  model_name?: string;
  prompt: string;
  negative_prompt: string;
  sd_vae?: string;
  controlnet?: Controlnet;
  loras?: Lora[];
  embeddings?: Embedding[];
  hires_fix?: HireFix;
  refiner?: Refiner;
  height: number;
  width: number;
  image_num: number;
  steps: number;
  seed: number;
  clip_skip?: number;
  guidance_scale: number;
  sampler_name: string;
}
export interface Controlnet { units?: ControlnetUnit[]; }
export interface ControlnetUnit { model_name?: string; }
export interface HireFix { target_width: number; target_height: number; strength?: number; upscaler?: string; }

export interface Refiner { switch_at: number; }
