/* eslint-disable */
import React from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// @material-ui/icons

import RegularButton from '../../../components/common/CustomButtons/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '3rem 0',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& p': {
      width: '95%',
      marginBottom: '1rem',
    },
  },
  platformImg: {
    width: '100%',
    height: '50vh',
    objectFit: 'cover',
    borderRadius: '30px 0',
    boxShadow: '2px 2px 5px #aaaaaa',
  },
}))

export default function Platform({ ...rest }) {
  const classes = useStyles()
  return (
    <Grid container justify="center" className={classes.root} spacin={3}>
      <Grid className={classes.flex} item xs={12}>
        <h6>PLATFORM</h6>
        <Typography variant="h2">Always Connect with us</Typography>
        <Typography variant="body1">
          We provide a convenient platform for our customers.<br></br>
          You can view information about financial products you have and receive
          necessary services.
        </Typography>
        <div>
          <RegularButton
            color="primary"
            size="md"
            style={{ margin: '5px 5px 5px 0' }}
          >
            Sign up today
          </RegularButton>
          <RegularButton
            color="secondary"
            size="md"
            style={{ margin: '5px 5px 5px 0' }}
          >
            Login
          </RegularButton>
        </div>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={6}>
        <img
          className={classes.platformImg}
          src={require('../../../assets/imgs/easylife.jpg')}
          alt="..."
        />
      </Grid> */}
    </Grid>
  )
}
