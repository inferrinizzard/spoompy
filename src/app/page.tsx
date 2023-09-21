import { Button, Spacer, Text } from '@kuma-ui/core';
import Link from 'next/link';

import HomeLink from '@/components/HomeLink';
import store from '@/redux/store';
import { getUserDetails, getUserPlaylists } from '@/redux/actions';
import { generateAuthUrl } from '@/spotify';

import styles from './page.module.css';

export async function Home() {
  const isAuthed = store.getState().user.isAuthed;
  if (isAuthed) {
    await getUserDetails();
    await getUserPlaylists();
  }

  return (
    <main className={styles.main}>
      <Text fontSize={36}>{'Spotify Data Visualizer'}</Text>
      <Spacer height="2rem" />
      <HomeLink disabled={!isAuthed} href="/browse" text="Browse Library" />
      <HomeLink disabled={!isAuthed} href="/analysis" text="Data Analysis" />
      <HomeLink disabled={!isAuthed} href="/archive" text="Archive Playlists" />

      {!isAuthed && (
        <Button as={Link} href={generateAuthUrl()}>
          {'Login'}
        </Button>
      )}

      {store.getState().user.userDetails && (
        <h1>{`Welcome, ${store.getState().user.userDetails?.display_name}`}</h1>
      )}
    </main>
  );
}

export default Home;
