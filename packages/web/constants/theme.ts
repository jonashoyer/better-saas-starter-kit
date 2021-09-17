import { createTheme } from '@mui/material/styles';

// Create a theme instance.
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#333333',
    },
  },
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiButton: {
      styleOverrides: {
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: "local('Raleway'), local('Raleway-Regular'), url(/fonts/Raleway-Regular.ttf) format('ttf')";
          unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
        }
      `,
    },
  }
});