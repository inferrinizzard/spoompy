import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

const Layout: Next.Layout = ({ children }) => {
  return (
    <main>
      <Navbar />
      {children}
      <ReturnButton />
    </main>
  );
};

export default Layout;
