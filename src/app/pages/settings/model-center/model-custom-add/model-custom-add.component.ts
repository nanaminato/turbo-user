import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DisplayModel} from "../../../../models";

@Component({
  selector: 'app-model-custom-add',
  templateUrl: './model-custom-add.component.html',
  styleUrls: ['./model-custom-add.component.scss'],
  standalone: true,
  imports: [
    FormsModule

  ]
})
export class ModelCustomAddComponent{
  modelName: string = '';
  modelValue: string = '';
  constructor() { }
  @Output()
  displayModel: EventEmitter<DisplayModel> = new EventEmitter<DisplayModel>();
  outerTransfer() {
    this.displayModel.next({
      modelName: this.modelName,
      modelValue: this.modelValue
    });
  }
}
