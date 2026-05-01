import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ImageService {
  format(url?: string): string {
    if (!url) return 'assets/placeholders/imgHolder.png';
    if (url.startsWith('http')
      || url.startsWith('asset')
      || url.startsWith('data:image/')) {
      return url;
    }
    return "data:image/png;base64," + url;
  }
}
