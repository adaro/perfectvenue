import React, { Component } from 'react';
import {
  Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Header from './Components/Header';
import Home from './Views/Home';
import AddVenue from './Components/AddVenue';
import Venue from './Components/Venue';
import history from './history';


class Main extends Component {

  render() {

    return (
      <Router history={history}>
        <div className="Main">
           <Header/>
           <Route exact path='/' component={Home}/>
           <Route exact path='/venues/new/add' component={(props) => <AddVenue {...props} open={true} />}/>
           <Route exact path='/venues/:id' component={Venue}/>
        </div>
      </Router>
    );
  }
}

export default Main;