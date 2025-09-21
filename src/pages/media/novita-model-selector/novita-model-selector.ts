import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NovitaModel} from "../../../models/media";
import {NumerService} from "../../../services/fetch_services";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzImageModule} from "ng-zorro-antd/image";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-novita-model-selector',
  templateUrl: './novita-model-selector.html',
  styleUrls: ['./novita-model-selector.scss'],
  standalone: true,
  imports: [
    NzImageModule,
    TranslateModule
  ]
})
export class NovitaModelSelector implements OnInit {

  numerService: NumerService = inject(NumerService);
  message: NzMessageService = inject(NzMessageService);
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
