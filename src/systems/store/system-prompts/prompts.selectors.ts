import {createFeatureSelector, createSelector} from "@ngrx/store";
import {SystemPromptsState} from "./prompts.reducer";

export const selectPromptsState = createFeatureSelector<SystemPromptsState>('prompts');

export const selectPrompt = createSelector(
  selectPromptsState,
  (state) => state.systemPrompts
);
