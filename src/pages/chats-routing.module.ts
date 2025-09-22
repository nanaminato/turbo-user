import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "", loadComponent: ()=>import("./chat-page/chat-page")
      .then(m=>m.ChatPage),

    children: [
      {
        path: "", loadComponent: ()=>import('./chat-main/chat-main')
          .then(m=>m.ChatMainComponent),
      },
      {
        path: "settings",
        loadComponent:()=>import("./settings/settings")
          .then(m=>m.Settings),
      },
      {
        path: "accounts",
        loadChildren: ()=>import("./accounts/account.module")
          .then(m=>m.AccountModule)
      },
      {
        path: "prompts",
        loadComponent: ()=>import("./prompt-store/prompt-store")
          .then(m=>m.PromptStore),
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsRoutingModule { }
