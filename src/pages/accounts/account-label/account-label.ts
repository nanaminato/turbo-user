import {Component, inject, Inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {MenuController} from "@ionic/angular";
import {sizeReportToken} from "../../../injection_tokens";
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
  menuCtrl: MenuController = inject(MenuController);
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
          this.menuCtrl.close();
        }
      }
    );
  }

  openAccount() {
    if(this.sizeReportService.miniPhoneView()){
      this.menuCtrl.close().then(r => {

      })
    }
    this.router.navigate(user_routes.account_info).then(
      ()=>{
      }
    );
  }
}
