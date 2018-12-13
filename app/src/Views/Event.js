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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import NotesIcon from '@material-ui/icons/Notes';
import StatusIcon from '@material-ui/icons/RateReview';

import CancelIcon from '@material-ui/icons/Cancel';
import FilterIcon from '@material-ui/icons/FilterList';
import { NotificationContext, MessageBarContext, UserContext } from '../Components/Header'

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

	// componentWillReceiveProps = (props) => {
	// 	if (this.props.match.params.event_id) {
	// 		this.getEvent()
	// 	}
	// }

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

	updateStatus = (event, status, context, message) => {
		var self = this;
		const putEventStatusPromise = RestClient('PUT', '/api/events/' + this.state.selectedEvent.id + "/",  {"status": status})
		putEventStatusPromise.then(function(resp) {

			if (context) {
				context.getNotifications()
			}
			if (message && status !== event.status) {
					switch(status) {
						case "PN":
							message.showMessageBar("Updated to " +  'PENDING')
							return
						case "AP":
							message.showMessageBar("Updated to " + 'APPROVED')
							return
						case "DC":
							message.showMessageBar("Updated to " + 'DECLINED')
							return
						case "CN":
							message.showMessageBar("Updated to " + 'CANCELLED')
							return
					}
			}
		})

		self.getEvent()
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

		      		<div className={classes.venueCoordNotes}>
           		<ListItem>
                <ListItemIcon>
                  <NotesIcon />
                </ListItemIcon>
                <ListItemText primary="Event Notes"  secondary={this.state.selectedEvent.notes}/>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <StatusIcon />
                </ListItemIcon>
                <ListItemText primary="Status"  secondary={this.renderStatus()}/>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Start Time"  secondary={moment(this.state.selectedEvent.start_date).utc().format('YYYY/MM/DD hh:mm a').toString()}/>
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="End Time"  secondary={moment(this.state.selectedEvent.end_date).utc().format('YYYY/MM/DD hh:mm a').toString()}/>
              </ListItem>
              </div>


		      		<MessageBarContext.Consumer>
		      			{message => (
								<div>
				      		<UserContext.Consumer>
				      			{user => (
										user.state.is_venue_coordinator ?
					      		<div className="flex">
			      					<NotificationContext.Consumer>
			        					{context => (
			        					<div>


							              <TextField
							                  id="venue-notes"
							                  name="notes"
							                  label="Venue Notes"
							                  multiline
							                  rowsMax="4"
							                  value={this.state.notes}
							                  onChange={this.props.handleChange}
							                  className={classes.textField}
							                  margin="normal"
							                  helperText="Add any additional details about the booking status."
							                  variant="outlined"
							                />


										      <Button variant="contained" color="primary" aria-label="Approve" className={classes.button} onClick={(event) => this.updateStatus(event, 'AP', context, message)}>
										        <CheckIcon className={classes.extendedIcon} />
										        Approve
										      </Button>

										      <Button variant="contained" color="secondary" aria-label="Decline" className={classes.button} onClick={(event) => this.updateStatus(event, 'DC', context, message)}>
										        <CancelIcon className={classes.extendedIcon} />
										        Decline
										      </Button>
									      </div>
								      )}
										</NotificationContext.Consumer>
									</div> : null

								)}
								</UserContext.Consumer>
							</div>)}
				     </MessageBarContext.Consumer>

    		<MessageBarContext.Consumer>
	      			{message => (
							<div>
		    					<NotificationContext.Consumer>
				      			{context => (
								      <Button variant="contained" color="error" style={{backgroundColor: '#e91e63', color: 'white'}} aria-label="Cancel Event" className={classes.button} onClick={(event) => this.updateStatus(event, 'CN', context, message)}>
								        <CancelIcon className={classes.extendedIcon} />
								        Cancel
								      </Button>
								     )}
									</NotificationContext.Consumer>
							</div>)}
			   </MessageBarContext.Consumer>


	      		</div> : <h3>Select Event to see it's details</h3>
	      	}
	      </div>
      </div>
    );
  }
}

export default withStyles(styles)(Event);