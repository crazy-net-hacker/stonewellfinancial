/**
 * Asynchronously loads the component for the Sign in Page
 */

import React from 'react'
import loadable from '../../../utils/loadable'
import CircularProgress from '@material-ui/core/CircularProgress'

export default loadable(() => import('./index'), {
  fallback: (
    <div
      style={{
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
      }}
    >
      <CircularProgress />,
    </div>
  ),
})
