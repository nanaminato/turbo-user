import {Component, Input} from '@angular/core';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ChatContext} from "../../../services/normal-services";
import {ChatModel} from "../../../models";

@Component({
  selector: 'app-system-prompt-manager',
  templateUrl: './system-prompt-manager.html',
  styleUrl: './system-prompt-manager.css',
  imports: [
    NzFormModule,
    NzButtonModule,
    NzSwitchModule,
    FormsModule,
    NzSkeletonModule,
    TranslateModule
  ],
  standalone: true
})
export class SystemPromptManager {
  @Input()
  chatContext: ChatContext | undefined;
  @Input()
  chatModels: ChatModel[] | undefined;
  getItem(id: number):ChatModel | undefined{
    return this.chatModels?.find(m=>m.dataId===id);
  }

  putAll() {
    for(let item of this.chatContext?.systems!){
      item.in = true;
    }
  }

  removeAll() {
    for(let item of this.chatContext?.systems!){
      item.in = false;
    }
  }
}
