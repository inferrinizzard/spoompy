'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface ReturnButtonProps {}

export const ReturnButton: React.FC<ReturnButtonProps> = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <Link href="/" style={{ position: 'fixed', bottom: 0, right: 0 }}>
      {'Home'}
    </Link>
  );
};

export default ReturnButton;
