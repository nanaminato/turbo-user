import {isDevMode, NgModule, SecurityContext} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouteReuseStrategy, RouterOutlet} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {CLIPBOARD_OPTIONS, ClipboardButtonComponent, MarkdownModule} from "ngx-markdown";
import {registerLocaleData} from "@angular/common";
import zh from '@angular/common/locales/zh';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ServiceWorkerModule} from "@angular/service-worker";
import {NZ_I18N, zh_CN} from "ng-zorro-antd/i18n";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {Subject} from "rxjs";
import { ProdTranslateHttpLoader } from '../services/handlers';
import {ChatModule} from "../pages/chat.module";
import {ChatHistory} from "../pages/chat-history/chat-history";
import {AccountLabel} from "../pages/accounts/account-label/account-label";
import {SignInPage} from "../pages/accounts/sign-in-page/sign-in-page";
import {TokenInterceptorService} from "../roots";
import {
  backChatHistorySubject,
  chatSessionSubject,
  configurationChangeSubject, lastSessionToken, sizeReportToken,
  systemPromptChangeSubject
} from "../injection_tokens";
import {ChatHistoryTitle, Configuration, LastSessionModel} from "../models";
import {ConfigurationResolver} from "../services/db-services";
import {SystemPromptResolver} from "../services/db-services/system-prompt-resolver.service";
import {DynamicConfigService, SizeReportService, ThemeSwitcherService} from "../services/normal-services";
import {historyChangeSubject, loginSubject} from "../injection_tokens/subject.data";
registerLocaleData(zh);
export function HttpLoaderFactory() {
  return new ProdTranslateHttpLoader();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
      sanitize: SecurityContext.HTML,
    }),
    TranslateModule.forRoot({
      lang: 'zh',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    FormsModule,
    ChatModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  //   app
    NzButtonModule,
    NzIconModule,
    ChatHistory,
    AccountLabel,
    NzSkeletonModule,
    RouterOutlet,
    TranslateModule,
    SignInPage,
    HttpClientModule,
    IonicModule,
  ],
  providers: [
    // base
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: configurationChangeSubject, useValue: new Subject<Configuration>()
    },
    ConfigurationResolver,
    SystemPromptResolver,
    {
      provide: chatSessionSubject,useValue: new Subject<number>(),
    },
    {
      provide: backChatHistorySubject, useValue: new Subject<ChatHistoryTitle>()
    },
    {
      provide: systemPromptChangeSubject, useValue: new Subject<boolean>()
    },
    {
      provide: loginSubject, useValue: new Subject<boolean>()
    },
    {
      provide: historyChangeSubject, useValue: new Subject<boolean>()
    },

  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
