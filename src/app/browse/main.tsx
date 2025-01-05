"use client";

import React, { useState } from "react";

import { Button } from "@/styles/primitives";

import TabularView from "./TabularView";
import PlaylistView from "./PlaylistView";

export interface BrowseProps {}

const BrowseMain: React.FC<BrowseProps> = () => {
	const [view, setView] = useState<"tabular" | "playlist">("tabular");

	return (
		<>
			<Button
				onClick={() => {
					view === "playlist" ? setView("tabular") : setView("playlist");
				}}
			>
				{"Switch View"}
			</Button>
			{view === "playlist" && <PlaylistView />}
			{view === "tabular" && <TabularView />}
		</>
	);
};

export default BrowseMain;
