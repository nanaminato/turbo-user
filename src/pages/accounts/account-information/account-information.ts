import {Component, inject, Inject, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {catchError, Observer} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {NzCardComponent} from "ng-zorro-antd/card";
import {AuthService, VerificationService} from "../../../auth_module";
import {AuthCallService} from "../../../auth_module/auth-call.service";
import {Role} from "../../../models/accounts";
import {user_routes} from "../../../roots/routes";
import {loginSubject} from "../../../injection_tokens/subject.data";
import {Store} from "@ngrx/store";
import {authActions} from "../../../systems/store/system.actions";

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.html',
  styleUrl: './account-information.css',
  imports: [
    NzCardComponent
  ],
  standalone: true
})
export class AccountInformation implements OnInit{
  message: NzMessageService = inject(NzMessageService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  call: AuthCallService = inject(AuthCallService);
  roles: Role[] | undefined;
  get user(){
    return this.authService.user;
  }
  ngOnInit() {
    if(this.authService.user){
      this.fetchRolesOfThisUser();
    }
  }
  fetchRolesOfThisUser(){
    this.call.getRolesWithUserId(this.user?.id!).subscribe({
      next: (roles: Role[]) =>{
        this.roles = roles;
      }
    })
  }
  store = inject(Store)
  logout() {
    this.authService.logout();
    this.store.dispatch(authActions.logout());
  }
}
