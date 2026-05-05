import {Component, inject, OnInit} from '@angular/core';
import {GenerateTask} from "../../../models/media";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService, RequestManagerService, RequestService} from "../../../auth_module";
import {NzCardComponent} from "ng-zorro-antd/card";
import {TaskItem} from "./task-item/task-item";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateModule} from "@ngx-translate/core";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {SizeReportService} from "../../../services/normal-services";

@Component({
  selector: 'app-task-lib',
  templateUrl: './task-lib.html',
  styleUrls: ['./task-lib.scss'],
  standalone: true,
  imports: [
    NzCardComponent,
    TaskItem,
    NzButtonComponent,
    TranslateModule,
    NzIconDirective,
    NzWaveDirective

  ]
})
export class TaskLib implements OnInit {
  generateTasks: GenerateTask[] = [];
  private sizeReportService = inject(SizeReportService);
  constructor(private universalService: UniversalService,
              private authService: AuthService,
              private notification: NzNotificationService,
              private requestService: RequestManagerService) {

  }
  loadGenerateTasks(){
    this.universalService.getAllGenerateTaskOfUser(this.authService.user!.id).then(tasks=>{
      this.generateTasks.length = 0;
      this.generateTasks.push(...(tasks as GenerateTask[]));
      this.notification.success("加载成功","");
      let taskIds = [];
      if(tasks){
        for(let i = 0; i < tasks.length; i++){
          let images = tasks[i].images;
          let videos = tasks[i].videos;
          if((images&&images.length > 0)||(videos&&videos.length > 0)){
            taskIds.push(tasks[i].task_id!);
          }
        }
      }
      this.requestService.fetchTasks(taskIds).then(tasks => {
        if(tasks && tasks.length > 0){
          tasks.forEach(task => {
            this.universalService.addOrUpdateGenerateTask(task);
            let findTask = this.generateTasks.find(t=>t.task_id===task.task_id);
            if(!findTask){
              this.generateTasks.push(task);
            }else{
              //修改引用，使得可以即时显示
              findTask.images = task.images;
              findTask.videos = task.videos;
            }
          });
        }
      });
    })
  }
  ngOnInit() {
    this.loadGenerateTasks();
  }

  awareDeleteItem($event: number) {
    this.generateTasks.splice($event,1);
  }

  menuVisible() {
    return this.sizeReportService.menuVisible;
  }

  toggleMenu() {
    this.sizeReportService.toggleMenu()
  }
}
