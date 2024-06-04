import {Component, Input, OnInit} from '@angular/core';
import {TtsFile} from "../../../../models/media";
import {FormsModule} from "@angular/forms";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-tts-file-editor',
  templateUrl: './tts-file-editor.component.html',
  styleUrls: ['./tts-file-editor.component.scss'],
  standalone: true,

  imports: [
    FormsModule,
    NzInputDirective,
    NzModalModule
  ],
  providers: [

  ]
})
export class TtsFileEditorComponent{

  constructor() {

  }
  @Input()
  ttsFile: TtsFile | undefined;

}
