import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {NzModalComponent, NzModalContentDirective, NzModalModule} from "ng-zorro-antd/modal";
import {IonicModule} from "@ionic/angular";
import {NovitaModelSelectorComponent} from "../../../media/novita-model-selector/novita-model-selector.component";
import {NovitaModel} from "../../../../models/media";

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.component.html',
  styleUrls: ['./image-model.component.scss'],
  standalone: true,
  imports: [
    NzModalComponent,
    IonicModule,
    NovitaModelSelectorComponent,
    NzModalContentDirective,
    NzModalModule
  ]
})
export class ImageModelComponent  implements OnInit {
  modelSelectorVisible = false;
  @Input()
  model: string | undefined;
  @Output()
  ngModelChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }
  windowWidth: number | undefined;
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
