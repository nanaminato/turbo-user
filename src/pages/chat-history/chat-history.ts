import {Component, inject,} from '@angular/core';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {HistoryBt} from "./history-bt/history-bt";
import {TranslateModule} from "@ngx-translate/core";
import {MenuController} from "@ionic/angular";
import {ChatHistoryTitle, } from "../../models";
import {SizeReportService} from "../../services/normal-services";
import {Store} from "@ngrx/store";
import {selectHistoryTitle} from "../../systems/store/history-title/history-title.selectors";

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.css',
  imports: [
    NzButtonModule,
    NzIconModule,
    HistoryBt,
    TranslateModule
  ],
  standalone: true
})
export class ChatHistory
{
  chatHistoryTitle: ChatHistoryTitle[] | undefined;
  selectId: number | undefined;
  menuCtrl: MenuController = inject(MenuController);
  sizeReportService: SizeReportService = inject(SizeReportService);
  store = inject(Store);
  constructor() {
    this.store.select(selectHistoryTitle).subscribe((histories: ChatHistoryTitle[]) => {
      this.chatHistoryTitle = histories;
    })
  }
  miniPhoneAction(){
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
  }

  async newChat() {
    this.selectId = -1;
    this.miniPhoneAction();
  }

  selectFirst(){

  }

  handleHistoryChange($event: number) {
    this.selectId = $event;

  }
}
