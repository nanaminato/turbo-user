import {catchError, from, map, mergeMap, of, tap, withLatestFrom} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ConfigurationService, DbService} from "../../../services/db-services";
import {configurationActions} from "./configuration.actions";
import {DynamicConfigService} from "../../../services/normal-services";
import {Configuration} from "../../../models";
import {Store} from "@ngrx/store";
import {selectConfig} from "./configuration.selectors";

@Injectable()
export class ConfigurationEffects {
  private actions$: Actions = inject(Actions)
  private dbService: DbService = inject(DbService);
  configurationService = inject(ConfigurationService);
  loadConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(configurationActions.load),
      mergeMap(() =>
        from(this.dbService.getConfiguration()).pipe(
          map(config => {
            if(config){
              return configurationActions.loadSuccess({config})
            }else{
              config = this.configurationService.default_configuration();
              this.dbService.setConfiguration(config);
              return configurationActions.loadSuccess({config})
            }
          }),
          catchError(error => of(configurationActions.loadFailure()))
        )
      )
    )
  );
  store = inject(Store);
  updateAppView$ = createEffect(() =>
      this.actions$.pipe(
        ofType(configurationActions.loadSuccess, configurationActions.configUpdate),
        tap(action => {
          // 直接从action中取配置
          this.initThemeAndLanguage(action.config);
        })
      ),
    { dispatch: false }
  );

  dynamicConfigService = inject(DynamicConfigService);
  initThemeAndLanguage(config: Configuration){
    let configDynamic =
      this.dynamicConfigService.getDynamicConfig(config);
    this.dynamicConfigService.initDynamic(configDynamic);
  }

}
