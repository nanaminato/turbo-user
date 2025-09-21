import {Component, DoCheck, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Gallery} from "../gallery/gallery";
import {IonicModule, MenuController} from "@ionic/angular";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {FormsModule} from "@angular/forms";
import {Embedding, Lora, NovitaImg2LcmResponse, TaskImage, UrlImage} from "../../../models/images";
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NovitaService} from "../../../services/fetch_services";
import {NgOptimizedImage} from "@angular/common";
import {NzImageModule} from "ng-zorro-antd/image";
import {CheckParameter, NovitaInit} from "../toolkits";
import {ImageModel} from "../toolkits/image-model/image-model";
import {EmbeddingList} from "../toolkits/embedding-list/embedding-list";
import {LoraList} from "../toolkits/lora-list/lora-list";
import {NovitaCheck} from "../../../services/handlers";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {NzSwitchComponent} from "ng-zorro-antd/switch";

@Component({
  selector: 'app-novita-img2-image-lcm',
  templateUrl: './novita-img2-image-lcm.html',
  styleUrls: ['./novita-img2-image-lcm.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NzSliderComponent,
    NzInputNumberComponent,
    NzIconDirective,
    NzButtonComponent,
    Gallery,
    NzImageModule,
    ImageModel,
    EmbeddingList,
    LoraList,
    NzTooltipDirective,
    TranslateModule,
    NzSwitchComponent,
    NgOptimizedImage
  ]
})
export class NovitaImg2ImageLcm implements OnInit, DoCheck, NovitaInit,CheckParameter{
  standardWidth: number = 200;
  standardHeight: number = 200;
  images: UrlImage[] | undefined = [];
  model: string | undefined;
  prompt: string = '';
  negative_prompt: string = '';
  image_num: number = 1;
  image_num_old: number = 1;
  sd_vae: string | undefined;
  loras: Lora[] = [];
  embeddings: Embedding[] = [];
  steps: number = 8;
  guidance_scale: number = 2;
  seeds: number = -1;
  clipSkip: number = 1;

  loading: boolean = false;
  menuAbleService: MenuAbleService = inject(MenuAbleService);
  menuCtrl: MenuController = inject(MenuController);
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

  novitaInit() {
    this.sd_vae = "vae-ft-mse-840000-ema-pruned.safetensors";
    this.model = "dreamshaper_8_93211.safetensors";
    this.prompt = "";
    this.negative_prompt = "nsfw, bottle,bad face";
  }

  ngDoCheck(): void {
    if (this.image_num_old !== this.image_num) {
      this.setSize(this.image_num);
      this.image_num_old = this.image_num;
    }
  }

  setSize(size: number) {
    this.images!.length = 0;
    for (let i = 0; i < size; i++) {
      this.images?.push({image_url: "assets/placeholders/imgHolder.png"});
    }
  }

  ngOnInit() {
    this.setSize(this.image_num);
  }

  showImageMenu() {
    this.menuCtrl.open("image-menu");
  }
  async checkParameter(): Promise<boolean>{
    return new Promise((resolve, reject)=>{
      if(this.prompt===''){
        this.notification.error("还没有设提示词","");
        resolve(false);
      }
      if(this.negative_prompt.indexOf(',')===-1) {
        this.notification.error("如果反向提示词不为空，则至少提供一个反向提示词，并使用英文逗号（','）分隔","");
        resolve(false);
      }
      resolve(true);
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
    let img2Img: NovitaImg2LcmResponse | undefined;
    try {
      img2Img = await this.novitaService.img2Lcm({
        model_name: this.model!,
        input_image: this.trimImage!,
        prompt: this.prompt,
        negative_prompt: this.negative_prompt.trim(),
        image_num: this.image_num,
        sd_vae: "vae-ft-mse-840000-ema-pruned.safetensors",//this.sd_vae!,
        loras: this.novitaCheck.filter(this.loras),
        embeddings: this.novitaCheck.filter(this.embeddings),
        steps: this.steps,
        guidance_scale: this.guidance_scale,
        seed: this.seeds,
        clip_skip: this.clipSkip,
        strength: 0//this.strength
      });
    } catch (error: any) {
      this.loading = false;
      this.notification.error("生成图片失败" + error.message,"");
      return;
    }
    if (img2Img.images ==null || img2Img.images?.length === 0) {
      this.loading = false;
      this.notification.error("生成图片失败",`${img2Img.reason}`)
      return;
    }
    this.images!.length = 0;
    this.loading = false;
    img2Img.images.forEach((image:any) => {
      this.images?.push({
        image_url: image.image_url,
        image_url_ttl: image["image expire time"]?.toString(),
        image_type: image.image_type,
      })
    });
    // 保存生成任务
    let taskImage: TaskImage[] = [];
    img2Img.images.forEach(image=>{
      taskImage.push({
        image_url: image.image_url,
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

  @ViewChild('imageContainer')
    imageContainer: ElementRef | undefined;
  @ViewChild('fileInput')
    fileInput: ElementRef | undefined;

  selectedImage: string | undefined = "assets/placeholders/no.png";
  nsfw: boolean = false;
  get trimImage(){
    if(this.selectedImage?.startsWith("data")){
      return this.selectedImage?.substring(this.selectedImage!.indexOf(",")+1);
    }
    return "";
  }
  selectImage() {
    this.fileInput!.nativeElement.click();
  }
  handleImageChange(event: Event) {
    if(event.target==null||(event.target as HTMLInputElement).files==null||(event.target as HTMLInputElement).files!.length<1){
      return;
    }
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        const img = new Image();
        img.onload = () => {
          this.standardHeight = img.height;
          this.standardWidth = img.width;
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  modelChange($event: any) {
    this.model = $event;
  }
}
