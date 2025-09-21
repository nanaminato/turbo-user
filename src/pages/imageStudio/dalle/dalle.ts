import {Component, DoCheck, OnInit} from '@angular/core';
import {Gallery} from "../gallery/gallery";
import {IonicModule, MenuController} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {DallE3Response, TaskImage, UrlImage} from "../../../models/images";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {FormsModule} from "@angular/forms";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzAutosizeDirective, NzInputDirective} from "ng-zorro-antd/input";
import {OpenaiService} from "../../../services/fetch_services";

@Component({
  selector: 'app-dalle',
  templateUrl: './dalle.html',
  styleUrls: ['./dalle.scss'],
  standalone: true,
  imports: [
    Gallery,
    IonicModule,
    TranslateModule,
    NzButtonComponent,
    NzIconDirective,
    FormsModule,
    NzInputNumberComponent,
    NzSliderComponent,
    NzAutosizeDirective,
    NzInputDirective
  ]
})
export class Dalle implements OnInit,DoCheck{

  constructor(private menuAbleService: MenuAbleService,
              private menuCtrl: MenuController,
              private notification: NzNotificationService,
              private universalService: UniversalService,
              private openaiService: OpenaiService,
              private authService: AuthService) {
    this.menuAbleService.enableImage();
    this.dalleInit();
  }
  images: UrlImage[] | undefined = [];
  loading: boolean = false;
  image_num: number = 1;
  image_num_old: number = 1;
  model: string = "dall-e-3";
  prompt: string = "";
  // n: number = 1; image_num
  size: string = "1024x1024";
  quality: string = "standard";
  style: string = "vivid";
  response_format: string = "url";
  sizes: string[] = [
    "1024x1024",
    "1024x1792",
    "1792x1024"
  ];
  image_response_formats: string[] = [
    "url",
    // "b64_json"
  ];
  qualities: string[] = [
    "hd","standard"
  ];
  styles: string[] = [
    "vivid","natural"
  ];

  async generateImages() {
    this.loading = true;
    let result :DallE3Response | undefined;
    try{
      result = await this.openaiService.dalle({
        model: this.model,
        prompt: this.prompt,
        n: this.image_num,
        size: this.size,
        quality: this.quality,
        response_format: this.response_format,
        style: this.style
      });
    }catch (e:any){
      this.loading = false;
      this.notification.error("生成失败",e.error)
      return;
    }
    if(result===null||result.results.length===0){
      this.loading = false;
      this.notification.error("生成失败","")
      return;
    }
    this.loading = false;
    this.images!.length = 0;
    result.results.forEach(image=>{
      this.images?.push({
        image_url: image.url.length===0? `data:image/png;base64,${image.b64}`: image.url,
        image_url_ttl: "3600",
        image_type: "any"
      })
    });
    let taskImage: TaskImage[] = [];
    result.results.forEach(image=>{
      taskImage.push({
        image_url: image.url.length===0? `data:image/png;base64,${image.b64}`: image.url,
        image_url_ttl: 3600,
        image_type: "any"
      })
    });
    let taskResult = {
      images: taskImage,
      videos: [

      ]
    };
    this.universalService.addOrUpdateGenerateTask({
      task_id: Date.now()+'',
      account_id: this.authService.user!.id!,
      task_type: "image",
      taskResult: taskResult,
      date: new Date(),
    });
  }

  showImageMenu() {
    this.menuCtrl.open("image-menu");
  }

  private dalleInit() {
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
  ngDoCheck(): void {
    if(this.image_num_old!==this.image_num){
      this.setSize(this.image_num);
      this.image_num_old = this.image_num;
    }
  }
}
