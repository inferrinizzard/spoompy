"use client";

import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

import { parseCssUnit } from "../utils";
import { type CssUnit, type TransientProps } from "../types";

type TextType = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const StyledText = styled.div<TransientProps<TextProps>>`
  ${(props) =>
		props.$fontSize && `font-size: ${parseCssUnit(props.$fontSize)};`}
  font-weight: 400;
`;

export interface TextProps {
	as?: TextType;

	fontSize?: CssUnit;
}

const Text: React.FC<TextProps & ComponentPropsWithoutRef<TextType>> = ({
	as = "p",
	fontSize,
	...props
}) => <StyledText $fontSize={fontSize} as={as} {...props} />;

export default Text;
