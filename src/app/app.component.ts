import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ChatHistoryTitle, Configuration} from "../models";
import {MenuAbleService} from "../services/normal-services/menu-able.service";
import {IonicModule, MenuController} from "@ionic/angular";
import {DynamicConfigService, SizeReportService} from "../services/normal-services";
import {
  ChatDataService,
  HistoryTitleService
} from "../services/db-services";
import {AuthService, SendManagerService} from "../auth_module";
import {ServiceProvider} from "../roots";
import {user_routes} from "../roots/routes";
import {ChatHistoryTitleAction, ChatHistoryTitleActionInfo} from "../models/operations";
import {FormsModule} from "@angular/forms";
import {ChatModule} from "../pages/chat.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ChatHistory} from "../pages/chat-history/chat-history";
import {AccountLabel} from "../pages/accounts/account-label/account-label";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {TranslatePipe} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";
import {Store} from "@ngrx/store";
import {selectConfig} from "../systems/store/configuration/configuration.selectors";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ChatModule,
    NzButtonModule,
    NzIconModule,
    ChatHistory,
    AccountLabel,
    NzSkeletonModule,
    IonicModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    NgTemplateOutlet,
  ],
  providers: [

  ],
})
export class AppComponent implements OnInit{
  config: Configuration | undefined;
  menuAble = inject(MenuAbleService);
  menuCtrl = inject(MenuController);
  sizeReportService = inject(SizeReportService);
  router = inject(Router);
  auth = inject(AuthService);
  provider = inject(ServiceProvider);
  store = inject(Store);

  async ngOnInit() {
    this.setMenu();
  }
  setMenu(){
    this.sizeReportService.width = window.innerWidth;
    this.sizeReportService.height = window.innerHeight;
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
  }
  @HostListener('window:resize',['$event'])
  onResize(event: any){
    this.sizeReportService.width = event.target.innerWidth;
    this.sizeReportService.height = event.target.innerHeight;
  }

  openSettingPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
    this.router.navigate(user_routes.settings);
  }
  openPromptPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
    this.router.navigate(user_routes.prompts);
  }

}
