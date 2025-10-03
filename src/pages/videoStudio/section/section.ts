import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FramePrompt} from "../../../models/videos";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {FormsModule} from "@angular/forms";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {TranslateModule} from "@ngx-translate/core";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-section',
  templateUrl: './section.html',
  styleUrls: ['./section.scss'],
  standalone: true,
  imports: [
    NzIconDirective,
    FormsModule,
    NzPopoverDirective,
    TranslateModule,
    NzOptionComponent,
    NzSelectComponent,
    NzInputNumberComponent,
    NzButtonComponent
  ]
})
export class Section{
  @Input()
  section: FramePrompt | undefined;
  @Input()
  id: number|undefined;
  @Output()
  delete = new EventEmitter<number>();

  emitDelete() {
    this.delete.emit(this.id);
  }
}
