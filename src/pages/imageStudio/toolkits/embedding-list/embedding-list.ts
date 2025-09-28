import {Component, Input, OnInit} from '@angular/core';
import {Embedding} from "../../../../models/images";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {EmbeddingSection} from "../embedding-section/embedding-section";
import {NzModalModule} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-embedding-list',
  templateUrl: './embedding-list.html',
  styleUrls: ['./embedding-list.scss'],
  standalone: true,
  imports: [
    NzIconDirective,
    EmbeddingSection,
    NzModalModule,
    TranslateModule
  ]
})
export class EmbeddingList{
  @Input() embeddings: Embedding[] | undefined;
  @Input() nsfw: boolean = false;
  awareDelete($event: number) {
    this.embeddings?.splice($event,1);
  }

  addNewEmbedding() {
    this.embeddings?.push({
      model_name: ''
    })
  }
}
