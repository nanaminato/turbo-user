import {Inject, Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {Subject} from "rxjs";
import {DatasModule} from "./datas.module";
import {Configuration} from "../../models";
import {configurationChangeSubject} from "../../injection_tokens";
import {RequestType} from "../../models/enumerates";
import {DisplayModelGenerator} from "../../models";
import {displayModels} from "../../models";
export const timeToWait = 1;
@Injectable({
  providedIn: "root"
})
export class ConfigurationService {
  public configuration: Configuration | undefined;
  private initFinish = false;

  constructor(private dbService: DbService,
              @Inject(configurationChangeSubject) private configurationObserver: Subject<Configuration>) {
    this.init();
  }

  public async init() {
    // 先加载默认配置
    this.configuration = this.default_configuration();
    this.initFinish = true;
    // 等待数据库加载存储的配置
    this.dbService.waitForDbInit().then(async () => {
      this.getConfiguration().then((config) => {
        if (config !== undefined) {
          console.info("系统配置加载成功")
          this.configuration = config;
          this.configurationObserver.next(this.configuration);
          console.log("next to observer")
        }else{
          this.dbService.setConfiguration(this.configuration!);
        }
      });
    });
  }



  public async accept() {
    if (this.configuration !== undefined) {
      return true;
    }
    else if(this.initFinish){
      this.configuration = this.default_configuration();
      this.configurationObserver.next(this.configuration);
      return true;
    }
    else {
      await this.waitThisInit();
      return true;
    }
  }

  private async waitThisInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, timeToWait);
      }
    });
  }
  public default_configuration(): Configuration {
    var generator = new DisplayModelGenerator();
    return {
      model: "gpt-3.5-turbo-16k",
      chatConfiguration: {
        models: displayModels,
        historySessionLength: 10,
        top_p: 0.6,
        temperature: 0.6,
        max_tokens: 4000,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      },
      displayConfiguration: {
        fontSize: "14"
      },
      dynamic:""
    };
  }

  async getConfiguration(): Promise<Configuration | undefined> {
    return await this.dbService.getConfiguration();
  }

  async setConfigurationLocal() {
    await this.setConfiguration(this.configuration!);
  }

  async setConfiguration(configuration: Configuration) {
    if (!configuration) return;
    return await this.dbService.setConfiguration(configuration);
  }

  async restoreConfiguration() {
    this.configuration = this.default_configuration();
    await this.setConfigurationLocal();
  }


}
