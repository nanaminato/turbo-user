// system-prompts.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {SystemPromptItem} from "../../../models";
import {systemPromptActions} from "./prompts.actions";

export interface SystemPromptsState {
  systemPrompts: SystemPromptItem[] | undefined;
}

export const initialState: SystemPromptsState = {
  systemPrompts: [],
};

export const systemPromptsReducer = createReducer(
  initialState,
  on(systemPromptActions.load, (state) => ({
    ...state,
  })),
  on(systemPromptActions.loadSuccess, (state, { systemPrompts }) => ({
    ...state,
    systemPrompts: systemPrompts,
  })),
);
