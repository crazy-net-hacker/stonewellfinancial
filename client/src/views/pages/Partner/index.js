import React from 'react'
import { Grid } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
import { Text } from '../../../components/common/LanguageProvider'
//components
import Hidden from '@material-ui/core/Hidden'

import BannerQuote from '../../../components/common/BannerQuote'
import Banner from '../../../components/common/Banner'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import SectionContent from '../../../components/common/SectionContent'

// banner Title
const bannerTitle = ['Partner with us']
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/partner',
    name: 'Partner with us',
  },
]

const buttonTitle = ['Request partnership']

const stickyLeftMenu = [
  {
    href: '#who-we-are',
    title: 'Partner.WhyShouldPartner.Label',
  },
  {
    href: '#what-we-do',
    title: 'Partner.WhoIdealPartner.Label',
  },
  {
    href: '#like-a-stonewell',
    title: 'Partner.BecomePartner.Label',
  },
]

export default function Partner() {  

  // const classes = useStyles()
  return (
    <>
      <Banner title={bannerTitle} links={links} quote_url ='/register-partner' buttonTitle={buttonTitle} />
  
      <Grid container justify="center" spacing={0}>
        {/* Side menu */}
        <Hidden mdDown>
          <Grid item lg={2}>
            <StickyLeftMenu
              pageName={<Text tid={'Travel Insurance'} />}
              lists={stickyLeftMenu}
              quote_url="/travel-insurance/quote/trip-info"
              title={<Text tid={'Travel Insurance'}/>}
            />
          </Grid>
        </Hidden>
        {/* Contents */}
        <Grid item sm={12} lg={6}>
          <section className="target" id="who-we-are">
            <SectionContent
              label="Partner.WhyShouldPartner.Label"
              detail="Partner.WhyShouldPartner.Content"
            />
          </section>
          <section className="target" id="like-a-stonewell">
            <SectionContent
              label="Partner.WhoIdealPartner.Label"
              detail="Partner.WhoIdealPartner.Content"
            />
          </section>
          <section className="target" id="how-we-work">
            {/* <SectionContent
              label="Partner.BecomePartner.Label"
              detail="Partner.BecomePartner.Content"
            /> */}
               <Grid item xs={12} style={{maxWidth:"1000px", marginBottom:'10vh' }}>
                <BannerQuote  
                  title = "Partner.BecomePartner.Label"
                  quote_Btn_Disable ="false" 
                  buttonTitle={buttonTitle}
                  quote_url ='/register-partner'/>
              </Grid>
          </section>
          {/* <section id="why-us">
              <Grid container justify="center" >
                <Grid item xs={12}>
                  <SectionContent
                    label="Banner.Whyus.label"
                    detail="Banner.Whyus.detail"
                  />
                </Grid>
                <Grid item xs={12} style={{maxWidth:"1000px"}}>
                  <WhyUs />
                </Grid>
              </Grid>
          </section> */}
        </Grid>
      </Grid>
    </>
  )
}
