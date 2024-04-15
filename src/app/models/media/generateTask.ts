import {TaskResult} from "../images";

export interface GenerateTask{
  task_id?: string;
  task_type?: string;
  date?: Date;
  account_id: number;
  dynamic?: string;
  taskResult?: TaskResult;
}
