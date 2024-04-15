import {Injectable} from "@angular/core";
import {ChatHistory, ChatHistoryTitle, ChatInterface} from "../models";
import {SenderService} from "./sender.service";

@Injectable({
  providedIn: "root"
})
export class SendManagerService{
  constructor(private sendService: SenderService) {
  }
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
}
