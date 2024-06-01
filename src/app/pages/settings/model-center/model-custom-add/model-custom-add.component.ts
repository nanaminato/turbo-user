import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DisplayModel} from "../../../../models";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-model-custom-add',
  templateUrl: './model-custom-add.component.html',
  styleUrls: ['./model-custom-add.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule

  ]
})
export class ModelCustomAddComponent{
  modelName: string = '';
  modelValue: string = '';
  constructor() { }
  @Output()
  displayModel: EventEmitter<DisplayModel> = new EventEmitter<DisplayModel>();
  vision: boolean = false;
  outerTransfer() {
    this.displayModel.next({
      modelName: this.modelName,
      modelValue: this.modelValue,
      vision: this.vision
    });
  }
}
