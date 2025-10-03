import {Component, DoCheck, inject, OnInit, } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {FormsModule} from "@angular/forms";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {Gallery} from "../gallery/gallery";
import {Embedding, Lora, NovitaText2LcmResponse, TaskImage, UrlImage} from "../../../models/images";
import {NovitaService} from "../../../services/fetch_services";
import {CheckParameter, NovitaInit} from "../toolkits";
import {ImageModel} from "../toolkits/image-model/image-model";
import {LoraList} from "../toolkits/lora-list/lora-list";
import {EmbeddingList} from "../toolkits/embedding-list/embedding-list";
import {NovitaCheck} from "../../../services/handlers";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateModule} from "@ngx-translate/core";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzInputDirective} from "ng-zorro-antd/input";
import {SizeReportService} from "../../../services/normal-services";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";

@Component({
  selector: 'app-image-main',
  templateUrl: './novita-text2-image-lcm.html',
  styleUrls: ['./novita-text2-image-lcm.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NzSliderComponent,
    NzInputNumberComponent,
    NzIconDirective,
    NzButtonComponent,
    Gallery,
    ImageModel,
    LoraList,
    EmbeddingList,
    TranslateModule,
    NzSwitchComponent,
    NzInputDirective,
    NzWaveDirective
  ]
})
export class NovitaText2ImageLcm implements OnInit, DoCheck,NovitaInit,CheckParameter {
  images: UrlImage[] | undefined = [];
  image_num: number = 1;
  image_num_old: number = 1;
  width: number = 1024;
  height: number = 800;
  model: string | undefined;
  prompt: string = '';
  negative_prompt: string = '';

  guidance_scale: number = 2;
  steps: number = 8;
  seeds: number = -1;
  clipSkip: number = 1;
  loras: Lora[] = [];
  embeddings: Embedding[] = [];

  loading: boolean = false;
  nsfw: boolean = false;
  menuAbleService: MenuAbleService = inject(MenuAbleService);
  novitaService: NovitaService = inject(NovitaService);
  notification: NzNotificationService = inject(NzNotificationService);
  novitaCheck: NovitaCheck = inject(NovitaCheck);
  universalService: UniversalService = inject(UniversalService);
  authService: AuthService = inject(AuthService);
  constructor(
              ) {
    this.menuAbleService.enableImage();
    this.novitaInit();
  }

  novitaInit(): void {
    this.width = 256;
    this.height = 256;
    this.model = "dreamshaper_8_93211.safetensors";
    this.prompt = "";//Glowing jellyfish floating through a foggy forest at twilight
    this.negative_prompt = "";
    // this.loras.push({model_name: "weight_slider_v2_91681",strength: 1});
    // this.embeddings.push({model_name: "deformityv6-SDXL_267495"});

  }

  ngDoCheck(): void {
    if(this.image_num_old!==this.image_num){
      this.setSize(this.image_num);
      this.image_num_old = this.image_num;
    }
  }

  setSize(size: number){
    this.images!.length = 0;
    for(let i = 0;i<size;i++){
      this.images?.push({image_url:"assets/placeholders/imgHolder.png"});
    }
  }
  ngOnInit() {
    this.setSize(this.image_num);
  }
  showImageMenu() {
  }
  checkParameter():Promise<boolean> {
    return new Promise((resolve, reject)=>{
      if(this.width<128||this.width>1024){
        this.notification.error("宽度不在有效范围内","宽度范围128-1024，选定的宽度为"+this.width);
        resolve(false);
      }
      if(this.height<128||this.height>1024){
        this.notification.error("高度不在有效范围内","宽度范围128-1024，选定的高度为"+this.height);
        resolve(false);
      }
      if(this.prompt===''){
        this.notification.error("还没有设提示词","");
        resolve(false);
      }
      if(this.negative_prompt.trim()!==''&&this.negative_prompt.indexOf(',')===-1) {
        this.notification.error("如果反向提示词不为空，则至少提供一个反向提示词，并使用英文逗号（','）分隔","");
        resolve(false);
      }
      resolve(true)
    });
  }
  precheck(){
    let res = this.novitaCheck.preCheck(this.loras);
    switch (res){
      case 0:
        break;
      case 1:
        this.notification.info("部分lora模型没有选择,已排除","");
        break;
      case 2:
        this.notification.info("选择的lora模型过多,生成时将会使用前5个使用的lora模型","");
        break;
      case 3:
        this.notification.info("部分lora模型没有选择,已排除.选择的lora模型过多,生成时将会使用前5个使用的lora模型","");
        break;
    }
    let res2 = this.novitaCheck.preCheck(this.embeddings);
    switch (res2){
      case 0:
        break;
      case 1:
        this.notification.info("部分embedding模型没有选择,已排除","");
        break;
      case 2:
        this.notification.info("选择的embedding模型过多,生成时将会使用前5个使用的embedding模型","");
        break;
      case 3:
        this.notification.info("部分embedding模型没有选择,已排除.选择的embedding模型过多,生成时将会使用前5个使用的lora模型","");
        break;
    }
  }
  async generateImages() {
    if(!await this.checkParameter()) return;
    this.precheck();
    this.loading = true;
    let t2i: NovitaText2LcmResponse | undefined;
    try{
      t2i = await this.novitaService.text2Lcm({
        model_name: this.model,
        prompt: this.prompt,
        negative_prompt: this.negative_prompt.trim(),
        height: this.height,
        width: this.width,
        loras: this.novitaCheck.filter(this.loras),
        embeddings: this.novitaCheck.filter(this.embeddings),
        image_num: this.image_num,
        steps: this.steps,
        seed: this.seeds,
        guidance_scale: this.guidance_scale,
        clip_skip: this.clipSkip,
      });
    }catch (error: any){
      this.loading = false;
      this.notification.error("生成图片失败"+error.message,"");
      return;
    }

    if(t2i.images == null||t2i.images?.length===0){
      this.loading = false;
      this.notification.error("生成图片失败",`${t2i.reason}`)
      return;
    }
    this.images!.length = 0;
    this.loading = false;
    t2i.images.forEach(image=>{
      this.images?.push({
        image_url: image.image_file,
        image_url_ttl: "not given",
        image_type: image.image_type,
      })
    });
    // 保存生成任务
    let taskImage: TaskImage[] = [];
    t2i.images.forEach(image=>{
      taskImage.push({
        image_url: image.image_file,
        image_url_ttl: 3600,
        image_type: image.image_type
      })
    });
    let result = {
      images: taskImage,
      videos: [

      ]
    };
    // 本地
    this.universalService.addOrUpdateGenerateTask({
      task_id: Date.now()+'',
      account_id: this.authService.user!.id!,
      task_type: "image",
      taskResult: result,
      date: new Date(),
    });

  }
  modelChange($event: any) {
    this.model = $event;
  }
  sizeReportService: SizeReportService = inject(SizeReportService);
  menuVisible() {
    return this.sizeReportService.menuVisible;
  }

  toggleMenu() {
    this.sizeReportService.toggleMenu()
  }
}
