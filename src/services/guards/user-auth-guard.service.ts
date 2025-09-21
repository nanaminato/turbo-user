import {inject, Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../../auth_module";
import {user_routes} from "../../roots/routes";

@Injectable({
  providedIn: "root"
})
export class UserAuthGuardService {
  message = inject(NzMessageService);
  authService = inject(AuthService);
  router = inject(Router);
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):Promise<boolean>|boolean{
    if(this.authService.isLogin){
      return true;
    }else{
      this.message.error("还没有登录哦");
      this.router.navigate(user_routes.sign_in);
      return false;
    }
  }
}
