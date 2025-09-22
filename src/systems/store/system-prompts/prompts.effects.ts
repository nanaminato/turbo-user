import {catchError, from, map, mergeMap, of, switchMap} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {DbService} from "../../../services/db-services";
import {systemPromptActions} from "./prompts.actions";

@Injectable()
export class SystemPromptsEffects {
  private actions$: Actions = inject(Actions)
  private dbService: DbService = inject(DbService);

  loadSystemPrompts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(systemPromptActions.load),
          mergeMap(() =>
            from(this.dbService.getSystemPrompts()).pipe(
              map(systemPrompts => systemPromptActions.loadSuccess({ systemPrompts })),
              catchError(error => of(systemPromptActions.loadFailure()))
            )
          )
    )
  );

}
