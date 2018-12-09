import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import EventCalendar from '../Components/EventCalendar'
import RestClient from '../HTTP/RestClient';
import PerfectvenueGlobals from '../PerfectvenueGlobals'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import FilterIcon from '@material-ui/icons/FilterList';
import { NotificationContext } from '../Components/Header'

const API = PerfectvenueGlobals.defaultProps.PROD;


const styles = theme => ({
  eventDetails: {
    border: "2px solid #464649",
    minHeight: 200,
    marginTop: 20,
    margin: 20,
    padding: 20,
    backgroundColor: '#d3d3d317'
  },
  eventRequestNotes: {
  	textAlign: 'left',
    width: '90%',
  },
  dateContainer: {
  	textAlign: 'left'
  },
  venueCoordNotes: {
  	textAlign: 'left',
  	padding: 20,
  	marginTop: 20,
  	border: "1px solid #e8e7e8",
  },
   button: {
  	marginTop: 20,
    position: 'relative',
    paddingRight: 25,
    position: 'relative',
    margin: 10
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
})

const spaces = []

class Event extends Component {

	state = {
		events: [],
		selectedEvent: null,
		filtered: false
	}

	componentDidMount = () => {
		if (this.props.match.params.event_id) {
			this.getEvent()
		}
		this.getEvents()
	}

	getEvent = () => {
    const getEventPromise = RestClient('GET', '/api/events/' + this.props.match.params.event_id)
    const self = this;
    getEventPromise.then(function(resp) {
    	if (resp.length > 0) {
    		self.setState({selectedEvent: resp[0]})
    	}
      else {
      	console.log('Could not find event.')
      }
    })
	}

	getEvents = () => {
    const getEventsPromise = RestClient('GET', '/api/events/?venue=' + this.props.match.params.id)
    const self = this;
    getEventsPromise.then(function(resp) {
      self.setState({events: resp, allEvents: resp})
    })
	}

	handleSelectSlot = () => {
		console.log(124)
	}

	handleSelectEvent = (event) => {
		// if deeplink - get event using ID
		// set scrollToTime var from event date
		this.props.history.push("/venues/" + this.props.match.params.id + "/events/" + event.id);
		this.setState({selectedEvent: event})
	}

	updateStatus = (event, status, context) => {
		var self = this;
		const putEventStatusPromise = RestClient('PUT', '/api/events/' + this.state.selectedEvent.id + "/",  {"status": status})
		putEventStatusPromise.then(function(resp) {
			self.getEvent()
			context.getNotifications()
		})
	}

	filterEvents = (spaceName) => {
		const events = [];
		this.state.allEvents.filter(function(event) {
			event.spaces.filter(function(space) {
				if (space.name == spaceName) {
					events.push(event)
				}
			})
		})
		this.setState({events:events, filtered:true})
	}

	clearFilters = () => {
		this.setState({events: this.state.allEvents, filtered:false})
	}

	renderStatus() {
		switch(this.state.selectedEvent.status) {
			case "PN":
					return (<b>PENDING</b>)
			case "AP":
					return (<b>APPROVED</b>)
			case "DC":
					return (<b>DECLINED</b>)
			case "CN":
					return (<b>CANCELLED</b>)
		}
	}

	uniq = (a) => {
	   return Array.from(new Set(a));
	}

	renderSpaces = (event) => {

		event.spaces.map(function(space) {
			if (!spaces.includes(space.name)) {
				spaces.push(space.name)
				}
		})

	}

	renderSpaceFilters = () => {
		const { classes } = this.props;
		const self = this;
		return (
			<div>
				{spaces.map(function(space) {
					return (
							<Button variant="contained" color="primary" className={classes.button} onClick={() => {self.filterEvents(space)}}>
							<FilterIcon className={classes.extendedIcon} />
							{space}
							</Button>
						)
					})
				}
			</div>
			)
	}

	convertDates = (dateString) => {

		var dateUtc = moment.utc(dateString);
		var localDate = moment(dateUtc).local();
		return localDate

	}

  render() {
  	const { classes } = this.props;
  	const { selectedEvent } = this.state
  	const self = this;

  	if (this.state.allEvents) {
  			this.state.allEvents.map(function(event) {
  				self.renderSpaces(event)
	  		})
	  }

    return (
      <div className="flex">
	      <div className="flex-item-75">

	      	<div className="flex">
	      		<Button variant="contained" color="secondary" disabled={!this.state.filtered} className={classes.button} onClick={() => {self.clearFilters()}}>
	      		<CancelIcon className={classes.extendedIcon} />
	      		Clear
	      		</Button>
		      	{this.renderSpaceFilters()}
	      	</div>

	      	<EventCalendar eventsList={this.state.events} selected={this.state.selectedEvent ? this.state.selectedEvent : null} handleSelectSlot={this.handleSelectSlot} handleSelectEvent={this.handleSelectEvent}/>
	      </div>
	      <div className={"flex-item-25 " + classes.eventDetails}>
	      	{ selectedEvent ?
	      		<div>
		      		<h2>{this.state.selectedEvent.name}</h2>
		      		<div>Status: {this.renderStatus()}</div>
		      		<p className={classes.eventRequestNotes}>{this.state.selectedEvent.notes}</p>

		      		<div className={classes.dateContainer}>
		      			<div>Start: <small>{moment(this.state.selectedEvent.start_date).utc().format('YYYY/MM/DD hh:mm a').toString()}</small></div>
		      			<div>End: <small>{moment(this.state.selectedEvent.end_date).utc().format('YYYY/MM/DD hh:mm a').toString()}</small></div>
		      		</div>

		      		<div className={classes.venueCoordNotes}>
		      			<TextField
								  placeholder="My notes"
								  multiline={true}
								  rows={5}
								  rowsMax={10}
								/>
		      		</div>

		      		<div className="flex">
      					<NotificationContext.Consumer>
        					{context => (
        						<div>
						      <Button variant="contained" color="primary" aria-label="Approve" className={classes.button} onClick={event => this.updateStatus(event, 'AP', context)}>
						        <CheckIcon className={classes.extendedIcon} />
						        Approve
						      </Button>

						      <Button variant="contained" color="secondary" aria-label="Decline" className={classes.button} onClick={event => this.updateStatus(event, 'DC', context)}>
						        <CancelIcon className={classes.extendedIcon} />
						        Decline
						      </Button>
						      </div>
					      )}

							</NotificationContext.Consumer>


							</div>

	      		</div> : <h3>Select Event to see it's details</h3>
	      	}
	      </div>
      </div>
    );
  }
}

export default withStyles(styles)(Event);