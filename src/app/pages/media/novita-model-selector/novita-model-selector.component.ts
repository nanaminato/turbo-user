import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NovitaModel} from "../../../models/media";
import {NumerService} from "../../../services/fetch_services/numer.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NgOptimizedImage} from "@angular/common";
import {NzImageDirective, NzImageModule} from "ng-zorro-antd/image";

@Component({
  selector: 'app-novita-model-selector',
  templateUrl: './novita-model-selector.component.html',
  styleUrls: ['./novita-model-selector.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzImageDirective,
    NzImageModule
  ]
})
export class NovitaModelSelectorComponent  implements OnInit {

  constructor(private numerService: NumerService,private message: NzMessageService) { }
  @Input()
  set modelType(type: string){
    this.selectModels(type);
  }
  @Output()
  selection = new EventEmitter<NovitaModel>();
  novitaModels: NovitaModel[] = [];
  ngOnInit() {
    console.log()
  }

  private selectModels(type: string) {
    switch (type){
      case "vae":
        this.numerService.getVaeModels().subscribe({
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
        this.numerService.getLoraModels().subscribe({
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
        this.numerService.getEmbeddingModels().subscribe({
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
        this.numerService.getImageModels().subscribe({
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
        this.numerService.getVideoModels().subscribe({
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
