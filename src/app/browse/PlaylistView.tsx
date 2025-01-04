"use client";

import Image from "next/image";

import Block from "@/components/Block";
import { useAppSelector } from "@/redux/client";
import { selectPlaylists } from "@/redux/slices/playlistSlice";
import { Text } from "@/styles/primitives";

import Search from "./components/Search";

export interface PlaylistViewProps {}

export const PlaylistView = () => {
	const playlists = useAppSelector(selectPlaylists);

	return (
		<>
			<div>
				<Search />
			</div>
			<section
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))",
					gap: "1rem",
				}}
			>
				{Object.values(playlists).map((playlist) => (
					<Block key={playlist.id}>
						<Image
							alt={playlist.name}
							height={150}
							src={playlist.images[0].url}
							style={{ aspectRatio: "1/1" }}
							width={150}
						/>
						<Text>{playlist.name}</Text>
					</Block>
				))}
			</section>
		</>
	);
};

export default PlaylistView;
