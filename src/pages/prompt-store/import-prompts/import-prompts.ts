import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzUploadFile, NzUploadModule} from "ng-zorro-antd/upload";
import {FormsModule} from "@angular/forms";
import {ClipboardModule} from "ngx-clipboard";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {SystemPromptService} from "../../../services/db-services/system-prompt.service";

@Component({
  selector: 'app-import-prompts',
  templateUrl: './import-prompts.html',
  styleUrl: './import-prompts.css',
  imports: [
    FormsModule,
    ClipboardModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    TranslateModule
  ],
  standalone: true
})
export class ImportPrompts {
  json: string = '';
  private notification: NzNotificationService = inject(NzNotificationService);
  private systemPromptService: SystemPromptService = inject(SystemPromptService);
  @ViewChild("textAreaElement")
  textAreaElement: ElementRef | undefined;
  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = ()=>{
      this.textAreaElement!.nativeElement.value = reader.result;
    };
    if(file){
      //@ts-ignore
      reader.readAsText(file);
    }
    return false;
  };
  async analysis(){
    try{
      if(this.textAreaElement?.nativeElement.value.trim().length===0) return;
      let noneIdItems: {
        title: string,
        content: string
      }[] = JSON.parse(this.textAreaElement?.nativeElement.value);
      for(let item of noneIdItems!){
        await this.systemPromptService.addOrPutPrompts({
          id: 0,
          title: item.title,
          content: item.content
        });
      }
      this.notification.success("系统预设导入成功","");
      this.systemPromptService.reLoad().then(()=>{
        this.notification.success("系统预设信息重载成功","");
      });

    }catch (e: any){
      this.notification.error("系统预设导入失败",e.toString());
    }

  }

}
