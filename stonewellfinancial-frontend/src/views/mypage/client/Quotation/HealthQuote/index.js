import React from 'react';

//core components
import { Card, CardContent, Grid } from '@material-ui/core'

//common components
// import { Quotation } from '../../../../pages/HealthQuote/Quotation'
import BreadCrumbs from '../../../../../components/common/BreadCrumbs/BreadCrumbs'

const links = [
    {
        to: '/myportal/client/new-quote',
        name: 'New Quote & Application'
    },
    {
        to: '/myportal/client/new-quote/health',
        name: 'Health Quote'
    }
]

export default function HealthQuote() { 

  return (
    <div>
      <Grid>
        <BreadCrumbs links={links} />
      </Grid>
      <Card style={{margin: '5%'}}>
        <CardContent>
          {/* <Quotation /> */}
        </CardContent>
      </Card>
    </div>
  )
}
