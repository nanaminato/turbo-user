import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../roots";
import {AuthCallService} from "./auth-call.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: "root"
})
export class RequestService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider)
  requestHistories(historyDataIds: number[]){
    return this.http.post<any>(`${this.provider.apiUrl}api/request/histories`,historyDataIds);
  }
  requestMessages(historyDataId: number,messageIds: number[]){
    return this.http.post<any>(`${this.provider.apiUrl}api/request/messages`,{
      historyDataId: historyDataId,
      messageIds: messageIds
    });
  }
}
