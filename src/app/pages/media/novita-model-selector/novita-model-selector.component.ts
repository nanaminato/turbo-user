import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NovitaModel} from "../../../models/media";
import {NumerService} from "../../../services/fetch_services/numer.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NgOptimizedImage} from "@angular/common";
import {NzImageDirective, NzImageModule} from "ng-zorro-antd/image";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-novita-model-selector',
  templateUrl: './novita-model-selector.component.html',
  styleUrls: ['./novita-model-selector.component.scss'],
  standalone: true,
  imports: [
    NzImageModule,
    TranslateModule
  ]
})
export class NovitaModelSelectorComponent  implements OnInit {

  constructor(private numerService: NumerService,private message: NzMessageService) { }
  @Input()
  set modelType(type: string){
    this.selectModels(type);
  }
  @Input()
  nsfw: boolean = false;
  @Output()
  selection = new EventEmitter<NovitaModel>();
  novitaModels: NovitaModel[] = [];
  ngOnInit() {
    console.log()
  }

  private selectModels(type: string) {
    switch (type){
      case "vae":
        this.numerService.getVaeModels(this.nsfw).subscribe({
          next: models=>{
            this.novitaModels.length = 0;
            models.forEach(model=>{
              this.novitaModels.push(model);
            })
          },
          error: err => {
            this.message.error("获取模型失败")
          }
        })
        break;
      case "lora":
        this.numerService.getLoraModels(this.nsfw).subscribe({
          next: models=>{
            this.novitaModels.length = 0;
            models.forEach(model=>{
              this.novitaModels.push(model);
            })
          },
          error: err => {
            this.message.error("获取模型失败")
          }
        })
        break;
      case "embedding":
        this.numerService.getEmbeddingModels(this.nsfw).subscribe({
          next: models=>{
            this.novitaModels.length = 0;
            models.forEach(model=>{
              this.novitaModels.push(model);
            })
          },
          error: err => {
            this.message.error("获取模型失败")
          }
        })
        break;
      case "image":
        this.numerService.getImageModels(this.nsfw).subscribe({
          next: models=>{
            this.novitaModels.length = 0;
            models.forEach(model=>{
              this.novitaModels.push(model);
            });
          },
          error: err => {
            this.message.error("获取模型失败")
          }
        })
        break;
      case "video":
        this.numerService.getVideoModels(this.nsfw).subscribe({
          next: models=>{
            this.novitaModels.length = 0;
            models.forEach(model=>{
              this.novitaModels.push(model);
            })
          },
          error: err => {
            this.message.error("获取模型失败")
          }
        })
        break;
    }
  }

  triggerSelect(model: NovitaModel) {
    this.selection.emit(model);
  }
}
