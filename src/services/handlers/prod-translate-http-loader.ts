import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {inject} from "@angular/core";
import {environment} from "../../environments/environment";

export class ProdTranslateHttpLoader implements TranslateLoader {
  public motoPrefix = '/assets/i18n/';
  public prefix: string = '/assets/i18n/';
  public suffix: string = '.json';
  http = inject(HttpClient);
  constructor() {
    if (environment.production) {
      this.prefix = environment.baseUrl + this.motoPrefix;
    }
  }

  public getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`${this.prefix}${lang}${this.suffix}`);
  }
}
