import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    maxWidth: 345,
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.2s',
    position: 'relative',
  },
  actionAreaContainer: {
    display: 'flex',
  },
  actionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 50,
  },
  cardContent: {
    flex: 1,
  },
  selected: {
    background: theme.palette.primary.light,
    color: 'white',
    transition: 'color 0.2s'
  },
  badge: {
    transition: 'bottom 0.2s',
    overflow: 'hidden',
    position: 'absolute',
    bottom: -50,
    boxSizing: 'border-box',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    textAlign: 'center',
    width: '100%',
    background: '#4CAF50',
    color: 'white',
    display: 'flex',
    padding: '14px 10px',

    '& > span': {
        flex: 1,
        margin: 'auto',
    }
  },
  selectedBadge: {
    bottom: 0,
  },
  selectedText: {
    color: 'white',
  },
  media: {
    objectFit: 'cover',
  },
});

function Scene(props) {
  const { classes, image, isSelected, name, description, onSelectScene } = props;
  return (
    <Card className={isSelected ? classes.card + ' ' + classes.selected : classes.card} onClick={onSelectScene}>
      <CardActionArea className={classes.actionArea}>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          className={classes.media}
          height="240"
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent className={classes.cardContent + ' ' + (isSelected ? classes.selectedText : '')}>
          <Typography gutterBottom variant="h5" component="h2" color='inherit'>
            {name}
          </Typography>
          <Typography component="p" color='inherit'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <div className={classes.badge + ' ' + (isSelected ? classes.selectedBadge : '')}>
        <span>Selected</span>
      </div>
    </Card>
  );
}

export default withStyles(styles)(Scene);