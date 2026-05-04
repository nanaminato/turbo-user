import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {DisplayModel} from "../../models";
import {inject, Injectable} from "@angular/core";
import {NovitaModel} from "../../models/media";
@Injectable({
  providedIn: "root"
})
export class NumerService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider);
  getChatModels(){
    return this.http.get<DisplayModel[]>(`${this.provider.apiUrl}api/ai/models`);
  }
}
