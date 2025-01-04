import { existsSync, mkdirSync } from "node:fs";

import type SpotifyWebApiNode from "spotify-web-api-node";

import { formatPlaylistName, getPlaylists, downloadPlaylist } from "./playlist";
import { archiveSaved } from "./saved";
import { organise } from "./organise";
import { readdir } from "node:fs/promises";

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

	async archivePlaylists(force = false) {
		this.preRun();

		const playlists = await getPlaylists(this.spotify, this.userId);

		const existing = await readdir(`archive/${this.date}`);

		for (const playlist of playlists) {
			if (
				existing.some((file) =>
					file.includes(formatPlaylistName(playlist.name)),
				) &&
				!force
			) {
				console.log(`${playlist.name} exists, skipping`);
				continue;
			}

			await new Promise((resolve) => setTimeout(resolve, 5000));

			let tries = 1;
			while (tries <= 3) {
				try {
					await downloadPlaylist(this.spotify, playlist, this.date);
					tries = -1;
					break;
				} catch {
					console.log(`${playlist.name} failed on attempt ${tries}, retrying`);
					tries++;
				}
			}
			if (tries > 0) {
				console.log(`${playlist.name} failed all ${tries} attempts`);
			}
		}
	}

	async archiveSaved(force = false) {
		this.preRun();

		if (existsSync(`archive/${this.date}/saved.json`) && !force) {
			return;
		}

		return archiveSaved(this.spotify)(this.date);
	}

	organise() {
		organise();
	}
}
