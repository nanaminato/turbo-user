import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ClipboardService} from "ngx-clipboard";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzTooltipModule} from "ng-zorro-antd/tooltip";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NgOptimizedImage} from "@angular/common";
import {Chat} from "./chat/chat";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {TranslateModule} from "@ngx-translate/core";
import {ChatModel, Configuration, SystemRole, UserRole} from "../../models";
import {SizeReportService} from "../../services/normal-services";
import {TaskType, UserTask} from "../../models/operations";
import {Store} from "@ngrx/store";
import {selectConfig} from "../../systems/store/configuration/configuration.selectors";

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.html',
  styleUrl: './dialogue.css',
  imports: [
    NzImageModule,
    NzTooltipModule,
    NzIconModule,
    NgOptimizedImage,
    Chat,
    NzButtonModule,
    NzSkeletonModule,
    TranslateModule,
  ],
  standalone: true
})
export class Dialogue {
  private _chatModel: ChatModel | undefined;
  private sizeReportService: SizeReportService = inject(SizeReportService);
  private clipboard: ClipboardService = inject(ClipboardService);
  private notification: NzNotificationService = inject(NzNotificationService);
  config: Configuration | null = null;
  store = inject(Store);
  constructor() {
    this.store.select(selectConfig).subscribe(config => {
      this.config = config;
    });
  }
  getFontSize() {
    return `font-size: ${this.config?.displayConfiguration.fontSize}px !important;`
  }
  @Input()
  set content(value: string | undefined) {

  }
  @Input()
  active: boolean = false;

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  @Output()
  userTask = new EventEmitter<UserTask>();

  isMiniView(){
    return this.sizeReportService.miniPhoneView();
  }
  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }
  getIcon(role: string | undefined) {
    if(role===undefined) return "assets/svgs/chat-gpt_11zon.jpg";
    if(role===UserRole){
      return 'assets/svgs/programmer.png';
    }else if(role===SystemRole){
      return 'assets/svgs/system.svg';
    }
    return "assets/svgs/chat-gpt_11zon.jpg";
  }
  isHover: boolean = false;

  onMouseEnter() {
    this.isHover = true;
  }

  onMouseLeave() {
    this.isHover = false;
  }

  triggerEdit() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.edit, this.chatModel?.dataId!));
  }

  triggerStartAsContext() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.asContext, this.chatModel?.dataId!));
  }

  triggerDelete() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.delete, this.chatModel?.dataId!));
  }

  getHeadName(chatModel: ChatModel | undefined) {
    if(chatModel===undefined){
      return "error";
    }
    if(chatModel.role===UserRole){
      return "You";
    }
    return chatModel.model;
  }

  copyAllContent() {
    this.clipboard.copy(this.chatModel?.content!);
    this.notification.success("复制内容成功","");
  }
  @Output()
  reGenerateSignal = new EventEmitter<number>();
  reRequest() {
    if(this.chatModel?.finish){
      this.reGenerateSignal.emit(this.chatModel.dataId);
    }else{
      this.notification.error("当前请求还没有结束","");
    }
  }
}


