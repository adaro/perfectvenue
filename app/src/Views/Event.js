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

class Event extends Component {

	state = {
		events: [],
		selectedEvent: null
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
      	alert('Could not find event.')
      }
    })
	}

	getEvents = () => {
    const getEventsPromise = RestClient('GET', '/api/events/?venue=' + this.props.match.params.id)
    const self = this;
    getEventsPromise.then(function(resp) {
      self.setState({events: resp})
    })
	}

	handleSelectSlot = () => {
		console.log(124)
	}

	handleSelectEvent = (event) => {
		// if deeplink - get event using ID
		// set scrollToTime var from event date
		window.history.pushState({}, document.title, "/venues/" + this.props.match.params.id + "/events/" + event.pk);
		this.setState({selectedEvent: event})
	}

	updateStatus = (status) => {
		console.log(status)
		const putEventStatusPromise = RestClient('PUT', '/api/events/' + this.state.selectedEvent.pk + "/",  {"status": status})
		putEventStatusPromise.then(function(resp) {
			console.log(resp)
		})
	}

  render() {
  	const { classes } = this.props;
  	const { selectedEvent } = this.state
    return (
      <div className="flex">
	      <div className="flex-item-75">
	      	<EventCalendar eventsList={this.state.events} selected={this.state.selectedEvent ? this.state.selectedEvent.fields : null} handleSelectSlot={this.handleSelectSlot} handleSelectEvent={this.handleSelectEvent}/>
	      </div>
	      <div className={"flex-item-25 " + classes.eventDetails}>
	      	{ selectedEvent ?
	      		<div>
		      		<h2>{this.state.selectedEvent.fields.name}</h2>
		      		<div>Status: {this.state.selectedEvent.fields.status == 'PN' ? <b>PENDING</b> : this.state.selectedEvent.fields.status}</div>
		      		<p className={classes.eventRequestNotes}>{this.state.selectedEvent.fields.notes}</p>

		      		<div className={classes.dateContainer}>
		      			<div>Start: <small>{moment(this.state.selectedEvent.fields.start_date).format('YYYY/MM/DD hh:mm a').toString()}</small></div>
		      			<div>End: <small>{moment(this.state.selectedEvent.fields.end_date).format('YYYY/MM/DD hh:mm a').toString()}</small></div>
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
					      <Button variant="contained" color="primary" aria-label="Approve" className={classes.button} onClick={() => this.updateStatus('AP')}>
					        <CheckIcon className={classes.extendedIcon} />
					        Approve
					      </Button>

					      <Button variant="contained" color="secondary" aria-label="Decline" className={classes.button} onClick={() => this.updateStatus('DC')}>
					        <CancelIcon className={classes.extendedIcon} />
					        Decline
					      </Button>
							</div>

	      		</div> : <h3>Select Event to see it's details</h3>
	      	}
	      </div>
      </div>
    );
  }
}

export default withStyles(styles)(Event);