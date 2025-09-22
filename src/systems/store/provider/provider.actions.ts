import {createActionGroup, emptyProps} from "@ngrx/store";

export const providerActions = createActionGroup({
  source: 'provider',
  events: {
    'load': emptyProps(),
    "load success": emptyProps(),
    "load fail": emptyProps(),
  }
});
