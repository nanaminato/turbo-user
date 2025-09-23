import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {User} from "../../models/accounts";


// login 相关 action 组
export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ username: string; password: string }>(),
    'logout': emptyProps,
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure':props<{ error: any }>()
    // 以后可以加 Logout、LoginSuccess 之类的动作
  }
});

export const dbActions = createActionGroup({
  source: 'db',
  events: {
    "load success": emptyProps()
  }
})
