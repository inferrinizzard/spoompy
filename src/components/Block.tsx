export interface BlockProps extends React.PropsWithChildren<unknown> {
  height?: number;
  width?: number;
}

export const Block: React.FC<BlockProps> = ({ height = 1, width = 1, children }) => {
  return (
    <div
      style={{
        borderColor: 'white',
        borderWidth: '1',
        borderStyle: 'solid',
        height: `${height * 8}rem`,
        width: `${width * 8}rem`,
        padding: '0.5rem',
        borderRadius: '0.75rem',
      }}>
      {children}
    </div>
  );
};

export default Block;
