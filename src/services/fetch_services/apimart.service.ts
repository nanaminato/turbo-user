import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {
  APIMartGPTImage2OfficialRequest,
  APIMartGPTImage2Request,
  APIMartGPTImage2Response, APIMartTaskResponse,
} from "../../models/images";

@Injectable({
  providedIn: "root"
})
export class ApimartService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider);
  gptImage2(request: APIMartGPTImage2Request){
    return new Promise<APIMartGPTImage2Response>((resolve, reject)=>{
      this.http.post<APIMartGPTImage2Response>(`${this.provider.apiUrl}api/apimart/image-generate/gpt-image-2`,request)
        .subscribe({
          next: (res:APIMartGPTImage2Response)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
  gptImage2Official(request: APIMartGPTImage2OfficialRequest){
    return new Promise<APIMartGPTImage2Response>((resolve, reject)=>{
      this.http.post<APIMartGPTImage2Response>(`${this.provider.apiUrl}api/apimart/image-generate/gpt-image-2-official`,request)
        .subscribe({
          next: (res:APIMartGPTImage2Response)=>{
            resolve(res)
          },
          error: error=>{
            reject(error)
          }
        })
    })
  }
  getApiMartTask(taskId: string): Promise<APIMartTaskResponse>{
    return new Promise((resolve,reject)=>{
      this.http.get<APIMartTaskResponse>(`${this.provider.apiUrl}api/apimart/getTask/${taskId}?language=zh`)
        .subscribe({
          next: (response)=>{
            resolve(response);
          },
          error: error => {
            console.log(error);
            reject();
          }
        })
    });
  }
}
