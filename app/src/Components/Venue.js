import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'
import Calendar from 'react-calendar'
import DateTimePicker from 'react-datetime-picker';
import RestClient from '../HTTP/RestClient';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Iframe from 'react-iframe'
import Modal from '@material-ui/core/Modal';
import CheckboxList from './List'
import VenueCarousel from './Carousel'
import AddEvent from '../Views/AddEvent'
import moment from 'moment'
import PerfectvenueGlobals from '../PerfectvenueGlobals'
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 20
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
		open: false,
		spaces: [],
    images: [],
    showStatus: false, // REMOVE - ONLY FOR DEMO PURPOSE
    selectedSpace: null,
    selectedIndex: 0,
    checked: [],
    duration: null,
    numGuests: 1,
    notes: ''
	}


	componentDidMount = () => {
    const getVenuePromise = RestClient('GET', '/api/venues/' + this.props.match.params.id)
    const self = this;
    getVenuePromise.then(function(resp) {
      self.setState({
        venueId:resp[0].pk,
        venue: resp[0].fields,
        loading: false,
        spaces: [{
          status: null,
          obj: resp[0].fields
        }]
      }, function() {
        this.getSpacesPromise().then(function(resp) {
          self.formatSpaces(resp)
        })
      })
    })

	}

  formatSpaces = (resp) => {
    const self = this;
    const arr = [] //self.state.spaces.slice()
    resp['available'].map((value) => {
      arr.push({
        status: 'AVAILABLE',
        obj: value
      })
    })
    resp['booked'].map((value) => {
      arr.push({
        status: 'BOOKED',
        obj: value
      })
    })
    console.log(arr, 54545)
    self.setState({
      spaces: arr
    })
  }

  getSpacesPromise = () => {
    const getSpacesPromise = RestClient('GET', '/api/spaces/?venue=' + this.props.match.params.id)
    return getSpacesPromise
  }


	goBack = () => {
		this.props.history.goBack();
	}


	onDateChange = (value) => {
    const self = this;
    var startDateJS = new Date(value);
    const startDate = moment(new Date(value + ' UTC')).utc().format()

    const url = '/api/spaces/' +
     '?venue=' + this.state.venueId + '&start_date=' +
     startDate + '&duration=' + this.state.duration

    const getSpacesPromise = RestClient('GET', url)
    getSpacesPromise.then(function(resp) {
      self.formatSpaces(resp)
      self.setState({startDate: startDate, startDateForm: startDateJS})
    })
	}

  onFormDateChange = (type, value) => {
    switch(type) {
      case 'dayClick':
        if (!this.state.startDate) {
          const startDate = new Date(value);
          this.setState({startDate})
        }
        if (!this.state.endDate) {
          const endDate = new Date(value);
          this.setState({endDate})
        }
        this.onDateChange([value, value])
        return
      case 'startDate':
        const startDate = new Date(value);
        this.setState({startDate})
        return
      case 'endDate':
        const endDate = new Date(value);
        this.setState({endDate})
        return
    }
  }


  handleSubmit = (event) => {
    const self = this;
    event.preventDefault()
    console.log(this.state.checked)
    const url = '/api/events/create/'
    const data = new FormData(event.target);
    var object = {};
    data.forEach(function(value, key){object[key] = value});
    object['venue'] = self.state.venueId
    object['spaces'] = self.state.checked
    object['duration'] = self.state.duration
    object['startDate'] = self.state.startDateForm
    const postFormPromise = RestClient('POST', url, object)
    postFormPromise.then(function(resp) {
      self.setState({showStatus: true, open: false})
    })

  }

	requestBooking = () => {
		// show modal iframe
		this.setState({open: true})
	}

  handleClose = () => {
    this.setState({ open: false });
  };

  handleFormChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

	renderModalIframe = () => {
		const { classes } = this.props;
		const url = API.host +  "/api/events/create/?venue=" + this.state.venueId +  "&start_date=" + this.state.startDate + "&end_date=" + this.state.endDate
		return (
        <AddEvent handleClose={this.handleClose} handleSubmit={this.handleSubmit} onFormDateChange={this.onFormDateChange} handleChange={this.handleFormChange} open={this.state.open} booking={{
          name: '',
          venue: this.state.venue,
          spaces: this.state.spaces,
          startDate: this.state.startDateForm,
          duration: this.state.duration
        }}/>
			)

	}

  setSelectedSpace = (space, index, status) => {
    const self = this;
    console.log(index)
    this.setState({selectedSpace: space, selectedIndex: index}, function(resp) {

    })
  }

  checkSelectedSpace = (space, status) => {
      const { checked } = this.state;
      const currentIndex = checked.indexOf(space);
      const newChecked = [...checked];
      if (status === 'BOOKED') {return;}
      if (currentIndex === -1) {
        newChecked.push(space);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      this.setState({
        checked: newChecked,
      });
  }

  handleDurationChange = (event) => {
    const self = this;
    const url = '/api/spaces/' +
     '?venue=' + this.state.venueId + '&start_date=' +
     this.state.startDate + '&duration=' + event.target.value

    const getSpacesPromise = RestClient('GET', url)
    getSpacesPromise.then(function(resp) {
      self.formatSpaces(resp)
    })


    this.setState({duration: event.target.value})
  }


  render() {
    // <img src={'https://via.placeholder.com/1200x300'}/>

    // <Calendar
      // tileDisabled={({activeStartDate, date, view }) => date.getDay() === 0}
    //   utcOffset={0}
    //   className={classes.calendar}
    //   tileDisabled={
    //     ({activeStartDate, date, view }) => date < new Date()
    //   }
    //   onClickDay={( value ) => {this.onFormDateChange('dayClick', value)}}
    //   onChange={this.onDateChange}
    //   value={this.state.date}
    // />

  	const { classes } = this.props
  	const { loading, spaces } = this.state
    return (
    	<div className={classes.root}>

    		{!loading ? (
    		<div classes={classes.venueContainer}>

        <BackIcon className={classes.backIcon} onClick={this.goBack}/>

        <VenueCarousel images={this.state.spaces} selectedElement={this.state.selectedIndex} className={classes.carousel}/>

	    		<div className="flex">

	    		  <div className="flex-item-60">
              <h2 className={classes.venueName}>{this.state.venue.name}</h2>
              <p className={classes.venueDescritpion}>{this.state.venue.address}</p>
	    			  <p className={classes.venueDescritpion}>{this.state.venue.description}</p>
              <br/>
              <Link className={classes.viewEventsLink} to={"/venues/" + this.props.match.params.id + "/events/"}>View All Events</Link>
            </div>


            <div className={classes.spaceContainer + " flex-item-40"}>

              {this.state.showStatus ? (
                  <div>
                    Booking Status: <b>PENDING</b>
                  <hr/>
                  </div>
                ): null}


              <div classes={"pv-border flex-item-25"}>
                <h2 className={classes.spaceName}>Event Details</h2>

                <FormGroup className={classes.textField}>
                  <FormLabel component="legend">Start Time</FormLabel>
                  <DateTimePicker utcOffset={0} name="startDate" onChange={this.onDateChange} value={this.state.startDateForm}/>
                </FormGroup>

                <FormGroup className={classes.textField}>
                  <FormLabel component="legend">Duration</FormLabel>
                   <Select

                      value={this.state.duration}
                      onChange={this.handleDurationChange}
                      inputProps={{
                        name: 'duration',
                        id: 'duration-simple',
                      }}
                    >
                    <MenuItem value={30}>
                      <em>Duration</em>
                    </MenuItem>
                    <MenuItem value={30}>0:30 minutes</MenuItem>
                    <MenuItem value={60}>1:00 hour</MenuItem>
                    <MenuItem value={90}>1:30 hours</MenuItem>
                    <MenuItem value={120}>2:00 hours</MenuItem>
                    <MenuItem value={150}>2:30 hours</MenuItem>
                    <MenuItem value={180}>3:00 hours</MenuItem>
                    <MenuItem value={210}>3:30 hours</MenuItem>
                    <MenuItem value={240}>4:00 hours</MenuItem>
                    <MenuItem value={270}>4:30 hours</MenuItem>
                    <MenuItem value={300}>5:00 hours</MenuItem>
                    <MenuItem value={330}>5:30 hours</MenuItem>
                    <MenuItem value={360}>6:00 hours</MenuItem>
                    <MenuItem value={390}>6:30 hours</MenuItem>
                    <MenuItem value={420}>7:00 hours</MenuItem>
                    <MenuItem value={450}>7:30 hours</MenuItem>
                    <MenuItem value={480}>8:00 hours</MenuItem>
                    <MenuItem value={510}>8:30 hours</MenuItem>
                    <MenuItem value={540}>9:00 hours</MenuItem>
                    <MenuItem value={570}>9:30 hours</MenuItem>
                    <MenuItem value={600}>10:00 hours</MenuItem>
                    <MenuItem value={630}>10:30 hours</MenuItem>
                    <MenuItem value={660}>11:00 hours</MenuItem>
                    <MenuItem value={690}>11:30 hours</MenuItem>
                    <MenuItem value={720}>12:00 hours</MenuItem>
                  </Select>
                </FormGroup>

                <br/>

              </div>

              {spaces ? (
              <div className="align-center">
                <h2 className={classes.spaceName}>Spaces</h2>
                <CheckboxList startDate={this.state.startDate} duration={this.state.duration} checked={this.state.checked} data={spaces} setSelectedSpace={this.setSelectedSpace} checkSelectedSpace={this.checkSelectedSpace}/>
                <Button disabled={this.state.checked.length == 0} variant="contained" color="primary" aria-label="Request to Book" className={classes.button} onClick={this.requestBooking}>
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