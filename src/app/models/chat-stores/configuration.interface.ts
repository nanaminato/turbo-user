import {DisplayModel} from "./display.model";


export interface Configuration{
  model: DisplayModel;
  chatConfiguration: ChatStreamConfiguration;
  displayConfiguration: DisplayConfiguration,
  dynamic?: string;
}
export interface DisplayConfiguration{
  fontSize?: string;
}
export const CONFIGURATION = "CONFIGURATION";
export interface ChatStreamConfiguration{
  models: DisplayModel[];
  top_p?: number;
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  historySessionLength: number;
  detail?: string;
}

export interface DynamicConfig{
  systemInfo?: SystemInfoConfig;
  theme?: string;
  language?: string;
  languageIsSet?: boolean;
}
export interface SystemInfoConfig{
  letChoice?: boolean;// 打开新的聊天时让用户选择系统信息
}

