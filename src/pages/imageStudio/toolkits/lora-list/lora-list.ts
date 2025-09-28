import {Component, Input, OnInit} from '@angular/core';
import {Lora} from "../../../../models/images";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {LoraSection} from "../lora-section/lora-section";
import {NzModalModule} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-lora-list',
  templateUrl: './lora-list.html',
  styleUrls: ['./lora-list.scss'],
  standalone: true,
  imports: [
    NzIconDirective,
    LoraSection,
    NzModalModule,
    TranslateModule
  ]
})
export class LoraList {
  @Input() loras!: Lora[] | undefined;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() default!: number;
  @Input() nsfw: boolean = false;

  addNewLora() {
    if(this.loras!==undefined){
      this.loras.push({
        model_name:'',
        strength: this.default
      })
    }
  }

  awareDelete($event: number) {
    this.loras?.splice($event,1);
  }
}
