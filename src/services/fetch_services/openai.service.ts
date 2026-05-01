import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {GptImageCreateRequest, GptImageResponse} from "../../models/images";
import {inject, Injectable} from "@angular/core";
import {TtsRequest, TtsResponse} from "../../models/media/tts";
import {OpenAiTranslationRequest} from "../../models/media/stt-translation";
import {OpenAiTranscriptionRequest} from "../../models/media/stt-transcription";
@Injectable({
  providedIn: "root"
})
export class OpenaiService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider);
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
  translate(request: OpenAiTranslationRequest){
    return new Promise<any>((resolve,reject)=>{
      this.http.post<any>(`${this.provider.apiUrl}api/media/whisper-translate`,request)
        .subscribe({
          next: (res:any)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
  transcription(request: OpenAiTranscriptionRequest){
    return new Promise<any>((resolve,reject)=>{
      this.http.post<any>(`${this.provider.apiUrl}api/media/whisper-transcription`,request)
        .subscribe({
          next: (res:any)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
  dallImageCreate(dalle: GptImageCreateRequest){
    return new Promise<GptImageResponse>((resolve, reject)=>{
      this.http.post<GptImageResponse>(`${this.provider.apiUrl}api/media/dall-e`,dalle)
        .subscribe({
          next: (res:GptImageResponse)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
  gptImageCreate(dalle: GptImageCreateRequest){
    return new Promise<GptImageResponse>((resolve, reject)=>{
      this.http.post<GptImageResponse>(`${this.provider.apiUrl}api/media/gpt-image`,dalle)
        .subscribe({
          next: (res:GptImageResponse)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
}
