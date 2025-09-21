import {NgModule} from "@angular/core";
import {ChatsRoutingModule} from "./chats-routing.module";
import {ConfigurationResolver} from "../services/db-services";
import {SystemPromptResolver} from "../services/db-services/system-prompt-resolver.service";

@NgModule({
  imports: [
    ChatsRoutingModule,
  ],
  declarations: [
  ],
  exports: [],
  providers: [
    ConfigurationResolver,
    SystemPromptResolver,
  ]
})
export class ChatModule {

}
