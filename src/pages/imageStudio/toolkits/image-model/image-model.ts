import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NovitaModelSelector} from "../../../media/novita-model-selector/novita-model-selector";
import {NovitaModel} from "../../../../models/media";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.html',
  styleUrls: ['./image-model.scss'],
  standalone: true,
  imports: [
    NovitaModelSelector,
    NzModalModule,
    TranslateModule
  ]
})
export class ImageModel implements OnInit {
  modelSelectorVisible = false;
  @Input()
  model: string | undefined;
  @Output()
  ngModelChange = new EventEmitter<any>();

  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }
  windowWidth: number | undefined;
  @Input() nsfw: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }
  selectImageModelAction($event: NovitaModel) {
    this.model = $event.model;
    this.modelSelectorVisible = false;
    this.ngModelChange.emit(this.model)
  }

}
