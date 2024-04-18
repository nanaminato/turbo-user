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
  getLoraModels(nsfw: boolean = false){
    let safe = nsfw?'':this.safe;
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${safe}media/lora`);
  }
  getEmbeddingModels(nsfw: boolean = false){
    let safe = nsfw?'':this.safe;
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${safe}media/embedding`);
  }
  getImageModels(nsfw: boolean = false){
    let safe = nsfw?'':this.safe;
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${safe}media/image`);
  }
  getVaeModels(nsfw: boolean = false){
    let safe = nsfw?'':this.safe;
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${safe}media/vae`);
  }
  getVideoModels(nsfw: boolean = false){
    let safe = nsfw?'':this.safe;
    return this.http.get<NovitaModel[]>(`${this.provider.apiUrl}api/${safe}media/video`);
  }
}
