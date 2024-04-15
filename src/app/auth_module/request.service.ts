import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../roots";

@Injectable({
  providedIn: "root"
})
export class RequestService{
  constructor(private http: HttpClient,private provider: ServiceProvider) {

  }
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
