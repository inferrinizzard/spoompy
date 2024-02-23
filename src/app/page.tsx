import store from '@/redux/store';
import { getUserDetails, getUserPlaylists, logOut } from '@/redux/actions';
import { readAuthSession } from '@/redux/actions/server/init';
import { getServerCookieString } from '@/actions/cookies/serverCookies';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify';

import LandingMain from './landing/main';

const Home: Next.RSC = async ({ searchParams }) => {
  readAuthSession();

  const isAuthed = store.getState().user.isAuthed;
  const userDetails = store.getState().user.userDetails;
  if (isAuthed && !userDetails) {
    await getUserDetails();
    await getUserPlaylists();
  }

  if (searchParams['error'] === 'access_denied') {
    logOut();
  }

  const serverCookie = getServerCookieString(SPOTIFY_AUTH_COOKIE);

  return <LandingMain serverCookie={serverCookie} />;
};

export default Home;
