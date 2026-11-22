"use client";

import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import styled from "styled-components";

const StyledButton = styled.button``;

export interface ButtonProps {}

const Button: React.FC<
	PropsWithChildren<ButtonProps> & ComponentPropsWithoutRef<"button">
> = ({ type = "button", children, ...props }) => {
	return (
		<StyledButton type={type} {...props}>
			{children}
		</StyledButton>
	);
};

export default Button;
