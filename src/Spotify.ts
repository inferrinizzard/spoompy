import SpotifyWebApi from 'spotify-web-api-js';

export const hostname = 'http://localhost:3000';
export const stateName = 'spoompy-state',
	accessTokenName = 'spoompy-access_token';
export default class Spotify extends SpotifyWebApi {
	client_id: string;
	state: string;
	access_token!: string;

	constructor(client_id: string) {
		super();
		this.client_id = client_id;
		this.state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		if (!sessionStorage.getItem(stateName)) sessionStorage.setItem(stateName, this.state);
		if (sessionStorage.getItem(accessTokenName)) {
			sessionStorage.removeItem(stateName);
			this.access_token = sessionStorage.getItem(accessTokenName) ?? '';
			this.setAccessToken(this.access_token);
			this.getMe().then(
				() => {},
				({ status, responseText }) =>
					status === 401 &&
					responseText.includes('expired') &&
					((this.access_token = ''), sessionStorage.removeItem(accessTokenName))
			);
		}
	}

	login = () => {
		const params = new URLSearchParams({
			client_id: this.client_id,
			response_type: 'token',
			redirect_uri: hostname,
			state: this.state,
		});

		const auth_url = `https://accounts.spotify.com/authorize?${params.toString()}`;
		window.location.replace(auth_url);
	};
}
