export interface RSCProps {
  params?: Record<string, string>;
  searchParams: Record<string, string>;
}

export type RSC = (props: RSCProps) => Promise<JSX.Element>;
