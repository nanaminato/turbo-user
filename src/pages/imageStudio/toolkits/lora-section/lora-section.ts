import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Lora} from "../../../../models/images";
import {NovitaModel} from "../../../../models/media";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NovitaModelSelector} from "../../../media/novita-model-selector/novita-model-selector";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {FormsModule} from "@angular/forms";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-lora-section',
  templateUrl: './lora-section.html',
  styleUrls: ['./lora-section.scss'],
  standalone: true,
  imports: [
    NzModalComponent,
    NovitaModelSelector,
    NzModalContentDirective,
    NzInputNumberComponent,
    FormsModule,
    NzIconDirective,
    NzTooltipDirective,
    TranslateModule
  ]
})
export class LoraSection implements OnInit {

  @Input()
  lora: Lora | undefined;
  loraModalVisible: boolean = false;
  @Input()
  index: number | undefined;
  @Output()
  delete = new EventEmitter<number>();
  ngOnInit() {
    this.windowWidth = window.innerWidth;
  }
  windowWidth: number | undefined;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() nsfw: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }
  selectImageModelAction($event: NovitaModel) {
    this.lora!.model_name = $event.model;
    this.loraModalVisible = false;
  }

  emitDelete() {
    this.delete.emit(this.index);
  }
}
