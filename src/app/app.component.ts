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
import {Observable, Observer, Subject} from "rxjs";
import {environment} from "../environments/environment";
import {ChatHistoryTitle, Configuration} from "../models";
import {MenuAbleService} from "../services/normal-services/menu-able.service";
import {IonicModule, MenuController} from "@ionic/angular";
import {
  backChatHistorySubject,
  configurationChangeSubject
} from "../injection_tokens";
import {DynamicConfigService, SizeReportService} from "../services/normal-services";
import {
  ChatDataService,
  ConfigurationService,
  DbService,
  HistoryTitleService
} from "../services/db-services";
import {AuthService, RequestManagerService, SendManagerService} from "../auth_module";
import {historyChangeSubject, loginSubject} from "../injection_tokens/subject.data";
import {ConfigService} from "../services/normal-services/config.service";
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
import {Actions, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {authActions} from "../systems/store/system.actions";
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
  configuration: Configuration | undefined;
  historyTitles: ChatHistoryTitle[] | undefined;
  @ViewChild('myElement', { static: true })
  imageMenu: ElementRef | undefined;
  public menuAble = inject(MenuAbleService);
  private menuCtrl = inject(MenuController);
  private sizeReportService = inject(SizeReportService);
  private router = inject(Router);
  private historyTitleService = inject(HistoryTitleService);
  private chatDataService = inject(ChatDataService);
  private dbService = inject(DbService);
  private dynamicConfigService = inject(DynamicConfigService);
  private configurationService = inject(ConfigurationService);
  private auth = inject(AuthService);
  private requestManagerService = inject(RequestManagerService);
  private sendManagerService = inject(SendManagerService);
  private configService = inject(ConfigService);
  private provider = inject(ServiceProvider);
  store = inject(Store);
  constructor(
    @Inject(backChatHistorySubject) private backHistoryObservable: Subject<ChatHistoryTitle>,
    @Inject(historyChangeSubject) private historyChangeObserver: Observer<boolean>,
  ) {

    this.initThemeAndLanguage();
    this.store.select(selectConfig).subscribe((config: Configuration | null)=>{
      this.configuration = config!;
      this.initThemeAndLanguage(true);
    });
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId===MagicDataId) return;
      const existingItem = this.historyTitles!.find(item => item.dataId === historyTitle.dataId);
      if (!existingItem) {
        this.historyTitles!.splice(0, 0, historyTitle)
        // 如果不存在具有相同 dataId 的项，则添加 historyTitle
      }
    });

    this.actions$.pipe(ofType(authActions.loginSuccess)).subscribe(()=>{
      this.ngOnInit();
    })
  }
  actions$ = inject(Actions);
  initThemeAndLanguage(direct: boolean = false){
    if(!direct){
      this.configuration = this.configurationService.configuration!;
    }
    let configDynamic = this.dynamicConfigService.getDynamicConfig(this.configuration!);
    this.dynamicConfigService.initDynamic(configDynamic);
    console.log(configDynamic);
    console.log(new Date());
  }
  async ngOnInit() {
    this.sizeReportService.width = window.innerWidth;
    this.sizeReportService.height = window.innerHeight;
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close();
    }
    this.store.dispatch(providerActions.load());
  }
  private async getUniqueDataIds(historyTitles: ChatHistoryTitle[]) {
    const dataIds: number[] = [];
    const uniqueDataIds: number[] = [];
    for (const title of historyTitles) {
      if (title.userId !== undefined && !dataIds.includes(title.dataId)) {
        dataIds.push(title.dataId);
        uniqueDataIds.push(title.dataId);
      }
    }
    return uniqueDataIds;
  }

  @HostListener('window:resize',['$event'])
  onResize(event: any){
    this.sizeReportService.width = event.target.innerWidth;
    this.sizeReportService.height = event.target.innerHeight;
  }

  openSettingPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close().then(r => {

      })
    }
    this.router.navigate(user_routes.settings).then(
      ()=>{

      }
    );
  }
  openPromptPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close().then(r => {

      })
    }
    this.router.navigate(user_routes.prompts).then(
      ()=>{
      }
    );

  }

  async handleChatHistoryAction($event: ChatHistoryTitleActionInfo) {
    switch ($event.action){
      case ChatHistoryTitleAction.Delete:
        const index = this.historyTitles?.findIndex(h=>h.dataId==$event.info.dataId);
        if(index===undefined) return;
        let historyTitle = this.historyTitles![index];
        this.historyTitles?.splice(index,1);
        await this.historyTitleService.deleteHistoryTitle(historyTitle).then(async ()=>{
          // console.log("本地: 删除会话标题成功")
          this.sendManagerService.deleteHistory(historyTitle.dataId).then((msg:string)=>{
            console.log("服务器: "+msg)
          });
          await this.chatDataService.deleteHistoriesByTitleId(historyTitle.dataId);
          // console.log("本地: 删除会话消息成功！")
        });

        // 推送一个额特殊的 消息，表示历史列表发生了改变
        this.backHistoryObservable.next({
          dataId: MagicDataId,
          title: "none"
        })
        break;
      case ChatHistoryTitleAction.Rename:

        break;
      default:
        break;
    }
  }

}
