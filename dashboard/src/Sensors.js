import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
import createSocket from 'socket.io-client';


const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  sensor: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    flex: 1,
    display: 'flex',
    overflow: 'hidden',

    '&:first-child': {
      marginRight: 20,
      flex: 2,
    },
  },
  plot: {
    flex: 1,
    height: 400,
  }
});


class Sensors extends Component {
  componentDidMount() {
    this.socket = createSocket('http://18.203.88.206')
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('event', (data) => console.log(data));
    this.socket.on('disconnect', () => console.log('disconnected'))
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.sensor} elevation={1}>
          <Plot
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines+points',
              },
            ]}
            layout={{ responsive: true, title: 'Heart rate' }}
            className={classes.plot}
          />

        </Paper>
        <Paper className={classes.sensor} elevation={1}>
          <Plot
            data={[
              {
                'type': 'cone',
                'x': [0],
                'y': [0],
                'z': [0],
                'u': [1],
                'v': [1],
                'w': [0]
              }
            ]}
            layout={{
              responsive: true,
              title: 'Head direction',
              scene: {
                camera: {
                  eye: {
                    x: -0.76,
                    y: 1.8,
                    z: 0.92
                  }
                }
              }
            }}
            className={classes.plot}
          />

        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Sensors);