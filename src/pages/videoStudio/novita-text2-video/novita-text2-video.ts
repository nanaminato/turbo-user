import {Component, DoCheck, inject} from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputNumberComponent} from "ng-zorro-antd/input-number";
import {NzSliderComponent} from "ng-zorro-antd/slider";
import {FormsModule} from "@angular/forms";
import {videoModels} from "../../../models/videos";
import {FramePrompt} from "../../../models/videos";
import {Section} from "../section/section";
import {EmbeddingList} from "../../imageStudio/toolkits/embedding-list/embedding-list";
import {LoraList} from "../../imageStudio/toolkits/lora-list/lora-list";
import {Embedding, Lora, NovitaTask, TaskResult} from "../../../models/images";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NovitaCheck} from "../../../services/handlers";
import {UniversalService} from "../../../services/db-services/universal.service";
import {AuthService} from "../../../auth_module";
import {NovitaService} from "../../../services/fetch_services";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NovitaInit} from "../../imageStudio/toolkits";
import {GenerateTask} from "../../../models/media";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {TranslateModule} from "@ngx-translate/core";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

@Component({
  selector: 'app-novita-text2-video',
  templateUrl: './novita-text2-video.html',
  styleUrls: ['./novita-text2-video.scss'],
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzInputNumberComponent,
    NzSliderComponent,
    FormsModule,
    Section,
    EmbeddingList,
    LoraList,
    NzTooltipDirective,
    NzCardComponent,
    NzSpinComponent,
    TranslateModule,
    NzSwitchComponent,
    NzSelectComponent,
    NzOptionComponent,
  ]
})
export class NovitaText2Video implements DoCheck, NovitaInit {
  model: string = "";
  width: number = 0;
  height: number = 0;
  negative_prompt: string = "";
  guidance_scale: number = 0;
  steps: number = 0;
  seeds: number = -1;
  clipSkip: number = 1;
  videoModelChoice: string[];
  loras: Lora[] = [];
  embeddings: Embedding[] = [];
  framePrompts: FramePrompt[] = [];
  loading: boolean = false;
  videoUrl: string | undefined = '';
  menuAble: MenuAbleService = inject(MenuAbleService);
  notification: NzNotificationService = inject(NzNotificationService);
  novitaService: NovitaService = inject(NovitaService);
  novitaCheck: NovitaCheck = inject(NovitaCheck);
  universalService: UniversalService = inject(UniversalService);
  authService: AuthService = inject(AuthService);
  constructor() {
    this.menuAble.enableVideo()
    this.videoModelChoice = videoModels;
    this.novitaInit();
  }

  novitaInit(): void {
    this.model = this.videoModelChoice[0];
    this.width = 640;
    this.height = 480;
    this.guidance_scale = 7.5;
    this.clipSkip = 1;
    this.steps = 20;
    this.framePrompts.push({
      frames: 8,
      prompt: ""
    });
    this.negative_prompt = "sfw,ng_deepnegative_v1_75t, badhandv4";
  }

  ngDoCheck(): void {
    console.log();
  }

  precheck() {
    let res = this.novitaCheck.preCheck(this.loras);
    switch (res) {
      case 0:
        break;
      case 1:
        this.notification.info("部分lora模型没有选择,已排除", "");
        break;
      case 2:
        this.notification.info("选择的lora模型过多,生成时将会使用前5个使用的lora模型", "");
        break;
      case 3:
        this.notification.info("部分lora模型没有选择,已排除.选择的lora模型过多,生成时将会使用前5个使用的lora模型", "");
        break;
    }
    let res2 = this.novitaCheck.preCheck(this.embeddings);
    switch (res2) {
      case 0:
        break;
      case 1:
        this.notification.info("部分embedding模型没有选择,已排除", "");
        break;
      case 2:
        this.notification.info("选择的embedding模型过多,生成时将会使用前5个使用的embedding模型", "");
        break;
      case 3:
        this.notification.info("部分embedding模型没有选择,已排除.选择的embedding模型过多,生成时将会使用前5个使用的lora模型", "");
        break;
    }
  }

  async checkParameter() {
    return new Promise<boolean>((resolve, reject) => {
      let piece = 0;
      // console.log(this.width)
      // console.log(this.height)
      this.framePrompts.forEach(p=>{
        piece+=p.frames;
      });
      if(piece>128){
        this.notification.error("总帧数超过了128","请删除部分片段或者减小片段的帧数吧");
        resolve(false);
      }
      if(piece<16){
        this.notification.error("总帧数要求至少为16","请多添加几个片段后者增大片段的帧数");
        resolve(false);
      }
      let ava = this.framePrompts.filter(p=>p.prompt!=='');
      if(ava.length===0){
        this.notification.error("没有有效的片段","请为片段添加提示词");
        resolve(false);
      }
      if(this.negative_prompt.indexOf(',')===-1) {
        this.notification.error("negative_prompt是必须的，至少提供一个，并且使用','分隔","");
        resolve(false);
      }
      resolve(true);
    })
  }

  async generateVideo() {
    if (!await this.checkParameter()) {
      return;
    }
    this.precheck();
    this.loading = true;
    this.videoUrl = '';
    let novitaTask: NovitaTask | undefined;
    try {
      novitaTask = await this.novitaService.text2Video({
        prompts: this.novitaCheck.filterVideoPrompts(this.framePrompts)!,
        closed_loop: false,
        model_name: this.model!,
        negative_prompt: this.negative_prompt,
        loras: this.novitaCheck.filter(this.loras),
        embeddings: this.novitaCheck.filter(this.embeddings),
        width: this.width,
        height: this.height,
        steps: this.steps,
        seed: this.seeds,
        clip_skip: this.clipSkip,
        guidance_scale: this.guidance_scale
      });
    } catch (error: any) {
      this.loading = false;
      this.notification.error("生成视频失败" + error.message, "");
      return;
    }
    if (novitaTask === undefined) {
      this.loading = false;
      return;
    }
    console.log("DEBUG: task_id: "+novitaTask.task_id);
    console.log(novitaTask)
    if(novitaTask.task_id==="null"){
      this.notification.error("生成视频失败,task_id=null","");
      return;
    }
    let generateTask: GenerateTask = {
      task_id: novitaTask.task_id,
      account_id: this.authService.user!.id,
      date: new Date(),
      task_type: "video"
    };
    this.universalService.addOrUpdateGenerateTask(generateTask).then(t => {
      this.notification.info("获取到task_id", "");
    });
    let taskResult: TaskResult | undefined;
    let first = true;
    let wait = 1000;
    while (taskResult === undefined || taskResult.videos == null || taskResult.videos.length === 0) {
      if (!first) {
        console.log("wait " + wait + " ms")
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("wait out")
      }
      first = false;
      try {
        taskResult = await this.novitaService.novitaTask(novitaTask!.task_id!);
      } catch (error: any) {
        this.loading = false;
        this.notification.error("获取任务结果失败", "");
        return;
      }
    }
    generateTask.taskResult = taskResult;
    this.universalService.addOrUpdateGenerateTask(generateTask).then(c => {
      this.notification.info("存储响应结果", "");
    });
    this.loading = false;
    this.changeVideoSrc(taskResult.videos[0].video_url!);
  }
  changeVideoSrc(newSrc: string) {
    this.showVideo = false;
    setTimeout(() => {
      this.videoUrl = newSrc;
      this.showVideo = true;
    });
  }
  showVideo: boolean = true;
  nsfw: boolean = false;

  addNewSection() {
    this.framePrompts.push({
      frames: 8,
      prompt: ''
    })
  }

  awareDelete($event: number) {
    this.framePrompts.splice($event, 1);
  }

  showVideoMenu() {

  }
}
