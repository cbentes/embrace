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
    flexDirection: 'column'
  },
  selected: {
    background: theme.palette.primary.light,
    color: 'white',
  },
  selectedBadge: {
    boxSizing: 'border-box',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100%',
    background: '#4CAF50',
    color: 'white',
    flex: 1,
    display: 'flex',
    padding: '14px 10px',

    '& > span': {
        flex: 1,
        margin: 'auto',
    }
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
    <Card className={isSelected ? classes.card + ' ' + classes.selected : classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          className={classes.media}
          height="240"
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent className={isSelected ? classes.selectedText : null}>
          <Typography gutterBottom variant="h5" component="h2" color='inherit'>
            {name}
          </Typography>
          <Typography component="p" color='inherit'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
        {isSelected ?
            <div className={classes.selectedBadge}><span>Selected</span></div> :
            <CardActions>
                <Button size="small" color="primary" onClick={onSelectScene}>
                    Select
                </Button>}
            </CardActions>}
    </Card>
  );
}

export default withStyles(styles)(Scene);