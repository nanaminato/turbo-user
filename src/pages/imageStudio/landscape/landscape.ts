import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

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

  constructor() {

  }

  present() {
    if (this.loading) {
      return "assets/placeholders/loading.png";
    }
    if (this.source?.startsWith('http')) {
      return this.source;
    }
    if (this.source?.startsWith("asset")) {
      return this.source;
    }
    return "data:image/png;base64," + this.source;
  }

  @Input()
  loading: boolean = false;

  loaded(source: string) {
    this.loading = false;
    this.source = source;
  }
}
