import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";

@Component({
  selector: 'app-openai-speech-to-text',
  templateUrl: './openai-speech-to-text.component.html',
  styleUrls: ['./openai-speech-to-text.component.scss'],
  standalone: true
})
export class OpenaiSpeechToTextComponent  implements OnInit {

  constructor(private menuAble: MenuAbleService,) {
    this.menuAble.enableMedia()
  }

  ngOnInit() {
    console.log()
  }

}
