import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { browserHistory } from 'react-router'
import DateTimePicker from 'react-datetime-picker';
import { withStyles } from '@material-ui/core/styles';
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
  }
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
            <form className={"flex-column"} onSubmit={this.props.handleSubmit}>
              <label>
                What is the name of your Event?
                <input type="text" name="name"  onChange={this.props.handleChange} />
              </label>

              <label>
                Which spaces would you like to book?
                <select multiple={true} name="spaces" value={this.props.booking.spaces} onChange={this.props.handleChange}></select>
              </label>

              <label>
                Start time?
                <DateTimePicker name="startDate" onChange={this.props.onFormDateChange.bind(this, 'startDate')} value={this.props.booking.startDate}/>
              </label>

              <label>
                End time?
                <DateTimePicker name="endDate" onChange={this.props.onFormDateChange.bind(this, 'endDate')} value={this.props.booking.endDate}/>
              </label>

              <input type="submit" value="Submit" />
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
