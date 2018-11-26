import React, { Component } from 'react';
import Calendar from 'react-calendar'
import RestClient from '../HTTP/RestClient';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Iframe from 'react-iframe'
import Modal from '@material-ui/core/Modal';

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
  	width: '95%'
  },
  venueName: {
    textAlign: 'left',
    width: '50%',
		color: '#464649',
		marginLeft: 55
  },
  venueDescritpion: {
  	textAlign: 'left',
  	width: '50%',
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
  	flexDirection: 'column'
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
    marginBottom: 20,
    position: 'relative',
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
		spaces: []
	}


	componentDidMount = () => {
		console.log(this.props.match.params.id)

    const getVenuePromise = RestClient('GET', '/api/venues/' + this.props.match.params.id)
    const self = this;
    getVenuePromise.then(function(resp) {
      self.setState({venueId:resp[0].pk, venue: resp[0].fields, loading: false})
    })

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
    	console.log(resp)
      self.setState({spaces: resp, startDate: value[0].toISOString().split('T')[0], endDate: value[1].toISOString().split('T')[0]})
    })

	}

	requestBooking = () => {
		console.log()
		// http://127.0.0.1:8000/api/events/?venue=1&start_date=2018-12-19&end_date=2018-12-20
		// show modal iframe
		this.setState({open: true})
	}

  handleClose = () => {
    this.setState({ open: false });
  };


  // TODO: this should be in a seperate AddEvent.js compoenent
	renderModalIframe = () => {
		const { classes } = this.props;

		const url = "http://127.0.0.1:8000/api/events/create/?venue=" + this.state.venueId +  "&start_date=" + this.state.startDate + "&end_date=" + this.state.endDate
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
			        height="550px"
			        id="myId"
			        className="myClassname"
			        display="initial"
			        position="relative"
			        allowFullScreen/>
          </div>
        </Modal>
			)

	}


  render() {

  	const { classes } = this.props
  	const { loading } = this.state
    return (
    	<div className={classes.root}>
    		<BackIcon className={classes.backIcon} onClick={this.goBack}/>
    		<img src={'https://via.placeholder.com/1200x300'}/>

    		{!loading ? (
    		<div classes={classes.venueContainer}>
	    		<div className={classes.flex}>
	    		  <div><h2 className={classes.venueName}>{this.state.venue.name}</h2>
	    			<p className={classes.venueDescritpion}>{this.state.venue.description}</p></div>
	    			<div classes={classes.bookingContainer}>
				      <Button disabled={this.state.startDate == null} variant="contained" color="primary" aria-label="Request to Book" className={classes.button} onClick={this.requestBooking}>
				        <CheckIcon className={classes.extendedIcon} />
				        Request to Book
				      </Button>
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