import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzImageService} from "ng-zorro-antd/image";

@Component({
  selector: 'app-top-media',
  templateUrl: './top-media.html',
  styleUrls: ['./top-media.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    IonicModule
  ],
  providers: [
    NzImageService
  ]
})
export class TopMedia implements OnInit {
  private menuAble: MenuAbleService = inject(MenuAbleService);
  constructor() {
    this.menuAble.enableMedia()
  }

  ngOnInit() {
    console.log()
  }

}
