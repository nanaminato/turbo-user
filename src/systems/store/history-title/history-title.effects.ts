import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject, Injectable} from "@angular/core";
import {historyTitleActions} from "./history-title.actions";
import {catchError, from, map, mergeMap, of, switchMap, tap, withLatestFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {addWithMerge} from "./addWithMerge";
import {HistoryTitleService} from "../../../services/db-services";
import {AuthService, RequestService} from "../../../auth_module";
import {ChatHistoryTitle} from "../../../models";
import {selectHistoryTitle} from "./history-title.selectors";
import {authActions} from "../system.actions";
import {user_routes} from "../../../roots/routes";

@Injectable()
export class HistoryTitleEffect {
  actions$ = inject(Actions)
  store = inject(Store)
  historyTitleService = inject(HistoryTitleService)
  authService = inject(AuthService)
  loadHistoryFromDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historyTitleActions.loadFromDb),
      withLatestFrom(
        this.store.select(selectHistoryTitle),
      ),
      mergeMap(([action, historyTitles]) => {
        let userId = this.authService.user!.id;
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
  missHistoryTitles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      switchMap(() => [
        historyTitleActions.clear()
      ])
    )
  );
  requestService = inject(RequestService)
  loadHistoryFromHttpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(historyTitleActions.loadFromHttp),
      withLatestFrom(
        this.store.select(selectHistoryTitle)
      ),
      mergeMap(([action,historyTitles]) => {
        let userId = this.authService.user!.id;
        if (!userId) {
          return of(historyTitleActions.loadSuccess({ historyTitles }));
        }

        const ids: number[] = (historyTitles && historyTitles.length > 0)
          ? historyTitles.map((item: ChatHistoryTitle) => item.dataId)
          : [];

        return this.requestService.requestHistories(ids).pipe(
          map(responseHistoryTitles => {
            const safeResponse = responseHistoryTitles ?? [];
            const merged = addWithMerge(historyTitles, safeResponse);
            return historyTitleActions.loadSuccess({ historyTitles: merged });
          }),
          catchError(() => of(historyTitleActions.loadFailure()))
        );
      })
    )
  );



}
