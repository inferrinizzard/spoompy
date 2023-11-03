import HomeLink from '@/components/HomeLink';
import AuthMain from '@/components/auth/AuthMain';
import store from '@/redux/store';
import { getUserDetails, getUserPlaylists } from '@/redux/actions';
import { readAuthSession } from '@/redux/actions/server/init';
import Preloader from '@/redux/components/Preloader';

import styles from './page.module.css';

const Home = async () => {
  readAuthSession();

  const isAuthed = store.getState().user.isAuthed;
  if (isAuthed) {
    await getUserDetails();
    await getUserPlaylists();
  }

  const userDetails = store.getState().user.userDetails;

  return (
    <main className={styles.main}>
      <Preloader state={store.getState()} />

      <h1
      // fontSize={36}
      >
        {'Spotify Data Visualizer'}
      </h1>
      {/* <Spacer height="2rem" /> */}
      <HomeLink disabled={!isAuthed} href="/browse" text="Browse Library" />
      <HomeLink disabled={!isAuthed} href="/analysis" text="Data Analysis" />
      <HomeLink disabled={!isAuthed} href="/archive" text="Archive Playlists" />

      <AuthMain />

      {userDetails && (
        <>
          <h3>{`Logged in as: ${userDetails.display_name}`}</h3>
          <h3>{`With user id: ${userDetails.id}`}</h3>
        </>
      )}
    </main>
  );
};

export default Home;
