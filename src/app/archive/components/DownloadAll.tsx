"use client";

import { useAppSelector } from "@/redux/client";
import { selectPlaylists } from "@/redux/slices/playlistSlice";
import { Button } from "@/styles/primitives";

export interface DownloadAllProps {}

export const DownloadAll: React.FC<DownloadAllProps> = () => {
	const playlists = useAppSelector(selectPlaylists);

	return (
		<div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
			<h2>{`Total Number of Playlists: ${Object.keys(playlists).length}`}</h2>
			<Button>{"Download All"}</Button>
			{/* TODO: downloads */}
			<Button>{"Download Selected"}</Button>
		</div>
	);
};

export default DownloadAll;
