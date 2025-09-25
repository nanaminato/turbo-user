import {createReducer, on} from "@ngrx/store";
import {historyTitleActions} from "./history-title.actions";
import {ChatHistoryTitle} from "../../../models";

export interface HistoryTitleState {
  historyTitles: ChatHistoryTitle[];
}

export const initialState: HistoryTitleState = {
  historyTitles: [],
};

export const historyTitleReducer = createReducer(
  initialState,
  on(historyTitleActions.loadSuccess, (state, { historyTitles }) => ({
    ...state,
    historyTitles,
  })),
  on(historyTitleActions.clear, () => ({
    ...initialState
  }))
);
