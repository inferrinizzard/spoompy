import { Inter } from 'next/font/google';
import { KumaRegistry } from '@kuma-ui/next-plugin/registry';

import DataLoader from '@/redux/components/DataLoader';
import ReduxProvider from '@/redux/components/Provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Spotify',
  description: 'Generated by create next app',
};

export const RootLayout = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <DataLoader />
          <KumaRegistry>{children}</KumaRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
