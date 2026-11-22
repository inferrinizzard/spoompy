"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import {
	selectAuthStatus,
	selectUserPlaylists,
} from "@/redux/slices/userSlice";
import { getAllPlaylists } from "@/redux/actions/client/getPlaylists";

export const DataLoader: React.FC = () => {
	const loaded = useRef(false);

	const isAuthed = useSelector(selectAuthStatus);
	const playlists = useSelector(selectUserPlaylists);

	useEffect(() => {
		if (!isAuthed || playlists.length <= 0) {
			return;
		}

		if (!loaded.current) {
			console.info("[Redux] Start loading user playlists");
			getAllPlaylists(playlists.slice(0, 10)).then(() =>
				console.info(
					`[Redux] Finished, loaded ${playlists.slice(0, 10).length} playlists`,
				),
			);

			loaded.current = true;
		}
	}, [isAuthed, playlists]);

	return null;
};

export default DataLoader;
