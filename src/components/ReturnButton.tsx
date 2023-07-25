import NextLink from 'next/link';
import { Link } from '@kuma-ui/core';

export interface ReturnButtonProps {}

export const ReturnButton: React.FC<ReturnButtonProps> = () => {
  return (
    <Link as={NextLink} href="/" style={{ position: 'fixed', bottom: 0, right: 0 }}>
      {'Home'}
    </Link>
  );
};

export default ReturnButton;
