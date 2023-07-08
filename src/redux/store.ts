import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import analysisReducer from './slices/analysisSlice';
import browseReducer from './slices/browseSlice';
import playlistReducer from './slices/playlistSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      playlist: playlistReducer,

      analysis: analysisReducer,
      browse: browseReducer,
    },
  });

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;