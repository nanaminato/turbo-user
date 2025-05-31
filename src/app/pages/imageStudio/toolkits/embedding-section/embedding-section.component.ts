import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Embedding} from "../../../../models/images";
import {NovitaModel} from "../../../../models/media";
import {IonicModule} from "@ionic/angular";
import {NovitaModelSelectorComponent} from "../../../media/novita-model-selector/novita-model-selector.component";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-embedding-section',
  templateUrl: './embedding-section.component.html',
  styleUrls: ['./embedding-section.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NovitaModelSelectorComponent,
    NzIconDirective,
    NzModalComponent,
    FormsModule,
    NzModalContentDirective,
    TranslateModule

  ]
})
export class EmbeddingSectionComponent  implements OnInit {
  @Output() delete = new EventEmitter<number>();
  @Input() index!: number;
  @Input() embedding: Embedding | undefined;

  embeddingModalVisible: boolean = false;
  constructor() { }
  selectImageModelAction($event: NovitaModel) {
    this.embedding!.model_name = $event.model;
    this.embeddingModalVisible = false;
  }

  emitDelete() {
    this.delete.emit(this.index);
  }
  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }
  windowWidth: number | undefined;
  @Input() nsfw:boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }

}
