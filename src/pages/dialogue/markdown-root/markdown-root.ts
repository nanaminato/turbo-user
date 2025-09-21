import {
  Component, Input
} from '@angular/core';
import {MarkdownModule} from "ngx-markdown";
import {CopiedButton} from "./copied-button/copied-button";
import {ChatModel} from "../../../models";
@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.html',
  styleUrl: './markdown-root.css',
  standalone: true,
  imports: [
    MarkdownModule,
    CopiedButton,
  ]
})
export class MarkdownRoot
{
  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel() {
    return this._chatModel === undefined ? new ChatModel() : this._chatModel;
  }

  private _chatModel: ChatModel | undefined;

}
