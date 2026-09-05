import {Component, ElementRef, inject, Renderer2, ViewChild} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {RouterLink} from "@angular/router";
import {NgStyle} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {ConfigExport} from "./config-export/config-export";
import {ConfigImport} from "./config-import/config-import";
import {NzTooltipModule} from "ng-zorro-antd/tooltip";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DynamicConfigService, LocalizationService, SizeReportService, ThemeSwitcherService} from "../../services/normal-services";
import {Configuration, DynamicConfig} from "../../models";
import {ConfigurationService, DbService} from "../../services/db-services";
import {ModelCenter} from "./model-center/model-center";
import {details, providerCatalog, ProviderDefinition, reasoningEfforts, thinkingBudgetPresets, verbosityLevels} from "../../models/enumerates/enum.type";
import {ServiceProvider} from "../../roots";
import {themeOptions} from '../../themes/theme'
import {selectConfig} from "../../systems/store/configuration/configuration.selectors";
import {Store} from "@ngrx/store";
import {NzMessageService} from "ng-zorro-antd/message";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  standalone: true,
  imports: [
    NzFormModule, NzModalModule, NzCardModule,
    NzButtonModule, NzIconModule, NzPopoverModule,
    NzInputNumberModule, NzSliderModule, FormsModule,
    NzInputModule, RouterLink, NgStyle,
    NzSelectModule, NzSwitchModule, NzSkeletonModule,
    ConfigExport, ConfigImport,
    NzTooltipModule, TranslateModule, ModelCenter,
  ],
})
export class Settings {
  dynamicConfig: DynamicConfig | undefined;
  config: Configuration | null = null;
  store = inject(Store);
  sizeReportService = inject(SizeReportService);
  constructor(
              private themeSwitcherService: ThemeSwitcherService,
              private configurationService: ConfigurationService,
              private notification: NzNotificationService,
              private renderer: Renderer2,
              private translate: TranslateService,
              private localization: LocalizationService,
              private dynamicConfigService: DynamicConfigService,
              private serviceProvider: ServiceProvider,
              private modal: NzModalService,
              private message: NzMessageService,
              private dbService: DbService
              ) {
    this.store.select(selectConfig).subscribe(config => {
      this.config = config;
      if(config){
        this.loadProperties();
      }
    });
  }
  apiUrl(){
    return this.serviceProvider.apiUrl;
  }
  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }

  async resetConfiguration() {
    await this.configurationService.resetConfig()
    this.notification
      .create(
        "success",
        this.localization.text('notifications.resetSuccess'),
        this.localization.text('notifications.settingsResetSuccess')
      );
  }


  async applyChangeRightNow() {
    await this.configurationService.saveConfigToDb(this.config!);
    this.notification
      .create(
        "success",
        this.localization.text('notifications.applySuccess'),
        this.localization.text('notifications.settingsSaved')
      );
  }

  @ViewChild('settingPanel') private settingPanel: ElementRef | undefined;
  inputConfigVisible: boolean = false;
  outputConfigVisible: boolean = false;

  scrollToTop() {
    if (!this.settingPanel) return;
    this.renderer.setProperty(this.settingPanel.nativeElement, 'scrollTop', 0);
  }

  handleInputConfigOk() {
    this.inputConfigVisible = false;
  }

  closeOutput() {
    this.outputConfigVisible = false;
  }

  okAndCloseOutput() {
    this.outputConfigVisible = false;
  }

  handleInputCancel() {
    this.inputConfigVisible = false;
  }

  async handleConfigInput($event: Configuration) {
    this.config = $event;
    await this.configurationService.saveConfigToDb($event);
  }

  protected readonly themeOptions = themeOptions;

  themeChange() {
    this.dynamicConfig!.theme = this.themeSwitcherService.load(this.dynamicConfig!.theme);
    this.dynamicConfigService.setDynamicConfig(this.config!,this.dynamicConfig!);
  }

  languageChange($event: string) {
    this.dynamicConfig!.language = this.localization.use($event);
    this.dynamicConfig!.languageIsSet = true;
    this.dynamicConfigService.setDynamicConfig(this.config!,this.dynamicConfig!);
  }

  protected get displayLanguages() {
    return this.localization.languages;
  }
  modelCenterVisible: boolean = false;

  private loadProperties() {
    let configDynamic = this.dynamicConfigService.getDynamicConfig(this.config!);
    if(configDynamic===undefined){
      this.dynamicConfig = this.dynamicConfigService.getDefaultDynamicConfig();
    }else{
      this.dynamicConfig = configDynamic;
    }
    this.themeChange();
    this.languageChange(this.dynamicConfig.language===undefined?'':this.dynamicConfig.language);
  }

  protected readonly details = details;

  menuVisible() {
    return this.sizeReportService.menuVisible;
  }

  toggleMenu() {
    this.sizeReportService.toggleMenu()
  }

  protected isResetting: unknown;
  protected showResetConfirm() {
    const title = this.translate.instant('settings.resetDataBase');
    const content = this.translate.instant('settings.resetDataBaseConfirm');
    const okText = this.translate.instant('universal.confirm') || 'OK';
    const cancelText = this.translate.instant('universal.cancel') || 'Cancel';

    this.modal.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: okText,
      nzOkDanger: true,
      nzCancelText: cancelText,
      nzOnOk: async () => this.handleReset()
    });
  }

  private async handleReset() {
    this.isResetting = true;
    this.isResetting = false;
    await this.dbService.forceFactoryReset();
    this.message.success(this.localization.text('notifications.databaseResetSuccess'));
  }

  // —— 新版 OpenAI / 多供应商对话参数 ——
  // 这些选项在 Settings 中以可选形式存在；存到 IndexedDB 后由 TurboService.fetchChat 透传。
  // 后端的 OpenAiChatHandler 与 GoogleChatHandler 已兼容：
  //  - reasoning_effort：OpenAI 推理模型 (o 系列、gpt-5 系列)
  //  - verbosity：GPT-5 系列
  //  - thinking_budget：Gemini 2.5 系列
  // 当目标模型不支持时，后端会忽略对应字段而不会报错。
  protected readonly reasoningEfforts = reasoningEfforts;
  protected readonly verbosityLevels = verbosityLevels;
  protected readonly thinkingBudgetPresets = thinkingBudgetPresets;
  protected readonly providerCatalog: ReadonlyArray<ProviderDefinition> = providerCatalog;

  protected updateReasoningEffort(value: string | null): void {
    if (!this.config) return;
    this.config.chatConfiguration.reasoning_effort = value ?? undefined;
  }

  protected updateVerbosity(value: string | null): void {
    if (!this.config) return;
    this.config.chatConfiguration.verbosity = value ?? undefined;
  }

  protected thinkingBudgetModel(): number | null {
    const value = this.config?.chatConfiguration.thinking_budget;
    if (value === undefined || value === null) return null;
    return value;
  }

  protected updateThinkingBudget(value: number | null): void {
    if (!this.config) return;
    this.config.chatConfiguration.thinking_budget = value === null ? undefined : value;
  }

  protected thinkingBudgetLabel(preset: number): string {
    if (preset === -1) return '-1 (dynamic)';
    if (preset === 0) return '0 (off)';
    return String(preset);
  }
}
