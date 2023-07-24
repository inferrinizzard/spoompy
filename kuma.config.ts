import { createTheme } from '@kuma-ui/core';

const theme = createTheme({
  colors: {
    red: {
      100: 'red',
    },
    blue: 'blue',
    green: 'lime',
  },
  breakpoints: {
    sm: '400px',
    md: '700px',
  },
  components: {
    Button: {
      baseStyle: {
        background: 'black', // bg is short for background
        padding: '10px', // p is short for padding
      },
      variants: {
        primary: {},
      },
    },

    Link: {
      baseStyle: {
        _hover: {
          color: 'colors.green',
          textDecoration: 'underline',
        },
      },
    },
  },
});

type UserTheme = typeof theme;

declare module '@kuma-ui/core' {
  export interface Theme extends UserTheme {}
}

export default theme;
