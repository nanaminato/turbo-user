import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {ImageService} from "../../../services/util-service";

@Component({
  selector: 'app-landscape',
  templateUrl: './landscape.html',
  styleUrls: ['./landscape.scss'],
  standalone: true,
  imports: [
  ]
})
export class Landscape
{
  @Input()
  set src(source: string | undefined) {
    this.source = source;
  }
  source: string | undefined;

  @ViewChild('imgEle')
  imgEle: ElementRef | undefined;

  constructor(private imageService: ImageService) {

  }

  present() {
    if (this.loading) {
      return "assets/placeholders/loading.png";
    }
    return this.imageService.format(this.source);
  }

  @Input()
  loading: boolean = false;

  loaded(source: string) {
    this.loading = false;
    this.source = source;
  }
}
