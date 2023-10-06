import { NextResponse } from 'next/server';
import { type AccessToken } from '@spotify/web-api-ts-sdk';

import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as AccessToken;

  const res = NextResponse.redirect('http://localhost:3000');

  res.cookies.set(SPOTIFY_AUTH_COOKIE, JSON.stringify(body), {
    maxAge: body.expires_in,
  });

  return res;
}

// postback {
//   access_token: 'BQA7vIICQH1b2_djvb-eFc0YlN1rtPr96Wp535qx3XNhwggu3eepTszv71ZeTSApAwDIlq8l1CCu2Bi5N0XTcz9npv6bZUv7XNDuA-tTnJeLoT0n34Wqvlrzgsl3ooa4DYBFurimhdBIYRMXpIF79irvZNLCCOmzUGryyo9GhOAQxyTnryvAxpNl5C_bmeecUhzheUvnMZEceor5ZM9beg',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   refresh_token: 'AQBuiMok3Mcimpk6gKSacSfv0kmz3jt1_TbigOZvKBkTSSfpD3NhG9b489cpRHyV5xX3rprSLxDZoMby5dwfkYQKc81_Z5S52jBwKuaeys_hlIF7bbH3J8EJyVcczJk-y30',
//   scope: 'playlist-read-private playlist-read-collaborative user-library-read user-read-recently-played user-top-read',
//   expires: 1696621296980
// }
