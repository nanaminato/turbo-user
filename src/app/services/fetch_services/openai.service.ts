import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {DallE, DallE3Response} from "../../models/images";
import {Injectable} from "@angular/core";
import {TtsRequest, TtsResponse} from "../../models/media/tts";
@Injectable({
  providedIn: "root"
})
export class OpenaiService{
  constructor(private http: HttpClient,private provider: ServiceProvider) {

  }
  tts(request: TtsRequest){
    return new Promise<TtsResponse>((resolve,reject)=>{
      this.http.post<TtsResponse>(`${this.provider.apiUrl}api/media/tts`,request)
        .subscribe({
          next: (res: TtsResponse)=>{
            resolve(res);
          },
          error: error=>{
            reject(error.error)
          }
        })
    })
  }
  dalle(dalle: DallE){
    return new Promise<DallE3Response>((resolve,reject)=>{
      this.http.post<DallE3Response>(`${this.provider.apiUrl}api/media/dall-e-3`,dalle)
        .subscribe({
          next: (res:DallE3Response)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
}
