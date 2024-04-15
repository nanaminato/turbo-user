import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {MenuAbleService} from "../../services/normal-services/menu-able.service";
export const MagicDataId = -2;
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
  standalone: true,
  imports: [
    IonicModule,
    RouterOutlet
  ],
  providers: [
  ]
})
export class ChatPageComponent {
  constructor(private menuAble: MenuAbleService) {
    this.menuAble.enableChat();
  }
}
