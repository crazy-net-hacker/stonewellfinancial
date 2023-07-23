import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Username } from '../../../layouts/constants';
//
import { Grid } from '@material-ui/core'
//
import { GetFromLocalStore } from '../../../layouts/utils';
import RenewableApplication from './RenewableApplication';
// svg
import PartyPopper from '../../../../assets/imgs/icons/partyPopper.svg'
// style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

export default function AdminDashboard() { 
  // style
  const useStyles = makeStyles(dashboardStyles)
  const classes = useStyles()

  // title
  document.title = 'Dashboard | Stonewell Financial Service'

  return (
    <>
      <Grid container>
        <Grid item container style={{ padding:'4vh 18px', background:'rgb(249, 249, 249)' }}>
          <Grid item xs={12} sm={12} md={6}>
            <span className={classes.titleText}>
                Welcome, {GetFromLocalStore(Username)}
                <img
                  src={PartyPopper}
                  alt="Party Popper icon"
                  style={{margin:'0 0px 5px 10px', height:'30px' }} 
                />
            </span>
          </Grid>
        </Grid>

        <RenewableApplication/>
      
      </Grid>
    </>
  )
}

