import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from "react-redux";

import { type AppDispatch, type AppState } from "./store";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
