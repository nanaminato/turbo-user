import {TtsFile} from "../../models/media";
import {inject, Injectable} from "@angular/core";
import {Bs64Handler} from "./bs64Handler";
import {ParseService} from "../fetch_services";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {LocalizationService} from '../normal-services';
@Injectable({
  providedIn: "root"
})
export class FileHandler{
  base64Handler: Bs64Handler = inject(Bs64Handler);
  parseService = inject(ParseService);
  notification = inject(NzNotificationService);
  localization = inject(LocalizationService);
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
          this.notification.error(this.localization.text('notifications.fileParseFailed'), '')
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
