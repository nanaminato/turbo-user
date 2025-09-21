import {Component, Inject} from '@angular/core';
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
  constructor(private configurationService: ConfigurationService,
              @Inject(configurationChangeSubject) private configurationObservable: Subject<Configuration>) {
    this.buildSelector();
    this.model = this.configurationService.configuration?.model;
    this.configurationObservable.subscribe((config)=>{
      this.buildSelector();
      this.model = config.model;
    })
  }
  buildSelector(){
    this.chatStreamChildren.length = 0;
    for(let model of this.configurationService.configuration?.chatConfiguration!.models!){
      this.chatStreamChildren.push(model)
    }
  }
  async onSelectChange() {
    this.configurationService!.configuration!.model! = this.model!;
    // console.log(this.model!)
    await this.configurationService.setConfigurationLocal();
  }
}
