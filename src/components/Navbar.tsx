import NextLink from 'next/link';

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
      <NextLink
        // as={NextLink}
        href="/">
        <h1
        // fontSize={24}
        >
          {'Home'}
        </h1>
      </NextLink>
      <NextLink
        // as={NextLink}
        href="/browse">
        <h1
        // fontSize={24}
        >
          {'Browse'}
        </h1>
      </NextLink>
      <NextLink
        // as={NextLink}
        href="/analysis">
        <h1
        // fontSize={24}
        >
          {'Analysis'}
        </h1>
      </NextLink>
      <NextLink
        // as={NextLink}
        href="/archive">
        <h1
        // fontSize={24}
        >
          {'Archive'}
        </h1>
      </NextLink>
    </nav>
  );
};

export default Navbar;
