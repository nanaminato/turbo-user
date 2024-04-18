import {Component, Input, OnInit} from '@angular/core';
import {UrlImage} from "../../../models/images";
import {LandscapeComponent} from "../landscape/landscape.component";
import {NgClass, NgForOf} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [
    LandscapeComponent,
    NgClass,
    NgForOf,
    IonicModule,
    NzCardComponent,
    NzSpinComponent,
    TranslateModule
  ]
})
export class GalleryComponent  implements OnInit {
  @Input()
  loading: boolean = false;
  constructor() { }
  @Input()
  images: UrlImage[] | undefined = [];
  ngOnInit() {
    console.log()
  }

}
