import React from 'react';

export interface NavProps {}

const Nav: React.FC<NavProps> = () => {
	return (
		<nav
			style={{
				position: 'fixed',
				width: '100vw',
				height: '2rem',
				zIndex: 1,
				backgroundColor: '#98ff98',
			}}>
			spooompy
		</nav>
	);
};

export default Nav;
