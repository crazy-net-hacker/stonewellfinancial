import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
// @material-ui/icons
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AlarmIcon from '@material-ui/icons/Alarm';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import InfoArea from '../../components/common/InfoArea'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2em',
    // maxWidth: '1000px',
    // marginTop: '2vh',
    marginBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
  infoArea: {
    maxWidth: "none",
    margin: "10px",
    padding: "20px 0",
    // background: "#eee",
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      padding: "20px 16px",
    },
  },
 
}))

export default function WhyUs() { 
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Grid container >
        <Grid item xs={12} sm={12} lg={4}>
          <InfoArea
            title="personalAdvice"
            description="personalAdvice"
            icon={QuestionAnswerIcon}
            iconColor="primary"
            className={classes.infoArea}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <InfoArea
            title="strongService"
            description="strongService"
            icon={AlarmIcon}
            iconColor="primary"
            className={classes.infoArea}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <InfoArea
            title="sepecificInsurance"
            description="sepecificInsurance"
            icon={AccessibilityIcon}
            iconColor="primary"
            className={classes.infoArea}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
