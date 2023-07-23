import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from "react-router-dom"
//components
import { Grid, Button, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

  paper : {
    position: 'relative',
    height: '50vh',
    background: '#fafbfd',
  },
  
  containerBox : {
    maxWidth: '710px',
    width: '100%',
    paddingLeft: '190px',
    lineHeight: '1.4',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      paddingLeft: '15px',
      paddingRight: '15px',
    },
  },
  
  container : {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '150px',
    height: '150px',
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      width: '100%',
      marginBottom: '15px',
    },
  },
  
  title : {
    color: '#8EC641',
    fontSize: '100px',
    letterSpacing: '15.5px',
    margin: '0px',
    fontWeight: 900,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  
  subTitle : {
    color: '#292929',
    fontSize: '28px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    marginTop: '0',
  },
  
  description : {
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '0',
    marginBottom: '15px',
    color: '#333',
  },
  
  subLink : {
    fontSize: '14px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    background: '#fff',
    display: 'inline-block',
    padding: '15px 30px',
    borderRadius: '40px',
    color: '#292929',
    fontWeight: '700',
    boxShadow: '0px 4px 15px -5px rgba(0, 0, 0, 0.3)',
    transition:'0.2s all',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#8EC641'
    }

  },

}))

const WarningPage = (props) => {
  const { warningCode, message } = props; 

  // warningCode  D: duplcate, W: not found data
  
  const classes = useStyles()
  return (
    <>
      <Grid container className={classes.paper}>
        <Grid item container className={classes.containerBox}>
          <Grid item className={classes.container}>
            <h1 className={classes.title}>:O</h1>
          </Grid>
          <Grid item xs={10} container>
          <Grid item xs={12}>
            <Typography variant="h2" >{warningCode==='D'?'Notice!':'Some data is wrong!'}</Typography>
          </Grid>
          <Typography className={classes.description}>It has not been submitted properly. </Typography>
          {message.map((m, index)=>
            <Grid item xs={12} key={index}><Typography className={classes.description}><strong>{m}</strong> </Typography></Grid>
          )}
          <Typography className={classes.description}>Please check it {warningCode==='D'? null:'and try'} or contact us.</Typography>
          
          <Grid item xs={12}>
            <Button variant="contained" color='primary' className={classes.subLink} 
                    style={{marginRight: '2vh'}}
                    onClick={()=>window.location.reload()}
            > 
              Try Again
            </Button>
            <Link to={'/'}>
              <Button variant="contained" color='primary' className={classes.subLink}> Home </Button>
            </Link>
          </Grid>

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default WarningPage;