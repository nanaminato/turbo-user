import {Injectable} from "@angular/core";
import {RequestType, ShowType} from "../../models/enumerates";

@Injectable()
export class ShowTypeService{
  public getRequestType(type: ShowType): RequestType{
    return type % 5;
  }
  public getSendMessageType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChatRequest;
      default:
        return ShowType.staticChatRequest;
    }
  }
  public getPromiseReceiveType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.promiseChat;
      default:
        return ShowType.staticChatRequest;
    }
  }
  public getStaticResponseType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChat;
      default:
        return ShowType.staticChatRequest;
    }
  }
}
