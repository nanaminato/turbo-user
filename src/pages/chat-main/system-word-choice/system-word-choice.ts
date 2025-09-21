import {Component, EventEmitter, Output} from '@angular/core';
import {NzFormModule} from "ng-zorro-antd/form";
import {NgForOf, NgTemplateOutlet} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {TranslateModule} from "@ngx-translate/core";
import {SystemPromptItem} from "../../../models";
import {SystemPromptService} from "../../../services/db-services/system-prompt.service";
import {user_routes} from "../../../roots/routes";

@Component({
  selector: 'app-system-word-choice',
  templateUrl: './system-word-choice.html',
  styleUrl: './system-word-choice.css',
  imports: [
    NzFormModule,
    NzButtonModule,
    RouterLink,
    NzCardModule,
    NgTemplateOutlet,
    TranslateModule
  ],
  standalone: true
})
export class SystemWordChoice {
  @Output()
  chooseSystemPrompt = new EventEmitter<SystemPromptItem | undefined>();
  systemPrompts: SystemPromptItem[] | undefined;
  constructor(private systemInfoService: SystemPromptService) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
  }
  @Output()
  close = new EventEmitter<any>();

  release(info?: SystemPromptItem) {
    this.chooseSystemPrompt.emit(info);
    this.close.emit(true);
  }

  protected readonly user_routes = user_routes;
}
