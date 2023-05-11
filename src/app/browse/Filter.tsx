'use client';

export interface FilterProps {
  options: string[];
  setOption: (str: string) => void;
}

const Filter: React.FC<FilterProps> = ({ options, setOption }) => {
  return (
    <select onChange={e => setOption(e.target.value)}>
      <option value={''}>{'All'}</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Filter;
