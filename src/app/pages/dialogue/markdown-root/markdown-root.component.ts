import {
  Component, Input
} from '@angular/core';
import {MarkdownModule} from "ngx-markdown";
import {CopiedButtonComponent} from "./copied-button/copied-button.component";
import {EscapeHtmlPipe} from "./simple-sanitizer.pipe";
import {CwPipe} from "./cw.pipe";
import {ChatModel} from "../../../models";
@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css',
  standalone: true,
  imports: [
    MarkdownModule,
    CopiedButtonComponent,
    EscapeHtmlPipe,
    CwPipe
  ]
})
export class MarkdownRootComponent
{
  constructor() {

  }
  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel() {
    return this._chatModel === undefined ? new ChatModel() : this._chatModel;
  }

  private _chatModel: ChatModel | undefined;

}
