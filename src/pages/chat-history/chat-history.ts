import {Component, HostListener, inject,} from '@angular/core';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MenuController} from "@ionic/angular";
import {ChatHistoryTitle, } from "../../models";
import {SizeReportService} from "../../services/normal-services";
import {Store} from "@ngrx/store";
import {selectHistoryTitle} from "../../systems/store/history-title/history-title.selectors";
import {ChatDataService, HistoryTitleService} from "../../services/db-services";
import {SendService} from "../../auth_module";
import {historyTitleActions} from "../../systems/store/history-title/history-title.actions";
import {NgStyle} from "@angular/common";
import {chatHistoryActions} from "../../systems/store/chat-history/chat-history.actions";

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.css',
  imports: [
    NzButtonModule,
    NzIconModule,
    TranslateModule,
    NgStyle
  ],
  standalone: true
})
export class ChatHistory
{
  historyTitles: ChatHistoryTitle[] | undefined;
  selectId: number | undefined;
  menuCtrl: MenuController = inject(MenuController);
  sizeReportService: SizeReportService = inject(SizeReportService);
  historyTitleService: HistoryTitleService = inject(HistoryTitleService);
  sendService = inject(SendService);
  store = inject(Store);
  chatDataService: ChatDataService = inject(ChatDataService);
  constructor() {
    this.store.select(selectHistoryTitle).subscribe((histories: ChatHistoryTitle[]) => {
      this.historyTitles = histories;
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
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuDataId: any = null;
  onRightClick(event: MouseEvent, dataId: any) {
    event.preventDefault(); // 阻止浏览器默认右键菜单弹出
    this.contextMenuDataId = dataId;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }
  async deleteHistory(dataId: number) {
    this.contextMenuVisible = false;
    const index = this.historyTitles?.findIndex(h=>h.dataId==dataId);
    if(index===undefined) return;
    let historyTitle = this.historyTitles![index];
    this.historyTitles?.splice(index,1);
    await this.historyTitleService.deleteHistoryTitle(historyTitle).then(async ()=>{
      this.sendService.deleteHistory(historyTitle.dataId);
      await this.chatDataService.deleteHistoriesByTitleId(historyTitle.dataId);
      this.store.dispatch(historyTitleActions.loadSuccess({historyTitles: this.historyTitles??[]}))
    });
  }

  selectHistory(dataId: number) {
    this.selectId = dataId;
    console.log(this.historyTitles);
    this.store.dispatch(chatHistoryActions.loadSession({sessionId: dataId}))
  }
  // 点击页面其他位置，关闭菜单
  @HostListener('document:click')
  onDocumentClick() {
    this.contextMenuVisible = false;
  }
}
