import {
  AfterViewChecked,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  input,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NzCardComponent} from "ng-zorro-antd/card";

@Component({
  selector: 'app-landscape',
  templateUrl: './landscape.html',
  styleUrls: ['./landscape.scss'],
  standalone: true,
  imports: [
    IonicModule,
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
