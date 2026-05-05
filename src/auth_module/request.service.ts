import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../roots";
import {ChatHistoryTitle, ChatInterface} from "../models";
import {GenerateTask} from "../models/media";

@Injectable({
  providedIn: "root"
})
export class RequestService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider)
  requestHistories(historyDataIds: number[]){
    return this.http.post<ChatHistoryTitle[]>(`${this.provider.apiUrl}api/request/histories`,historyDataIds);
  }
  requestMessages(historyDataId: number,messageIds: number[]){
    return this.http.post<ChatInterface[]>(`${this.provider.apiUrl}api/request/messages`,{
      historyDataId: historyDataId,
      messageIds: messageIds
    });
  }
  requestTasks(taskIds: string[]){
    return this.http.post<GenerateTask[]>(`${this.provider.apiUrl}api/request/tasks`,{taskIds: taskIds});
  }
}
