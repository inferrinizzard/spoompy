import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DrawerBase = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 15%;
	height: 100%;
	background-color: ${p => p.theme.black};
`;

const TextButton = styled.button``;

export interface DrawerProps {}

const Drawer: React.FC<DrawerProps> = () => {
};

export default Drawer;
