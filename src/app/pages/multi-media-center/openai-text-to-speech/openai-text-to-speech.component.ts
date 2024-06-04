import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {TranslateModule} from "@ngx-translate/core";
import {NzOptionComponent, NzOptionGroupComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzImageDirective} from "ng-zorro-antd/image";

@Component({
  selector: 'app-openai-text-to-speech',
  templateUrl: './openai-text-to-speech.component.html',
  styleUrls: ['./openai-text-to-speech.component.scss'],
  imports: [
    NzCardComponent,
    NzRowDirective,
    NzColDirective,
    TranslateModule,
    NzSelectComponent,
    NzOptionGroupComponent,
    NzOptionComponent,
    FormsModule,
    NgForOf,
    IonicModule,
    NzInputNumberComponent,
    NzSliderComponent,
    NzIconDirective,
    NzButtonComponent,
    NzImageDirective,
  ],
  standalone: true
})
export class OpenaiTextToSpeechComponent  implements OnInit {
  voice: string = "alloy";
  human_voices: string[] = [
    "alloy","echo","fable","onyx",
  ];
  woman_voices: string[] = [
    "nova","shimmer"
  ];
  speech_response_formats: string[] = [
    "mp3","opus","aac","flac"
  ]
  response_format: string = "mp3";
  model: string = "tts-1";
  speed: number = 1; // 0.25 - 4.0
  models: string[] = [
    "tts-1","tts-1-hd"
  ];
  constructor(private menuAble: MenuAbleService,) {
    this.menuAble.enableMedia()
  }

  ngOnInit() {
    console.log()
  }
  fileList: File[] = [];

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFilesToList(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    this.fileList.length = 0;
    if (files) {
      this.addFilesToList(files);
    }
  }

  addFilesToList(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileList.push(file);
      console.log(file.type)
      // if (!this.fileList.includes(file)) {
      // }
    }
  }

  removeFile(file: File) {
    const index = this.fileList.indexOf(file);
    if (index > -1) {
      this.fileList.splice(index, 1);
    }
  }
  getIcon(fileName: string) {
    const fileExtension = fileName.split('.').pop(); // 获取文件后缀
    switch (fileExtension) {
      case 'md':
        return "assets/file/markdown.png";
      case "pdf":
        return "assets/file/pdf.png";
      case "doc":
      case "docs":
      case "docx":
        return "assets/file/doc.png";
      case 'txt':
      case 'text':
        return 'assets/svgs/plaintext.svg'; // 普通文本文件的 icon 地址
      default:
        return 'assets/svgs/code.svg';
    }
  }

}
