"use client";

import { useMemo } from "react";

import { useAppSelector } from "@/redux/client";
import { selectPlaylists, selectTracks } from "@/redux/slices/playlistSlice";
import {
	selectEndDate,
	selectStartDate,
	selectTimeStep,
} from "@/redux/slices/analysisSlice";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import Count from "@/components/data/Count";
import TextBlock from "@/components/data/TextBlock";

import TimeControls from "./components/TimeControls";
import { useRollingSumOfPlaylists } from "./util";
import styles from "./main.module.css";

export interface AnalysisMainProps {}

export const AnalysisMain: React.FC<AnalysisMainProps> = () => {
	const playlists = useAppSelector(selectPlaylists);
	const tracks = useAppSelector(selectTracks);

	const startDate = useAppSelector(selectStartDate);
	const endDate = useAppSelector(selectEndDate);
	const timeStep = useAppSelector(selectTimeStep);

	const playlistsSlice = useMemo(
		() =>
			Object.values(playlists).map((playlist) => ({
				...playlist,
				tracks: [
					...playlist.tracks.filter((track) => {
						let include = true;

						if (
							startDate &&
							tracks[track].playlists[playlist.id].added_at < startDate
						) {
							include = false;
						}
						if (
							endDate &&
							tracks[track].playlists[playlist.id].added_at > endDate
						) {
							include = false;
						}

						return include;
					}),
				],
			})),
		[startDate, endDate, playlists, tracks],
	);

	const lineChartData = useRollingSumOfPlaylists(playlistsSlice, timeStep);

	return (
		<section>
			<TimeControls />
			<div className={styles.grid}>
				<Count
					caption="Total Tracks"
					value={playlistsSlice.reduce(
						(count, { tracks }) => count + tracks.length,
						0,
					)}
				/>
				<TextBlock caption="Biggest Growing Playlist" text="Test" />
				<BarChart
					data={Object.values(playlistsSlice).reduce(
						(acc, playlist) => ({
							...acc,
							[playlist.id]: playlist.tracks.length,
						}),
						{},
					)}
				/>
				<LineChart datasets={lineChartData} />
				<TextBlock caption="Most Active Month" text="Month" />
			</div>
		</section>
	);
};

export default AnalysisMain;
