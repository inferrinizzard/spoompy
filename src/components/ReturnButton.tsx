import NextLink from 'next/link';

export interface ReturnButtonProps {}

export const ReturnButton: React.FC<ReturnButtonProps> = () => {
  return (
    <NextLink
      // as={NextLink}
      href="/"
      style={{ position: 'fixed', bottom: 0, right: 0 }}>
      {'Home'}
    </NextLink>
  );
};

export default ReturnButton;
