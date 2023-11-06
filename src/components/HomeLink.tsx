import { Link, Text } from '@/styles/primitives';

const disabledLinkStyles = {
  cursor: 'not-allowed',
  opacity: 0.5,
  textDecoration: 'none',
};

export interface HomeLinkProps {
  href: string;
  text: string;
  disabled?: boolean;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, text, disabled }) => {
  return (
    <article style={{ marginBottom: '3rem' }}>
      <Link
        href={disabled ? 'null' : href}
        style={{ ...(disabled && disabledLinkStyles) }}>
        <Text as="h2" fontSize={36}>
          {text}
        </Text>
      </Link>
    </article>
  );
};

export default HomeLink;
