import React, { useEffect } from 'react';
// import React, { useEffect, useState } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getAccountByUserId } from '../../../../redux/actions/accounts';
// core components
import { Grid } from '@material-ui/core'
// import { ProfileForm } from './ProfileForm'
import { Company } from './Company'
import { Address } from './Address'
import { User } from './User'
import { Settings } from './Settings';

import { Text } from '../../../../components/common/LanguageProvider'
import TabMenu from '../../../../components/common/Tabs/tabMenu'
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';

// import { FamilyMembers } from './FamilyMembersFrom'
// import { PaymentMethods } from './PaymentMethods'
// import { Settings } from './Settings'

// Form initial data
import { vendorAccountInit } from './InitData';

//styles
// import { makeStyles } from '@material-ui/core/styles'
// import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// icons


// const useStyles = makeStyles(dashboardStyles)


export default function ClientMyAccount({user}) {
  // const classes = useStyles();
  

  const dispatch = useDispatch();
  const profile = useSelector(state => state.accountReducer.account)
  
  // get accout data from backend side
  // useEffect
  useEffect(() => {
    dispatch(getAccountByUserId(user))
  }, [dispatch, user]);

  // initial data
  // const [data, setData] = useState(myAccountInit());
  const data = vendorAccountInit();
  
  //tabs
  const tabs = [
    
    { 
      id: 0,
      label: <Text tid={'Dashboard.Organization'} />,
      // value: 'value 1',
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <Company 
            company={profile} 
            data={data} 
          />
          {/* <FamilyMembers 
            data={data} 
          /> */}
          <Address/>
        </Grid>
        </>
      )
    },
    {
      id: 1,
      label: <Text tid={'Dashboard.User'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <User />
        </Grid>
        </>
      )
    },
    {
      id: 2,
      label: <Text tid={'Dashboard.ChangePassword'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'0 -24px'}}>
          <Settings />
        </Grid>
        </>
      )
    },
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

    <Grid container>
      
      <Grid item container style={{ marginTop:'-37px' }}>         
        <QuoteBanner2 title={'Dashboard.MyAccount'} subTitle={'Dashboard.MyAccount.Subtitle'} links={[]}/>
      </Grid>
      <Grid item xs={12} style={{ margin:'0 7vh' }}>
        <TabMenu tabs={tabs}/>
      </Grid>
    </Grid>
    {/* } */}
    </div>
  )
}
