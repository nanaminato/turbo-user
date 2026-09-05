import {DisplayModel} from "./display.model";
import {ThemeId} from '../../themes/theme';


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
  max_completion_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  historySessionLength: number;
  detail?: string;

  /**
   * 推理努力程度。适用于 OpenAI 推理模型（o 系列、gpt-5 系列）。
   * 支持值：none / minimal / low / medium / high / xhigh。
   * 未配置（undefined）或与模型不兼容时，后端会自动忽略。
   */
  reasoning_effort?: string | null;

  /**
   * 输出详细度。仅适用于 GPT-5 系列模型。
   * 支持值：low / medium / high。
   */
  verbosity?: string | null;

  /**
   * Gemini 2.5 系列思考预算（thinking_budget）。
   * -1 = 动态思考；0 = 不限制；其他正数表示具体预算。
   * `null` 或 `undefined` 表示不传该字段。
   */
  thinking_budget?: number | null;
}

export interface DynamicConfig{
  systemInfo?: SystemInfoConfig;
  theme?: ThemeId;
  language?: string;
  languageIsSet?: boolean;
}
export interface SystemInfoConfig{
  letChoice?: boolean;// 打开新的聊天时让用户选择系统信息
}
