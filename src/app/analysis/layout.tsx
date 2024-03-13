import Navbar from '@/components/Navbar';
import ReturnButton from '@/components/ReturnButton';

const AnalysisLayout: Next.Layout = ({ children }) => {
  return (
    <main>
      <Navbar />
      {children}
      <ReturnButton />
    </main>
  );
};

export default AnalysisLayout;
