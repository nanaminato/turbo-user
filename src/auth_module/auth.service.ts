import {inject, Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {User} from "../models/accounts";
import {AuthCallService} from "./auth-call.service";
import {Store} from "@ngrx/store";
import {authActions} from "../systems/store/system.actions";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private userKey: string = "auth_user";
  public user: User | undefined;
  public token: string | undefined;
  message = inject(NzMessageService);
  call = inject(AuthCallService);
  store = inject(Store);
  constructor() {
    this.resume();
    if(this.user){
      // 自动使用密码登录
      this.store.dispatch(authActions.login({username: this.user.name, password: this.user.password}))
    }
  }
  resume(){
    let iToken = localStorage.getItem(this.tokenKey);
    if(iToken!=null) this.token = iToken;
    let iUser = localStorage.getItem(this.userKey);
    if(iUser!=null) this.user = JSON.parse(iUser);
  }
  get isLogin(): boolean {
    return this.token !== undefined;
  }

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password
    };
    return this.call.login(body).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            // 密码错误
            this.message.create('error', `用户名或者密码错误`);
          } else {
            // 网络错误
            this.message.create('error', `网络错误，请稍后重试`);
          }
        }
        throw error;
      })
    );
  }
  restore(user: User, token: string) {
    this.user = user;
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(this.user));
  }

  logout(){
    this.token = undefined;
    this.user = undefined;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
