/// <reference types="@types/spotify-api" />
import SpotifyWebApiNode from "spotify-web-api-node";

import { Command } from "commander";

import * as dotenv from "dotenv";
import { SpotifyArchiver } from "./archive";
dotenv.config({ path: ".env.local" });

const userId = (12121954989).toString();
const spotify = new SpotifyWebApiNode({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: "http://localhost:8000",
});

const spotifyArchiver = new SpotifyArchiver(spotify, userId);

const program = new Command();

program.name("spotify-archiver").description("CLI to archive Spotify data");

program
	.command("playlists")
	.option("--force", "force download", false)
	.action((options) => spotifyArchiver.archivePlaylists(options.force));

program
	.command("saved")
	.option("--force", "force download", false)
	.action((options) => spotifyArchiver.archiveSaved(options.force));

program.command("organise").action(spotifyArchiver.organise);

program.command("all").action(async () => {
	await spotifyArchiver.archivePlaylists();
	await spotifyArchiver.archiveSaved();
	spotifyArchiver.organise();
});

program.parse();
