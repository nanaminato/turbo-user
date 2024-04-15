import {Injectable} from "@angular/core";
import {ConfigService} from "../services/normal-services/config.service";

@Injectable({
  providedIn: "root"
})
export class ServiceProvider{
  public apiUrl: string | undefined = '';
  constructor() {
    // this.apiUrl = "https://localhost:44301/";
  }
}
