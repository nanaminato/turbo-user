import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ConfigurationService} from "../db-services";
import {AuthService} from "../../auth_module";
import {ServiceProvider} from "../../roots";
import {ChatPacket, Configuration, Message, VisionMessage} from "../../models";
import {ErrorType, ResponseError} from "../../errors";
import {Store} from "@ngrx/store";
import {selectConfig} from "../../systems/store/configuration/configuration.selectors";

@Injectable({
  providedIn: "root"
})
export class TurboService {
  provider = inject(ServiceProvider);
  baseUrl: string = `${this.provider.apiUrl}api/ai`;
  authService = inject(AuthService);
  store = inject(Store);
  config: Configuration | null = null;
  constructor() {
    this.store.select(selectConfig).subscribe(config => {
      this.config = config;
    });
  }
  fetchChat(mp: ChatPacket, model?: string): Observable<string> {
    const messages: Message[] | VisionMessage[] = mp.messages;
    let config = this.config!;
    let url = this.baseUrl + "/chat";
    let requestBody: any;
    let tokens: number | undefined | null = config?.chatConfiguration.max_completion_tokens;
    if(tokens===0){
      tokens = null;
    }
    requestBody = {
      messages: messages,
      model: model === undefined ? config?.model.modelValue : model,
      vision: config?.model.vision,
      frequency_penalty: config?.chatConfiguration.frequency_penalty,
      max_completion_tokens: tokens ,
      presence_penalty: config?.chatConfiguration.presence_penalty,
      stream: true,
      temperature: config?.chatConfiguration.temperature,
      top_p: config?.chatConfiguration.top_p
    };
    return this.fetchChatBase(url, requestBody);
  }


  fetchChatBase(url: string, requestBody: any): Observable<string> {
    return new Observable<string>(observer => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.token}`
        },
        body: JSON.stringify(requestBody)
      }).then(response => {
        let error: ResponseError | undefined;
        if (!response.ok) {
          switch (response.status){
            case 401:
            case 403:
              error = {
                type: ErrorType.NotAuthorize,
              }
              break;
            default:
              error = {
                type: ErrorType.Other
              }
          }
          observer.error(error)
          return ;
        }
        const reader = response.body?.getReader();
        if (!reader) {
          observer.error({
            type: ErrorType.NoContent
          });
          return ;
        }

        const pump = (): Promise<void> => reader!.read().then(({value, done}) => {
          if (done) {
            observer.complete();
            return;
          }
          // 处理接收到的数据
          if (value) {
            const chunk = new TextDecoder().decode(value);
            observer.next(chunk);
          }
          // 继续读取下一个数据块
          return pump();
        }).catch(error => {
          observer.error(error);
          return;
        });

        return pump();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
