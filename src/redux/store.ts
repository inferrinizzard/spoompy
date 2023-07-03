import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';

import analysisReducer from './slices/analysisSlice';
import browseReducer from './slices/browseSlice';
import playlistReducer from './slices/playlistSlice';

export const makeStore = wrapMakeStore(() =>
  configureStore({
    reducer: {
      playlist: playlistReducer,

      analysis: analysisReducer,
      browse: browseReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          subtrees: ['playlist'],
        })
      ),
  })
);

const store = makeStore({});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
