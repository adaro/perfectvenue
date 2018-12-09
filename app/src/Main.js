import React, { Component } from 'react';
import {
  Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Header from './Components/Header';
import Home from './Views/Home';
import AddVenue from './Views/AddVenue';
import Venue from './Components/Venue';
import Event from './Views/Event';
import history from './history';


class Main extends Component {

  render() {

    return (
      <Router history={history}>
        <div className="Main">
           <Header history={history}>
             <Route exact path='/' component={Home}/>
             <Route exact path='/venues/new/add' component={(props) => <AddVenue {...props} open={true} />}/>
             <Route exact path='/venues/:id' component={Venue}/>
             <Route exact path='/venues/:id/events' component={(props) => <Event {...props}  getNotifications={this.props.getNotifications} />}/>
             <Route exact path='/venues/:id/events/:event_id' component={Event}/>
          </Header>
        </div>
      </Router>
    );
  }
}

export default Main;