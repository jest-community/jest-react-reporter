import * as React from 'react';
import { Box, Color, ColorProps } from 'ink';

export const Arrow: React.FC = () => <>{' \u203A '}</>;
export const Dot: React.FC = () => <>{' \u2022 '}</>;
export const DownArrow: React.FC = () => <>{' \u21B3 '}</>;

export const PaddedColor: React.FC<ColorProps> = ({ children, ...props }) => (
  <Box paddingRight={1}>
    <Color {...props}>
      &nbsp;
      {children}
      &nbsp;
    </Color>
  </Box>
);
