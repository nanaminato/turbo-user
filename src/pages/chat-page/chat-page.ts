import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MenuAbleService} from "../../services/normal-services/menu-able.service";
import {AccountLabel} from "../accounts/account-label/account-label";
import {ChatHistory} from "../chat-history/chat-history";
import {NgTemplateOutlet} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {TranslatePipe} from "@ngx-translate/core";
import {user_routes} from "../../roots/routes";
import {Configuration} from "../../models";
import {SizeReportService} from "../../services/normal-services";
import {AuthService} from "../../auth_module";
import {ServiceProvider} from "../../roots";
import {Store} from "@ngrx/store";
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    AccountLabel,
    ChatHistory,
    NgTemplateOutlet,
    NzButtonComponent,
    NzIconDirective,
    NzSkeletonComponent,
    NzWaveDirective,
    RouterLink,
    TranslatePipe
  ],
  providers: [
  ]
})
export class ChatPage {
  config: Configuration | undefined;
  menuAble = inject(MenuAbleService);
  sizeReportService = inject(SizeReportService);
  router = inject(Router);
  auth = inject(AuthService);
  provider = inject(ServiceProvider);
  store = inject(Store);
  openSettingPage() {
    this.router.navigate(user_routes.settings);
  }
  openPromptPage() {
    this.router.navigate(user_routes.prompts);
  }
}
