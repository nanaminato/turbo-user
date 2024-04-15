import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DisplayModel, displayModels} from "../../../models";
import {NumerService} from "../../../services/fetch_services/numer.service";
import {ConfigurationService} from "../../../services/db-services";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {ModelCustomAddComponent} from "./model-custom-add/model-custom-add.component";
import {UniversalService} from "../../../services/db-services/universal.service";

@Component({
  selector: 'app-model-center',
  templateUrl: './model-center.component.html',
  styleUrls: ['./model-center.component.scss'],
  standalone: true,
  imports: [
    NzButtonComponent,
    NzModalComponent,
    NzModalContentDirective,
    ModelCustomAddComponent
  ]
})
export class ModelCenterComponent  implements OnInit {
  constructor(private numerService: NumerService,
              private configurationService: ConfigurationService,
              private universalService: UniversalService) {
     this.configurationService.configuration?.chatConfiguration.models.forEach(t=>{
       this.selectedModels.push(t)
     })
  }
  selectableModels: DisplayModel[] = [];
  selectedModels: DisplayModel[] = [];
  ngOnInit() {
    displayModels.forEach(e=>{
      this.push(e);
    });
    this.numerService.getChatModels().subscribe({
      next: models=>{
        models.forEach(e=>{
          this.push(e)
        })
      }
    });
    this.universalService.getSelectableModels().then(models=>{
      models?.forEach((m: DisplayModel)=>{
        this.push(m);
      })
    })

  }
  push(displayModel: DisplayModel){
    if(this.selectableModels.
      findIndex(s=>s.modelValue===displayModel.modelValue)!==-1){
    }else{
      this.selectableModels.push(displayModel)
    }
  }
  add(displayModel: DisplayModel){
    this.universalService.addSelectableModel(displayModel);
  }
  selected(modelValue: string){
    let i1 = this.selectedModels.findIndex(m=>m.modelValue===modelValue);
    return i1 !== -1;
  }
  addOrRemove(displayModel: DisplayModel){
    let i1 = this.selectedModels.findIndex(m=>m.modelValue===displayModel.modelValue);
    if(i1===-1){
      this.selectedModels.push(displayModel);
    }else{
      this.selectedModels.splice(i1,1);
    }
  }
  save(){
    let models = this.configurationService.configuration?.chatConfiguration.models;
    models!.length = 0;
    this.selectedModels.forEach(s=>{
      models?.push(s);
    })
    this.closeAction.next(true);
  }

  notSelected(modelValue: string) {
    return !this.selected(modelValue);
  }
  customAddVisible: boolean = false;
  @Output() closeAction = new EventEmitter<boolean>();

  newDisplayModelAction(displayModel: DisplayModel) {
    this.push(displayModel);
    this.universalService.addSelectableModel(displayModel);
    this.customAddVisible = false;
  }
}
