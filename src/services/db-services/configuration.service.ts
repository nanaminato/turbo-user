import {inject, Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {Configuration} from "../../models";
import {displayModels} from "../../models";
export const timeToWait = 1;
@Injectable({
  providedIn: "root"
})
export class ConfigurationService {
  dbService: DbService = inject(DbService);
  default_configuration(): Configuration {
    return {
      model: {
        modelName: "gpt-4.1-mini",
        modelValue: "gpt-4.1-mini",
        vision: false
      },
      chatConfiguration: {
        models: displayModels,
        historySessionLength: 10,
        top_p: 0.6,
        temperature: 0.6,
        max_completion_tokens: 4000,
        presence_penalty: 0.6,
        frequency_penalty: 0.6,
        // 新版 OpenAI 推理模型与多供应商相关字段：
        // undefined 让后端保持现有行为（不动 reasoning_effort/verbosity/thinking_budget）。
        reasoning_effort: undefined,
        verbosity: undefined,
        thinking_budget: undefined
      },
      displayConfiguration: {
        fontSize: "14"
      },
      dynamic:""
    };
  }

  async getConfigFromDb(): Promise<Configuration | undefined> {
    return await this.dbService.getConfiguration();
  }
  // 保存配置到数据库
  async saveConfigToDb(configuration: Configuration) {
    if (!configuration) return;
    return await this.dbService.setConfiguration(configuration);
  }

  // 重置配置
  async resetConfig() {
    let config = this.default_configuration();
    await this.saveConfigToDb(config);
  }


}
