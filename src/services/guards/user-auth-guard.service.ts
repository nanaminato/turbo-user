import {inject, Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../../auth_module";
import {user_routes} from "../../roots/routes";
import {LocalizationService} from '../normal-services';

@Injectable({
  providedIn: "root"
})
export class UserAuthGuardService {
  message = inject(NzMessageService);
  authService = inject(AuthService);
  router = inject(Router);
  localization = inject(LocalizationService);
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):Promise<boolean>|boolean{
    if(this.authService.isLogin){
      return true;
    }else{
      this.message.error(this.localization.text('notifications.notSignedIn'));
      this.router.navigate(user_routes.sign_in);
      return false;
    }
  }
}
