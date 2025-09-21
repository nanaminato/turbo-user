import {Component, ElementRef, HostListener, inject, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Observable, Observer, Subject} from "rxjs";
import {environment} from "../environments/environment";
import {ChatHistoryTitle, Configuration} from "../models";
import {MenuAbleService} from "../services/normal-services/menu-able.service";
import {MenuController} from "@ionic/angular";
import {backChatHistorySubject, configurationChangeSubject, sizeReportToken} from "../injection_tokens";
import {DynamicConfigService, SizeReportService} from "../services/normal-services";
import {ChatDataService, ConfigurationService, DbService, HistoryTitleService} from "../services/db-services";
import {AuthService, RequestManagerService, SendManagerService} from "../auth_module";
import {historyChangeSubject, loginSubject} from "../injection_tokens/subject.data";
import {ConfigService} from "../services/normal-services/config.service";
import {ServiceProvider} from "../roots";
import {MagicDataId} from "../pages/chat-page/chat-page";
import {user_routes} from "../roots/routes";
import {ChatHistoryTitleAction, ChatHistoryTitleActionInfo} from "../models/operations";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
  providers: []
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

  constructor(
    @Inject(backChatHistorySubject) private backHistoryObservable: Subject<ChatHistoryTitle>,
    @Inject(configurationChangeSubject) private configObservable: Observable<Configuration>,
    @Inject(loginSubject) private loginObservable: Observable<boolean>,
    @Inject(historyChangeSubject) private historyChangeObserver: Observer<boolean>,
  ) {
    if(!environment.production) {
      this.configService.getConfig().subscribe((config: any)=>{
        this.provider.apiUrl = config.apiUrl;
        // console.log("服务器地址: "+config.apiUrl);
      });
    }
    this.initThemeAndLanguage();
    this.configObservable.subscribe((config: Configuration)=>{
      console.log("aware config app");
      this.configuration = config;
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
    this.loginObservable.subscribe(async (newLogin)=>{
      if(newLogin){
        await this.ngOnInit();
      }
    });
  }
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
    this.dbService.waitForDbInit().then(async ()=>{
      this.historyTitles = await this.historyTitleService.getHistoryTitles(this.auth.user?.id);
      if (this.historyTitles === undefined) {
        this.historyTitles = [];
      }
      this.historyTitles?.reverse();
      let ids = await this.getUniqueDataIds(this.historyTitles);
      // console.log("准备更新历史记录");
      if(!environment.production){
        await this.provider.waitForInit();
      }
      let fetchedHistories =
        await this.requestManagerService.fetchHistoryAndRefreshData(ids);
      if(fetchedHistories!==undefined){
        for(let history of fetchedHistories){
          let find = this.historyTitles
            .findIndex(c=>c.dataId===history.dataId&&c.userId===history.dataId);
          if(find!==-1){
            /// 如果本地历史中包含和服务器下载的一样的数据标识,就删除本地并且添加下载数据
            this.historyTitles.splice(find,1,history);
          }else{
            this.historyTitles.push(history);
          }
        }
      }
      let reverse = -1;
      this.historyTitles.sort((a, b) => {
        if (a.userId !== undefined && b.userId !== undefined) {
          return (a.dataId - b.dataId)*reverse;
        } else if (a.userId === undefined && b.userId === undefined) {
          return (a.dataId - b.dataId)*reverse;
        } else {
          return (-1 + 2 * ((a.userId===undefined)?1:0))*reverse;
        }
      });
      // reorder
      // 依据 userId != null 依据dataId排序
      // userId == null, 依据dataId 排序
      this.historyChangeObserver.next(true);
    });
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
