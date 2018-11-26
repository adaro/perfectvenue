import React from 'react';
import {
  Link,
} from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import AuthClient from '../HTTP/AuthClient';
import VenueSearch from '../Components/VenueSearch'
import PerfectvenueGlobals from '../PerfectvenueGlobals'
import RestClient from '../HTTP/RestClient';

const setSessionKey = PerfectvenueGlobals.defaultProps.setSessionKey;
const getParam = PerfectvenueGlobals.defaultProps.getParam;

const API = PerfectvenueGlobals.defaultProps.DEV;

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  menuLink: {
    textDecoration: 'none'
  },
  accountIcon: {
    marginTop: 1
  },
  link: {
    color: 'white',
    padding: 20,
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer'
  },
  linkContainer: {
    color: 'white',
    marginTop: 15
  }
};



class MenuAppBar extends React.Component {
  state = {
    auth: false,
    anchorEl: null,
    suggestions: [],
    inputValue: null
  };

  componentDidMount = () => {

    // TODO: Get All Auth stuff into a wrapper compoenent?
    window.addEventListener('message', this.handleMessage, false);

    const sessionUid = getParam('uid', window.location.href)
    if (sessionUid) {
      setSessionKey('pvuid', sessionUid)
    }

    const getAuthPromise = RestClient('POST', '/accounts/auth/', {pvuid: localStorage.getItem('pvuid')})
    const self = this;
    getAuthPromise.then(function(resp) {
      self.setState({auth: resp.loggedIn})
    })

  }

  handleMessage = (event) => {
      if (event.origin != "http://127.0.0.1:8000") { return; }
      if (event.data) {
        setSessionKey('pvuid', event.data)
        this.setState({auth: true})
      }
  }

  logout = (event, checked) => {
    localStorage.removeItem('pvuid')
    window.location.href = API.host + '/accounts/logout'
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  searchVenue = (value) => {
    if (value && this.state.inputValue !== value) {
      const searchVenuesPromise = RestClient('GET', '/api/venues/?name=' + value)
      const self = this;
      searchVenuesPromise.then(function(suggestions) {
        self.setState({suggestions: suggestions, inputValue: value})
      })
    }
    return
  }


  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (

        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Link to="/"><img className="logo" src={"https://via.placeholder.com/50"}/></Link>
              <Typography color="inherit" className={classes.flex}>
                {this.props.title}
                <VenueSearch searchVenue={this.searchVenue} suggestions={this.state.suggestions}/>
              </Typography>


            <div className={classes.container}>
              <div className={classes.linkContainer}>
                <Link className={classes.link} to="/venues/new/add">Add Venue</Link>
              </div>

              {auth && (

                <div className={classes.linkContainer}>
                  | <a className={classes.link} onClick={this.logout}>Logout</a>
                </div>

              )}

              {!auth && (

                <div className={classes.linkContainer}>
                  | <a className={classes.link} href={API.host + '/accounts/login'}>Login</a>
                </div>

              )}


              </div>
            </Toolbar>
          </AppBar>
        </div>

    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);