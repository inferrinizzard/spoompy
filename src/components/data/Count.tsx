import Block from '../Block';

export interface CountProps {
  value: number;
  caption: string;
}

export const Count: React.FC<CountProps> = ({ value, caption }) => {
  return (
    <Block>
      <h1>{value}</h1>
      <h3>{caption}</h3>
    </Block>
  );
};

export default Count;
