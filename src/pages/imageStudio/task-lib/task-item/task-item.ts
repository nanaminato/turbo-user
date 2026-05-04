import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GenerateTask} from "../../../../models/media";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzImageDirective, NzImageModule} from "ng-zorro-antd/image";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {UniversalService} from "../../../../services/db-services/universal.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateModule} from "@ngx-translate/core";
import {ImagePresentPipe} from "../../../../pipes";
import {ApimartService} from "../../../../services/fetch_services/apimart.service";

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.scss'],
  standalone: true,
  imports: [
    NzColDirective,
    NzImageDirective,
    NzImageModule,
    NzButtonComponent,
    NzPopconfirmDirective,
    TranslateModule,
    ImagePresentPipe
  ]
})
export class TaskItem {
  @Input() task: GenerateTask | undefined;

  constructor(private notification: NzNotificationService,
              private universalService: UniversalService,
              private apiMartService: ApimartService) { }

  @Input()
  index: number | undefined;
  @Output()
  delete = new EventEmitter<number>();

  recheck_task_status(task: GenerateTask) {
    if(task.images!==undefined || task.videos!==undefined){
      this.notification.warning("警告","已经取得到了结果，无需再次取得。")
      return;
    }
    let task_id = task.task_id??"";
    if(task.task_type!.startsWith("apimart")){
      this.apiMartService.getApiMartTask(task_id).then(res=>{
        if(res.data?.completed!==0){
          const resultData = res?.data?.result?.images?.[0];
          task.images = resultData?.url || [];
          this.universalService.addOrUpdateGenerateTask(this.task!).then(
            c=>{
              this.notification.info("获取结果成功，并保存到数据库中","")
            }
          );
        }else{
          this.notification.info(res.data.status,`please wait! ${res.data.status}`);
        }
      });
    }
  }
  protected readonly confirm = confirm;
  deleteItem(task: GenerateTask) {
    this.universalService.deleteGenerateTask(task).then(c=>{
      this.notification.success("删除成功","")
    });
    this.delete.emit(this.index);
  }
  getFormat(taskType?: string) {
    if(!taskType){
      return "undefined";
    }
    let index = taskType.indexOf(">");
    if(index > -1){
      return taskType.substring(index + 1).trim();
    }
    return taskType.trim();
  }
}
