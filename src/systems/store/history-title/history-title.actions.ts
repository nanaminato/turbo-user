import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {ChatHistoryTitle} from "../../../models";

export const historyTitleActions = createActionGroup({
  source: 'historyTitle',
  events: {
    // 主动触发更新的 action，携带 boolean
    'load from db': emptyProps(),
    'load from http': emptyProps(),
    "load success":  props<{ historyTitles: ChatHistoryTitle[] }>(),
    'load failure': emptyProps(),
    // 以后你可以这里添加更多的 systemPrompt 相关 action
  }
});
