import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { API } from './constants';

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

const environmentNames = ['dog', 'spider', 'rat', 'room'];

class Scenes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImage: 0
        }
    }

    handleSelectScene = (index) => {
        this.setState({selectedImage: index})
        axios.post(`${API}/set_environment`, {environment: environmentNames[index]}, {withCredentials: true})
    }

    componentDidMount() {
        axios.get(`${API}/get_environment_ui`, {withCredentials: true}).then(({data: environment}) => this.setState({
            selectedImage: environmentNames.indexOf(environment)
        }))
    }

    render() {
        const { classes } = this.props;
        const { selectedImage } = this.state;
        return (
            <div className={classes.container}>
                <Scene
                    image={`${API}/static/images/dog.jpg`}
                    isSelected={selectedImage == 0}
                    name="Dog"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(0)}/>

                <Scene
                    image={`${API}/static/images/spider.jpg`}
                    isSelected={selectedImage == 1}
                    name="Spider"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(1)}
                />
                <Scene
                    image={`${API}/static/images/rat.jpg`}
                    isSelected={selectedImage == 2}
                    name="Rat"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(2)}
                />
                <Scene
                    image={`${API}/static/images/room.jpg`}
                    isSelected={selectedImage == 3}
                    name="Room"
                    description={lorem}
                    onSelectScene={() => this.handleSelectScene(3)}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Scenes);