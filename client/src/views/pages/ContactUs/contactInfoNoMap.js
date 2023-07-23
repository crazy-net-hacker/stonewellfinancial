import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
// import { theme } from '../../../assets/jss/theme'
//icon
import emailIcon from '../../../assets/imgs/icons/email.svg';
import phoneIcon from '../../../assets/imgs/icons/phone.svg';
//components
import Button from '../../../components/common/CustomButtons/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2em',
    marginRight: '1em',
    border: '1px solid #ddd',
    borderRadius: '10px'
    // background: '#f5f5f5',
    // borderBottom: '5px solid #2a2f71',
  },
  infoArea: {
    maxWidth: "none",
    margin: "10px",
    padding: "20px 0",
    // background: "#eee",
    borderRadius: '10px',
  },
  iconImg: {
    marginTop: '15px'
  },
  iconTitle: {
    paddingLeft:"1em", 
    fontWeight:'600', 
    marginTop:'-5px' 
  },
  iconDesc: {
    paddingLeft:"45px", 
    fontSize: '0.8em', 
    marginTop:'-15px'
  }
}))

export default function contactInfoNoMap() {  
// export default () => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h4>We're Here to Help</h4>
        </Grid>
        <Grid item xs={12}>
            <img src={emailIcon} className={classes.iconImg} alt="Email us at"/>
            <span className={classes.iconTitle} >Email us at</span>
            <p className={classes.iconDesc}>info@stonewellfinancial.com</p>
        </Grid>
        <Grid item xs={12}>
            <img src={phoneIcon} className={classes.iconImg} alt="Call us at"/>
            <span className={classes.iconTitle} >Call us at</span>
            <p className={classes.iconDesc}>1-833-645-3858 (Toll Free)</p>
        </Grid>
       
        <Grid item xs={12}>
          <Link to='/' style={{textDecoration: 'none', paddingTop: '1em'}}>
                  <Button color="secondary">
                    Live Chat with us
                  </Button>
          </Link>
        </Grid> 
      
        
      </Grid>
    </Box>
  )
}
