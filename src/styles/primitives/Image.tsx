"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";

interface StyledImageContainerProps {
	height: NextImageProps["height"];
	width: NextImageProps["width"];
}

const StyledImageContainer = styled.div<StyledImageContainerProps>`
  height: ${(props) => `${props.height}px`};
  width: ${(props) => `${props.width}px`};

  position: relative;
`;

const StyledImage = styled(NextImage)`
  object-fit: contain;
`;

export interface ImageProps {}

const Image: React.FC<
	ImageProps & NextImageProps & ComponentPropsWithoutRef<"img">
> = ({ height = 0, width = 0, ...props }) => {
	if (height && width) {
		return <StyledImage height={height} width={width} {...props} />;
	}

	return (
		<StyledImageContainer height={height} width={width}>
			<StyledImage fill sizes={`${width}`} {...props} />
		</StyledImageContainer>
	);
};

export default Image;
