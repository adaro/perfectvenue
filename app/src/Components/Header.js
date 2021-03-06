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
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import AuthClient from '../HTTP/AuthClient';
import VenueSearch from '../Components/VenueSearch'
import PerfectvenueGlobals from '../PerfectvenueGlobals'
import RestClient from '../HTTP/RestClient';
import Tooltip from '@material-ui/core/Tooltip';
import MessageBar from '../Components/MessageBar'

const setSessionKey = PerfectvenueGlobals.defaultProps.setSessionKey;
const getParam = PerfectvenueGlobals.defaultProps.getParam;

const API = PerfectvenueGlobals.defaultProps.PROD;

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
  },
  noNotificationsMessage: {
    margin: 5,
    padding: 5
  },
  noNotificationsMessageDiv: {
  }
};


const NotificationContext = React.createContext();
const UserContext = React.createContext();
const MessageBarContext = React.createContext();


class MenuAppBar extends React.Component {
  state = {
    auth: false,
    anchorEl: null,
    openMEssage: false,
    message: '',
    suggestions: [],
    inputValue: null,
    notifications: null,
    is_venue_coordinator: false
  };

  componentDidMount = () => {
    // TODO: Get All Auth stuff into a wrapper compoenent?
    window.addEventListener('message', this.handleMessage, false);
    const sessionUid = getParam('pvToken', window.location.href)
    if (sessionUid) {
      setSessionKey('pvToken', sessionUid)
    }
    const getAuthPromise = RestClient('POST', '/accounts/auth/', {pvToken: localStorage.getItem('pvToken')})
    const self = this;
    getAuthPromise.then(function(resp) {
      console.log(resp, 'USER')
      self.setState({auth: resp.loggedIn, pvUserId: resp.userId, is_venue_coordinator: resp.is_venue_coordinator}, function(resp) {
        self.getNotifications()
      })
    })

  }

  getNotifications = () => {
    const self = this;
    if (this.state.pvUserId ) {
      const getMessagesPromise = RestClient('GET', '/api/notifications/' + this.state.pvUserId + '/unread')
      getMessagesPromise.then(function(resp) {
        self.setState({notifications: resp}, function() {

        })

      })
    }
  }

  handleMessage = (event) => {
      if (event.origin != API.host) { return; }
      if (event.data && event.data !== 'success-venue' || event.data !== ' success-event') {
        setSessionKey('pvToken', event.data)
        this.setState({auth: true})
      }
  }

  logout = (event, checked) => {
    localStorage.removeItem('pvToken')
    window.location.href = API.host + '/accounts/logout'
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleViewNotification = (value) => {
    if (value && value.fields) {
      const url = "/venues/" + value.fields.verb.split('/')[1].split('-')[0].trim() + "/events/" + value.fields.verb.split('/')[1].split('-')[1]
      this.props.history.push(url)
      this.setState({ anchorEl: null });
    }
  }

  handleClose = (event, value, keepOpen) => {
    event.stopPropagation()
    var self = this;
    if (value && value.fields) {
      const putMessagesPromise = RestClient('PUT', '/api/notifications/' + this.state.pvUserId + '/unread/' + value.pk + '/')
      putMessagesPromise.then(function(resp) {
        self.getNotifications()
      })
    }
    if (!keepOpen) {
      this.setState({ anchorEl: null });
    }

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

  showMessageBar = (message) => {
    this.setState({openMessage: true, message: message})
  }

  closeMessageBar = () => {
    this.setState({openMessage: false})
  }

  renderNotifications = () => {
    const { classes } = this.props;
    if (this.state.notifications && this.state.notifications.length) {
      return (
        <div className={classes.noNotificationsMessage}>
          {this.state.notifications.map((value, index) => (

            <ListItem key={value} role={undefined} dense button onClick={this.handleViewNotification.bind(this, value)}>
              <ListItemText primary={`${value.fields.verb.split('/')[0]} `} />
              <Tooltip title="Mark as read">
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments" onClick={event => this.handleClose(event, value, true)}  >
                    <CheckCircleIcon style={{ fontSize: 17 }}/>
                  </IconButton>
                </ListItemSecondaryAction>
              </Tooltip>
            </ListItem>

          ))}
        </div>
      )
    }
    else {
      return (
        <div className={classes.noNotificationsMessage}>
          <div> You have no unread notifications. </div>
          <br/>
          <Link to="/notifications"> <div> View All Notifications </div> </Link>
        </div>
      )
    }
  }

  renderIconButton = () => {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    if (this.state.notifications && this.state.notifications.length) {
      return (

          <IconButton
              className={classes.accountIcon}
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              <Badge className={classes.badge} badgeContent={this.state.notifications.length} color="secondary"><AccountCircle /></Badge>
            </IconButton>

      )
    }
    else {
      return (
          <IconButton
              className={classes.accountIcon}
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
      )
    }
  }

  render() {
    const { classes } = this.props;
    const { auth, anchorEl, is_venue_coordinator } = this.state;
    const open = Boolean(anchorEl);

    return (

        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Link to="/"><img className="logo" src={"https://via.placeholder.com/50"}/></Link>
              <Typography color="inherit">
                {this.props.title}
              </Typography>

              <VenueSearch searchVenue={this.searchVenue} suggestions={this.state.suggestions}/>


            <div className={classes.container + " header-link-container"}>

              {is_venue_coordinator && (<div className={classes.linkContainer}>
                <Link className={classes.link} to="/venues/new/add">Add Venue</Link>
              </div>
              )}

              {auth && (

                <div className={classes.linkContainer}>
                  | <a className={classes.link} onClick={this.logout}>Logout</a>
                </div>

              ) }

              {!auth && (

                <div className={classes.linkContainer}>
                  | <a className={classes.link} href={API.host + '/accounts/login'}>Login</a>
                </div>

              )}

              </div>

                {this.renderIconButton()}
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >

                    {this.renderNotifications()}
                  </Menu>

            </Toolbar>
          </AppBar>

          <MessageBar closeMessageBar={this.closeMessageBar} message={this.state.message} open={this.state.openMessage}/>

          <UserContext.Provider
                value={{
                    state: this.state,
                }}>
            <NotificationContext.Provider
                value={{
                    state: this.state,
                    getNotifications: this.getNotifications,
                }}>
              <MessageBarContext.Provider
                value={{
                    state: this.state,
                    showMessageBar: this.showMessageBar,
                    closeMessageBar: this.closeMessageBar
                }}>
                {this.props.children}
              </MessageBarContext.Provider>
            </NotificationContext.Provider>
          </UserContext.Provider>


        </div>

    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export { NotificationContext, UserContext, MessageBarContext };
export default withStyles(styles)(MenuAppBar);