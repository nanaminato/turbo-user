import {
  ApplicationConfig, importProvidersFrom,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, SecurityContext
} from '@angular/core';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations, provideNoopAnimations} from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';import {provideStoreDevtools} from '@ngrx/store-devtools';
import {jwtInterceptor} from "../systems/interceptors/jwt.interceptor";
import {routes} from "./app.routes";
import {NZ_I18N, zh_CN} from "ng-zorro-antd/i18n";
import {provideServiceWorker} from "@angular/service-worker";
import {provideTranslateService} from "@ngx-translate/core";
import {CLIPBOARD_OPTIONS, ClipboardButtonComponent, MarkdownModule} from "ngx-markdown";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {AuthEffects} from "../systems/store/auth/auth.effects";
import {HistoryTitleEffect} from "../systems/store/history-title/history-title.effects";
import {ConfigurationEffects} from "../systems/store/configuration/configuration.effects";
import {ProviderEffects} from "../systems/store/provider/provider.effects";
import {SystemPromptsEffects} from "../systems/store/system-prompts/prompts.effects";
import {SystemEffects} from "../systems/store/system.effects";
import {configurationReducer} from "../systems/store/configuration/configuration.reducer";
import {historyTitleReducers} from "../systems/store/history-title/history-title.reducers";
import {systemPromptsReducer} from "../systems/store/system-prompts/prompts.reducer";
import {ChatHistoryEffects} from "../systems/store/chat-history/chat-history.effects";
import {chatHistoryReducer} from "../systems/store/chat-history/chat-history.reducers";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      lang: 'zh',
      fallbackLang: 'zh',
      loader: provideTranslateHttpLoader({
        prefix: environment.assets,
        suffix: '.json'
      })
    }),

    importProvidersFrom(
      MarkdownModule.forRoot({
        clipboardOptions: {
          provide: CLIPBOARD_OPTIONS,
          useValue: {
            buttonComponent: ClipboardButtonComponent,
          },
        },
        sanitize: SecurityContext.HTML,
      }),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideNoopAnimations(),
    provideAnimations(),
    { provide: NZ_I18N, useValue: zh_CN },
    provideStore({
        "config": configurationReducer,
        "historyTitle": historyTitleReducers,
        "prompts": systemPromptsReducer,
        "chatHistory": chatHistoryReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        }
      }),
    provideEffects(AuthEffects, ConfigurationEffects, HistoryTitleEffect, ProviderEffects,
      SystemPromptsEffects, SystemEffects, ChatHistoryEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ]
};
