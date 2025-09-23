import { createFeatureSelector, createSelector } from '@ngrx/store';
import {ConfigurationState} from "./configuration.reducer";

export const selectConfigurationState = createFeatureSelector<ConfigurationState>('config');

export const selectConfig = createSelector(
  selectConfigurationState,
  (state) => state.config
);
