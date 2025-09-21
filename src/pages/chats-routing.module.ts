import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ConfigurationResolver} from "../services/db-services";
import {SystemPromptResolver} from "../services/db-services/system-prompt-resolver.service";

const routes: Routes = [
  {
    path: "", loadComponent: ()=>import("./chat-page/chat-page")
      .then(m=>m.ChatPage),

    children: [
      {
        path: "", loadComponent: ()=>import('./chat-main/chat-main')
          .then(m=>m.ChatMainComponent),
        resolve: {
          model: ConfigurationResolver,
          model2: SystemPromptResolver,
        }
      },
      {
        path: "settings",
        loadComponent:()=>import("./settings/settings")
          .then(m=>m.Settings),
        resolve: {
          model: ConfigurationResolver
        }
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
        resolve: {
          model: SystemPromptResolver,
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsRoutingModule { }
