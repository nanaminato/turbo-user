import {inject, Injectable} from "@angular/core";
import {DisplayModel} from "../../models";
import {DbService} from "./db.service";
import {GenerateTask} from "../../models/media";

@Injectable({
  providedIn: "root"
})
export class UniversalService{
  dbService: DbService = inject(DbService);
  async getSelectableModels(){
    return this.dbService.getAllSelectableModels();
  }

  addSelectableModel(displayModel: DisplayModel) {
    return this.dbService.addOrUpdateSelectableModel(displayModel);
  }
  async getAllGenerateTaskOfUser(account_id: number){
    let tasks = await this.dbService.getAllGenerateTask();
    return tasks?.filter(t=>t.account_id===account_id);
  }
  async addOrUpdateGenerateTask(task: GenerateTask){
    return await this.dbService.addOrUpdateGenerateTask(task);
  }
  async deleteGenerateTask(task: GenerateTask){
    return await this.dbService.deleteGenerateTask(task);
  }

}
