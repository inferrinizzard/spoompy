import DownloadAll from './components/DownloadAll';
import DownloadRow from './components/DownloadRow';

export interface ArchiveMainProps {}

export const ArchiveMain: React.FC<ArchiveMainProps> = () => {
  return (
    <div>
      <DownloadAll />
      <section>
        {/* flex */}
        <DownloadRow />
      </section>
    </div>
  );
};

export default ArchiveMain;
