import {
	type Action,
	type ThunkAction,
	configureStore,
} from "@reduxjs/toolkit";

import analysisReducer from "./slices/analysisSlice";
import browseReducer from "./slices/browseSlice";
import playlistReducer from "./slices/playlistSlice";
import userReducer from "./slices/userSlice";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeStore = () =>
	configureStore({
		reducer: {
			playlist: playlistReducer,

			analysis: analysisReducer,
			browse: browseReducer,

			user: userReducer,
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
