// system-prompts.actions.ts
import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {SystemPromptItem} from "../../../models";
export const systemPromptActions = createActionGroup({
  source: 'SystemPrompt',
  events: {
    // 主动触发更新的 action，携带 boolean
    'load': emptyProps(),
    "load success": props<{ systemPrompts: SystemPromptItem[] | undefined }>(),
    'load failure': emptyProps(),
    // 以后你可以这里添加更多的 systemPrompt 相关 action
  }
});
