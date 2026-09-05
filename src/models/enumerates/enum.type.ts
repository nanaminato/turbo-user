export const details: string[] = [
  "low","high","auto"
]

// 与后端 Turbo.Auth.Application.Providers.HandlerType 保持一致，
// 不可随意改动顺序（数据库中的 SupplierKey.RequestIdentifier 与之一一对应）。
export enum HandlerType {
  Openai = 0,
  Google = 1,
  Anthropic = 2,
  Novita = 3,
  Alibaba = 4,
  Twitter = 5,
  ApiMart = 6
}

export interface ProviderDefinition {
  type: HandlerType;
  displayName: string;
  /** 该供应商是否支持对话（对应 ProviderCatalog.SupportsChat）。 */
  supportsChat: boolean;
}

// 镜像后端 Turbo.Auth.Application.Providers.ProviderCatalog.All。
// 当后端新增供应商时，请同步补全此列表。
export const providerCatalog: ProviderDefinition[] = [
  { type: HandlerType.Openai,    displayName: 'OpenAI',   supportsChat: true  },
  { type: HandlerType.Google,    displayName: 'Google',   supportsChat: true  },
  { type: HandlerType.Anthropic, displayName: 'Anthropic', supportsChat: true },
  { type: HandlerType.Novita,    displayName: 'Novita',   supportsChat: false },
  { type: HandlerType.Alibaba,   displayName: 'Alibaba',  supportsChat: true  },
  { type: HandlerType.Twitter,   displayName: 'Twitter',  supportsChat: false },
  { type: HandlerType.ApiMart,   displayName: 'apiMart',  supportsChat: false }
];

// OpenAI 推理模型专用（o 系列、gpt-5 系列）。后端 OpenAiChatHandler 会按模型兼容性过滤。
export const reasoningEfforts: string[] = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh'];

// GPT-5 系列专用的 verbosity；后端只在 isGpt5Family 时生效。
export const verbosityLevels: string[] = ['low', 'medium', 'high'];

// Gemini 2.5 系列专用的 thinking_budget，-1 表示动态思考，0 表示不思考。
export const thinkingBudgetPresets: number[] = [-1, 0, 512, 1024, 2048, 4096, 8192, 16384];
