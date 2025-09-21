import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
const routes: Routes = [
  {
    path: "", loadComponent: ()=> import('./account/account').then(m=>m.Account),
    children: [
      {
        path: "", pathMatch: "full",redirectTo: "account-info",
      },
      {
        path: "account-info", loadComponent: ()=>import("./account-information/account-information")
          .then(m=>m.AccountInformation),
      },
      {
        path: "sign-in", loadComponent: ()=>import("./sign-in-page/sign-in-page")
          .then(m=>m.SignInPage),
      },
      {
        path: "register", loadComponent: ()=>import("./register/register")
          .then(m=>m.Register),
      },
      {
        path: "forgot-me-password", loadComponent: ()=>import("./forgot-my-password/forgot-my-password")
          .then(m=>m.ForgotMyPassword)
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {

}
