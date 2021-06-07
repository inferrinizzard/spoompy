import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ButtonBase = styled.button`
	display: block;
	border: none;
	box-shadow: none;
	background-color: transparent;
`;

const LinkText = styled.a`
	color: ${p => p.theme.lightgray};
	text-decoration: none;
	font-family: circular;
	font-size: 1.5rem;

	&:hover,
	&:active {
		color: ${p => p.theme.white};
	}
`;

export const LinkButton = ({ text, to }: { text: string; to: string }) => (
	<ButtonBase>
		{/* Icon here */}
		<Link to={to} component={LinkText}>
			{text}
		</Link>
	</ButtonBase>
);
