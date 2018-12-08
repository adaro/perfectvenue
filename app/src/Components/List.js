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

  renderList = (value, index) => {
    const { classes, data, status, setSelectedSpace, checkSelectedSpace } = this.props;
    if (value.status) {
      return (
        <div>
          <ListItem key={value.obj.name} role={undefined} dense button onClick={setSelectedSpace.bind(this, value.obj, index, value.status)}>
           <ListItemAvatar>
              <Avatar alt="S" src={value.obj.photo} />
            </ListItemAvatar>
            <ListItemText primary={`${value.obj.name}`} secondary={<Typography type="span" className={classes[value.status]}>{value.status}</Typography>} />
            <ListItemSecondaryAction>
            </ListItemSecondaryAction>
             <Checkbox
                onClick={this.props.checkSelectedSpace.bind(this, value.obj, value.status)}
                disabled={this.props.duration == null || this.props.startDate == null || value.status == "BOOKED"}
                checked={this.props.checked.indexOf(value.obj) !== -1}
                tabIndex={-1}
                disableRipple={true}
              />
          </ListItem>
        </div>
      )
    }

    else {
      return null
    }
  }

  render() {
    const { classes, data, status, setSelectedSpace, checkSelectedSpace } = this.props;
    const self = this
    return (
      <List className={classes.root}>
        {data.map((value, index) => (
          self.renderList(value, index)
        ))}
      </List>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);