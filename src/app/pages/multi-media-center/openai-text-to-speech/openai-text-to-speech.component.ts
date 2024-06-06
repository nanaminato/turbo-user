import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {TtsFile} from "../../../models/media";
import {NzAutosizeDirective, NzInputDirective} from "ng-zorro-antd/input";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {Bs64Handler} from "../../../services/handlers";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {OpenaiService, ParseService} from "../../../services/fetch_services";
import {TtsResponse} from "../../../models/media/tts";
import {TtsFileEditorComponent} from "./tts-file-editor/tts-file-editor.component";
import {ModelEditorComponent} from "../../chat-main/model-editor/model-editor.component";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {ChatModel} from "../../../models";
import {forkJoin, map} from "rxjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FileHandler} from "../../../services/handlers/fileHandler";

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
    NzAutosizeDirective,
    NzInputDirective,
    NzSpinComponent,
    TtsFileEditorComponent,
    ModelEditorComponent,
    NzModalComponent,
    NzModalContentDirective,
  ],
  providers: [
    Bs64Handler
  ],
  standalone: true
})
export class OpenaiTextToSpeechComponent {
  voice: string = "alloy";
  human_voices: string[] = [
    "alloy", "echo", "fable", "onyx",
  ];
  woman_voices: string[] = [
    "nova", "shimmer"
  ];
  speech_response_formats: string[] = [
    "mp3", "opus", "aac", "flac"
  ]
  response_format: string = "mp3";
  model: string = "tts-1";
  speed: number = 1; // 0.25 - 4.0
  models: string[] = [
    "tts-1", "tts-1-hd"
  ];
  inputText: string = "";

  constructor(private menuAble: MenuAbleService,
              private sanitizer: DomSanitizer,
              private bs64Handler: Bs64Handler,
              private openaiService: OpenaiService,
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
    const allowedTypes = ['application/msword', 'application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file.type)
      if (allowedTypes.includes(file.type)) {
        this.fileList.push({
          file: file,
        });
      }
    }
  }

  removeFile(index: number) {
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

  @ViewChild('player') player: ElementRef<HTMLAudioElement> | undefined;
  @ViewChild('musicIcon') musicIcon: ElementRef<HTMLImageElement> | undefined;
  isAudioPlaying: boolean = false;
  audioSrc: SafeUrl | undefined;
  time: number = 0;
  pending: boolean = true;
  private timerInterval: any;

  onAudioPlay() {
    this.isAudioPlaying = true;
    if (!this.musicIcon) return;
    this.musicIcon.nativeElement.classList.add('playing');
  }

  onAudioPause() {
    this.isAudioPlaying = false;
    if (!this.musicIcon) return;
    this.musicIcon.nativeElement.classList.remove('playing');
  }

  loading: boolean = false;
  delta = 200;

  startTimer() {
    this.time = 0;
    this.timerInterval = setInterval(() => {
      this.time++;
      if (this.time > this.delta) {
        clearInterval(this.timerInterval);
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.pending = false;
  }

  getPendingText() {
    return `Already waiting ${this.time / 10}s, please wait patiently`;
  }

  async generate() {
    const type = "audio/" + this.response_format;
    let ttsResponse: TtsResponse | undefined;
    this.loading = true;
    this.startTimer();
    try {
      ttsResponse = await this.openaiService.tts({
        model: this.model,
        speed: this.speed,
        response_format: this.response_format,
        voice: this.voice,
        input: this.inputText
      })
    } catch (e) {
      this.loading = false;
      this.stopTimer();
    }
    this.stopTimer();
    this.loading = false;
    const blob = this.bs64Handler.base64toBlob(ttsResponse?.base64!, type);
    this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // 创建安全的 URL
  }

  editTtsFile: TtsFile | undefined;
  ttsEditModelVisible: boolean = false;

  edit(ttsFile: TtsFile) {
    this.editTtsFile = ttsFile;
    ttsFile.parsed = true;
    this.ttsEditModelVisible = true;
  }

  reparse(ttsFile: TtsFile){
    this.fileHandler.reparse(ttsFile)
  }

  async reparseAll() {
    await this.waitReadAllFile();
    await this.parseAllFile();
  }

  async parseAllFile() {
    this.fileHandler.parseAllFile(this.fileList)
  }

  putAllContent() {
    this.inputText = '';
    for (let ttsFile of this.fileList) {
      if (ttsFile.parsed) {
        this.inputText += ttsFile.parsedContent;
      }
    }
  }

  async waitReadAllFile() {
    const promises = this.fileList
      .filter(f => f.fileData === undefined)
      .map((file) => this.fileHandler.readFile(file));
    await Promise.all(promises);
  }


}
