import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 345,
    maxHeight: 345,
    margin: 20,
    marginBottom: 20,
  },
  details: {
     textDecoration: null,
     maxHeight: 200,
     overflow: 'scroll',
     overflowX: 'hidden',
     marginBottom: 20
  },
  media: {
    height: 140,
  },
};

class MediaCard extends Component {
  render() {
    const { classes } = this.props;
    return (
     <Link to={this.props.actionRoute}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={this.props.media}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this.props.title}
            </Typography>
            <Typography component="p" className={classes.details}>
              {this.props.details}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      </Link>
    );
  }
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);