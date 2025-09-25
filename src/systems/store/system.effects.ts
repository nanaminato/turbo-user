import {Actions, createEffect, ofType} from "@ngrx/effects";
import {dbActions} from "./system.actions";
import {switchMap} from "rxjs";
import {configurationActions} from "./configuration/configuration.actions";
import {systemPromptActions} from "./system-prompts/prompts.actions";
import {inject, Injectable} from "@angular/core";
import {providerActions} from "./provider/provider.actions";
@Injectable()
export class SystemEffects{
  actions$ = inject(Actions)
  dbLoadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dbActions.loadSuccess),
      switchMap(() => [
        providerActions.load(),
        configurationActions.load(),
        systemPromptActions.load(),
      ])
    )
  );


}
