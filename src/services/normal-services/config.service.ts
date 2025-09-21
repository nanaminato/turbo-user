import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  private configUrl = 'assets/config.json';

  http = inject(HttpClient);

  getConfig() {
    return this.http.get(this.configUrl);
  }
}
