import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Configuration} from "../../../models";

export const configurationActions = createActionGroup({
  source: 'configuration',
  events: {
    // 主动触发更新的 action，携带 boolean
    'load': emptyProps(),
    "load success": props<{ config: Configuration }>(),
    'load failure': emptyProps(),
    'config update': props<{ config: Configuration }>()
    // 以后你可以这里添加更多的 systemPrompt 相关 action
  }
});
