import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { deepPurple, teal } from '@material-ui/core/colors';
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import Navbar from './components/Navbar';
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: teal
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar></Navbar>
          <div className="container">
            <Switch>
              <Route exact path="/" component={home}></Route>
              <Route exact path="/login" component={login}></Route>
              <Route exact path="/signup" component={signup}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
