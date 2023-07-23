import React from 'react'
import { Typography, Box, Grid, Hidden } from '@material-ui/core'
import Banner from '../../../components/common/Banner';
import { Text } from '../../../components/common/LanguageProvider'

import SearchBar from './SearchBar'
import Questions from './Questions'
import SideBar from './Sidebar';
// banner Title
const bannerTitle = ['FAQ']

const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/faq',
    name: 'FAQ',
  },
]

export default function FAQ() {  
  return (
    <>
      <Grid container style={{ justifyContent: 'center' }} direction="row" spacing={2}>
        <Grid item xs={12}>
          <Banner
            title={bannerTitle}
            links={links}
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Box my={10}>
            <Typography variant="h2" align='center'>
              <Text tid={'FAQ.Label'} />
            </Typography>
          </Box>
          <Box my={10}>
            <SearchBar />
          </Box>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2}>
          <Hidden mdDown>
            <SideBar />
          </Hidden>
        </Grid>
        <Grid item xs={8}>
          <Box mb={10}>
            <Questions />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}