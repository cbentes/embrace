import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import AppBar from './AppBar';
import Sensors from './Sensors';
import Controls from './Controls';
import Scenes from './Scenes';

const styles = theme => ({
  container: {
    margin: '0 150px 40px',
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <AppBar />
        <main className={classes.container}>
          <Header>Sensors</Header>
          <Sensors />
          <Header>Scene</Header>
          <Scenes />
          <Header>Controls</Header>
          <Controls />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
