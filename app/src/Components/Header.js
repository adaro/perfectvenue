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
    fontWeight: 600
  },
  linkContainer: {
    color: 'white',
    marginTop: 15
  }
};


class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  // LOGOUT CONTROLLER
  handleChange = (event, checked) => {
    window.location.href = API.host + '/accounts/logout'
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };



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
                <VenueSearch/>
              </Typography>



              {auth && (
                <div className={classes.container}>

                    <div className={classes.linkContainer}>
                      <Link className={classes.link} to="/venues/add">Add Venue</Link>
                    </div>

                    <div className={classes.linkContainer}>
                      | <a className={classes.link} href={API.host + '/accounts/logout'}>Logout</a>
                    </div>

                </div>

              )}
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