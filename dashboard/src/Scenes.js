import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Scene from './Scene';

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

const styles = theme => ({
  container: {
      display: 'flex',
      justifyContent: 'center',
       '& > *:not(:last-child)': {
            marginRight: 20,
       }
  }
});

class Scenes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImage: 0
        }
    }

    handleSelectScene = (index) => {
        this.setState({selectedImage: index})
    }

    render() {
        const { classes } = this.props;
        const { selectedImage } = this.state;
        return (
            <div className={classes.container}>
                <Scene
                    image="http://18.203.88.206/static/images/dog.jpg"
                    isSelected={selectedImage == 0}
                    name="Dog"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(0)}/>

                <Scene
                    image="http://18.203.88.206/static/images/spider.jpg"
                    isSelected={selectedImage == 1}
                    name="Spider"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(1)}
                />
                <Scene
                    image="http://18.203.88.206/static/images/room.jpg"
                    isSelected={selectedImage == 2}
                    name="Room"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(2)}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Scenes);