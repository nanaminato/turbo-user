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
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
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
import {historyTitleReducer} from "../systems/store/history-title/history-title.reducer";
import {systemPromptsReducer} from "../systems/store/system-prompts/prompts.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      lang: 'zh',
      fallbackLang: 'zh',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
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
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicModule.forRoot()),
    provideHttpClient(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideNoopAnimations(),
    provideAnimations(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
    provideStore({
        "config": configurationReducer,
        "historyTitle": historyTitleReducer,
        "prompts": systemPromptsReducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
        }
      }),
    provideEffects(AuthEffects, ConfigurationEffects, HistoryTitleEffect, ProviderEffects,
      SystemPromptsEffects, SystemEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),

  ]
};
