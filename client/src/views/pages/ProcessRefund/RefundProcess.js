import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components 
import { Grid, Typography } from '@material-ui/core'
// components
import { Text } from '../../../components/common/LanguageProvider'
// import RequestForm from './RequestForm'

const useStyles = makeStyles((theme) => ({
  step: {
    textTransform: 'uppercase',
    color: theme.palette.secondary.main,
    fontWeight: 700,
    marginBottom: 8,
    fontSize: '1.2rem',
  },
  image: {
    padding: '16px 4px',
    width: '100%',
    height: 'auto',
  },
}))

export default function RefundProcess() {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h2">
        <Text tid={'ProcessRefund.RefundProcess.label'} />
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <div>
            <span className={classes.step}>Step 1</span>
            <Typography variant="h4" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.first.title'} />
            </Typography>

            <img
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="supporting document"
              className={classes.image}
            />
            <Typography variant="body1">
              <Text tid={'ProcessRefund.RefundProcess.first.desc'} />
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <div>
            <span className={classes.step}>Step 2</span>
            <Typography variant="h4" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.second.title'} />
            </Typography>
            <img
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="request form"
              className={classes.image}
            />
            <Typography variant="body1" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.second.desc1'} />
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.second.desc2'} />
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <div>
            <span className={classes.step}>Step 3</span>
            <Typography variant="h4" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.third.title'} />
            </Typography>
            <img
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="refund payment"
              className={classes.image}
            />
            <Typography variant="body1" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.third.desc1'} />
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Text tid={'ProcessRefund.RefundProcess.third.desc2'} />
            </Typography>
          </div>
        </Grid>
      </Grid>
    </>
  )
}
