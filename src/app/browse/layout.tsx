import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

const BrowseLayout: Next.Layout = ({ children }) => {
  return (
    <main>
      <Navbar />
      {children}
      <ReturnButton />
    </main>
  );
};

export default BrowseLayout;
