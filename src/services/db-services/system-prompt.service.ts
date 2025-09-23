import {inject, Inject, Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {Observer} from "rxjs";
import {timeToWait} from "./configuration.service";
import {SystemPromptItem} from "../../models";
import {systemPromptChangeSubject} from "../../injection_tokens";
import {Store} from "@ngrx/store";
import {systemPromptActions} from "../../systems/store/system-prompts/prompts.actions";

@Injectable({
  providedIn: "root"
})
export class SystemPromptService {
  dbService: DbService = inject(DbService);

  private getSystemPrompts():Promise<SystemPromptItem[] | undefined> {
    return this.dbService.getSystemPrompts();
  }
  public getMaxId():Promise<number>{
    return this.dbService.getMaxPromptId();
  }
  private addOrPutPromptsQueue: SystemPromptItem[] = [];
  private isAddOrPutPromptsRunning: boolean = false;

  // 没有考虑细粒度的并发操作
  public async addOrPutPrompts(prompt: SystemPromptItem){
    this.addOrPutPromptsQueue.push(prompt);

    if(this.isAddOrPutPromptsRunning){
      // 如果函数正在执行，则直接返回
      return;
    }

    this.isAddOrPutPromptsRunning = true;

    while(this.addOrPutPromptsQueue.length > 0){
      const nextPrompt = this.addOrPutPromptsQueue.shift();
      if(nextPrompt===undefined) continue;
      if(nextPrompt.id! <= 0){
        nextPrompt.id = (await this.getMaxId()) + 1;
      }
      await this.dbService.addOrUpdateSystemPrompt(nextPrompt);
    }

    this.isAddOrPutPromptsRunning = false;
  }
  store = inject(Store)

  async reLoad() {
    this.store.dispatch(systemPromptActions.load())
  }


  async deletePrompt(id: number) {
    return this.dbService.deleteSystemPrompt(id);
  }
}
