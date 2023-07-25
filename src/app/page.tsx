import { Button, Spacer, Text } from '@kuma-ui/core';

import HomeLink from '@/components/HomeLink';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Text fontSize={36}>{'Spotify Data Visualizer'}</Text>
      <Spacer height={'2rem'} />
      <HomeLink href="/browse" text="Browse Library" />
      <HomeLink href="/analysis" text="Data Analysis" />
      <HomeLink href="/archive" text="Archive Playlists" />
    </main>
  );
}
