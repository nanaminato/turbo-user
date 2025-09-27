import {inject, Injectable} from "@angular/core";
import {RequestService} from "./request.service";
import {ChatHistoryTitle, ChatInterface} from "../models";
import {DbService} from "../services/db-services";

@Injectable({
  providedIn: "root"
})
export class RequestManagerService{
  requestService = inject(RequestService);
  dbService = inject(DbService);
  // 拉取title并更新数据库
  fetchHistoryAndRefreshData(historyDataIds: number[]):Promise<ChatHistoryTitle[] | undefined>{
    return new Promise((resolve,reject)=>{
      this.requestService.requestHistories(historyDataIds).subscribe({
        next: (histories: ChatHistoryTitle[]) =>{
          for(let history of histories){
            this.dbService.addOrUpdateHistoryTitles(history);
            this.dbService.addOrUpdateHistory({
              userId: history.userId,
              title: history.title,
              dataId: history.dataId,
              chatList: []
            });
          }
          resolve(histories);
        },
        error: err=>{
          console.log("error");
          reject(undefined);
        }
      });
    })
  }
  // 拉取并更新数据库
  fetchMessageAndRefreshData(historyDataId: number,messageDataIds: number[]): Promise<ChatInterface[] | undefined>{
    return new Promise(async (resolve, reject)=>{
      this.requestService.requestMessages(historyDataId,messageDataIds)
        .subscribe({
          next: async (messages: ChatInterface[])=>{
            let history = await this.dbService.getHistory(historyDataId);
            let mList = history!.chatList;
            for (let message of messages){
              let fIndex = mList.findIndex(c=>c===message.dataId);
              if(fIndex!==-1){

              }else{
                mList.push(message.dataId)
              }
              await this.dbService.putChatInterface(message);
            }
            await this.dbService.addOrUpdateHistory(history!);
            resolve(messages);
          },
          error: error=>{
            reject({
              error: "服务错误"
            })
          }
        })
    });
  }
  fetchMessage(historyDataId: number,messageDataIds: number[]): Promise<ChatInterface[] | undefined>{
    return new Promise(async (resolve, reject)=>{
      this.requestService.requestMessages(historyDataId,messageDataIds)
        .subscribe({
          next: async (messages: ChatInterface[])=>{
            resolve(messages);
          },
          error: error=>{
            reject({
              error: "服务错误"
            })
          }
        })
    });
  }
}
