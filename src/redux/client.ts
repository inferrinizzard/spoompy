import { useDispatch, type TypedUseSelectorHook, useSelector } from 'react-redux';
import { type AppDispatch, type AppState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
