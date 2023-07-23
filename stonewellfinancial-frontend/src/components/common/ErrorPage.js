import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from "react-router-dom"
//components
import { Grid, Button } from '@material-ui/core'
import { Text } from './LanguageProvider'

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

// const Submission = (props) => {

export default function ErrorPage() {  

  const classes = useStyles()
  return (
    <>
      <Grid container className={classes.paper}>
        <Grid item container className={classes.containerBox}>
          <Grid item className={classes.container}>
            <h1 className={classes.title}>:O</h1>
          </Grid>
          <h2 className={classes.subTitle}>Oops! Something went wrong!</h2>
          <p className={classes.description}>It has not been submitted properly. Please try again later or contact us.</p>
          {/* <a href="/" className={classes.subLink}>Back to Home</a> */}
          <Link to={'/'}>
            <Button variant="contained" color='primary' className={classes.subLink}> <Text tid={'Button.Home'}/></Button>
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
