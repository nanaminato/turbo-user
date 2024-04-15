import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TurboService} from "../fetch_services/turbo.service";
import {AuthService} from "../../auth_module";
import {RequestType} from "../../models/enumerates";
import {ChatPacket} from "../../models";

@Injectable()
export class ModelFetchService{
  constructor(private turboService: TurboService,
              private authService: AuthService) {
  }
  public getFetchResponse(type: RequestType,
                          param:  ChatPacket,
                          model?: string){
    let subject: Observable<string>;
    switch (type) {
      case RequestType.Chat:
        subject = this.turboService.fetchChat(param as ChatPacket,model);
        break;
    }
    return subject!;
  }
}
