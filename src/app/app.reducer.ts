import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as formUi from './shared/ui.reducer';

export interface State {
    ui: formUi.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: formUi.uiReducer
}

// od razu zwraca state.ui, nie trzeba sie tak odwolywac juz 
export const getUiState = createFeatureSelector<formUi.State>('ui');

export const getIsLoading = createSelector(getUiState, formUi.getIsLoading);