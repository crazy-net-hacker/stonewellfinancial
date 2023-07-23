import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
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
    margin: theme.spacing(3,1,1,1)
  }
}));

const Submission = (props) => {
  const { confirmationNo, submissionType, userRole } = props;   
  
  const classes = useStyles();
  
  return (
    <div className={classes.textCenter}>
      
      {confirmationNo.slice(0,3) !== 'APP'
        ? <>
            {/* <Typography variant="h2"> Thank You For Your Submission </Typography> */}
            <Typography variant="h2"> {`Thank you for an ${submissionType}`} </Typography>
            <br/>
            <Typography className={classes.lineMargin} variant="h6" > 
              Confirmation No : {confirmationNo}
            </Typography>
          </>
        : <>
            <Typography variant="h2"> {` The application have been saved successfully`} </Typography>
            <br/>
            <Typography className={classes.lineMargin} variant="h6" > 
              Application ID : {confirmationNo}
            </Typography>
          </>
      }
      <Link to={userRole==='ADM'?'/myportal/admin/travel-application':'/myportal/vendor/search-application'}>
      {/* <Link to={'/myportal/dashboard'}> */}
        <Button variant="contained" color='primary' className={classes.button}> <Text tid={'Dashboard.Application'}/></Button>
      </Link>
      <Link to={userRole==='ADM'?'/myportal/amin/new-application':'/myportal/vendor/new-application'}>
        <Button variant="contained" color='primary' className={classes.button}> <Text tid={'Dashboard.StartNewApplication'}/></Button>
      </Link>

    </div>

  );
};

export default Submission;
