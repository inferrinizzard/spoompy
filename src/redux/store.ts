import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch, type TypedUseSelectorHook, useSelector } from 'react-redux';

import dateReducer from './slices/dateSlice';
import filterReducer from './slices/filterSlice';
import playlistReducer from './slices/playlistSlice';
import searchReducer from './slices/searchSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      playlist: playlistReducer,

      date: dateReducer,
      filter: filterReducer,
      search: searchReducer,
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

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
