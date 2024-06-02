import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {FileAdds} from "../../models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ParseService{
  constructor(private http: HttpClient,private provider: ServiceProvider) {
  }
  parse(file: FileAdds): Observable<{content: string}>{
    console.log("parse "+file)
    let url = this.provider.apiUrl+'api/fileExtractor';
    return this.http.post<{content: string}>(url,file);
  }

}
