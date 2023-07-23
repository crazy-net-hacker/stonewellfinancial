// import React, { useEffect } from 'react';
import React from 'react';
// redux
// import { useSelector, useDispatch } from 'react-redux';
// import { getAccountByUserId } from '../../../../redux/actions/accounts';
// core components
import Grid from '@material-ui/core/Grid'
// import { ProfileForm } from './ProfileForm'
import { Profile } from './Profile'
import { Address } from './Address'
// import { FamilyMembers } from './FamilyMembers'
import { FamilyMembers } from './FamilyMembersFrom'
import { PaymentMethods } from './PaymentMethods'
import { Settings } from './Settings'
//styles
import { makeStyles } from '@material-ui/core/styles'
import formStyle from './../../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

export default function ClientMyAccount({user}) {
  const classes = useStyles();
  

  // const dispatch = useDispatch();
  // const profile = useSelector(state => state.accountReducer.account)

  // console.log('user', user)
  // console.log(profile)

// get accout data from backend side
  // useEffect
  // useEffect(() => {
  //   dispatch(getAccountByUserId(user))
  // }, [dispatch, user]);
  
  
  // fake account data
    const profile = [
    {
    first_name : 'Jungsoo',
    last_name : 'Shim',
    email : ''
    }
  ]

  return (
    <div>
    {profile.length > 0 &&

    <Grid container direction="column" spacing={3} >

      <Grid item xs={12} className={classes.title}>
        <h2>My Account</h2>
      </Grid>
      
      <Grid item xs={12} className={classes.formMargin}>
        <h4>Profile</h4>
        {/* <Profile /> */}
        <Profile profile={profile}/>
      </Grid>
      
      <Grid item xs={12} className={classes.formMargin}>
        <h4>Address</h4>
        <Address />
      </Grid>

      <Grid item xs={12} className={classes.formMargin}>
      <h4>Family Members</h4>
      <FamilyMembers />
      </Grid>

      <Grid item xs={12} className={classes.formMargin}>
      <h4>Payment Methods</h4>
      <PaymentMethods />
      </Grid>

      <Grid item xs={12} className={classes.formMargin}>
      <h4>Password Change</h4>
      <Settings />
      </Grid>

    </Grid>
    }
    </div>
  )
}
