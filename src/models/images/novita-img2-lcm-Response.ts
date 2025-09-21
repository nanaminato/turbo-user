import {ExtraImage, UrlImage} from "./direct-image";
import {Metadata} from "./metadata";

export interface NovitaImg2LcmResponse {
  images?: ExtraImage[];
  image?: UrlImage[];
  code?: number;
  reason?: string;
  message?: string;
  metadata?: Metadata;
}
