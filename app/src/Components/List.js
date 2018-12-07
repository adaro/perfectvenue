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

  render() {
    const { classes, data, status, setSelectedSpace } = this.props;

    return (
      <List className={classes.root}>
        {data.map((value, index) => (
          <ListItem disabled={this.props.startDate == null} key={value.name} role={undefined} dense button onClick={setSelectedSpace.bind(this, value, index + 1, status)}>
           <ListItemAvatar>
              <Avatar alt="S" src={value.photo} />
            </ListItemAvatar>

            <ListItemText primary={`${value.name}`} secondary={<Typography type="span" className={classes[status]}>{status}</Typography>} />
            <ListItemSecondaryAction>

            </ListItemSecondaryAction>

             <Checkbox
                  checked={this.props.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple={true}
                  disabled={status == "BOOKED"}
                />

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