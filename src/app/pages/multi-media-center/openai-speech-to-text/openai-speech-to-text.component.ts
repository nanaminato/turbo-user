import { Component } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {TtsFile} from "../../../models/media";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzOptionGroupComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzAutosizeDirective, NzInputDirective} from "ng-zorro-antd/input";
import {OpenaiService} from "../../../services/fetch_services";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {IonicModule} from "@ionic/angular";
import {NzModalComponent, NzModalContentDirective, NzModalModule} from "ng-zorro-antd/modal";
import {TtsFileEditorComponent} from "../openai-text-to-speech/tts-file-editor/tts-file-editor.component";
import {JsonCodeViewerComponent} from "./json-code-viewer/json-code-viewer.component";

@Component({
    selector: 'app-openai-speech-to-text',
    templateUrl: './openai-speech-to-text.component.html',
    styleUrls: ['./openai-speech-to-text.component.scss'],
  imports: [
    NzIconDirective,
    NzRowDirective,
    NzCardComponent,
    NzColDirective,
    NzOptionComponent,
    NzOptionGroupComponent,
    NzSelectComponent,
    FormsModule,
    NzInputNumberComponent,
    NzSliderComponent,
    NzButtonComponent,
    NzAutosizeDirective,
    NzInputDirective,
    IonicModule,
    NzModalComponent,
    TtsFileEditorComponent,
    NzModalContentDirective,
    JsonCodeViewerComponent,
    NzModalModule
  ],
  providers: [

  ],
  standalone: true
})
export class OpenaiSpeechToTextComponent{
  model: string = "whisper-1"
  models: string [] = [
    'whisper-1'
  ]
  temperature: number = 0;//0-1
  response_format: string = "json";
  response_formats: string[] = [
    "json",
    "text",
    "srt",
    "verbose_json",
    "vtt"
  ]
  language = "en";
  languages: string[] = [
    'aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu'
  ];
  constructor(private menuAble: MenuAbleService,
              private openaiService: OpenaiService,
              private notificaion: NzNotificationService) {
    this.menuAble.enableMedia()
  }


  fileList: TtsFile[] = []
  outputText: string = "";
  prompt: string = ""
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
    // flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
    const allowedTypes =
      ['audio/flac','audio/mp3','audio/mpeg','audio/mpga',
      'audio/m4a','audio/ogg','audio/wav','audio/webm',
        'video/mp4','audio/mp3'];
    this.fileList.length = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (allowedTypes.includes(file.type)) {
        this.fileList.push({
          file: file,
        });
        return;
      }
    }
  }
  loading: boolean = false;
  async translate() {
    if(this.fileList.length===0){
      this.notificaion.error("还没有选择文件","")
      return;
    }
    this.loading = true;
    this.outputText = ''
    let file = this.fileList[0];
    await this.waitReadFile(file)
    try{
      let result = await this.openaiService.translate({
        file: file.fileData!,
        model: this.model,
        response_format: this.response_format,
        temperature: this.temperature,
        suffix: file!.file!.name.split('.')[1],
        prompt: this.prompt
      });
      // console.log(text)
      if(result.error!==undefined && result.error!=null){
        this.outputText = this.suggestion;
        this.notificaion.error(result.error.code,''+result.error.type)
      }else{
        this.outputText = result.text;
      }
      this.result = result;
    }catch (e:any){
      this.notificaion.error(e.error,'')
    }
    this.loading = false;
  }
  result: any;
  viewSourceVisible: boolean = false;
  suggestion = "生成失败，请通过点击'查看源结果'查看具体信息"
  async transcription() {
    if(this.fileList.length===0){
      this.notificaion.error("还没有选择文件","")
      return;
    }
    this.loading = true;
    this.outputText = ''
    let file = this.fileList[0];
    await this.waitReadFile(file)
    try{
      let result = await this.openaiService.transcription({
        file: file.fileData!,
        model: this.model,
        response_format: this.response_format,
        temperature: this.temperature,
        suffix: file!.file!.name.split('.')[1],
        language: this.language,
        prompt: this.prompt
      });
      if(result.error!==undefined && result.error!=null ){
        this.outputText = this.suggestion;
        this.notificaion.error(result.error.code,''+result.error.type)
      }else{
        this.outputText = result.text;
      }
      this.result = result;
    }catch (e:any){
      this.notificaion.error(e.error,'')
    }
    this.loading = false;
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
        ttsFile.fileData = this.arrayBufferToBase64(arrayBuffer);
        resolve();
      };
      if (ttsFile) {
        reader.readAsArrayBuffer(ttsFile.file!);
      }
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
