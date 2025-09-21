import {Component, inject, OnInit} from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {IonicModule} from "@ionic/angular";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-top-image',
  templateUrl: './top-image.html',
  styleUrls: ['./top-image.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterOutlet
  ]
})
export class TopImage {
  private menuAble: MenuAbleService = inject(MenuAbleService);
  constructor() {
    this.menuAble.enableImage();
  }


}
