import NextLink from 'next/link';
import { Box, Link, Text } from '@kuma-ui/core';

// TODO: redo with kuma
const disabledLinkStyles = {
  cursor: 'not-allowed',
  opacity: 0.5,
  textDecoration: 'none',
  pointerEvents: 'none',
};

export interface HomeLinkProps {
  href: string;
  text: string;
  disabled?: boolean;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, text, disabled }) => {
  return (
    <Box
      as="article"
      style={{
        marginBottom: '3rem',
        ...(disabled && { cursor: 'not-allowed' }),
      }}>
      <Link
        as={NextLink}
        // href={disabled ? '' : href}
        href={href}
        // @ts-expect-error disabled style
        style={{ ...(disabled && disabledLinkStyles) }}>
        <Text fontSize={48}>{text}</Text>
      </Link>
    </Box>
  );
};

export default HomeLink;
