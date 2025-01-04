import { existsSync, mkdirSync } from 'node:fs';

import SpotifyWebApiNode from 'spotify-web-api-node';

import { archivePlaylists } from './playlist';
import { archiveSaved } from './saved'
import { organise } from './organise';

export class SpotifyArchiver {
	spotify: SpotifyWebApiNode;
	userId: string;
	date: string;

	constructor(spotify: SpotifyWebApiNode, userId: string) {
		this.spotify = spotify;
		this.userId = userId;
		this.date = new Date().toISOString().replace(/T.*/, '')
	}

	preRun() {
		if (!existsSync(`archive/${this.date}`)) {
			mkdirSync(`archive/${this.date}`);
		}
	}

	async archivePlaylists() {
		this.preRun();
		return archivePlaylists(this.spotify)(this.userId, this.date);
	}

	async archiveSaved() {
		this.preRun();
		return archiveSaved(this.spotify)(this.date);
	}

	organise() {
		organise();
	}
}
