import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { PropTypes } from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  snackbar: {
    top: 90
    // [theme.breakpoints.down('xs')]: {
    //   top: 90,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   top: 90,
    // },
    // [theme.breakpoints.down('md')]: {
    //   top: 90,
    // },
    // [theme.breakpoints.down('lg')]: {
    //   top: 90,
    // },
  },
}))

export default function Snackbars({
  openSnack,
  closeSnack,
  severity,
  message
}) {
  const classes = useStyles()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    closeSnack(event)
  }

  return (
    <div>
      <Snackbar
        // style={{ height: '50%' }}
        className={classes.snackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

Snackbars.propTypes = {
  openSnack: PropTypes.bool,
  closeSnack: PropTypes.any,
  message: PropTypes.string,
  severity: PropTypes.string,
}
