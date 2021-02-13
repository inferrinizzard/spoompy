import SpotifyWebApi from 'spotify-web-api-js';

// client_id = '104889eeeb724a9ca5efa673f527f38f'
const randomString = (n: number) => [...Array(n)].map(() => Math.random().toString(36)[2]).join('');

// src: https://stackoverflow.com/a/48161723
async function sha256(str: string) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(str);

	// hash the message
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
	return hashHex;
}

const hostname = 'http://localhost:3000';
export default class Spotify {
	client_id: string;
	code_verifier: string;
	code_challenge!: string;
	state: string;

	access_token!: string;
	refresh_token!: string;
	timeout!: number;

	constructor(client_id: string) {
		this.client_id = client_id;
		this.state = randomString(30);
		if (!sessionStorage.getItem('spoompy-state'))
			sessionStorage.setItem('spoompy-state', this.state);
		this.code_verifier = randomString(64);
		if (!sessionStorage.getItem('spoompy-code_verifier'))
			sessionStorage.setItem('spoompy-code_verifier', this.code_verifier);
	}

	login = () =>
		sha256(this.code_verifier).then(code_challenge => {
			this.code_challenge = code_challenge;
			let params = new URLSearchParams({
				client_id: this.client_id,
				response_type: 'token',
				redirect_uri: hostname,
				state: this.state,
			});

			const auth_url = `https://accounts.spotify.com/authorize?${params.toString()}`;
			window.location.replace(auth_url);
		});

	getAccessToken(auth_code: string) {
		const body = {
			client_id: this.client_id,
			grant_type: 'authorization_code',
			code: auth_code,
			redirect_uri: hostname,
			code_verifier: this.code_verifier,
		};
		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(body),
		}).then(this.applyToken);
	}

	refresh = () => {
		const body = {
			client_id: this.client_id,
			grant_type: 'refresh_token',
			refresh_token: this.refresh_token,
		};
		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(body),
		}).then(this.applyToken);
	};

	async applyToken(res: Response) {
		sessionStorage.removeItem('spoompy-code_verifier');
		if (res.status === 200 && res.body) {
			let { access_token, expires_in, refresh_token } = await res.json();
			this.access_token = access_token;
			this.timeout = expires_in;
			this.refresh_token = refresh_token;
			setTimeout(this.refresh, expires_in * 1000);
		}
	}
}
