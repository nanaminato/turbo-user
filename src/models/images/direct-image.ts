export interface DirectImage {
  image_file: string;
  image_type: string;
}
export interface UrlImage {
  image_url?: string;
  image_url_ttl?: string;
  image_type?: string;
}
export interface ExtraImage{
  image_url: string;
  "image expire time"?: number;
  image_type: string;
}
