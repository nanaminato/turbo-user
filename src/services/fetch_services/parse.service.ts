import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceProvider} from "../../roots";
import {FileAdds} from "../../models";
import {Observable} from "rxjs";
import {TtsFile} from "../../models/media";

@Injectable({
  providedIn: "root"
})
export class ParseService{
  http = inject(HttpClient);
  provider = inject(ServiceProvider);
  parse(file: FileAdds): Observable<{content: string}>{
    // console.log("parse "+file)
    let url = this.provider.apiUrl+'api/fileExtractor';
    return this.http.post<{content: string}>(url,file);
  }
  parseTts(file: TtsFile): Observable<{content: string}>{
    let url = this.provider.apiUrl+'api/fileExtractor';
    return this.http.post<{content: string}>(url,{
      fileName: file.file?.name,
      fileType: file.file?.type,
      fileSize: file.file?.size,
      fileContent: file.fileData,
      parsedContent: ''
    });
  }

}
