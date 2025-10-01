import {Component, inject} from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzImageDirective} from "ng-zorro-antd/image";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {TtsFileEditor} from "../openai-text-to-speech/tts-file-editor/tts-file-editor";
import {TtsFile} from "../../../models/media";
import {FileHandler} from "../../../services/handlers/fileHandler";

@Component({
    selector: 'app-media-extractor',
    templateUrl: './media-extractor.html',
    styleUrls: ['./media-extractor.scss'],
  imports: [
    NzButtonComponent,
    NzColDirective,
    NzIconDirective,
    NzImageDirective,
    NzModalModule,
    NzRowDirective,
    ReactiveFormsModule,
    TranslateModule,
    TtsFileEditor,
  ],
    standalone: true
})
export class MediaExtractor {
  private menuAble: MenuAbleService = inject(MenuAbleService);
  private fileHandler: FileHandler = inject(FileHandler);
  constructor() {
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
