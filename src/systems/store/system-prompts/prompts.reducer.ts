// system-prompts.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {SystemPromptItem} from "../../../models";
import {systemPromptActions} from "./prompts.actions";

export interface SystemPromptsState {
  systemPrompts: SystemPromptItem[] | undefined;
  loaded: boolean;
  error: any;
}

export const initialState: SystemPromptsState = {
  systemPrompts: [],
  loaded: false,
  error: null,
};

export const systemPromptsReducer = createReducer(
  initialState,
  on(systemPromptActions.load, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(systemPromptActions.loadSuccess, (state, { systemPrompts }) => ({
    ...state,
    loaded: true,
    systemPrompts: systemPrompts,
  })),
);
