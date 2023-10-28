import { Spacer, Text } from '@kuma-ui/core';

import HomeLink from '@/components/HomeLink';
import AuthMain from '@/components/auth/AuthMain';
import store from '@/redux/store';
import { getUserDetails, getUserPlaylists } from '@/redux/actions';
import { readAuthSession } from '@/redux/actions/server/init';
import Preloader from '@/redux/components/Preloader';

import styles from './page.module.css';

export async function Home() {
  readAuthSession();

  const isAuthed = store.getState().user.isAuthed;
  if (isAuthed) {
    await getUserDetails();
    await getUserPlaylists();
  }

  return (
    <main className={styles.main}>
      <Preloader state={store.getState()} />

      <Text fontSize={36}>{'Spotify Data Visualizer'}</Text>
      <Spacer height="2rem" />
      <HomeLink disabled={!isAuthed} href="/browse" text="Browse Library" />
      <HomeLink disabled={!isAuthed} href="/analysis" text="Data Analysis" />
      <HomeLink disabled={!isAuthed} href="/archive" text="Archive Playlists" />

      <AuthMain />

      {store.getState().user.userDetails && (
        <h1>{`Welcome, ${store.getState().user.userDetails?.display_name}`}</h1>
      )}
    </main>
  );
}

export default Home;
