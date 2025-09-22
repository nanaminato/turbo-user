import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {providerActions} from "./provider.actions";
import {ServiceProvider} from "../../../roots";
import {ConfigService} from "../../../services/normal-services/config.service";
import {environment} from "../../../environments/environment";
import {historyTitleActions} from "../history-title/history-title.actions";

@Injectable()
export class ProviderEffects{
  actions$ = inject(Actions)
  provider = inject(ServiceProvider)
  configService = inject(ConfigService)
  providerLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(providerActions.load),
      // 如果是生产环境，立即返回loadSuccess，不调用接口
      switchMap(() => {
        if (environment.production) {
          return of(providerActions.loadSuccess());
        }
        return this.configService.getConfig().pipe(
          tap((config: any) => {
            this.provider.apiUrl = config.apiUrl;
          }),
          map(() => providerActions.loadSuccess()),
          catchError(() => of(providerActions.loadFail()))
        );
      })
    )
  );
  providerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(providerActions.loadSuccess),
      switchMap(() => [
        historyTitleActions.loadFromHttp()
      ])
    )
  );

}
