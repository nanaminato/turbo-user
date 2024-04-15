import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {IonicModule} from "@ionic/angular";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-top-video',
  templateUrl: './top-video.component.html',
  styleUrls: ['./top-video.component.scss'],
  standalone: true,
  imports:
    [
      IonicModule,
      RouterOutlet
    ]
})
export class TopVideoComponent {

  constructor(private menuAble: MenuAbleService) {
    this.menuAble.enableVideo();
  }

}
