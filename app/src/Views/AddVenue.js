import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'
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
});

class AddVenue extends Component {

	componentWillReceiveProps() {
		this.setState({open: this.props.open})
	}

  state = {
    open: this.props.open ? this.props.open : false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {

  	const { classes } = this.props;

    return (

				<Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
          	<Iframe url={API.host + "/api/venues/add/"}
			        width="100%"
			        height="700px"
			        id="myId"
			        className="myClassname"
			        display="initial"
			        position="relative"
			        allowFullScreen/>
          </div>
        </Modal>

    );
  }
}

AddVenue.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddVenueModalWrapped = withStyles(styles)(AddVenue);

export default AddVenueModalWrapped;
