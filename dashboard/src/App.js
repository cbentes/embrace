import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import AppBar from './AppBar';
import Sensors from './Sensors';
import Controls from './Controls';
import Scenes from './Scenes';
import io from 'socket.io-client';

const styles = theme => ({
  container: {
    margin: '0 150px 40px',
  }
});

class App extends Component {
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
    const { heartRate, temperature, direction } = this.state;
    return (
      <div className="App">
        <AppBar />
        <main className={classes.container}>
          <Header>Sensors</Header>
          <Sensors heartRate={heartRate} direction={direction} temperature={temperature} />
          <Header>Scene</Header>
          <Scenes />
          <Header>Controls</Header>
          <Controls heartRate={heartRate} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
