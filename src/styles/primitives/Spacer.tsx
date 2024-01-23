'use client';

import { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';

import { parseCssUnit } from '../utils';
import { type CssUnit, type TransientProps } from '../types';

const StyledSpacer = styled.div<
  TransientProps<{
    height: string;
    width: string;
    display: string;
  }>
>`
  ${(props) => `height: ${props.$height};`}
  ${(props) => `width: ${props.$width};`}
  ${(props) => `display: ${props.$display};`}
  flex-shrink: 0;
`;

export interface SpacerProps {
  size?: CssUnit;
  height?: CssUnit;
  width?: CssUnit;
  horizontal?: boolean;
}

const Spacer: React.FC<SpacerProps & ComponentPropsWithoutRef<'div'>> = ({
  size,
  horizontal,
  height,
  width,
  ...props
}) => {
  if (!size && !height && !width) {
    throw new Error('Must specify at least one of: size, height, width!');
  }

  const dimensions = height
    ? { $height: parseCssUnit(height), $width: 'auto', $display: 'block' }
    : width
    ? { $width: parseCssUnit(width), $height: 'auto', $display: 'inline-block' }
    : horizontal
    ? {
        $width: parseCssUnit(size as CssUnit),
        $height: 'auto',
        $display: 'inline-block',
      }
    : {
        $height: parseCssUnit(size as CssUnit),
        $width: 'auto',
        $display: 'block',
      };

  return <StyledSpacer {...dimensions} {...props} />;
};

export default Spacer;
