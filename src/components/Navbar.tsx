import NextLink from 'next/link';
import { Link, Text } from '@kuma-ui/core';

export interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav
      style={{
        height: '2rem',
        width: '100%',
        margin: '0.5rem',
        display: 'flex',
        gap: '1rem',
      }}>
      <Link as={NextLink} href="/">
        <Text fontSize={24}>{'Home'}</Text>
      </Link>
      <Link as={NextLink} href="/browse">
        <Text fontSize={24}>{'Browse'}</Text>
      </Link>
      <Link as={NextLink} href="/analysis">
        <Text fontSize={24}>{'Analysis'}</Text>
      </Link>
      <Link as={NextLink} href="/archive">
        <Text fontSize={24}>{'Archive'}</Text>
      </Link>
    </nav>
  );
};

export default Navbar;
