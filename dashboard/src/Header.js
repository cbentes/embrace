import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  header: {
    margin: '35px 0 20px',
    textAlign: 'center'
  }
})

const Header = ({children, classes}) => (
    <Typography variant="h5" color="inherit" className={classes.header}>
        {children}
    </Typography>
);

export default withStyles(styles)(Header);