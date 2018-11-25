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
                    description='Cynophobia is the fear of dogs. Cynophobia is classified as a specific phobia, under the subtype "animal phobias". Animal phobias are among the most common of the specific phobias and 36% of patients who seek treatment report being afraid of dogs or cats.'
                    onSelectScene={() => this.handleSelectScene(0)}/>

                <Scene
                    image={`${API}/static/images/spider.jpg`}
                    isSelected={selectedImage == 1}
                    name="Spider"
                    description="Not many people like spiders. When many people see one, they have a reaction from trying to kill the spider to running from it. While arachnophobia, or fear of spiders, is one of the most common specific phobias, not everyone who dislikes spiders is experiencing a phobia."
                    onSelectScene={() => this.handleSelectScene(1)}
                />
                <Scene
                    image={`${API}/static/images/rat.jpg`}
                    isSelected={selectedImage == 2}
                    name="Rat"
                    description="Musophobia is a fear of mice or rats. The origin of the word Muso is Latin (mus meaning mouse). Musophobia is one of the most common specific phobias, which is discussed on the home page. Musophobia is also known as Suriphobia and Murophobia (murine stems from the Muridae family that encompasses mice and rats)."
                    onSelectScene={() => this.handleSelectScene(2)}
                />
                <Scene
                    image={`${API}/static/images/room.jpg`}
                    isSelected={selectedImage == 3}
                    name="Room"
                    description="Claustrophobia is the fear of being enclosed in a small space or room and unable to escape or get out. It can be triggered by many situations or stimuli, including elevators crowded to capacity, windowless rooms, hotel rooms with closed doors and sealed windows, small cars and even tight-necked clothing."
                    onSelectScene={() => this.handleSelectScene(3)}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Scenes);