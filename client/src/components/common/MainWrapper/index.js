import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'

// Styles
const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
  },
}))

// Default functional component
export default function DashboardPageWrap({ children }) {
  const classes = useStyles()
  return <Box className={classes.root}>{children}</Box>
}

DashboardPageWrap.propTypes = {
  children: PropTypes.any,
}
