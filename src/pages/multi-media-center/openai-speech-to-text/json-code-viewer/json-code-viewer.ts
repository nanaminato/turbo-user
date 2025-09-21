import {Component, Input, OnInit} from '@angular/core';
import {CopiedButton} from "../../../dialogue/markdown-root/copied-button/copied-button";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-json-code-viewer',
  templateUrl: './json-code-viewer.html',
  styleUrls: ['./json-code-viewer.scss'],
  imports: [
    CopiedButton,
    MarkdownComponent
  ],
  standalone: true
})
export class JsonCodeViewer {

  constructor() { }
  code: string | undefined;
  @Input()
  set jsonCode(code: any){
    this.code = "```json\n"+
      JSON.stringify(code, null, 2)
      +"\n```";
  }

}
