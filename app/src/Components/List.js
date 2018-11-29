import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  'AVAILABLE': {
    color: 'green',
    fontSize: 10
  },
  'BOOKED': {
    color: 'red',
    fontSize: 10
  }
});

class CheckboxList extends React.Component {
  state = {
    checked: [0],
  };

  // TODO: add back in the checkbox
  //   <Checkbox
  //   checked={this.state.checked.indexOf(value) !== -1}
  //   tabIndex={-1}
  //   disableRipple={true}
  //   disabled={status == "BOOKED"}
  // />

  // handleToggle = (value, status) => () => {
  //   const { checked } = this.state;
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (status === 'BOOKED') {return;}

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   this.setState({
  //     checked: newChecked,
  //   });
  // };

  render() {
    const { classes, data, status, setSelectedSpace } = this.props;

    return (
      <List className={classes.root}>
        {data.map((value, index) => (
          <ListItem key={value.name} role={undefined} dense button onClick={setSelectedSpace.bind(this, value, index + 1)}>
           <ListItemAvatar>
              <Avatar alt="S" src={value.photo} />
            </ListItemAvatar>

            <ListItemText primary={`${value.name}`} secondary={<Typography type="span" className={classes[status]}>{status}</Typography>} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Comments">
                <InfoIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);