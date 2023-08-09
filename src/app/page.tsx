import { Button, Spacer, Text } from '@kuma-ui/core';
import Link from 'next/link';

import HomeLink from '@/components/HomeLink';
import store from '@/redux/store';
import { setUserDetails } from '@/redux/slices/userSlice';
import { generateAuthUrl, getSpotify } from '@/spotify';

import styles from './page.module.css';

export async function Home() {
  if (store.getState().user.isAuthed) {
    await getSpotify()
      .getUserDetails()
      .then((userDetails) => store.dispatch(setUserDetails(userDetails)));
  }

  return (
    <main className={styles.main}>
      <Text fontSize={36}>{'Spotify Data Visualizer'}</Text>
      <Spacer height="2rem" />
      <HomeLink href="/browse" text="Browse Library" />
      <HomeLink href="/analysis" text="Data Analysis" />
      <HomeLink href="/archive" text="Archive Playlists" />

      {!store.getState().user.isAuthed && (
        <Button as={Link} href={generateAuthUrl()}>
          {'Login'}
        </Button>
      )}

      {store.getState().user.userDetails && (
        <h1>{`Welcome, ${store.getState().user.userDetails?.name}`}</h1>
      )}
    </main>
  );
}

export default Home;
