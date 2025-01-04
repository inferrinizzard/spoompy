"use client";

import { useState } from "react";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "@/redux/client";
import { selectSlice, selectSort, setSort } from "@/redux/slices/browseSlice";
import {
	selectAlbums,
	selectArtists,
	selectPlaylists,
} from "@/redux/slices/playlistSlice";
import { formatDate } from "@/utils/dateFormat";

import { type PlaylistTrackEntityWithPlaylist } from "../TabularView";

const TableCell = styled.td`
  padding: 0.5rem 1rem;
`;

export interface PlaylistTableProps {
	tracks: PlaylistTrackEntityWithPlaylist[];
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ tracks }) => {
	const dispatch = useAppDispatch();

	const playlists = useAppSelector(selectPlaylists);
	const artists = useAppSelector(selectArtists);
	const albums = useAppSelector(selectAlbums);

	const sort = useAppSelector(selectSort);
	const slice = useAppSelector(selectSlice);

	const [flags, setFlags] = useState({
		showId: false,
		showUserId: false,
	});

	const handleSort = (column: string) => {
		const nextSort = () => {
			if (sort?.column === column) {
				if (sort.asc) {
					return { column, asc: false };
				}
				return undefined;
			}
			return { column, asc: true };
		};

		dispatch(setSort(nextSort()));
	};

	const getSortIcon = (column: string) =>
		sort?.column === column ? (sort.asc ? "▲" : "▼") : "";

	const playlistSlice = tracks.slice(
		slice.index * slice.size,
		(slice.index + 1) * slice.size,
	);

	return (
		<table style={{ width: "100%" }}>
			<thead>
				<tr>
					<th>{"Playlist"}</th>
					<th onClick={() => handleSort("name")}>
						{"Name" + getSortIcon("name")}
					</th>
					<th onClick={() => handleSort("artists")}>
						{"Artists" + getSortIcon("artists")}
					</th>
					<th onClick={() => handleSort("album")}>
						{"Album" + getSortIcon("album")}
					</th>
					<th onClick={() => handleSort("time")}>
						{"Date Added" + getSortIcon("time")}
					</th>
					{flags.showId && <th>{"ID"}</th>}
					{flags.showUserId && <th>{"Added by"}</th>}
				</tr>
			</thead>
			<tbody>
				{playlistSlice.map((track) => (
					<tr key={track.playlist + track.id}>
						<TableCell>{playlists[track.playlist].name}</TableCell>
						<TableCell>{track.name}</TableCell>
						<TableCell>
							{track.artists.map((id) => artists[id].name).join(", ")}
						</TableCell>
						<TableCell>{albums[track.album].name}</TableCell>
						<TableCell style={{ whiteSpace: "nowrap" }}>
							{formatDate(new Date(track.added_at), "day")}
						</TableCell>
						{flags.showId && <TableCell>{track.id}</TableCell>}
						{flags.showUserId && <TableCell>{track.added_by}</TableCell>}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default PlaylistTable;
