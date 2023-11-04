import Link from '@/styles/primitives/Link';
import Text from '@/styles/primitives/Text';

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
        <Text as="h3" fontSize={24}>
          {'Home'}
        </Text>
      </Link>
      <Link href="/browse">
        <Text as="h3" fontSize={24}>
          {'Browse'}
        </Text>
      </Link>
      <Link href="/analysis">
        <Text as="h3" fontSize={24}>
          {'Analysis'}
        </Text>
      </Link>
      <Link href="/archive">
        <Text as="h3" fontSize={24}>
          {'Archive'}
        </Text>
      </Link>
    </nav>
  );
};

export default Navbar;
