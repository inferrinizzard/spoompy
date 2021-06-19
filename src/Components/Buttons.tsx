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
	font-size: 1.5rem;

	p {
		display: inline-block;
		margin: 0 0.25rem;
		vertical-align: super;
	}

	&:hover,
	&:active {
		color: ${p => p.theme.white};
		svg {
			fill: ${p => p.theme.white};
		}
	}
`;

interface LinkButtonProps {
	text: string;
	to: string;
	icon?: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
}

const LinkIcon = styled(
	({ icon, children, ...props }: React.PropsWithChildren<Pick<LinkButtonProps, 'icon'>>) =>
		icon ? React.createElement(icon, props, children) : null
)`
	fill: ${p => p.theme.lightgray};
	height: 32px;
	width: 32px;
	padding: 0.25rem;
`;

export const LinkButton: React.FC<LinkButtonProps> = ({ text, to, icon }) => (
	<ButtonBase>
		<Link to={to} component={LinkText}>
			<LinkIcon icon={icon} />
			<p>{text}</p>
		</Link>
	</ButtonBase>
);
