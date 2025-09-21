import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FramePrompt} from "../../../models/videos";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-section',
  templateUrl: './section.html',
  styleUrls: ['./section.scss'],
  standalone: true,
  imports: [
    NzIconDirective,
    IonicModule,
    FormsModule,
    NzPopoverDirective,
    TranslateModule
  ]
})
export class Section implements OnInit {
  @Input()
  section: FramePrompt | undefined;
  @Input()
  id: number|undefined;
  @Output()
  delete = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
    console.log()
  }

  emitDelete() {
    this.delete.emit(this.id);
  }
}
