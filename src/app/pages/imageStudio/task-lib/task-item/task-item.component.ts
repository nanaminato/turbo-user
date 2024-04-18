import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GenerateTask} from "../../../../models/media/generateTask";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzImageDirective, NzImageModule} from "ng-zorro-antd/image";
import {TaskImage} from "../../../../models/images";
import {NovitaService} from "../../../../services/fetch_services/novita.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {UniversalService} from "../../../../services/db-services/universal.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  imports: [
    NzColDirective,
    NzImageDirective,
    NzImageModule,
    NzButtonComponent,
    NzPopconfirmDirective,
    TranslateModule
  ]
})
export class TaskItemComponent {
  @Input() task: GenerateTask | undefined;

  constructor(private notification: NzNotificationService,
              private novitaService: NovitaService,
              private universalService: UniversalService) { }

  @Input()
  index: number | undefined;
  @Output()
  delete = new EventEmitter<number>();
  recheck_task_status(task_id: string) {
    if(task_id.indexOf('-')===-1){
      this.notification.error("不符合的类型","");
      return;
    }
    this.novitaService.novitaTask(task_id).then(res=>{
      this.task!.taskResult = res;
      this.universalService.addOrUpdateGenerateTask(this.task!).then(
        c=>{
          this.notification.info("获取结果成功，并保存到数据库中","")
        }
      );
    });
  }
  present(image: TaskImage) {
    if (image.image_url!.startsWith('http')) {
      return image.image_url!;
    }
    if (image.image_url!?.startsWith("asset")) {
      return image.image_url!;
    }
    return "data:image/png;base64," + image.image_url!;
  }

  protected readonly confirm = confirm;

  deleteItem(task: GenerateTask) {
    this.universalService.deleteGenerateTask(task).then(c=>{
      this.notification.success("删除成功","")
    });
    this.delete.emit(this.index);
  }
}
