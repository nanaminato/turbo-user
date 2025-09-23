import {Component, inject, Inject} from '@angular/core';
import {Subject} from "rxjs";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";
import {ConfigurationService} from "../../../services/db-services";
import {configurationChangeSubject} from "../../../injection_tokens";
import {RequestType} from "../../../models/enumerates";
import {Configuration, DisplayModel} from "../../../models";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {Store} from "@ngrx/store";
import {selectConfig} from "../../../systems/store/configuration/configuration.selectors";
import {configurationActions} from "../../../systems/store/configuration/configuration.actions";


@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.html',
  styleUrl: './model-selector.css',
  imports: [
    FormsModule,
    NzSelectModule,
    NzIconDirective,
    NzTooltipDirective
  ],
  standalone: true
})
export class ModelSelector {
  chatStreamChildren: DisplayModel[] = [];
  model: DisplayModel | undefined;
  config: Configuration | null = null;
  store = inject(Store);
  configService = inject(ConfigurationService);
  constructor() {
    this.store.select(selectConfig).subscribe(config => {
      this.config = config;
      this.buildSelector();
      this.model = config!.model;
    });
  }
  buildSelector(){
    this.chatStreamChildren.length = 0;
    for(let model of this.config!.chatConfiguration!.models!){
      this.chatStreamChildren.push(model)
    }
  }
  async onSelectChange() {
    this.config!.model = this.model!;
    this.store.dispatch(configurationActions.configUpdate({config: this.config!}))
    this.configService.saveConfigToDb(this.config!)
  }
}
