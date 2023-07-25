import NextLink from 'next/link';
import { Box, Link, Text } from '@kuma-ui/core';

export interface HomeLinkProps {
  href: string;
  text: string;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, text }) => {
  return (
    <Box as="article" style={{ marginBottom: '3rem' }}>
      <Link as={NextLink} href={href}>
        <Text fontSize={48}>{text}</Text>
      </Link>
    </Box>
  );
};

export default HomeLink;
