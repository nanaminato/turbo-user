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
import {ChatModel, SystemRole, UserRole} from "../../models";
import {ConfigurationService} from "../../services/db-services";
import {sizeReportToken} from "../../injection_tokens";
import {SizeReportService} from "../../services/normal-services";
import {TaskType, UserTask} from "../../models/operations";

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
  private configurationService: ConfigurationService = inject(ConfigurationService);
  private sizeReportService: SizeReportService = inject(SizeReportService);
  private clipboard: ClipboardService = inject(ClipboardService);
  private notification: NzNotificationService = inject(NzNotificationService);
  getFontSize() {
    return `font-size: ${this.configurationService.configuration?.displayConfiguration.fontSize}px !important;`
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

  protected readonly UserRole = UserRole;


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

  getWidth() {
    let part = -269;
    if(this.sizeReportService.width! <=606){
      return "width: "+(this.sizeReportService.width!-16)!+"px;";
    }
    else if(this.sizeReportService.width!<800){
      return "width: "+(this.sizeReportService.width!+part-16)+"px;";
    }else{
      if(this.sizeReportService.width!+part-32>=800){
        // 减去sideBar 之后剩余宽度大于800，使用800
        return "width: "+800+"px;";
      }
      // 减去sideBar 之后剩余宽度小于800，使用实际的宽度
      return "width: "+(this.sizeReportService.width!+part-16)+"px;";
    }
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


