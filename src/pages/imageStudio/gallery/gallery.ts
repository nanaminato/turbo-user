import {Component, Input, OnInit} from '@angular/core';
import {UrlImage} from "../../../models/images";
import {Landscape} from "../landscape/landscape";
import {NgClass,} from "@angular/common";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss'],
  standalone: true,
  imports: [
    Landscape,
    NgClass,
    NzSpinComponent,
    TranslateModule
  ]
})
export class Gallery implements OnInit {
  @Input()
  loading: boolean = false;
  @Input()
  images: UrlImage[] | undefined = [];
  ngOnInit() {
    console.log()
  }

}
