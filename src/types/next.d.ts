declare interface RSCProps {
  params?: Record<string, string>;
  searchParams: Record<string, string>;
}

declare interface LayoutProps {
  readonly children: React.ReactNode;
}

declare namespace Next {
  declare type RSC = (props: RSCProps) => Promise<JSX.Element>;
  declare type Layout = (props: LayoutProps) => JSX.Element;
}
