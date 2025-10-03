import {Component, HostListener, inject,} from '@angular/core';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {ChatHistoryTitle, } from "../../models";
import {SizeReportService} from "../../services/normal-services";
import {Store} from "@ngrx/store";
import {selectHistoryTitle} from "../../systems/store/history-title/history-title.selectors";
import {historyTitleActions} from "../../systems/store/history-title/history-title.actions";
import {NgStyle} from "@angular/common";
import {chatHistoryActions} from "../../systems/store/chat-history/chat-history.actions";
import {chatActions} from "../../systems/store/system.actions";

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
  sizeReportService: SizeReportService = inject(SizeReportService);
  store = inject(Store);
  constructor() {
    this.store.select(selectHistoryTitle).subscribe((histories: ChatHistoryTitle[]) => {
      this.historyTitles = histories;
      if(histories.length > 0 && this.selectId === -1) {
        this.selectId = histories[0].dataId;
      }
    })
  }
  miniPhoneAction(){
    if(this.sizeReportService.miniPhoneView()){
      this.sizeReportService.hideMenu()
    }
  }
  async newChat() {
    this.selectId = -1;
    this.miniPhoneAction();
    this.store.dispatch(chatActions.startNewChat());
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
    this.contextMenuVisible = false;
    this.store.dispatch(historyTitleActions.delete({ dataId }));
  }

  selectHistory(dataId: number) {
    this.selectId = dataId;
    this.miniPhoneAction()
    this.store.dispatch(chatHistoryActions.loadSession({sessionId: dataId}))
  }
  // 点击页面其他位置，关闭菜单
  @HostListener('document:click')
  onDocumentClick() {
    this.contextMenuVisible = false;
  }
}
