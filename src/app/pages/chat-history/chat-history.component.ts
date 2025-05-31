import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {delay, Observable, Observer} from "rxjs";
import {MagicDataId} from "../chat-page/chat-page.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {HistoryBtComponent} from "./history-bt/history-bt.component";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MenuController} from "@ionic/angular";
import {ChatHistoryTitle, LastSessionModel} from "../../models";
import {ChatHistoryTitleActionInfo} from "../../models/operations";
import {backChatHistorySubject, chatSessionSubject, lastSessionToken, sizeReportToken} from "../../injection_tokens";
import {SizeReportService} from "../../services/normal-services";
import {historyChangeSubject, loginSubject} from "../../injection_tokens/subject.data";

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css',
  imports: [
    NzButtonModule,
    NzIconModule,
    HistoryBtComponent,
    TranslateModule
  ],
  standalone: true
})
export class ChatHistoryComponent
{
  @Input()
  chatHistoryTitle: ChatHistoryTitle[] | undefined;
  @Output()
  chatHistoryChangeEvent = new EventEmitter<ChatHistoryTitleActionInfo>();
  selectId: number | undefined;
  constructor(
    private menuCtrl: MenuController,
    @Inject(sizeReportToken) private sizeReportService: SizeReportService,
    @Inject(chatSessionSubject) private chatSessionObserver:Observer<number> ,
    @Inject(backChatHistorySubject) private backHistoryObservable: Observable<ChatHistoryTitle>,
    @Inject(lastSessionToken) private lastSession: LastSessionModel,
    @Inject(historyChangeSubject) private historyChangeObservable: Observable<boolean>
              ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId!==MagicDataId){
        console.info(`订阅到新的 历史标识 ${historyTitle.dataId} ${historyTitle.title}`);
        this.changeSession(historyTitle.dataId)
      }else{
        this.selectFirst();
      }
    });
    this.historyChangeObservable.subscribe({
      next: value=>{
        if(value){
          this.selectFirst();
        }
      }
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

  reEmit($event: ChatHistoryTitleActionInfo) {
    this.chatHistoryChangeEvent.emit($event);
  }

  handleHistoryChange($event: number) {
    console.info(`聊天历史列表响应会话更改 ${$event}`);
    this.selectId = $event;
    this.changeSession($event);
  }
}
