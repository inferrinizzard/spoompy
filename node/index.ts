/* eslint-disable no-loop-func */
/// <reference types="@types/spotify-api" />
import SpotifyWebApiNode from 'spotify-web-api-node';

import { mkdirSync, existsSync } from 'fs';

import { archivePlaylists } from './playlist';
import { archiveSaved } from './saved';
import { organise } from './organise';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const date = new Date().toISOString().replace(/T.*/, '');
if (!existsSync(`archive/${date}`)) {
	mkdirSync(`archive/${date}`);
}

const userId = (12121954989).toString();
const spotify = new SpotifyWebApiNode({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: 'http://localhost:8000',
});

archivePlaylists(spotify)(userId, date).then(
	() => archiveSaved(spotify)(date)).then(
		() => organise()
);
