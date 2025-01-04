/// <reference types="@types/spotify-api" />
import SpotifyWebApiNode from 'spotify-web-api-node';

import * as dotenv from 'dotenv';
import { SpotifyArchiver } from './archive';
dotenv.config({ path: '.env.local' });

const userId = (12121954989).toString();
const spotify = new SpotifyWebApiNode({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: 'http://localhost:8000',
});

const spotifyArchiver = new SpotifyArchiver(spotify, userId);

await spotifyArchiver.archivePlaylists()
await spotifyArchiver.archiveSaved();
spotifyArchiver.organise();
