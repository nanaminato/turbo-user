import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {MenuAbleService} from "../../services/normal-services/menu-able.service";
export const MagicDataId = -2;
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.scss',
  standalone: true,
  imports: [
    IonicModule,
    RouterOutlet
  ],
  providers: [
  ]
})
export class ChatPage {
  private menuAble: MenuAbleService = inject(MenuAbleService);
  constructor() {
    this.menuAble.enableChat();
  }
}
