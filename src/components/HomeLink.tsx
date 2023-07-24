import Link from 'next/link';
import { Box, Text } from '@kuma-ui/core';

export interface HomeLinkProps {
  href: string;
  text: string;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, text }) => {
  return (
    <Box
      as="article"
      _hover={{ color: 'lime', textDecoration: 'underline' }}
      style={{ marginBottom: '3rem' }}>
      <Link href={href}>
        <Text fontSize={48}>{text}</Text>
      </Link>
    </Box>
  );
};

export default HomeLink;
