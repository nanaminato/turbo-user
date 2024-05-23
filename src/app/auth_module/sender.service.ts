import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../roots";
import {AuthService} from "./auth.service";
import {ChatHistory, ChatHistoryTitle, ChatInterface, ChatModel, Message} from "../models";

@Injectable({
  providedIn: "root"
})
export class SenderService{
  constructor(private http: HttpClient,
              private provider: ServiceProvider
              ) {
  }
  sendHistory(chatHistory: ChatHistoryTitle){
    return this.http.post<any>(`${this.provider.apiUrl}api/receiver/history`,
      {
        dataId: chatHistory.dataId,
        title: chatHistory.title
      });
  }
  sendMessage(historyDataId: number,chatMessage: ChatInterface){
    return this.http.post<any>(`${this.provider.apiUrl}api/receiver/message`,
      {
        historyDataId: historyDataId,
        dataId: chatMessage.dataId,
        role: chatMessage.role,
        content: chatMessage.content,
        fileList: chatMessage.fileList,
        finish: chatMessage.finish,
        model: chatMessage.model
      });
  }
  updateHistory(chatHistory: ChatHistory){
    return this.http.put<any>(`${this.provider.apiUrl}api/receiver/history`,
      {
        dataId: chatHistory.dataId,
        title: chatHistory.title
      });
  }
  updateMessage(historyDataId: number,chatMessage: ChatInterface){
    return this.http.put<any>(`${this.provider.apiUrl}api/receiver/message`,
      {
        historyDataId: historyDataId,
        dataId: chatMessage.dataId,
        role: chatMessage.role,
        content: chatMessage.content,
        fileList: chatMessage.fileList,
        finish: chatMessage.finish,
        model: chatMessage.model
      });
  }
  deleteHistory(historyDataId: number){
    return this.http.delete<any>(`${this.provider.apiUrl}api/receiver/history/${historyDataId}`);
  }
  deleteMessage(historyDataId: number, messageDataId: number){
    return this.http.delete<any>(`${this.provider.apiUrl}api/receiver/message/${historyDataId}/${messageDataId}`);
  }
}
