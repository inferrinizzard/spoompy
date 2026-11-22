"use client";

import { useAppSelector } from "@/redux/client";
import { selectPlaylists } from "@/redux/slices/playlistSlice";

import DownloadAll from "./components/DownloadAll";
import DownloadRow from "./components/DownloadRow";

export interface ArchiveProps {}

export const ArchiveMain: React.FC<ArchiveProps> = () => {
	const playlists = useAppSelector(selectPlaylists);

	return (
		<div>
			<DownloadAll />
			<section>
				{/* flex */}
				{Object.values(playlists).map((playlist) => (
					<DownloadRow key={playlist.id} playlist={playlist} />
				))}
			</section>
		</div>
	);
};

export default ArchiveMain;
