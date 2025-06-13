import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TurboService} from "../fetch_services";
import {AuthService} from "../../auth_module";
import {ChatPacket} from "../../models";

@Injectable()
export class ModelFetchService{
  constructor(private turboService: TurboService,
              private authService: AuthService) {
  }
  public getFetchResponse(
                          param:  ChatPacket,
                          model?: string){
    let subject: Observable<string>;
    subject = this.turboService.fetchChat(param as ChatPacket,model);
    return subject!;
  }
}
