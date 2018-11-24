import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './Theme'
import Main from './Main';
import './App.css';


class App extends Component {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Main/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
