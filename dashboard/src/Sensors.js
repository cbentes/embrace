import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Plot from 'react-plotly.js';
import io from 'socket.io-client';
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
  constructor(props) {
    super(props)
    this.state = {
      heartRate: [],
      temperature: [],
      direction: {
        x: 1,
        y: 1,
        z: 1
      }
    }
  }

  componentDidMount() {
    this.socket = io('http://18.203.88.206')
    this.socket.on('connect', () => console.log('connected'));

    this.socket.on('sensor_data', (data) => {
      if (data.data && data.data.Uri.includes('HR')) {
        this.setState({
          heartRate: this.state.heartRate.concat([{
            average: data.data.Body.average,
            timestamp: data.timestamp
          }])
        })
      } else {
        this.setState({
          temperature: this.state.temperature.concat([{
            average: data.data.Body.Measurement,
            timestamp: data.timestamp
          }])
        })
      }
    });

    this.socket.on('ar_data', ({x, y, z}) => console.log(x, y, z) || this.setState({
      direction: {
        x: Number(x) * 100,
        y: Number(y) * 100,
        z: Number(z) * 100
      }
    }))

    this.socket.on('disconnect', () => console.log('disconnected'))
  }

  render() {
    const { classes } = this.props;
    const { heartRate, temperature, direction: {x: u, y: v, z: w}} = this.state;
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