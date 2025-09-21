import { Component, OnInit } from '@angular/core';
import {GenerateTask} from "../../../models/media";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {NzCardComponent} from "ng-zorro-antd/card";
import {TaskItem} from "./task-item/task-item";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-task-lib',
  templateUrl: './task-lib.html',
  styleUrls: ['./task-lib.scss'],
  standalone: true,
  imports: [
    NzCardComponent,
    TaskItem,
    NzButtonComponent,
    TranslateModule

  ]
})
export class TaskLib implements OnInit {
  generateTasks: GenerateTask[] = [];
  constructor(private universalService: UniversalService,
              private authService: AuthService,
              private notification: NzNotificationService) {

  }
  loadGenerateTasks(){
    this.universalService.getAllGenerateTaskOfUser(this.authService.user!.id).then(tasks=>{
      this.generateTasks.length = 0;
      this.generateTasks.push(...(tasks as GenerateTask[]));
      this.notification.success("加载成功","");
    })
  }
  ngOnInit() {
    this.loadGenerateTasks();
  }

  awareDeleteItem($event: number) {
    this.generateTasks.splice($event,1);
  }
}
