import {Pipe, PipeTransform} from "@angular/core";
import {ImageService} from "../services/util-service";

@Pipe({ name: 'imagePresent', standalone: true })
export class ImagePresentPipe implements PipeTransform {
  constructor(private imageService: ImageService) {}
  transform(image_url: string | undefined): string {
    return this.imageService.format(image_url);
  }
}
