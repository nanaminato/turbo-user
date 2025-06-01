import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DisplayModel, displayModels} from "../../../models";
import {NumerService} from "../../../services/fetch_services";
import {ConfigurationService} from "../../../services/db-services";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalContentDirective, NzModalModule} from "ng-zorro-antd/modal";
import {ModelCustomAddComponent} from "./model-custom-add/model-custom-add.component";
import {UniversalService} from "../../../services/db-services/universal.service";
import {TranslateModule} from "@ngx-translate/core";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {NzPopoverDirective} from "ng-zorro-antd/popover";

@Component({
  selector: 'app-model-center',
  templateUrl: './model-center.component.html',
  styleUrls: ['./model-center.component.scss'],
  standalone: true,
  imports: [
    NzButtonComponent,
    NzModalModule,
    NzModalContentDirective,
    ModelCustomAddComponent,
    TranslateModule,
    NzIconDirective,
    NzPopoverDirective,
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
      this.pushSelectableModel(e);
    });
    this.universalService.getSelectableModels().then(models=>{
      models?.forEach((m: DisplayModel)=>{
        this.pushSelectableModel(m);
        // console.log("push",m.modelName," local")
      })
    })
    this.numerService.getChatModels().subscribe({
      next: models=>{
        models.forEach(m=>{
          m.internet = true;
          this.pushSelectableModel(m,true);
          // console.log("push",m.modelName,"internet")
        })
      }
    });


  }
  pushSelectableModel(displayModel: DisplayModel, replace: boolean = false){
    let search = this.selectableModels.findIndex(s=>s.modelName===displayModel.modelName);
    if(search!==-1){
      if(replace){
        this.selectableModels.splice(search,1,displayModel)
      }
    }else{
      this.selectableModels.push(displayModel)
    }
  }
  selected(modelName: string){
    let i1 = this.selectedModels.findIndex(m=> m.modelName===modelName);
    return i1 !== -1;
  }
  addOrRemove(displayModel: DisplayModel){
    let i1 = this.selectedModels.findIndex(m=>m.modelName===displayModel.modelName);
    if(i1===-1){
      this.selectedModels.push(displayModel);
      console.log("添加")
      console.log(this.selectedModels);
      console.log(this.selectableModels);
    }else{
      this.selectedModels.splice(i1,1);
      console.log("删除")
      console.log(this.selectedModels);
      console.log(this.selectableModels);
    }
  }
  save(){
    let models = this.configurationService.configuration?.chatConfiguration.models;
    models!.length = 0;
    this.selectedModels.forEach(s=>{
      models?.push(s);
      // console.log(s)
    })
    this.closeAction.next(true);
  }

  notSelected(modelName: string) {
    if(this.selectedModels.length===0){
      return true;
    }
    return !this.selected(modelName);
  }
  customAddVisible: boolean = false;
  @Output() closeAction = new EventEmitter<boolean>();

  newDisplayModelAction(displayModel: DisplayModel) {
    this.pushSelectableModel(displayModel);
    this.universalService.addSelectableModel(displayModel);
    this.customAddVisible = false;
  }
}
