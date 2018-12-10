import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export default createMuiTheme({
  palette: {

    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#8247ff',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#ffab68',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    },
    error: {
      light: '#ec407a',
      main: '#e91e63',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
    },

  },

  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
  },

  overrides: {
      MuiInput: {
        // Name of the styleSheet
        underline: {

          // '&:hover:not($disabled):before': {
          //   display: 'none',
          // },
          // '&:hover:not($disabled):after': {
          //   display: 'none',
          // },
          // '&:hover:not($disabled):not($error):not($focused):before': {
          //   display: 'none'
          // },
          // '&:after': {
          //   display: 'none',
          // },
          // '&:before': {
          //   display: 'none',
          // }

        },

      },
    },

});