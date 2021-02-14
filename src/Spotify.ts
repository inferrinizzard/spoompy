import SpotifyWebApi from 'spotify-web-api-js';

const hostname = 'http://localhost:3000';
export default class Spotify extends SpotifyWebApi {
	client_id: string;
	state: string;
	access_token!: string;

	constructor(client_id: string) {
		super();
		this.client_id = client_id;
		this.state = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
		if (!sessionStorage.getItem('spoompy-state'))
			sessionStorage.setItem('spoompy-state', this.state);
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
