import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid } from '@material-ui/core';
import {Link} from "react-router-dom"
//components
import { Text } from './LanguageProvider';

//Style
const useStyles = makeStyles(theme => ({
  textCenter: {
    margin: theme.spacing(10,1,8,1),
    textAlign: 'center'
  },
  lineMargin: {
    marginBottom: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(3,3,1,1),
    width: '100%'
  },
}));


const Submission = (props) => {
  const { confirmationNo, submissionType } = props;   

  const classes = useStyles();

  // navigation and refresh page
  function changeLocation(placeToGo){
    window.history.pushState(null, null, placeToGo);
    window.location.reload();
  }

  return (
    <div className={classes.textCenter}>
      
      <Typography variant="h2"> {`Thank you for ${submissionType}`} </Typography>

      <br/>
      {submissionType !== 'payment' && confirmationNo &&
        <Typography className={classes.lineMargin} variant="h6" > 
          Confirmation No : {confirmationNo}
        </Typography>
      }

      <Typography className={classes.lineMargin} variant="h6" >
        {confirmationNo?`We have emailed a confirmation, and will contact you as soon.`:`We will contact you as soon.`} 
      </Typography>

      <Grid container spacing={2} justify="center">
        {submissionType === 'application' && 
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Link to={'/travel-insurance/quote/trip-info'} 
                    onClick={() => {changeLocation('/travel-insurance/quote/trip-info')}}>
                <Button variant="contained" color='primary' className={classes.button}> <Text tid={'Get a quote'}/> </Button>
              </Link>
            </Grid>
        }

        <Grid item xs={12} sm={4} md={3} lg={2}> 
          <Link to={'/'} onClick={() => {changeLocation('/')}}>
            <Button variant="contained" color='primary' className={classes.button}> <Text tid={'Button.Home'}/></Button>
          </Link>
        </Grid>

      </Grid>
      

    </div>

  );
};

export default Submission;
