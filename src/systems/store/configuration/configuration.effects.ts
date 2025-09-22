import {catchError, from, map, mergeMap, of} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ConfigurationService, DbService} from "../../../services/db-services";
import {configurationActions} from "./configuration.actions";

@Injectable()
export class SystemPromptsEffects {
  private actions$: Actions = inject(Actions)
  private dbService: DbService = inject(DbService);
  configurationService = inject(ConfigurationService);
  loadSystemPrompts$ = createEffect(() =>
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

}
