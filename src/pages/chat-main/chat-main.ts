import {Component, ElementRef, inject, Inject, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {NzUploadFile, NzUploadModule} from "ng-zorro-antd/upload";
import {map, Observable, Observer, Subject, Subscription} from "rxjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ModelEditor} from "./model-editor/model-editor";
import {SystemWordChoice} from "./system-word-choice/system-word-choice";
import {SystemPromptManager} from "./system-prompt-manager/system-prompt-manager";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NgTemplateOutlet} from "@angular/common";
import {ModelSelector} from "./model-selector/model-selector";
import {Dialogue} from "../dialogue/dialogue";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {
  ChatContext,
  ContextMemoryService,
  ModelFetchService,
  SizeReportService,
  SystemContext
} from "../../services/normal-services";
import {
  backChatHistorySubject,
  chatSessionSubject,
  configurationChangeSubject,
} from "../../injection_tokens";
import {
  AssistantRole,
  ChatHistoryModel,
  ChatHistoryTitle, ChatInterface,
  ChatModel,
  ChatPacket,
  Configuration,
  FileAdds,
  LastSessionModel,
  SystemPromptItem,
  SystemRole,
  UserRole
} from "../../models";
import {ChatDataService, ConfigurationService, HistoryTitleService} from "../../services/db-services";
import {TaskType, UserTask} from "../../models/operations";
import {ErrorType, ResponseError} from "../../errors";
import {ParseService} from "../../services/fetch_services";
import { forkJoin } from 'rxjs';
import {AuthService, RequestManagerService, SendManagerService} from "../../auth_module";
import {MenuAbleService} from "../../services/normal-services/menu-able.service";
import {Bs64Handler, ChatContextHandler} from "../../services/handlers";
import {RequestType} from "../../models/enumerates";
import {NzTooltipModule} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.html',
  styleUrl: './chat-main.css',
  standalone: true,
  imports: [
    NzModalModule,
    ModelEditor,
    SystemWordChoice,
    SystemPromptManager,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    ModelSelector,
    NgTemplateOutlet,
    Dialogue,
    NzUploadModule,
    NzTooltipModule,
    NzInputModule,
    FormsModule,
    NzImageModule,
    NzSkeletonModule,
    TranslateModule,
    IonicModule,
  ],
  providers: [
  ]
})
export class ChatMainComponent implements OnDestroy{

  async parseAllFile(userModel: ChatModel):Promise<boolean>{
    if(userModel.fileList===undefined||userModel.fileList.length===0) return true;
    let sendList = userModel.fileList.filter(f=>!f.fileType?.startsWith("image"));
    const parseObservables =
      sendList.map(f => this.parseService.parse(f));
    if(parseObservables.length===0) return true;
    try {
      const parsedContents = await forkJoin(parseObservables).pipe(
        map(results => {
          for (let i = 0; i < sendList.length; i++) {
            sendList[i].parsedContent = results[i].content;
          }
          return true;
        })
      ).toPromise();

      return parsedContents!;
    } catch (error) {
      console.error('发生错误：', error);
      return false;
    }
  }
  async askGPT() {
    if (this.chatHistoryModel === undefined) {
      this.chatHistoryModel = new ChatHistoryModel();
    }
    this.answering = true;

    //构建请求文件列表
    await this.buildFileList();
    // console.log(this.fileList)

    // 添加用户请求

    const randomId = Date.now()*1000 + Math.floor(Math.random() * 500) + 1;
    const userModel = new ChatModel("user", this.inputText,
      this.chatFileList, randomId,true,this.configuration!.model.modelValue);
    this.chatModels.push(userModel);
    let parseStatus = await this.parseAllFile(userModel);//!!!!!

    if(!parseStatus){
      return;
    }
    // 如果当前的上下文指针为空，就设置上一条为当前上下文的指针，该指针指示最后一条将要包含到上下文中的对话的id
    if (this.chatContext.pointer === undefined) {
      this.chatContext.pointer = userModel.dataId;
      this.awareContextChange();
    }
    // console.log("point 1")
    let fetchParam: ChatPacket
      = this.resolveContext(this.chatContext.pointer,undefined);
    // 添加返回的 聊天信息模型
    const assistantModel = new ChatModel(AssistantRole);
    assistantModel.finish = false;
    assistantModel.reRandom();
    assistantModel.model = this.configuration!.model.modelValue;
    this.chatModels.push(assistantModel);
    //  构建新的滚动 订阅
    this.scrollSubject = new Subject<boolean>();
    this.scrollSubscribe();
    this.nextSubscribe(true);
    // console.log("point 2")
    // 如果当前的聊天历史模型的标题为空，说明使用的是刚创建的，还没有消息，存储到数据库，
    // 设置nextSubjection为true表示将会推送一个新的历史记录
    this.handleTitleWhenNewResponse(userModel);
    this.inputText = '';// 清空输入框
    let response: Observable<string> = this.modelFetchService.getFetchResponse(fetchParam);
    // 订阅返回的数据
    this.animalModel = assistantModel;
    this.responseSubscription = this.subscriptionResponse(response,assistantModel);
  }
  handleTitleWhenNewResponse(model: ChatModel){
    if (this.chatHistoryModel?.title === '') {
      if(this.inputText===''){
        if(this.chatFileList.length>=1){
          this.chatHistoryModel.title = this.chatFileList[0].fileName.substring(0,25);
        }else{
          this.chatHistoryModel.title = "哪里出现了问题";
        }
      }else{
        this.chatHistoryModel.title = this.inputText.substring(0,25);
      }
      this.chatHistoryService.putHistoryTitles({
        dataId: this.chatHistoryModel.dataId!,
        title: this.chatHistoryModel.title,
        userId: this.auth.user?.id!
      }).then(()=>{
        this.sendManagerService.sendHistory({
          dataId: this.chatHistoryModel!.dataId!,
          title: this.chatHistoryModel!.title,
          userId: this.auth.user?.id!
        }).then((msg:any)=>{
          this.sendManagerService.sendMessage(this.chatHistoryModel!.dataId!,model as ChatInterface);
        })
      })
      this.notifyChatHistoryIdentifier = true;
    }else{
      this.sendManagerService.sendMessage(this.chatHistoryModel!.dataId!,model as ChatInterface);
    }
  }
  subscriptionResponse(subject: Observable<string>, model: ChatModel): Subscription{
    let collector = '';
    model.content = '';
    return subject!.subscribe({
      next: (data: any) => {
        collector += data;
        model.content = collector;
        this.nextSubscribe(true);
      },
      error: (error: ResponseError) => {
        if(error.type===ErrorType.NotAuthorize){
          model.content = '';
          model.content += `请获取具备vip身份的账号，并且登录。（未经授权的请求）`;
        }else{
          model.content += '其他错误（中断，或者无服务）';
        }

        model.finish = true;
        this.nextSubscribe(false);
        this.answering = false;
        this.finalizeResponse();
        this.sendManagerService.updateMessage(this.chatHistoryModel?.dataId!,model as ChatInterface)
          .then(msg=>{
          console.log(msg)
          });
      },
      complete: () => {
        this.answering = false;
        model.finish = true;
        this.sendManagerService.updateMessage(this.chatHistoryModel?.dataId!,model as ChatInterface)
          .then(msg=>{
            console.log(msg)
          });
        this.finalizeResponse();
      }
    });
  }

  // 一个相应的生命周期的结束，清空 文件列表，结束滚动订阅
  //
  finalizeResponse() {
    this.fileList = []
    this.chatFileList = []
    for(let model of this.chatModels){
      if(model.content===undefined||model.content.length===0){
        model.content = '终止响应';
      }
      model.finish = true;
    }
    this.scrollSubject?.complete();
    if (this.responseSubscription&&!this.responseSubscription.closed) {
      if(this.animalModel){
        this.animalModel.finish = true;
      }
      this.responseSubscription.unsubscribe();
    }
    this.syncHistorySession();
  }
  syncHistorySession(): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.chatDataService.putHistory(this.chatHistoryModel!).then(() => {
        if (this.notifyChatHistoryIdentifier) {
          this.backHistoryObserver.next({
            dataId: this.chatHistoryModel!.dataId!,
            title: this.chatHistoryModel!.title,
            userId: this.auth.user?.id!
          })
          this.notifyChatHistoryIdentifier = false;
        }
        resolve("同步数据到本地数据库成功");
      });
    })
  }

  nextSubscribe(data: boolean) {
    if (this.answering) {
      this.scrollSubject?.next(data);
    }
  }

  scrollSubscribe() {
    this.scrollSubject?.subscribe({
      next: () => {
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.responseSubscription) {
      this.responseSubscription.unsubscribe();
    }
    for(let subscription of this.responseHolder){
      if(subscription&&!subscription.closed){
        subscription.unsubscribe();
      }
    }
  }

  async typeControlGPT() {
    if (this.answering) {
      return;
    } else {
      this.askGPT();
    }
  }

  async buttonControlGPT() {
    if (this.answering) {
      this.answering = false;
      this.finalizeResponse();
    } else {
      this.askGPT();
    }
  }

  configuration: Configuration | undefined;
  fileList: NzUploadFile[] = [];
  inputText: string = '';
  animalModel: ChatModel | undefined;
  scrollSubject: Subject<boolean> | undefined;
  chatFileList: FileAdds[] = [];
  private _chatHistoryModel: ChatHistoryModel | undefined;

  get chatHistoryModel(): ChatHistoryModel | undefined {
    return this._chatHistoryModel;
  }

  set chatHistoryModel(value: ChatHistoryModel | undefined) {
    this._chatHistoryModel = value;
    this.chatModels = this._chatHistoryModel?.chatList?.chatModel!;
  }
  initSession = false;
  chatModels: ChatModel[] = [];
  answering: boolean = false;
  notifyChatHistoryIdentifier: boolean = false;
  responseSubscription: Subscription | undefined;
  responseHolder: Subscription[] = [];
  chatContext: ChatContext;

  findLatestTrueRequest(lastId: number): ChatModel | undefined{
    let index = this.chatModels.findIndex(m=>m.dataId===lastId);
    for(let id = index;id>=0;id--){
      let model = this.chatModels[id];
      if(model.role===UserRole||model.role===SystemRole){
        return this.chatModels[id];
      }
    }
    return undefined;
  }
  findNextAssistantModel(id: number):ChatModel | undefined{
    let index = this.chatModels.findIndex(m=>m.dataId === id);
    for(let i = index+1;i<this.chatModels.length;i++){
      let model = this.chatModels[i];
      if(model.role===AssistantRole){
        return model;
      }
    }
    return undefined;
  }

  async reGenerateHandle($event: number) {
    // tackle since model
    let reModel = this.chatModels.find(m=>m.dataId===$event);
    if(reModel===undefined){
      this.notification.error("列表中不存在","");
      return;
    }
    if(reModel.role===SystemRole){
      this.notification.error("不允许的操作","不要重新生成 系统级prompt。");
      return;
    }
    let parseStatus = await this.parseAllFile(reModel);//!!!!!

    if(!parseStatus){
      return;
    }
    let generateModel: ChatModel | undefined;
    if(reModel.role===AssistantRole){
      generateModel = reModel;
    }else{
      generateModel = this.findNextAssistantModel(reModel.dataId!);
      if(generateModel===undefined){
        generateModel = new ChatModel(AssistantRole);
        generateModel.finish = false;
        generateModel.model = reModel.model;
        generateModel.dataId = reModel.dataId;
        generateModel.reRandom();
        let index = this.chatModels.findIndex(m=>m.dataId===reModel!.dataId);
        this.chatModels.splice(index+1,0,generateModel);
      }
    }
    // 向上查找 用户model，作为 聊天的完成对象
    let endPointerModel = this.findLatestTrueRequest($event);
    if(endPointerModel===undefined){
      this.notification.error("在该消息之前找不到用户信息或者系统信息","");
      return;
    }
    // 添加用户请求
    let back: number | undefined;
    // back 指针，是为了进行细粒度控制上下文引入的指针，
    // 如果上下文后指针为空，就设置当前 “重新生成”的
    // 后指针为 查找到的上一条用户模型的id（指针就是一个id）
    if(this.chatContext.pointer === undefined || this.chatContext.pointer > endPointerModel.dataId!){
      back = endPointerModel.dataId;
    }else{
      back = this.chatContext.pointer;
    }
    let fetchParam: ChatPacket
      = this.resolveContext(back,endPointerModel.dataId,endPointerModel);
    // 添加返回的 聊天信息模型
    generateModel!.finish = false;
    generateModel!.markAsChanged = true;

    let response: Observable<string> = this.modelFetchService.getFetchResponse(
      fetchParam,generateModel!.model);
    // 订阅返回的数据
    let animalSubscription = this.subscriptionResponse(response,generateModel!);
    this.responseHolder.push(animalSubscription);
  }
  @ViewChild('chatPanel') private chatPanel: ElementRef | undefined;

  clearContext() {
    this.chatContext.pointer = undefined;
    this.notification.success("清空上下文", "清除成功");
    this.awareContextChange();
  }

  isActive(chat: ChatModel) {
    if(chat.role===SystemRole){
      if(this.chatContext.pointer===undefined){
        let id = chat.dataId;
        let sys = this.chatContext.systems?.find(s=>s.id===id);
        if(sys!==undefined){
          return sys.in;
        }else{
          return false;
        }
      }else{
        if(chat.dataId!>= this.chatContext.pointer){
          return true;
        }
        let id = chat.dataId;
        let sys = this.chatContext.systems?.find(s=>s.id===id);
        if(sys!==undefined){
          return sys.in;
        }else{
          return false;
        }
      }
    }else{
      return this.chatContext.pointer !== undefined && chat.dataId! >= this.chatContext.pointer;
    }

  }
  sizeReportService = inject(SizeReportService)
  menuAbleService = inject(MenuAbleService);
  chatContextHandler = inject(ChatContextHandler)
  contextMemoryService = inject(ContextMemoryService);
  render = inject(Renderer2)
  chatDataService = inject(ChatDataService);
  chatHistoryService = inject(HistoryTitleService)
  lastSession = inject(LastSessionModel);
  private configurationService = inject(ConfigurationService);
  notification = inject(NzNotificationService);
  private modelFetchService: ModelFetchService = inject(ModelFetchService);
  private parseService: ParseService = inject(ParseService);
  private auth: AuthService = inject(AuthService);
  private requestManagerService: RequestManagerService = inject(RequestManagerService);
  private sendManagerService: SendManagerService = inject(SendManagerService);
  private bs64Handler: Bs64Handler = inject(Bs64Handler);
  constructor(
              @Inject(chatSessionSubject) private chatSessionObservable: Observable<number>,
              @Inject(backChatHistorySubject) private backHistoryObserver: Observer<ChatHistoryTitle>,
              @Inject(configurationChangeSubject) private configurationObserver: Subject<Configuration>,
  ) {
    this.menuAbleService.enableChat();
    // 添加默认值
    this.chatContext = {
      pointer: undefined,
      systems: [],
      onlyOne: true
    };

    this.configurationObserver.subscribe((configuration)=>{
      this.configuration = configuration;
    });
    // 初始化configuration
    this.configuration = this.configurationService.configuration!;
    this.chatSessionObservable.subscribe(async (dataId) => {
      this.initSession = false;
      console.info(`切换会话: 会话Id: ${dataId}`)
      this.sync(dataId).then(()=>{
        let chatContext = this.contextMemoryService.getValue(dataId);
        this.inputChatContext(chatContext);
      });
    })
    if (this.chatHistoryModel === undefined && this.lastSession.sessionId) {
      this.initSession = false;
      this.sync(this.lastSession.sessionId).then(async ()=>{
        let chatContext = this.contextMemoryService.getValue(this.lastSession.sessionId!);
        this.inputChatContext(chatContext);
      });
    }
  }
  resolveContext( startPointer: number|undefined = undefined, endPointer: number | undefined = undefined, reModel: ChatModel | undefined = undefined) {
    if (this.chatModels === undefined) {
      console.log("未知错误")
    }
    let messages = this.chatContextHandler.handler(
      startPointer,
      this.configurationService.configuration!,
      this.chatModels,
      endPointer
    );
    // 添加指针之前的系统消息
    this.chatContextHandler.handlerBefore(
      this.chatContext,
      this.chatModels,
      messages
    );
    return new ChatPacket(messages);
  }
  async sync(dataId: number) {
    if (dataId === this.lastSession.sessionId) {
    } else {
      // console.log("will open by observer " + dataId)
    }
    try {
      this.chatDataService.getChatHistory(dataId).then(async (chatHistory)=>{
        if (chatHistory) {
          this.chatHistoryModel = chatHistory;
          this.lastSession.sessionId = dataId;

          let messageIds: number[] = [];
          for(let ms of this.chatHistoryModel.chatList?.chatModel!){
            messageIds.push(ms.dataId!);
          }
          let messages = await this.requestManagerService
            .fetchMessageAndRefreshData(this.chatHistoryModel.dataId!,messageIds);
          if(messages!==undefined&&messages.length>0){
            let ch = await this.chatDataService.getChatHistory(dataId);
            if (ch) {
              this.chatHistoryModel = ch;
              this.lastSession.sessionId = dataId;
            } else {
              this.chatHistoryModel = new ChatHistoryModel();
              this.chatHistoryModel.userId = this.auth.user?.id;
              this.lastSession.sessionId = this.chatHistoryModel.dataId;
            }
            // 本地加载，联网同步，（填充到本地），本地加载
          }
        } else {
          this.chatHistoryModel = new ChatHistoryModel();
          this.chatHistoryModel.userId = this.auth.user?.id;
          this.lastSession.sessionId = this.chatHistoryModel.dataId;
        }

        this.initSession = true;
      });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      this.initSession = true;
    }
  }

  scrollToBottom(): void {
    if (!this.chatPanel) return;
    try {
      setTimeout(()=>{
        this.render.setProperty(this.chatPanel!.nativeElement, 'scrollTop', this.chatPanel!.nativeElement.scrollHeight);
      },
        200);
    } catch (err) {
      console.error(err);
    }
  }
  editModel: ChatModel | undefined;
  editBeforeModel: ChatModel | undefined;
  awareContextChange(){
    this.contextMemoryService.setValue(this.chatHistoryModel?.dataId!,
      this.chatContext);
  }
  async inputChatContext(chatContext: ChatContext | undefined){
    if(chatContext!==undefined){
      this.chatContext = chatContext;
      if(this.chatContext.systems===undefined){
        this.chatContext.systems = [];
      }
      if(this.chatContext.onlyOne===undefined){
        this.chatContext.onlyOne = true;
      }
    }else{
      this.chatContext = {
        pointer: undefined,
        systems: [],
        onlyOne: true
      };// 更换会话，需要创建新的 会话上下文数据
      await this.waitForSessionInit();
      let ms = this.chatModels.filter(m=>m.role===SystemRole);
      for(let s of ms){
        this.chatContext.systems?.push({
          id: s.dataId!,
          in: false
        });
      }
      if(this.chatContext.onlyOne){
        if(this.chatContext.systems!.length>0){
          this.chatContext.systems![this.chatContext.systems!.length-1].in = true;
        }
      }else{
        for (let s of this.chatContext.systems!){
          s.in = true;
        }
      }
      this.awareContextChange();
    }
  }
  cloneChatModel(model2: ChatModel | undefined){
    return new ChatModel(model2?.role,model2?.content,model2?.fileList,model2?.dataId,model2?.finish,model2?.model);
  }
  handleUserTask($event: UserTask) {
    switch ($event.task){
      case TaskType.edit:
        const i = this.chatHistoryModel?.chatList?.chatModel!.findIndex(item => item.dataId === $event.id);
        if (i !== undefined) {
          this.editModel = this.chatHistoryModel?.chatList?.chatModel![i];
          this.editBeforeModel = this.cloneChatModel(this.editModel);
          this.showModal();
        }
        break;
      case TaskType.asContext:
        this.chatContext.pointer = $event.id;
        this.awareContextChange();
        break;
      case TaskType.delete:
        const index = this.chatHistoryModel?.chatList?.chatModel!.findIndex(item => item.dataId === $event.id);
        if (index !== undefined) {
          let model = this.chatHistoryModel?.chatList?.chatModel![index]!;
          if(model.role===SystemRole){
            this.chatContext.systems = this.chatContext.systems?.filter(si=>si.id!==model.dataId);
          }
          this.chatHistoryModel?.chatList?.chatModel!.splice(index, 1); // 删除符合条件的元素
          this.chatDataService.deleteChatModel($event.id);
          this.sendManagerService.deleteMessage(this.chatHistoryModel?.dataId!,$event.id).then((msg:string)=>{
            console.log(msg)
          });
        }
        this.chatDataService.putHistory(this.chatHistoryModel!).then(()=>{
        });
        break;
      default:
        break;
    }
  }
  isVisible: boolean = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    // console.log(this.editModel);
    // console.log(this.editBeforeModel);
    if(this.editModel===undefined || this.editBeforeModel===undefined) return;
    if(this.editBeforeModel?.content!==this.editModel?.content){
      this.editModel!.markAsChanged = true;
      console.log(this.notifyChatHistoryIdentifier)
      this.sendManagerService.updateMessage(this.chatHistoryModel!.dataId!,this.editModel! as ChatInterface)
        .then((msg: string)=>{
          console.log(msg)
        });
      this.syncHistorySession().then((msg: any)=>{
        console.log(msg);
        // console.log(this.chatHistoryModel);
      });
    }
    this.handleFinalization();
    /// 暂时的替代品

  }
  handleFinalization(){
    this.editModel = undefined;
    this.editBeforeModel = undefined;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.handleFinalization();
  }

  showLogo() {
    return this.chatHistoryModel===undefined || this.chatHistoryModel.chatList?.chatModel?.length===0;
  }
  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }

  enableTouch() {
    // 正在回复 | 没有在回复，内容不为空 |  模型为转录或者tts，且添加了文件
    return this.answering || (!this.answering && this.inputText != '') ||
      (this.fileList.length > 0);
  }

  isFade() {
    return !this.enableTouch();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  async buildFileList() {
    // 构建非图像文件
    const promises = this.fileList.map((file) => this.readFile(file));
    await Promise.all(promises);
  }

  readFile(file: NzUploadFile): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if(file.type?.startsWith("image")){
          const base64String = reader.result as string;
          const afile: FileAdds = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileContent: base64String,
          };
          this.chatFileList.push(afile);
        }else {
          const arrayBuffer = reader.result as ArrayBuffer;
          const base64String = this.bs64Handler.arrayBufferToBase64(arrayBuffer);
          const afile: FileAdds = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileContent: base64String,
          };
          this.chatFileList.push(afile);
        }
        resolve();
      };

      if (file) {
        if(file.type?.startsWith("image")){
          // @ts-ignore
          reader.readAsDataURL(file);
        }else{
          // @ts-ignore
          reader.readAsArrayBuffer(file);

        }

      }
    });
  }


  protected readonly RequestType = RequestType;
  showChoice: boolean = false;

  addSystemInfo() {
    this.choiceVisible = true;
  }

  manageSystemContext() {
    this.systemPromptManagerVisible = true;
  }

  choiceVisible: boolean = false;

  handleSystemPromptChoice($event: SystemPromptItem | undefined) {
    if($event!==undefined){
      if (this.chatHistoryModel === undefined) {
        this.chatHistoryModel = new ChatHistoryModel();
      }
      let model = new ChatModel(SystemRole,$event.content,
      );
      let systemContext: SystemContext = {
        id: model.dataId!,
        in: true
      };
      if(this.chatContext.onlyOne){
        for(let system of this.chatContext.systems!){
          system.in = false;
        }
      }
      // 将之前的系统信息移除上下文
      this.chatContext.systems!.push(systemContext);
      this.chatModels.push(model);
      /// make it stable for system ms!.
      if(this.chatHistoryModel.title===undefined||this.chatHistoryModel.title===''){
        this.chatHistoryModel.title = model.content;
        this.chatHistoryService.putHistoryTitles({
          dataId: this.chatHistoryModel.dataId!,
          title: this.chatHistoryModel.title,
          userId: this.auth.user?.id!
        }).then(()=>{
          this.sendManagerService.sendHistory({
            dataId: this.chatHistoryModel!.dataId!,
            title: this.chatHistoryModel!.title,
            userId: this.auth.user?.id!
          }).then((msg)=>{
            this.sendManagerService.sendMessage(this.chatHistoryModel!.dataId!,model as ChatInterface)
              .then((msg)=>{
                console.log(msg)
              })
          })
        })

      }
      this.syncHistorySession(); /// not check
      this.awareContextChange();
    }
  }

  handleChoiceClose() {
    this.choiceVisible = false;
    this.showChoice = false;
  }

  systemPromptManagerVisible: boolean = false;
  handleManagerClose() {
    this.systemPromptManagerVisible = false;
    this.showChoice = false;
  }
  private async waitForSessionInit() {
    return new Promise<void>((resolve)=>{
      if(this.initSession){
        resolve();
      }else{
        const interval = setInterval(()=>{
          if(this.initSession){
            clearInterval(interval);
            resolve();
          }
        },10)
      }
    });
  }


  superMini() {
    return this.sizeReportService.superMiniView();
  }
  @ViewChild('promptBox', { static: true })
  promptBox: ElementRef | undefined;
  insertCodeFlags() {
    if(!this.promptBox){
      return;
    }
    const textarea = this.promptBox.nativeElement;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const newText = textarea.value.substring(0, textarea.selectionStart) + '```\n' + selectedText + '\n```' + textarea.value.substring(textarea.selectionEnd);
    this.inputText = newText;
  }

  insertInlineCodeFlags(){
    if(!this.promptBox){
      return;
    }
    const textarea = this.promptBox.nativeElement;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const newText = textarea.value.substring(0, textarea.selectionStart) + '`' + selectedText + '`' + textarea.value.substring(textarea.selectionEnd);
    this.inputText = newText;
  }
}
