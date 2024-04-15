import { Component, OnInit } from '@angular/core';
import {GenerateTask} from "../../../models/media/generateTask";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {NzCardComponent} from "ng-zorro-antd/card";
import {TaskItemComponent} from "./task-item/task-item.component";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-task-lib',
  templateUrl: './task-lib.component.html',
  styleUrls: ['./task-lib.component.scss'],
  standalone: true,
  imports: [
    NzCardComponent,
    TaskItemComponent,
    NzButtonComponent

  ]
})
export class TaskLibComponent  implements OnInit {
  generateTasks: GenerateTask[] = [];
  constructor(private universalService: UniversalService,
              private authService: AuthService) {

  }
  loadGenerateTasks(){
    this.universalService.getAllGenerateTaskOfUser(this.authService.user!.id).then(tasks=>{
      this.generateTasks.length = 0;
      this.generateTasks.push(...(tasks as GenerateTask[]));
    })
  }
  ngOnInit() {
    this.loadGenerateTasks();

  }

  awareDeleteItem($event: number) {
    this.generateTasks.splice($event,1);
  }
}
