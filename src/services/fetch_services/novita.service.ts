import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {
  Img2,
  Img2Lcm, NovitaImg2LcmResponse,
  NovitaTask,
  NovitaText2LcmResponse,
  Text2,
  Text2Lcm
} from "../../models/images";
import {TaskResult} from "../../models/images";
import {Text2Video} from "../../models/videos";

@Injectable({
  providedIn: "root"
})
export class NovitaService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider);
  text2Lcm(obj:Text2Lcm):Promise<NovitaText2LcmResponse>{
    return new Promise<NovitaText2LcmResponse>((resolve, reject)=>{
      this.http.post<NovitaText2LcmResponse>(`${this.provider.apiUrl}api/image/text2-lcm`,obj)
        .subscribe({
          next: (t2i)=>{
            resolve(t2i);
          },
          error: error=>{
            console.log(error);
            reject(error);
          },
        });

    })
  }
  img2Lcm(obj: Img2Lcm): Promise<NovitaImg2LcmResponse>{
    return new Promise<NovitaImg2LcmResponse>((resolve,reject)=>{
      this.http.post<NovitaImg2LcmResponse>(`${this.provider.apiUrl}api/image/img2-lcm`,obj)
        .subscribe({
          next: (response)=>{
            resolve(response);
          },
          error: error=>{
            console.log(error);
            reject();
          }
        });
    });

  }
  text2(obj: Text2): Promise<NovitaTask>{
    return new Promise<NovitaTask>((resolve, reject)=>{
      this.http.post<NovitaTask>(`${this.provider.apiUrl}api/image/text2`,obj)
        .subscribe({
          next: (response)=>{
            resolve(response);
          },
          error: error => {
            console.log(error);
            reject();
          }
        })
    })
  }
  img2(obj: Img2): Promise<NovitaTask>{
    return new Promise<NovitaTask>((resolve, reject)=>{
      this.http.post<NovitaTask>(`${this.provider.apiUrl}api/image/img2`,obj)
        .subscribe({
          next: (response)=>{
            resolve(response);
          },
          error: error => {
            console.log(error);
            reject();
          }
        })
    })
  }
  text2Video(obj: Text2Video): Promise<NovitaTask>{
    return new Promise((resolve,reject)=>{
      this.http.post<NovitaTask>(`${this.provider.apiUrl}api/video/text2video`,obj)
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
  novitaTask(taskId: string): Promise<TaskResult>{
    return new Promise((resolve,reject)=>{
      this.http.get<TaskResult>(`${this.provider.apiUrl}api/imagetask/${taskId}`)
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
