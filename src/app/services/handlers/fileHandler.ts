import {TtsFile} from "../../models/media";
import {Injectable} from "@angular/core";
import {Bs64Handler} from "./bs64Handler";
import {ParseService} from "../fetch_services";
import {NzNotificationService} from "ng-zorro-antd/notification";
@Injectable({
  providedIn: "root"
})
export class FileHandler{
  constructor(private base64Handler: Bs64Handler,
              private parseService: ParseService,
              private notification: NzNotificationService) {
  }
  async reparse(ttsFile: TtsFile) {
    if (ttsFile.fileData === undefined) {
      await this.waitReadFile(ttsFile);
    }
    try {
      this.parseService.parseTts(ttsFile).subscribe({
        next: res => {
          ttsFile.parsedContent = res.content;
          ttsFile.parsed = true;
        },
        error: (error: any) => {
          this.notification.error(error.error, "")
        }
      })
    } catch (error) {
      console.error('发生错误：', error);
    }
  }
  async parseAllFile(ttsFiles: TtsFile[]){
    await Promise.all(ttsFiles!.map(async (file) => {
      // @ts-ignore
      this.parseService.parseTts(file).subscribe({
        next: res=>{
          file.parsedContent = res.content;
          file.parsed = true;
        },
        error: err => {
          this.notification.error("解析文件出现了问题","")
        }
      })
    }));
  }
  async waitReadFile(ttsFile: TtsFile) {
    const promise = this.readFile(ttsFile);
    await promise;
  }
  readFile(ttsFile: TtsFile): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        ttsFile.fileData = this.base64Handler.arrayBufferToBase64(arrayBuffer);
        resolve();
      };
      if (ttsFile) {
        reader.readAsArrayBuffer(ttsFile.file!);
      }
    });
  }
}
