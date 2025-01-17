"use server";

import { getServerSpotify, serverSpotifyLogout } from "@/spotify/server";

import store from "../../store";
import {
	setAuthStatus,
	setUserDetails,
	setUserPlaylists,
} from "../../slices/userSlice";

export const getUserDetails = async (): Promise<void> => {
	if (store.getState().user.isAuthed) {
		await getServerSpotify()
			.getUserDetails()
			.then((user) => store.dispatch(setUserDetails(user)));
	}
};

export const getUserPlaylists = async (): Promise<void> => {
	const user = store.getState().user;
	if (user.isAuthed && user.userDetails) {
		await getServerSpotify()
			.getUserPlaylists(user.userDetails.id)
			.then((userPlaylists) => store.dispatch(setUserPlaylists(userPlaylists)));
	}
};

export const logOut = async (): Promise<void> => {
	serverSpotifyLogout();

	store.dispatch(setAuthStatus(false));
	store.dispatch(setUserDetails(undefined));
	store.dispatch(setUserPlaylists([]));
};
