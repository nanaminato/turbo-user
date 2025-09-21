import {DirectImage, ExtraImage, UrlImage} from "./direct-image";
import {Metadata} from "./metadata";

export interface NovitaText2LcmResponse {
  images?: DirectImage[];
  code?: number;
  reason?: string;
  message?: string;
  metadata?: Metadata;
}

