import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ChatHistoryState} from "./chat-history.reducers";

export const selectChatHistoryState = createFeatureSelector<ChatHistoryState>('chatHistory');

export const selectChatHistory = createSelector(
  selectChatHistoryState,
  (state) => state.history,
);
