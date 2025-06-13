import {TranslateLoader} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
// @Injectable({
//   providedIn: "root",
// })
export class ProdTranslateHttpLoader implements TranslateLoader {
  public motoPrefix = "/assets/i18n/";
  public prefix: string = "/assets/i18n/";
  public suffix: string = ".json"
  constructor(private http: HttpClient,
              ) {
    if(environment.production){
      this.prefix = environment.baseUrl+this.motoPrefix;
    }
  }

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
