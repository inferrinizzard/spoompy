import NextLink from 'next/link';

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
      <NextLink
        // as={NextLink}
        href={disabled ? 'null' : href}
        style={{ ...(disabled && disabledLinkStyles) }}>
        <h1
        //  fontSize={48}
        >
          {text}
        </h1>
      </NextLink>
    </article>
  );
};

export default HomeLink;
