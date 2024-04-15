import {NgModule} from "@angular/core";
import {ChatsRoutingModule} from "./chats-routing.module";
import {Subject} from "rxjs";
import { DatasModule } from "../services/db-services/datas.module";
import {ConfigurationResolver} from "../services/db-services";
import {SystemPromptResolver} from "../services/db-services/system-prompt-resolver.service";
import {configurationChangeSubject, systemPromptChangeSubject} from "../injection_tokens";
import {Configuration} from "../models";

@NgModule({
  imports: [
    ChatsRoutingModule,
    DatasModule,
  ],
  declarations: [
  ],
  exports: [],
  providers: [
    ConfigurationResolver,
    SystemPromptResolver,
    {
      provide: configurationChangeSubject, useValue: new Subject<Configuration>()
    },
    {
      provide: systemPromptChangeSubject, useValue: new Subject<boolean>()
    }
  ]
})
export class ChatModule {

}
