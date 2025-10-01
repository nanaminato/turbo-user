import {Component, inject} from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AccountLabel} from "../../accounts/account-label/account-label";
import {NgTemplateOutlet} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {TranslatePipe} from "@ngx-translate/core";
import {Configuration} from "../../../models";
import {AuthService} from "../../../auth_module";
import {ServiceProvider} from "../../../roots";
import {Store} from "@ngrx/store";
import {user_routes} from "../../../roots/routes";

@Component({
  selector: 'app-top-image',
  templateUrl: './top-image.html',
  styleUrls: ['./top-image.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    AccountLabel,
    NgTemplateOutlet,
    NzButtonComponent,
    NzIconDirective,
    NzSkeletonComponent,
    NzWaveDirective,
    RouterLink,
    TranslatePipe
  ]
})
export class TopImage {
  config: Configuration | undefined;
  router = inject(Router);
  auth = inject(AuthService);
  provider = inject(ServiceProvider);
  store = inject(Store);
  openSettingPage() {
    this.router.navigate(user_routes.settings);
  }
  openPromptPage() {
    this.router.navigate(user_routes.prompts);
  }

}
