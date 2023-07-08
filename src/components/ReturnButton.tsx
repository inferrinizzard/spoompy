import Link from 'next/link';

export interface ReturnButtonProps {}

export const ReturnButton: React.FC<ReturnButtonProps> = () => {
  return (
    <Link href="/" style={{ position: 'fixed', bottom: 0, right: 0 }}>
      {'Home'}
    </Link>
  );
};

export default ReturnButton;
