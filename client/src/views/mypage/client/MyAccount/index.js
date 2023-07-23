import React, { useEffect } from 'react';
// import React, { useEffect, useState } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getAccountByUserId } from '../../../../redux/actions/accounts';
// core components
import { Typography, Grid } from '@material-ui/core'
// import { ProfileForm } from './ProfileForm'
import { Profile } from './Profile'
import { Address } from './Address'
import { FamilyMembers } from './FamilyMembers'

import { Text } from '../../../../components/common/LanguageProvider'

import TabMenu from '../../../../components/common/Tabs/tabMenu'
// import { FamilyMembers } from './FamilyMembersFrom'
import { PaymentMethods } from './PaymentMethods'
import { Settings } from './Settings'

// Form initial data
import { myAccountInit } from './InitData';

//styles
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// icons


const useStyles = makeStyles(dashboardStyles)


export default function ClientMyAccount({user}) {
  const classes = useStyles();
  

  const dispatch = useDispatch();
  const profile = useSelector(state => state.accountReducer.account)
  
  // get accout data from backend side
  // useEffect
  useEffect(() => {
    dispatch(getAccountByUserId(user))
  }, [dispatch, user]);

  // initial data
  // const [data, setData] = useState(myAccountInit());
  const data = myAccountInit();
  
  //tabs
  const tabs = [
    
    { 
      id: 0,
      label: <Text tid={'Dashboard.Profile'} />,
      // value: 'value 1',
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <Profile 
            profile={profile} 
            data={data} 
          />
          <FamilyMembers 
            data={data} 
          />
        </Grid>
        </>
      )
    },
    {
      id: 1,
      label: <Text tid={'Dashboard.Address'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <Address />
        </Grid>
        </>
      )
    },
    {
      id: 2,
      label: <Text tid={'Dashboard.PaymentMethod'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <PaymentMethods />
        </Grid>
        </>
      )
    },
    {
      id: 3,
      label:   <Text tid={'Dashboard.ChangePassword'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <Settings />
        </Grid>
        </>
      )
    }
  ]

  // fake account data
  //   const profile = [
  //   {
  //   first_name : '',
  //   last_name : '',
  //   email : ''
  //   }
  // ]
// console.log(data)
  return (
    <div>
    {/* {profile.length > 0 && */}

    <Grid container>
      
      <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
        <Typography className={classes.dashboardPageTitle}>
          {/* <Text tid={'Vendor.StartApplication'} /> */}
          My Account
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ margin:'0 7vh' }}>
        <TabMenu tabs={tabs}/>
      </Grid>
      {/* <Grid item xs={12} className={classes.formMargin}>
        <h4>Profile</h4>
        <Profile profile={profile}/>
      </Grid>
      
      <Grid item xs={12} className={classes.formMargin}>
        <h4>Address</h4>
        <Address />
      </Grid> */}

      {/* <Grid item xs={12} className={classes.formMargin}>
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
      </Grid> */}

    </Grid>
    {/* } */}
    </div>
  )
}
