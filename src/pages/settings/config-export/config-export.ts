import {Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ClipboardModule, ClipboardService} from "ngx-clipboard";
import {TranslateModule} from "@ngx-translate/core";
import {Configuration} from "../../../models";

export const turboMask = "Turbo://";
@Component({
  selector: 'app-config-export',
  templateUrl: './config-export.html',
  styleUrl: './config-export.css',
  standalone: true,
  imports: [
    NzFormModule,
    FormsModule,
    NzButtonModule,
    ClipboardModule,
    TranslateModule
  ],
  providers: [
  ]
})
export class ConfigExport {
  @Input()
  config: Configuration | undefined;
  lock: boolean = false;
  private clipboardService: ClipboardService = inject(ClipboardService);
  @ViewChild("textAreaElement")
  textAreaElement: ElementRef | undefined;
  getJson(){
    if(!this.config){
      return '';
    }
    const json = JSON.stringify(this.config,null,2);

    if(this.lock){
      // 1. 将 JSON 字符串转换成 UTF-8 编码的字节流（Uint8Array）
      const utf8Encoder = new TextEncoder();
      const utf8Array = utf8Encoder.encode(json);

      // 2. 将字节流转换为 base64 字符串
      // base64 转换需要使用 btoa，但是 btoa 接受的是字符串，所以需要先把字节数组转成“二进制字符”字符串
      let binary = '';
      utf8Array.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      const base64 = btoa(binary);

      return turboMask + base64;
    }
    return json;
  }



  copyConfig() {
    this.clipboardService.copy(this.textAreaElement?.nativeElement.value);
  }
}
