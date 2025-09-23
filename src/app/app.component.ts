import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Observer, Subject} from "rxjs";
import {ChatHistoryTitle, Configuration} from "../models";
import {MenuAbleService} from "../services/normal-services/menu-able.service";
import {IonicModule, MenuController} from "@ionic/angular";
import {
  backChatHistorySubject
} from "../injection_tokens";
import {DynamicConfigService, SizeReportService} from "../services/normal-services";
import {
  ChatDataService,
  ConfigurationService,
  HistoryTitleService
} from "../services/db-services";
import {AuthService, SendManagerService} from "../auth_module";
import {historyChangeSubject} from "../injection_tokens/subject.data";
import {ServiceProvider} from "../roots";
import {MagicDataId} from "../pages/chat-page/chat-page";
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
import {providerActions} from "../systems/store/provider/provider.actions";

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
  historyTitles: ChatHistoryTitle[] | undefined;
  @ViewChild('myElement', { static: true })
  imageMenu: ElementRef | undefined;
  menuAble = inject(MenuAbleService);
  menuCtrl = inject(MenuController);
  sizeReportService = inject(SizeReportService);
  router = inject(Router);
  historyTitleService = inject(HistoryTitleService);
  chatDataService = inject(ChatDataService);
  dynamicConfigService = inject(DynamicConfigService);
  auth = inject(AuthService);
  sendManagerService = inject(SendManagerService);
  provider = inject(ServiceProvider);
  store = inject(Store);
  constructor() {
    this.store.select(selectConfig).subscribe((config: Configuration | null)=>{
      this.config = config!;
      if(this.config){
        this.initThemeAndLanguage(true);
      }
    });
  }

  initThemeAndLanguage(direct: boolean = false){
    let configDynamic =
      this.dynamicConfigService.getDynamicConfig(this.config!);
    this.dynamicConfigService.initDynamic(configDynamic);
  }
  async ngOnInit() {
    this.setMenu();
    this.store.dispatch(providerActions.load());
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

  async handleChatHistoryAction($event: ChatHistoryTitleActionInfo) {
    switch ($event.action){
      case ChatHistoryTitleAction.Delete:
        const index = this.historyTitles?.findIndex(h=>h.dataId==$event.info.dataId);
        if(index===undefined) return;
        let historyTitle = this.historyTitles![index];
        this.historyTitles?.splice(index,1);
        await this.historyTitleService.deleteHistoryTitle(historyTitle).then(async ()=>{
          this.sendManagerService.deleteHistory(historyTitle.dataId).then((msg:string)=>{
            console.log("服务器: "+msg)
          });
          await this.chatDataService.deleteHistoriesByTitleId(historyTitle.dataId);
        });
        break;
      case ChatHistoryTitleAction.Rename:
        break;
      default:
        break;
    }
  }

}
