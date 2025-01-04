"use client";

import React, { useEffect, useRef } from "react";

import store, { AppState } from "../store";
import { preloadState } from "../actions";

export interface PreloaderProps {
	readonly state: AppState;
}

const Preloader: React.FC<PreloaderProps> = ({ state }) => {
	const loaded = useRef(false);

	useEffect(() => {
		if (state.user.isAuthed && !store.getState().user.isAuthed) {
			// preloaded again after cold start auth
			store.dispatch(preloadState(state));
			loaded.current = true;
		} else if (!loaded.current) {
			// preload on default start;
			store.dispatch(preloadState(state));
			loaded.current = true;
		}
	}, [state]);

	return null;
};

export default Preloader;
