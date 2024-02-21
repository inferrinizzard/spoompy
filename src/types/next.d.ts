declare interface RSCProps {
  params?: Record<string, string>;
  searchParams: Record<string, string>;
}

declare namespace Next {
  declare type RSC = (props: RSCProps) => Promise<React.JSX.Element>;
}
