import {inject, Injectable} from "@angular/core";
import {ChatHistory, ChatHistoryTitle, ChatInterface} from "../models";
import {SendService} from "./send.service";
import {GenerateTask} from "../models/media";

@Injectable({
  providedIn: "root"
})
export class SendManagerService{
  sendService = inject(SendService);
  sendHistory(chatHistory: ChatHistoryTitle): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.sendHistory(chatHistory)
        .subscribe({
          next: (msg:any)=>{
            resolve("上传历史（会话）标题成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  sendMessage(historyDataId: number,chatMessage: ChatInterface): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.sendMessage(historyDataId,chatMessage)
        .subscribe({
          next: (msg:any)=>{
            resolve("上传信息成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  sendTask(task: GenerateTask): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.sendTask(task)
        .subscribe({
          next: (msg:any)=>{
            resolve("上传生成任务成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  updateHistory(chatHistory: ChatHistory): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.updateHistory(chatHistory)
        .subscribe({
          next: (msg:any)=>{
            resolve("更新会话（历史）标题成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  updateMessage(historyDataId: number,chatMessage: ChatInterface): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.updateMessage(historyDataId,chatMessage)
        .subscribe({
          next: (msg:any)=>{
            resolve("更新信息成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  updateTask(task: GenerateTask): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.updateTask(task)
        .subscribe({
          next: (msg:any)=>{
            resolve("更新生成任务成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  deleteHistory(historyDataId: number): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.deleteHistory(historyDataId)
        .subscribe({
          next: (msg:any)=>{
            resolve("删除会话（历史）标题成功")
          },
          error: err => {
            reject()
          }
        })
    });
  }
  deleteMessage(historyDataId: number, messageDataId: number): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.deleteMessage(historyDataId,messageDataId)
        .subscribe({
          next: (msg:any)=>{
            resolve("删除消息成功")
          },
          error: err => {
            reject()
          }
        })
    })
  }
  deleteTask(taskId: string): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.sendService.deleteTask(taskId)
        .subscribe({
          next: (msg:any)=>{
            resolve("删除生成结果成功")
          },
          error: err => {
            reject()
          }
        })
    })
  }
}
