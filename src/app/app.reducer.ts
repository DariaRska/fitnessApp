import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
    // training reducer w training.module - przez lazy loading
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer,
}

// od razu zwraca state.ui, nie trzeba sie tak odwolywac juz 
export const getUiState = createFeatureSelector<fromUi.State>('ui');

export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);