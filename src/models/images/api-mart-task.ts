import {APIMartImageItem, APIMartTaskError} from "./api-mart-gpt-image";

export interface APIMartTaskResult {
  images: APIMartImageItem[];
}
export interface APIMartTaskData {
  id: string;
  status: string;
  progress: number;
  result?: APIMartTaskResult | null;
  created: number;
  completed?: number | null;
  estimatedTime: number;
  actualTime?: number|null;
  error?: APIMartTaskError | null;
}
export interface APIMartTaskResponse {
  code: number;
  data?: APIMartTaskData | null;
}
