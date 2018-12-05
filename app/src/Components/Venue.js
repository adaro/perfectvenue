import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'
import Calendar from 'react-calendar'
import RestClient from '../HTTP/RestClient';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Iframe from 'react-iframe'
import Modal from '@material-ui/core/Modal';
import CheckboxList from './List'
import VenueCarousel from './Carousel'

import PerfectvenueGlobals from '../PerfectvenueGlobals'
const API = PerfectvenueGlobals.defaultProps.PROD;

const styles = theme => ({
  root: {
    marginTop: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing.unit * 4,
  },
  flex: {
  	display: 'flex',
  },
  venueName: {
    textAlign: 'left',
    width: '60%',
		color: '#464649',
		marginLeft: 55
  },
  spaceName: {
    textAlign: 'center',
    color: '#464649',
  },
  venueDescritpion: {
  	textAlign: 'left',
  	width: '80%',
  	marginLeft: 55
  },
  backIcon: {
  	position: 'absolute',
    top: 90,
    right: 0,
    left: 35,
    cursor: 'pointer'
  },
  bookingContainer: {
  	marginRight: '5%',
  	display: 'flex',
  	flexDirection: 'column',

  },
  button: {
  	marginTop: 20,
		marginBottom: 20,
    position: 'relative',
    paddingRight: 25,
    position: 'relative',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  calendar: {
    marginTop: 20,
    position: 'relative',
  },
  viewEventsLink: {
    paddingBottom: 100
  },
  spaceContainer: {
    border: "solid 1px #464649",
    padding: 16,
    textAlign: 'left',
    margin: 20,
  },
  bookedStyle: {
    color: 'grey'
  },
  availableDetail: {
    color: 'green',
    fontSize: 10
  },
  bookedDetail: {
    color: 'red',
    fontSize: 10
  },
  carousel: {
    margin: '0 auto'
  }
})

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class Venue extends Component {

	state = {
		venueId:null,
		venue: null,
		loading: true,
		startDate: null,
		endDate: null,
		open: false,
		spaces: [{'available': null}],
    images: [],
    showStatus: false, // REMOVE - ONLY FOR DEMO PURPOSE
    selectedSpace: null,
    selectedIndex: 0,
	}


	componentDidMount = () => {
    const getVenuePromise = RestClient('GET', '/api/venues/' + this.props.match.params.id)
    const self = this;
    getVenuePromise.then(function(resp) {
      console.log(resp, 88)
      self.setState({
        venueId:resp[0].pk,
        venue: resp[0].fields,
        loading: false,
        images: [{
          image_src: resp[0].fields.photo,
          legend: resp[0].fields.name
        }]
      }, function(resp) {
        this.setSpaceImages()
      })
    })

    this.getSpacesPromise().then(function(resp) {
      console.log(resp)
      self.setState({
        spaces: resp
      })
    })
    window.addEventListener('message', this.handleMessage, false);
	}

  getSpacesPromise = () => {
    const getSpacesPromise = RestClient('GET', '/api/spaces/?venue=' + this.props.match.params.id)
    return getSpacesPromise
  }

  setSpaceImages = () => {
    const self = this;
    const getSpacesPromise = this.getSpacesPromise()
    getSpacesPromise.then(function(resp) {
      var stateArray = self.state.images.slice();
      resp['available'].filter(function(space) {
        stateArray.push({
          image_src: space.photo,
          legend: space.name
        })
      })
      resp['booked'].filter(function(space) {
        stateArray.push({
          image_src: space.photo,
          legend: space.name
        })
      })
      self.setState({images:stateArray})
    })
  }


  handleMessage = (event) => {
      if (event.origin != API.host) { return; }
      if (event.data && event.data == 'success-event') {
        console.log('Closing Iframe', event.data)
        this.setState({showStatus: true}, function() {
          this.handleClose()
        })
      }
  }

	goBack = () => {
		window.history.back();
	}

	onDateChange = (value) => {
		const url = '/api/spaces/' +
    	'?venue=' + this.state.venueId + '&start_date=' +
    	value[0].toISOString().split('T')[0] + '&end_date=' +
    	value[1].toISOString().split('T')[0]

    const getSpacesPromise = RestClient('GET', url)
    const self = this;
    getSpacesPromise.then(function(resp) {
      self.setState({spaces: resp, startDate: value[0].toISOString().split('T')[0], endDate: value[1].toISOString().split('T')[0]})
    })

	}

	requestBooking = () => {
		// show modal iframe
		this.setState({open: true})
	}

  handleClose = () => {
    this.setState({ open: false });
  };


  // TODO: this should be in a seperate AddEvent.js compoenent
	renderModalIframe = () => {
		const { classes } = this.props;
		const url = API.host +  "/api/events/create/?venue=" + this.state.venueId +  "&start_date=" + this.state.startDate + "&end_date=" + this.state.endDate
		return (
				<Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
          	<Iframe url={url}
			        width="100%"
			        height="435px"
			        id="myId"
			        className="myClassname"
			        display="initial"
			        position="relative"
			        allowFullScreen/>
          </div>
        </Modal>
			)

	}

  setSelectedSpace = (space, index) => {
    console.log(index, 'index!')
    this.setState({selectedSpace: space, selectedIndex: index})
  }


  render() {
    // <img src={'https://via.placeholder.com/1200x300'}/>
  	const { classes } = this.props
  	const { loading, spaces } = this.state
    return (
    	<div className={classes.root}>

    		{!loading ? (
    		<div classes={classes.venueContainer}>

        <BackIcon className={classes.backIcon} onClick={this.goBack}/>

        <VenueCarousel images={this.state.images} selectedElement={this.state.selectedIndex} className={classes.carousel}/>

	    		<div className="flex">

	    		  <div className="flex-item-33">
              <h2 className={classes.venueName}>{this.state.venue.name}</h2>
              <p className={classes.venueDescritpion}>{this.state.venue.address}</p>


	    			  <p className={classes.venueDescritpion}>{this.state.venue.description}</p>
            </div>


            <div classes={classes.bookingContainer + " flex-item-33"}>
              <Calendar
                // tileDisabled={({activeStartDate, date, view }) => date.getDay() === 0}
                className={classes.calendar}
                tileDisabled={
                  ({activeStartDate, date, view }) => date < new Date()
                }
                selectRange={true}
                onChange={this.onDateChange}
                value={this.state.date}
              />

              <br/>
              <Link className={classes.viewEventsLink} to={"/venues/" + this.props.match.params.id + "/events/"}>View All Events</Link>
              <br/>
            </div>

            <div className={classes.spaceContainer + " flex-item-33"}>


              {this.state.showStatus ? (
                  <div>
                    Booking Status: <b>PENDING</b>
                  <hr/>
                  </div>
                ): null}

              {spaces.available || spaces.booked ? (
              <div className="align-center">
                <h2 className={classes.spaceName}>Spaces</h2>
                <CheckboxList data={spaces.available} setSelectedSpace={this.setSelectedSpace} status="AVAILABLE"/>
                <CheckboxList data={spaces.booked} setSelectedSpace={this.setSelectedSpace} status="BOOKED"/>
                <Button disabled={this.state.startDate == null} variant="contained" color="primary" aria-label="Request to Book" className={classes.button} onClick={this.requestBooking}>
                  <CheckIcon className={classes.extendedIcon} />
                  Request to Book
                </Button>
              </div>
              ): <h3 style={{textAlign: 'center'}}>Select a date to start planning your event.</h3> }

            </div>
	    		</div>
    		</div> ): null
    	}

    	{this.renderModalIframe()}

    	</div>
    );
  }
}

export default withStyles(styles)(Venue);