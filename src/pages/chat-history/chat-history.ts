import {Component, EventEmitter, inject, Inject, Input, Output} from '@angular/core';
import {delay, Observable, Observer} from "rxjs";
import {MagicDataId} from "../chat-page/chat-page";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {HistoryBt} from "./history-bt/history-bt";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MenuController} from "@ionic/angular";
import {ChatHistoryTitle, LastSessionModel} from "../../models";
import {ChatHistoryTitleActionInfo} from "../../models/operations";
import {backChatHistorySubject, chatSessionSubject, lastSessionToken, sizeReportToken} from "../../injection_tokens";
import {SizeReportService} from "../../services/normal-services";
import {historyChangeSubject, loginSubject} from "../../injection_tokens/subject.data";
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
  lastSession: LastSessionModel = inject(LastSessionModel);
  store = inject(Store);
  constructor(
    @Inject(chatSessionSubject) private chatSessionObserver:Observer<number>
              ) {
    this.store.select(selectHistoryTitle).subscribe((histories: ChatHistoryTitle[]) => {
      this.chatHistoryTitle = histories;
    })
  }
  changeSession(dataId: number) {
    this.selectId = dataId;
    this.miniPhoneAction();
    this.chatSessionObserver.next(dataId);
    this.lastSession.sessionId = dataId;
  }
  miniPhoneAction(){
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
  }

  async newChat() {
    this.selectId = -1;
    this.chatSessionObserver.next(-1);
    this.miniPhoneAction();
  }

  selectFirst(){
    if(this.chatHistoryTitle?.length===0){
      this.chatSessionObserver.next(-1);
      return;
    }
    const first = this.chatHistoryTitle![0];
    this.selectId = first.dataId;
    this.chatSessionObserver.next(this.selectId);
    this.lastSession.sessionId = this.selectId;
    //console.info(`选择历史的第一条 ${first.dataId} ${first.title}`)
  }

  handleHistoryChange($event: number) {
    console.info(`聊天历史列表响应会话更改 ${$event}`);
    this.selectId = $event;
    this.changeSession($event);
  }
}
