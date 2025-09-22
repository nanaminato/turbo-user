import {inject, Inject, Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {Subject} from "rxjs";
import {Configuration} from "../../models";
import {configurationChangeSubject} from "../../injection_tokens";
import {DisplayModelGenerator} from "../../models";
import {displayModels} from "../../models";
export const timeToWait = 1;
@Injectable({
  providedIn: "root"
})
export class ConfigurationService {
  public configuration: Configuration | undefined;
  dbService: DbService = inject(DbService);
  default_configuration(): Configuration {
    const generator = new DisplayModelGenerator();
    return {
      model: {
        modelName: "gpt-3.5-turbo-16k",
        modelValue: "gpt-3.5-turbo-16k",
        vision: false
      },
      chatConfiguration: {
        models: displayModels,
        historySessionLength: 10,
        top_p: 0.6,
        temperature: 0.6,
        max_completion_tokens: 4000,
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
