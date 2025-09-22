import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, of, tap} from "rxjs";
import {authActions} from "../system.actions";
import {user_routes} from "../../../roots/routes";
import {AuthService} from "../../../auth_module";
import {Router} from "@angular/router";

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

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(action => {
          this.authService.restore(action.user, action.token);
          this.router.navigate(user_routes.account_info);
          // 如果你还有其他登录成功后的逻辑，比如通知组件，可以考虑这里触发通知 action
        })
      ),
    { dispatch: false }
  );


}
