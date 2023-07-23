import React, { useState } from 'react'
import { Box, Grid, Hidden } from '@material-ui/core'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
import Banner from '../../../components/common/Banner';
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

  const [searchText, setSearchText] = useState('');

  return (
    <>
      <Grid container style={{ justifyContent: 'center' }} direction="row" spacing={2}>
        <Grid item xs={12}>
          <Banner
            title={bannerTitle}
            links={links}
          />
        </Grid>
        <Grid container style={{ justifyContent: 'center', marginBottom :'2vh' }} >
          <Grid item xs={6}>
            <RegularTextField
                id= 'Search'
                placeholder="Search"
                onChange={(e) => {
                    setSearchText(e.target.value)
                }}
            />
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Hidden mdDown>
            <SideBar />
          </Hidden>
        </Grid>
        <Grid item xs={8}>
          <Box mb={10}>
            <Questions 
              searchText = {searchText}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}