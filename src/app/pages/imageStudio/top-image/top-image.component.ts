import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {IonicModule} from "@ionic/angular";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-top-image',
  templateUrl: './top-image.component.html',
  styleUrls: ['./top-image.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterOutlet
  ]
})
export class TopImageComponent {
  constructor(private menuAble: MenuAbleService) {
    this.menuAble.enableImage();
  }


}
