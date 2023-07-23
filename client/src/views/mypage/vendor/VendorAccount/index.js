import React from 'react';
//core components
import { Grid } from '@material-ui/core'
// common customized components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import VendorAccount from '../../common/SearchVendor/VendorAccount'

// icon
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function Vendor({match, user, accessCode, vendorID}) {

    // title
    document.title = 'Dashboard - Vendor Account';

    return (
        <>
          <Grid container justify="center" style={{ marginTop:'-37px' }}>

            <QuoteBanner2 
                icon={<ManageAccountsIcon style={{ fontSize:'30px' }}/>} 
                title={`Dashboard.Account`} 
                subTitle={'Dashboard.UserAccount.subtitle'} 
                links={[]} 
            />

              <VendorAccount 
                accessRole = {'VEN'}
                accessCode = {accessCode}
                vendorID = {vendorID}
              />
            
          </Grid>
        </>
    )
}

