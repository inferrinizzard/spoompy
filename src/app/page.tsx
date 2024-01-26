import store from '@/redux/store';
import { getUserDetails, getUserPlaylists } from '@/redux/actions';
import { readAuthSession } from '@/redux/actions/server/init';
import Preloader from '@/redux/components/Preloader';

import LandingMain from './landing/main';

const Home = async () => {
  readAuthSession();

  const isAuthed = store.getState().user.isAuthed;
  const userDetails = store.getState().user.userDetails;
  if (isAuthed && !userDetails) {
    await getUserDetails();
    await getUserPlaylists();
  }

  return (
    <>
      {/* <Preloader state={store.getState()} /> */}
      <LandingMain />
    </>
  );
};

export default Home;
