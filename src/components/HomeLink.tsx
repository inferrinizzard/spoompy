import { Box, Link, Text } from '@/styles/primitives';

export interface HomeLinkProps {
  href: string;
  text: string;
  disabled?: boolean;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, text, disabled }) => {
  return (
    <Box as="article" style={{ marginBottom: '3rem' }}>
      <Link disabled={disabled} href={href}>
        <Text as="h2" fontSize={36}>
          {text}
        </Text>
      </Link>
    </Box>
  );
};

export default HomeLink;
