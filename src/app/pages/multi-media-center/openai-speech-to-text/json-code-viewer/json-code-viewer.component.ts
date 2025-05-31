import {Component, Input, OnInit} from '@angular/core';
import {CopiedButtonComponent} from "../../../dialogue/markdown-root/copied-button/copied-button.component";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-json-code-viewer',
  templateUrl: './json-code-viewer.component.html',
  styleUrls: ['./json-code-viewer.component.scss'],
  imports: [
    CopiedButtonComponent,
    MarkdownComponent
  ],
  standalone: true
})
export class JsonCodeViewerComponent{

  constructor() { }
  code: string | undefined;
  @Input()
  set jsonCode(code: any){
    this.code = "```json\n"+
      JSON.stringify(code, null, 2)
      +"\n```";
  }

}
