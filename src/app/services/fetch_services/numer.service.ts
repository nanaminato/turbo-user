import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {DisplayModel} from "../../models";
import {Injectable} from "@angular/core";
import {NovitaModel} from "../../models/media";
@Injectable({
  providedIn: "root"
})
export class NumerService{
  constructor(private http: HttpClient, private provider: ServiceProvider) {

  }
  safe: string = 'safe-';
  getChatModels(){
    return this.http.get<DisplayModel[]>(`${this.provider.apiUrl}api/ai/models`);
  }
  getLoraModels(){
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${this.safe}media/lora`);
  }
  getEmbeddingModels(){
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${this.safe}media/embedding`);
  }
  getImageModels(){
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${this.safe}media/image`);
  }
  getVaeModels(){
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${this.safe}media/vae`);
  }
  getVideoModels(){
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${this.safe}media/video`);
  }
}
