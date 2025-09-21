import {Component, Input} from '@angular/core';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NgIf} from "@angular/common";
import {ChatModel} from "../../../models";

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.html',
  styleUrl: './model-editor.css',
  imports: [
    NzSpinModule,
    FormsModule,
    NzInputModule,
  ],
  standalone: true
})
export class ModelEditor {
  @Input()
  chatModel: ChatModel | undefined;
}
