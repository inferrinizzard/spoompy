import { initTracks } from '@/redux/actions/init';
import Preloader from '@/redux/components/Preloader';
import store from '@/redux/store';

export interface ReduxMainProps {
  children: React.ReactNode;
}

export const ReduxMain: React.FC<ReduxMainProps> = ({ children }) => {
  initTracks();

  return (
    <main>
      <Preloader tracks={store.getState().playlist.tracks} />
      {children}
    </main>
  );
};

export default ReduxMain;
