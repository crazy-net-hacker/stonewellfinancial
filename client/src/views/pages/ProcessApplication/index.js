import React from 'react'
//components
import Banner from '../../../components/common/Banner';
import { Container, Box } from '@material-ui/core'
import ApplicationProcess from './ApplicationProcess'
import ProcessInfo from './ProcessInfo'

// banner Title
const bannerTitle = ['Application Process']
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/application',
    name: 'Application Process',
  },
]


export default function index() {  
  return (
    <>
      <Container>
        <Banner
          title={bannerTitle}
          links={links}
        />
        <Box my={10}>
          <ApplicationProcess />
        </Box>
        <Box my={10}>
          <ProcessInfo
            process_url="/insurance/claim"
            label="ProcessApplication.ProcessInfo.First.label"
            desc="ProcessApplication.ProcessInfo.First.detail"
          />
        </Box>
        <Box my={10}>
          <ProcessInfo
            process_url="/insurance/refund"
            label="ProcessApplication.ProcessInfo.Second.label"
            desc="ProcessApplication.ProcessInfo.Second.detail"
          />
        </Box>

      </Container>

    </>
  )
}

