import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, of, switchMap, tap} from "rxjs";
import {authActions, dbActions} from "../system.actions";
import {user_routes} from "../../../roots/routes";
import {AuthService} from "../../../auth_module";
import {Router} from "@angular/router";
import {historyTitleActions} from "../history-title/history-title.actions";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class AuthEffects {
  private actions$: Actions = inject(Actions)
  private authService = inject(AuthService);
  private router: Router = inject(Router);
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      mergeMap(action =>
        this.authService.login(action.username, action.password).pipe(
          map(response =>
            authActions.loginSuccess({
              user: { name: action.username, id: response.id, password: action.password },
              token: response.token
            })
          ),
          catchError(error => of(authActions.loginFailure({ error })))
        )
      )
    )
  );
  messageService = inject(NzMessageService);
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(action => {
          this.messageService.success("登录成功")
          this.authService.restore(action.user, action.token);
          this.router.navigate(user_routes.account_info);
        })
      ),
    { dispatch: false }
  );
  dbLoadSuccess2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSuccess),
      switchMap(() => [
        historyTitleActions.loadFromDb(),
        historyTitleActions.loadFromHttp()
      ])
    )
  );

}
