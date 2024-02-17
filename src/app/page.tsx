import store from '@/redux/store';
import { getUserDetails, getUserPlaylists } from '@/redux/actions';
import { readAuthSession } from '@/redux/actions/server/init';

import LandingMain from './landing/main';

const Home = async () => {
  readAuthSession();

  const isAuthed = store.getState().user.isAuthed;
  const userDetails = store.getState().user.userDetails;
  if (isAuthed && !userDetails) {
    await getUserDetails();
    await getUserPlaylists();
  }

  return <LandingMain />;
};

export default Home;
