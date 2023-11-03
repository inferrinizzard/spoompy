import 'styled-components';

type Theme = typeof theme;

declare module 'styled-components' {
  export type DefaultTheme = Theme;
}

const theme = {};

export default theme;
