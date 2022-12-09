/* eslint-disable no-loop-func */
/// <reference types="@types/spotify-api" />
import SpotifyWebApiNode from 'spotify-web-api-node';

import { archivePlaylists } from './playlist';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userId = (12121954989).toString();
const spotify = new SpotifyWebApiNode({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: 'http://localhost:8000',
});

archivePlaylists(spotify)(userId);
