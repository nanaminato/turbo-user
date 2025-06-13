import {Injectable} from "@angular/core";
import {ConfigService} from "../services/normal-services/config.service";
import {timeToWait} from "../services/db-services/configuration.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ServiceProvider{
  public apiUrl: string | undefined = '';
  constructor() {
    if(environment.production) {
      this.apiUrl = "/";
    }
    // this.apiUrl = "https://localhost:44301/";
  }

  waitForInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.apiUrl!=='') {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.apiUrl!=='') {
            clearInterval(interval);
            resolve();
          }
        }, timeToWait);
      }
    });
  }
}
