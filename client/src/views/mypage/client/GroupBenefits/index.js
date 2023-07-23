import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//core component
import { Typography, Grid } from '@material-ui/core'
//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

export default function ClientGroupInsurance({user}) { 
  const classes = useStyles();
  
  return (
    <Grid container>
      <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
        <Typography className={classes.dashboardPageTitle}>
          {/* <Text tid={'Vendor.StartApplication'} /> */}
          My Group Benefits
        </Typography>
      </Grid>


    </Grid>
  )
}
