import {Component, inject, Inject} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Observable} from "rxjs";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ExportPrompts} from "./export-prompts/export-prompts";
import {ImportPrompts} from "./import-prompts/import-prompts";
import {CreatePrompt} from "./create-prompt/create-prompt";
import {LookUpdatePrompt} from "./look-update-prompt/look-update-prompt";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {SystemPromptItem} from "../../models";
import {sizeReportToken, systemPromptChangeSubject} from "../../injection_tokens";
import {SizeReportService} from "../../services/normal-services";
import {SystemPromptService} from "../../services/db-services/system-prompt.service";

@Component({
  selector: 'app-prompt-store',
  templateUrl: './prompt-store.html',
  styleUrl: './prompt-store.css',
  imports: [
    NzModalModule,
    ExportPrompts,
    ImportPrompts,
    CreatePrompt,
    LookUpdatePrompt,
    NzButtonModule,
    RouterLink,
    NzIconModule,
    NzCardModule,
    NzFormModule,
    FormsModule,
    NzSkeletonModule,
    NzInputModule,
    TranslateModule,
    IonicModule
  ],
  standalone: true
})
export class PromptStore {
  systemPrompts: SystemPromptItem[] | undefined;
  filterText: string = '';
  sizeReportService: SizeReportService = inject(SizeReportService);
  systemInfoService: SystemPromptService = inject(SystemPromptService);
  notification: NzNotificationService = inject(NzNotificationService);
  constructor(
              @Inject(systemPromptChangeSubject) private promptObservable: Observable<boolean>) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
    for(let item of this.systemPrompts!){
      this.filterPrompts.push(item);
    }
    this.promptObservable.subscribe(()=>{
      this.filter();
    })
  }
  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }
  filterPrompts: SystemPromptItem[] = [];
  filter(){
    this.filterPrompts.length = 0;
    let search = this.filterText.trim();
    for(let item of
      this.systemPrompts!.filter(s=>s.content.includes(search) || s.title!.includes(search))){
      this.filterPrompts.push(item);
    }
  }
  exportVisible: boolean = false;
  importVisible: boolean = false;
  createVisible: boolean = false;
  lookVisible: boolean = false;

  deletePrompt(id: number | undefined) {
    if(id===undefined) return;
    // this.systemPrompts = this.systemPrompts!
    //   .filter(p=>p.id!==id);
    let index = this.systemPrompts?.findIndex(s=>s.id===id);
    if(index===undefined) return;
    this.systemPrompts?.splice(index,1);
    try{
      this.systemInfoService.deletePrompt(id).then(()=>{
        // this.notification.success("删除系统预设信息成功","");
        this.filter();
      });

    }catch (e: any){
      this.notification.error("删除系统预设信息失败",e.toString());
    }
  }

  exportClose() {
    this.exportVisible = false;
    this.filter();
  }

  importClose() {
    this.importVisible = false;
    this.filter();
  }

  createClose() {
    this.createVisible = false;
    this.filter();
  }

  lookClose() {
    this.lookVisible = false;
    this.filter();
  }

  deleteAllFilterPrompts() {
    for(let prompt of this.filterPrompts){
      this.deletePrompt(prompt.id);
    }
  }

  lookPrompt: SystemPromptItem | undefined;
  lookModalOpen(id: number | undefined) {
    if(id===undefined) return;
    let prompt = this.systemPrompts?.find(p=>p.id===id);
    if(prompt===undefined) return;
    this.lookPrompt = prompt;
    this.lookVisible = true;
  }
}
