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

export default class Spotify {
	client_id: string;
	code_challenge!: string;
	state: string;

	constructor(client_id: string) {
		this.client_id = client_id;
		this.state = randomString(30);
	}

	login = () =>
		sha256(randomString(64)).then(code_challenge => {
			this.code_challenge = code_challenge;
			let params = new URLSearchParams({
				client_id: this.client_id,
				response_type: 'code',
				redirect_uri: 'http://localhost:3000',
				code_challenge_method: 'S256',
				code_challenge: btoa(code_challenge),
				state: this.state,
			});

			const auth_url = `https://accounts.spotify.com/authorize?${params.toString()}`;
			window.location.replace(auth_url);
		});

	getAccessToken() {
		// 		4. Your app exchanges the code for an access token
		// If the user accepted your request, then your app is ready to exchange the authorization code for an access token. It can do this by making a POST request to the https://accounts.spotify.com/api/token endpoint. The body of this POST request must contain the following parameters encoded as application/x-www-form-urlencoded:
		// REQUEST BODY PARAMETER	VALUE
		// client_id	Required.
		// The client ID for your app, available from the developer dashboard.
		// grant_type	Required.
		// This field must contain the value authorization_code.
		// code	Required.
		// The authorization code obtained in step 3.
		// redirect_uri	Required.
		// The value of this parameter must match the value of the redirect_uri parameter your app supplied when requesting the authorization code.
		// code_verifier	Required.
		// The value of this parameter must match the value of the code_verifier that your app generated in step 1.
	}
}
