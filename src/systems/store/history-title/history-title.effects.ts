import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject, Injectable} from "@angular/core";
import {historyTitleActions} from "./history-title.actions";
import {catchError, from, map, mergeMap, of, withLatestFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {addWithMerge} from "./addWithMerge";
import {HistoryTitleService} from "../../../services/db-services";

@Injectable()
export class HistoryTitleEffect {
  actions$ = inject(Actions)
  store = inject(Store)
  historyTitleService = inject(HistoryTitleService)
  loadHistoryFromDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historyTitleActions.loadFromDb),
      withLatestFrom(
        this.store.select(state => state.auth.user?.id),
        this.store.select(state => state.history.historyTitles),
      ),
      mergeMap(([action, userId, historyTitles]) => {
        if (!userId) {
          // 用户未登录，直接返回已有historyTitles
          return of(historyTitleActions.loadSuccess({ historyTitles }));
        }
        return from(this.historyTitleService.getHistoryTitles(userId)).pipe(
          map(dbHistoryTitles => {
            // 如果接口返回 undefined，保证赋予空数组，避免报错
            const safeDbTitles = dbHistoryTitles ?? [];
            const merged = addWithMerge(historyTitles, safeDbTitles);
            return historyTitleActions.loadSuccess({ historyTitles: merged });
          }),
          catchError(() =>
            of(historyTitleActions.loadFailure()) // 你需要定义 loadFailure Action
          )
        );
      })
    )
  );

  loadHistoryFromHttpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historyTitleActions.loadFromHttp),
      withLatestFrom(this.store.select(state => state.history.historyTitles)),
      map(([{ httpHistoryTitles }, historyTitles]) => {
        const merged = addWithMerge(historyTitles, httpHistoryTitles);
        return historyTitleActions.loadSuccess({ historyTitles: merged });
      })
    )
  );

}
