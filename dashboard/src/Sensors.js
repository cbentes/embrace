import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
import _ from 'lodash';


const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    display: 'flex',
  },
  rowTemp: {
    marginTop: 20,
  },
  sensor: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    flex: 1,
    display: 'flex',
    overflow: 'hidden',

    '&:not(:last-child)': {
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
  render() {
    const { classes, heartRate, temperature, direction: {x: u, y: v, z: w} } = this.props;
    console.log({ u, v, w })
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <Paper className={classes.sensor} elevation={1}>
            <Plot
              data={[
                {
                  x: heartRate.map(({ timestamp }) => new Date(timestamp * 1000)),
                  y: heartRate.map(({ average }) => average),
                  type: 'scatter',
                  mode: 'lines+points',
                },
              ]}
              layout={{ responsive: true, title: '💓 Heart rate', yaxis: {title: 'Beats per minute'}, xaxis: {title: 'Time'} }}
              className={classes.plot}
            />
          </Paper>

          <Paper className={classes.sensor} elevation={1}>
            {/* <Plot
              data={[
                {
                  'type': 'cone',
                  'x': [0],
                  'y': [0],
                  'z': [0],
                  'u': [u],
                  'v': [v],
                  'w': [w]
                }
              ]}
              layout={{
                responsive: true,
                title: 'Head direction',
                xaxis: {
                  range: [-2, 2]
                },
                yaxis: {
                  range: [-2, 2]
                },
                zaxis: {
                  range: [-2, 2]
                },
                // scene: {
                //   camera: {
                //     eye: {
                //       x: -0.76,
                //       y: 1.8,
                //       z: 0.92
                //     }
                //   }
                // }
              }}
              className={classes.plot}
            /> */}
            <Plot
              data={[{
                type: 'bar',
                x: ['x', 'y', 'z'],
                y: [u, v, w]
              }]}
              className={classes.plot}
              layout={{responsive: true, title: 'Head direction'}}
            />
          </Paper>
        </div>
        <div className={classes.row + ' ' + classes.rowTemp}>
          <Paper className={classes.sensor} elevation={1}>
            <Plot
              data={[
                {
                  x: temperature.map(({ timestamp }) => new Date(timestamp * 1000)),
                  y: temperature.map(({ average }) => average),
                  type: 'scatter',
                  mode: 'lines+points',
                },
              ]}
              layout={{ responsive: true, title: '🌡Body temperature', yaxis: {title: 'Degrees'}, xaxis: {title: 'Time'} }}
              className={classes.plot}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Sensors);