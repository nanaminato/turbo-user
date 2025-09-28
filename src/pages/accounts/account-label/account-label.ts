import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "../../../auth_module";
import {SizeReportService} from "../../../services/normal-services";
import {user_routes} from "../../../roots/routes";

@Component({
  selector: 'app-account-label',
  templateUrl: './account-label.html',
  styleUrl: './account-label.css',
  imports: [
    NzButtonModule,
    TranslateModule,
  ],
  providers: [
  ],
  standalone: true
})
export class AccountLabel {
  sizeReportService: SizeReportService = inject(SizeReportService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  get isLogin():boolean{
    return this.authService.isLogin;
  }

  openSignIn() {
    this.router.navigate(user_routes.sign_in).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
        }
      }
    );
  }

  openAccount() {
    if(this.sizeReportService.miniPhoneView()){
    }
    this.router.navigate(user_routes.account_info).then(
      ()=>{
      }
    );
  }
}
