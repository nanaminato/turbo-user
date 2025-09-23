import {createFeatureSelector, createSelector} from "@ngrx/store";
import {HistoryTitleState} from "./history-title.reducer";

export const selectHistoryTitleState = createFeatureSelector<HistoryTitleState>('historyTitle');

export const selectHistoryTitle = createSelector(
  selectHistoryTitleState,
  (state) => state.historyTitles,
);
