import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { browserHistory } from 'react-router'
import TextField from '@material-ui/core/TextField';
import DateTimePicker from 'react-datetime-picker';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import Modal from '@material-ui/core/Modal';
import PerfectvenueGlobals from '../PerfectvenueGlobals'
const API = PerfectvenueGlobals.defaultProps.PROD;

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing.unit * 4,
  },
  textField: {
    margin: '20px auto',
    width: '80%',
  },
});

class AddEvent extends Component {

  componentDidMount = () => {
  }

	componentWillReceiveProps = () => {
		this.setState({open: this.props.open})
	}

  state = {
  };

  render() {

  	const { classes } = this.props;

    return (

				<Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <form className={"flex-column"} onSubmit={this.props.handleSubmit} autoComplete="off">

                <TextField
                  id="event-name"
                  name="name"
                  label="What is the name of your Event?"
                  className={classes.textField}
                  value={this.state.name}
                  onChange={this.props.handleChange}
                  margin="normal"
                />

                <FormGroup className={classes.textField}>
                  <FormLabel component="legend">Start Date</FormLabel>
                  <DateTimePicker name="startDate" onChange={this.props.onFormDateChange.bind(this, 'startDate')} value={this.props.booking.startDate}/>
                </FormGroup>
                <FormGroup className={classes.textField}>
                  <FormLabel component="legend">End Date</FormLabel>
                  <DateTimePicker name="endDate" onChange={this.props.onFormDateChange.bind(this, 'endDate')} value={this.props.booking.endDate}/>
                </FormGroup>
                <Button type="submit" className={classes.textField} variant="contained" color="primary">Request Booking</Button>

            </form>
          </div>
        </Modal>

    );
  }
}

AddEvent.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddEventModalWrapped = withStyles(styles)(AddEvent);

export default AddEventModalWrapped;
