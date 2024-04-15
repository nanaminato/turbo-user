import {Injectable} from "@angular/core";
import * as signalR from "@microsoft/signalr";
import {ServiceProvider} from "../roots";
import {AuthService} from "./auth.service";
import {ChatHistory, ChatModel, Message} from "../models";
import {ChatModule} from "../pages/chat.module";
///https://www.npmjs.com/package/@microsoft/signalr
@Injectable({
  providedIn: "root"
})
export class MessageService{
  private hubConnection: signalR.HubConnection | undefined;
  constructor(private provider: ServiceProvider,private auth: AuthService) {
    // this.connect();
    // let ms: Message = JSON.parse('{ "Message": { "role": "string", "content": "string","id":10 } }');
    // console.log(ms)
  }
  //app.component.ts
  connect(){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.provider.apiUrl}hubs/message`,
        {
          accessTokenFactory: ()=> this.auth.token!
        }
        )
      .build();

    this.hubConnection.on("getMessage", async (dd: any) => {
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("message");
        }, 100);
      });
      return promise;
    });
    this.hubConnection.on("message", (message: string,user: any) => {
      console.log(message+"\n"+user);
      return 'world'
    });
    this.hubConnection.on('history', (hello:number)=>{
      console.log(hello)
    });
    this.hubConnection.start().catch((e)=>{
      console.log(e);
    });
  }
  uploadMessage(message: ChatModel,historyDataId: number){
    let mMessage = {
      historyDataId: historyDataId,
      userId: this.auth.user?.id,
      dataId: message.dataId,
      role: message.role,
      content: message.content,
      fileList: message.fileList,
      showType: message.showType,
      finish: message.finish,
      model: message.model
    };
    if(this.hubConnection){
      this.hubConnection.invoke("uploadMessage",mMessage);
    }
  }
  uploadHistory(history: ChatHistory){
    let mHistory = {
      userId: this.auth.user?.id,
      dataId: history.dataId,
      title: history.title
    };
    if(this.hubConnection){
      this.hubConnection.invoke("uploadHistory",mHistory);
    }
  }
  sendMessageToServer(message: string) {
    if(this.hubConnection){
      this.hubConnection.invoke("SendMessageToClients", message).catch((error) => {
        console.error(error);
      });
    }
  }
}
