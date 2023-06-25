'use client';

export interface SearchProps {
  handleSearch: (str: string) => void;
}

const Search: React.FC<SearchProps> = ({ handleSearch }) => {
  return <input type="search" placeholder="Search" onChange={e => handleSearch(e.target.value)} />;
};

export default Search;
