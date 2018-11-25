import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import { API } from './constants';
import axios from 'axios';
import _ from 'lodash';

const styles = theme => ({
    container: {
        ...theme.mixins.gutters(),
        display: 'flex',
        flexDirection: 'row',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    column: {
        flex: 1,
        display: 'flex',

        '&:last-child': {
            flex: 3
        }
    },
    formControl: {
        margin: theme.spacing.unit * 3,
        flex: 1,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',

        '& > span': {
            marginRight: 10,
        }
    },
    slider: {
        padding: '22px 0px',
    },
});

class Controls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            control: 'manual',
            exposure: 10,
        }
    }

    handleAiControlChange = (event) => {
        this.setState({ control: event.target.value })
    }

    handleExposureChange = (event, value) => {
        this.setState({ exposure: value })
        this.postExposure(value);
    }

    postExposure = _.debounce((value) => {
        axios.post(`${API}/set_exposure`, {exposure: value}, {withCredentials: true})
    }, 500)

    componentDidMount() {
        axios.get(`${API}/get_exposure`, {withCredentials: true}).then(({data: exposure}) => this.setState({ exposure: Number(exposure) }))
    }

    render() {
        const { classes } = this.props;
        const { control, exposure } = this.state;
        return (
            <Paper className={classes.container}>
                <div className={classes.column}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Control</FormLabel>
                        <RadioGroup
                            aria-label="Control"
                            className={classes.group}
                            value={control}
                            onChange={this.handleAiControlChange}
                        >
                            <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                            <FormControlLabel value="ai" control={<Radio />} label="AI" />
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={classes.column}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Exposure</FormLabel>
                        <div className={classes.sliderContainer}>
                            <span>{exposure}% </span>
                            <Slider
                                classes={{ container: classes.slider }}
                                aria-labelledby="exposure"
                                value={exposure}
                                onChange={this.handleExposureChange}
                                min={0}
                                max={100}
                                step={5}
                                disabled={control == 'ai'}
                            />
                        </div>
                    </FormControl>
                </div>
            </Paper>
        )
    }
}

export default withStyles(styles)(Controls);