import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TurboService} from "../fetch_services";
import {AuthService} from "../../auth_module";
import {ChatPacket} from "../../models";

@Injectable({
  providedIn: "root",
})
export class ModelFetchService{
  turboService: TurboService = inject(TurboService);
  public getFetchResponse(
                          param:  ChatPacket,
                          model?: string){
    let subject: Observable<string>;
    subject = this.turboService.fetchChat(param as ChatPacket,model);
    return subject!;
  }
}
