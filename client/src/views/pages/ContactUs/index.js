import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Hidden } from '@material-ui/core'
//components
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import { ContactForm } from './contactForm'
import { ContactInfo } from './contactInfo'
import { Text } from '../../../components/common/LanguageProvider'

// banner Title
const bannerTitle = [<Text tid={'Contact.Title'}/>]
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/contact-us',
    name: 'Contact Us',
  },
]

export default function ContactUs({match}) {
  const metaData = {
    title: 'Meta.ContactUs.Title',
    description: 'Meta.ContactUs.Description',
    canonical: match.url
  }

  return (
    <>
      <MetaTags data={metaData} />
      <Banner title={bannerTitle} links={links} />
      <Grid container justify="center">
        <Hidden mdDown>
          <Grid item sm={3} style={{ background: '#f5f5f5' }}>
            <ContactInfo />
          </Grid>
        </Hidden>
        <Grid item sm={8} lg={5}>
          <ContactForm />
        </Grid>
      </Grid>
    </>
  )
}
