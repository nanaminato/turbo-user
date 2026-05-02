import {Component, DoCheck, inject, OnInit, signal} from '@angular/core';
import {Gallery} from "../gallery/gallery";
import {TranslateModule} from "@ngx-translate/core";
import {
  APIMartGPTImage2OfficialRequest,
  APIMartGPTImage2Request,
  APIMartGPTImage2Response, APIMartTaskResponse,
  TaskImage,
  UrlImage
} from "../../../models/images";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {FormsModule} from "@angular/forms";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {NzInputDirective, NzInputGroupComponent, NzInputWrapperComponent} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {SizeReportService} from "../../../services/normal-services";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ApimartService} from "../../../services/fetch_services/apimart.service";
import {GenerateTask} from "../../../models/media";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {fileToBase64} from "../../../services/utils";
import {NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzImageService} from "ng-zorro-antd/image";

@Component({
  selector: 'app-dalle',
  templateUrl: './apimart-image.component.html',
  styleUrls: ['./apimart-image.component.scss'],
  standalone: true,
  imports: [
    Gallery,
    TranslateModule,
    NzButtonComponent,
    NzIconDirective,
    FormsModule,
    NzInputNumberComponent,
    NzSliderComponent,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzWaveDirective,
    CdkTextareaAutosize,
    NzSwitchComponent,
    NzUploadComponent,
  ],
  providers: [
    NzImageService,
  ]
})
export class APIMartImage implements OnInit,DoCheck{

  constructor(private menuAbleService: MenuAbleService,
              private notification: NzNotificationService,
              private universalService: UniversalService,
              private apimartService: ApimartService,
              private authService: AuthService,
              private msg: NzMessageService,
              private nzImageService: NzImageService) {
    this.menuAbleService.enableImage();
    this.apiMartImageInit();
  }
  images: UrlImage[] | undefined = [];
  loading: boolean = false;

  image_num: number = 1;
  //for gpt-image-2 1
  //for gpt-image-2-official 1~4
  image_num_old: number = 1;
  image_num_max: number = 1;

  model: string = "gpt-image-2";
  models: string[] = [
    "gpt-image-2",
    "gpt-image-2-official",
  ]
  prompt: string = "";
  size: string = "1:1";
  sizes_normal: string[] = [
    "1:1",
    "3:2",
    "2:3",
    "4:3",
    "3:4",
    "5:4",
    "4:5",
    "16:9",
    "9:16",
    "2:1",
    "1:2",
    "21:9",
    "9:21"
  ]
  sizes = this.sizes_normal;
  resolution: string = "1k";
  resolutions: string[] = [
    "1k",
    "2k",
    "4k"
  ]
  //official only
  quality: string = "high";
  qualities: string[] = [
    "auto",
    "low",
    "medium",
    "high",
  ];
  //official only
  background: string = "auto";
  backgrounds: string[] = [
    "transparent",
    "opaque",
    "auto"
  ]
  //official only
  moderation: string = "low";
  moderations: string[] = [
    "low",
    "auto"
  ]
  //official only
  output_format: string = "png";
  output_formats: string[] = [
    "png","jpeg","webq"
  ]

  image_urls: string[] = [

  ]
  mask_url: string | undefined = undefined;
  tempImageUrl = '';
  tempMaskUrl = '';
  //gpt-image-2 only
  official_fallback: boolean = false;

  async generateImages() {
    this.loading = true;
    let asyncTask :APIMartGPTImage2Response | undefined;
    try{
      if(this.model.endsWith("official")){
        let createRequest: APIMartGPTImage2OfficialRequest = {
          model: this.model,
          prompt: this.prompt,
          size: this.size,
          resolution: this.resolution,
          quality: this.quality,
          background: this.background,
          moderation: this.moderation,
          output_format: this.output_format,
          n: this.image_num,
          image_urls: this.image_urls.length===0?null: this.image_urls,
          mask_url: this.mask_url,
        };
        asyncTask = await this.apimartService.gptImage2Official(createRequest);
      }else{
        let createRequest: APIMartGPTImage2Request = {
          model: this.model,
          prompt: this.prompt,
          n: this.image_num,
          size: this.size,
          resolution: this.resolution,
          image_urls: this.image_urls.length===0?null: this.image_urls,
          official_fallback: this.official_fallback,
        };
        asyncTask = await this.apimartService.gptImage2(createRequest);
      }
    }catch (e:any) {
      this.loading = false;
      this.notification.error("生成失败", e.error)
      return;
    }
    if (asyncTask === undefined || asyncTask.code!==200) {
      this.loading = false;
      this.notification.error("生成图片失败","");
      return;
    }
    let task_id = asyncTask!.data![0]!.task_id!;
    let generateTask: GenerateTask = {
      task_id: task_id,
      account_id: this.authService.user!.id,
      date: new Date(),
      task_type: "apimart => image"
    };
    this.universalService.addOrUpdateGenerateTask(generateTask).then(t=>{
      this.notification.info("获取到task_id","");
    });

    let taskResult: APIMartTaskResponse | undefined;
    let first = true;
    while(taskResult===undefined ||
        (taskResult.data?.progress !== 100 ||taskResult.data.completed===0)
      ){
      if(!first){
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      first = false;
      try{
        taskResult = await this.apimartService.getApiMartTask(task_id);
        if(taskResult.code===200){
          console.log("progress...",taskResult.data?.progress);
        }
      }catch (error: any){
        this.loading = false;
        this.notification.info("获取任务结果失败","");
        return;
      }
    }
    // 1. 提取核心数据，使用可选链简化判断
    const resultData = taskResult?.data?.result?.images?.[0];
    const imageUrls: string[] = resultData?.url || [];
    const expiresAt = resultData?.expiresAt ?? '';

    // 2. 构造 generateTask 所需的 images 数组
    const taskImages: TaskImage[] = imageUrls.map(url => ({
      image_url: url,
      image_url_ttl: 3600,
      nsfw_detection_result: ""
    }));

    // 3. 更新 generateTask 并调用服务
    generateTask.taskResult = {
      images: taskImages
    };
    this.universalService.addOrUpdateGenerateTask(generateTask).then(() => {
      this.notification.info("存储响应结果", "");
    });

    // 4. 重置并更新当前组件的展示图片 (this.images)
    this.loading = false;
    // 建议直接赋值，如果 this.images 必须保持引用，则使用 map 重新构造
    this.images = imageUrls.map(url => ({
      image_url: url,
      image_url_ttl: String(expiresAt),
      image_type: "image",
    }));


  }
  private apiMartImageInit() {
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
  sizeReportService: SizeReportService = inject(SizeReportService);
  menuVisible() {
    return this.sizeReportService.menuVisible;
  }

  toggleMenu() {
    this.sizeReportService.toggleMenu()
  }

  isOfficial = signal(false);
  //模型切换
  protected modelChange(event: string) {
    if(this.model.endsWith("official")){
      //gpt-image-2-official
      this.isOfficial.update(()=>true);
      this.image_num_max = 4;
    }else{
      //gpt-image-2
      this.isOfficial.update(()=>false);
      this.image_num_max = 1;
      this.image_num = 1;
    }

  }
  addUrlToList(): void {
    if (!this.tempImageUrl) return;
    if (this.image_urls.length >= 16) {
      this.msg.error('image_urls exceeds max 16');
      return;
    }
    this.image_urls.push(this.tempImageUrl);
    this.tempImageUrl = '';
  }

  // 处理本地上传
  beforeImageUpload = (file: NzUploadFile): boolean => {
    if (this.image_urls.length >= 16) {
      this.msg.error('image_urls exceeds max 16');
      return false;
    }

    this.handleLocalFile(file, 'list');
    return false; // 返回 false 停止上传流程
  };
  private async handleLocalFile(nzFile: NzUploadFile, type: 'list' | 'mask') {
    const file = nzFile as unknown as File;
    try {
      const base64 = await fileToBase64(file);
      if (type === 'list') {
        this.image_urls = [...this.image_urls, base64];
      } else {
        this.mask_url = base64;
      }
    } catch (e) {
      this.msg.error('图片读取失败');
    }
  }
  removeImage(index: number): void {
    this.image_urls.splice(index, 1);
  }

  // --- 处理遮罩图 (mask_url) ---

  beforeMaskUpload = (file: NzUploadFile): boolean => {
    this.handleLocalFile(file, 'mask');
    return false; // 返回 false 停止上传流程
  };

  setMaskUrl(): void {
    if (this.tempMaskUrl) {
      this.mask_url = this.tempMaskUrl;
      this.tempMaskUrl = '';
    }
  }

  showImage(url: string) {
    const images = [
      {
        src: url,
        alt: 'preview'
      }
    ];
    this.nzImageService.preview(images);
  }
  highResolutionAvailableSize: string[] = [
    "16:9",
    "9:16",
    "2:1",
    "1:2",
    "21:9",
    "9:21"
  ]
  protected resolutionChange() {
    if(this.resolution==="4k" ){
      this.sizes = this.highResolutionAvailableSize;
      let index = this.highResolutionAvailableSize.indexOf(this.size);
      if(index > -1){

      }else{
        this.size = this.highResolutionAvailableSize[0];
        let sizes = this.highResolutionAvailableSize.join(", ")
        this.notification.warning("图像的比例自动改变了",`4k模式下支持的比例为${sizes}, 由于之前的比例不被支持, 自动替换为${this.size}`)
      }
    }else{
      this.sizes = this.sizes_normal;
    }
  }

}
