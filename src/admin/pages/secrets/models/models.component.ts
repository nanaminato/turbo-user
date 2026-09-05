import { Component } from '@angular/core';
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {RouterLink} from "@angular/router";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzMessageService} from "ng-zorro-antd/message";
import {EditModelComponent} from "./edit-model/edit-model.component";
import {NewModelComponent} from "./new-model/new-model.component";
import {Model} from "../../../models/keys";
import {KeyCallService} from "../../../services";
import {MultipleAddModelComponent} from "./multiple-add-model/multiple-add-model.component";

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [
    NzSkeletonComponent,
    RouterLink,
    NzModalModule,
    NzPopconfirmDirective,
    NzTooltipDirective,
    EditModelComponent,
    NewModelComponent,
    MultipleAddModelComponent
  ],
  templateUrl: './models.component.html',
  styleUrl: './models.component.css'
})
export class ModelsComponent {
  models: Model[] | undefined;
  constructor(private message: NzMessageService, private call: KeyCallService) {
  }
  newModelVisible : boolean = false;
  refresh() {
    this.fetchModels(true);
  }
  ngOnInit(){
    this.fetchModels();
  }
  delete(roleId: number) {
    this.call.deleteModel(roleId)
      .subscribe({
        next: msg=>{
          this.message.success("删除成功");
          this.fetchModels(true);
        },
        error: (err:any)=>{
          this.message.error("删除错误");
        }
      })
  }
  fetchModels(refresh: boolean = false){
    this.call.getModelsWithKey().subscribe({
      next: models=>{
        this.models = models;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error:(err: any) => {
        this.message.error("获取账户信息失败")
      }
    })
  }

  tackleClose($event: boolean) {
    if($event){
      this.newModelVisible = false;
      this.fetchModels(true);
    }
  }
  multipleAddModalClose($event: boolean) {
    if($event){
      this.multipleAddVisible = false;
      this.fetchModels(true);
    }
  }
  editModelVisible: boolean = false;
  editModel: Model | undefined;
  tackleEditClose($event: boolean) {
    if($event){
      this.editModelVisible = false;
      this.fetchModels(true);
    }
  }

  editAModel(model: Model) {
    this.editModel = model;
    this.editModelVisible = true;
  }

  disableModel(modelId: number | undefined) {
    this.call.disableModel(modelId!).subscribe({
      next: (msg:any)=>{
        this.message.success(msg.msg)
      },
      error: err => {
        this.message.error(err.error)
      }
    })
  }

  enableModel(modelId: number | undefined) {
    this.call.enableModel(modelId!).subscribe({
      next: (msg:any)=>{
        this.message.success(msg.msg)
      },
      error: err => {
        this.message.error(err.error)
      }
    })
  }
  multipleAddVisible: boolean = false;
}
