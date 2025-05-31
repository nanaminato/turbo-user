import {Component, Input, OnInit} from '@angular/core';
import {Lora} from "../../../../models/images";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {IonicModule} from "@ionic/angular";
import {LoraSectionComponent} from "../lora-section/lora-section.component";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzModalModule} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-lora-list',
  templateUrl: './lora-list.component.html',
  styleUrls: ['./lora-list.component.scss'],
  standalone: true,
  imports: [
    NzIconDirective,
    IonicModule,
    LoraSectionComponent,
    NzModalModule,
    TranslateModule
  ]
})
export class LoraListComponent {
  @Input() loras!: Lora[] | undefined;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() default!: number;
  @Input() nsfw: boolean = false;
  constructor() { }

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
