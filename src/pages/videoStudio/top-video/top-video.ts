import {Component, inject, OnInit} from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {IonicModule} from "@ionic/angular";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-top-video',
  templateUrl: './top-video.html',
  styleUrls: ['./top-video.scss'],
  standalone: true,
  imports:
    [
      IonicModule,
      RouterOutlet
    ]
})
export class TopVideo {
  private menuAble: MenuAbleService = inject(MenuAbleService);
  constructor() {
    this.menuAble.enableVideo();
  }

}
