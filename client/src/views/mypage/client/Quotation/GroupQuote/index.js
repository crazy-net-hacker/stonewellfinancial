import React from 'react';

//core components
import { Grid, 
  // Card, CardContent 
} from '@material-ui/core'

//common components
// import { Quotation } from '../../../../pages/GroupQuote/Quotation'
import BreadCrumbs from '../../../../../components/common/BreadCrumbs/BreadCrumbs';

const links = [
    {
        to: '/myportal/client/new-quote',
        name: 'New Quote & Application'
    },
    {
        to: '/myportal/client/new-quote/group',
        name: 'Group Quote'
    }
]
export default function GroupQuote() { 

  return (
    <div>
        <Grid>
            <BreadCrumbs links={links} />
        </Grid>

        {/* <Card style={{margin: '5%'}}>
            <CardContent>
              <Quotation />
            </CardContent>
        </Card> */}
    </div>
  )
}