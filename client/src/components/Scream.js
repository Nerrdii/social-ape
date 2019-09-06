import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Scream extends Component {
  render() {
    const {
      classes,
      scream: {
        body,
        createdAt,
        userHandle,
        userImage,
        likeCount,
        commentCount
      }
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile image"></CardMedia>
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
            component={Link}
            to={`/users/${userHandle}`}>
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Scream);
