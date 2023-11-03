import Link from '@/styles/primitives/Link';

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
      <Link href="/">
        <h1
        // fontSize={24}
        >
          {'Home'}
        </h1>
      </Link>
      <Link href="/browse">
        <h1
        // fontSize={24}
        >
          {'Browse'}
        </h1>
      </Link>
      <Link href="/analysis">
        <h1
        // fontSize={24}
        >
          {'Analysis'}
        </h1>
      </Link>
      <Link href="/archive">
        <h1
        // fontSize={24}
        >
          {'Archive'}
        </h1>
      </Link>
    </nav>
  );
};

export default Navbar;
