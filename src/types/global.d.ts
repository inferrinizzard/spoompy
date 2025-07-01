import { type ClientSpotifyInstance } from "@/spotify/instances/client";
import { type ServerSpotifyInstance } from "@/spotify/instances/server";

export declare global {
	var clientSpotify: ClientSpotifyInstance;
	var serverSpotify: ServerSpotifyInstance;
}
