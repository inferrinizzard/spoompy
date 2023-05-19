export interface BlockProps extends React.PropsWithChildren<unknown> {
  size?: number;
}

export const Block: React.FC<BlockProps> = ({ size = 1, children }) => {
  return <div>{children}</div>;
};

export default Block;
