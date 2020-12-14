import { execSync } from 'child_process';
const args = process.argv.slice(2);

let tokenHash = Buffer.from(args.join(':')).toString('base64');
let accessTokenCmd = `curl -X "POST" -H "Authorization: Basic ${tokenHash}" -d grant_type=client_credentials https://accounts.spotify.com/api/token`;
let token = JSON.parse(Buffer.from(execSync(accessTokenCmd)).toString()).access_token;

console.log(token);
