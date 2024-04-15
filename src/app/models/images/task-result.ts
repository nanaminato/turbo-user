export interface TaskResult {
  extra?: TaskExtra;
  images?: TaskImage[];
  videos: TaskVideo[];
}

export interface TaskExtra {
  seed?: string;
  enable_nsfw_detection?: string;
}

export interface TaskInfo {
  task_id?: string;
  status?: string;
  reason?: string;
  task_type?: string;
  eta: number;
  progress_percent: number;
  images?: TaskImage[];
  videos?: TaskVideo[];
}

export interface TaskImage {
  image_url?: string;
  image_url_ttl: number;
  image_type?: string;
  nsfw_detection_result?: any;
}

export interface TaskVideo {
  video_url?: string;
  video_url_ttl?: string;
  video_type?: string;
}
