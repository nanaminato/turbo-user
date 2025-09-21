import {Embedding, Lora} from "../images";
import {FramePrompt} from "./frame_prompt";

export interface Text2Video {
  extra?: any;
  model_name: string;
  height: number;
  width: number;
  seed: number;
  steps: number;
  negative_prompt?: string;
  prompts: FramePrompt[];
  guidance_scale?: number;
  loras?: Lora[];
  embeddings?: Embedding[];
  closed_loop?: boolean;
  clip_skip?: number;
}
