import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NgForOf} from "@angular/common";
import {NzAutosizeDirective, NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzImageDirective} from "ng-zorro-antd/image";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NzOptionComponent, NzOptionGroupComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {TtsFileEditorComponent} from "../openai-text-to-speech/tts-file-editor/tts-file-editor.component";
import {ParseService} from "../../../services/fetch_services";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TtsFile} from "../../../models/media";
import {forkJoin, map} from "rxjs";
import {FileHandler} from "../../../services/handlers/fileHandler";

@Component({
    selector: 'app-media-extractor',
    templateUrl: './media-extractor.component.html',
    styleUrls: ['./media-extractor.component.scss'],
  imports: [
    NgForOf,
    NzAutosizeDirective,
    NzButtonComponent,
    NzCardComponent,
    NzColDirective,
    NzIconDirective,
    NzImageDirective,
    NzInputDirective,
    NzInputNumberComponent,
    NzModalComponent,
    NzOptionComponent,
    NzOptionGroupComponent,
    NzRowDirective,
    NzSelectComponent,
    NzSliderComponent,
    NzSpinComponent,
    ReactiveFormsModule,
    TranslateModule,
    TtsFileEditorComponent,
    NzModalContentDirective
  ],
    standalone: true
})
export class MediaExtractorComponent{

  constructor(private menuAble: MenuAbleService,private parseService: ParseService,
              private notification: NzNotificationService,
              private fileHandler: FileHandler) {
    this.menuAble.enableMedia()
  }

  fileList: TtsFile[] = []
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
    if (files) {
      this.addFilesToList(files);
    }
  }
  addFilesToList(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileList.push({
        file: file,
      });
    }
  }

  removeFile(index:number) {
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
  editTtsFile: TtsFile | undefined;
  ttsEditModelVisible: boolean = false;
  edit(ttsFile: TtsFile) {
    this.editTtsFile = ttsFile;
    ttsFile.parsed = true;
    this.ttsEditModelVisible = true;
  }

  async reparse(ttsFile: TtsFile) {
    await this.fileHandler.reparse(ttsFile)
  }
  async reparseAll() {
    await this.waitReadAllFile();
    await this.parseAllFile();
  }
  async parseAllFile(){
    await this.fileHandler.parseAllFile(this.fileList)
  }
  async waitReadAllFile() {
    const promises = this.fileList.
    filter(f=>f.fileData===undefined).
    map((file) => this.fileHandler.readFile(file));
    await Promise.all(promises);
  }



}
