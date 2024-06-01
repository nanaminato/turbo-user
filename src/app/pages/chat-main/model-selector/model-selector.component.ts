import {Component, Inject} from '@angular/core';
import {Subject} from "rxjs";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";
import {ConfigurationService} from "../../../services/db-services";
import {configurationChangeSubject} from "../../../injection_tokens";
import {RequestType} from "../../../models/enumerates";
import {Configuration, DisplayModel} from "../../../models";


@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrl: './model-selector.component.css',
  imports: [
    FormsModule,
    NzSelectModule,
    NgForOf
  ],
  standalone: true
})
export class ModelSelectorComponent {
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
    console.log(this.model!)
    await this.configurationService.setConfigurationLocal();
  }
}
