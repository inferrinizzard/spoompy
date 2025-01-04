import { existsSync, mkdirSync } from "node:fs";

import type SpotifyWebApiNode from "spotify-web-api-node";

import { formatPlaylistName, getPlaylists, downloadPlaylist } from "./playlist";
import { archiveSaved } from "./saved";
import { organise } from "./organise";

export class SpotifyArchiver {
	spotify: SpotifyWebApiNode;
	userId: string;
	date: string;

	constructor(spotify: SpotifyWebApiNode, userId: string) {
		this.spotify = spotify;
		this.userId = userId;
		this.date = new Date().toISOString().replace(/T.*/, "");
	}

	preRun() {
		if (!existsSync(`archive/${this.date}`)) {
			mkdirSync(`archive/${this.date}`);
		}
	}

	async archivePlaylists() {
		this.preRun();

		const playlists = await getPlaylists(this.spotify, this.userId);

		for (const playlist of playlists) {
			await new Promise((resolve) => setTimeout(resolve, 5000));

			let tries = 1;
			while (tries <= 3) {
				try {
					await downloadPlaylist(this.spotify, playlist, this.date);
					break;
				} catch {
					console.log(`${playlist.name} failed on attempt ${tries}, retrying`);
					tries++;
				}
			}
			console.log(`${playlist.name} failed all ${tries} attempts`);
		}
	}

	async archiveSaved() {
		this.preRun();
		return archiveSaved(this.spotify)(this.date);
	}

	organise() {
		organise();
	}
}
