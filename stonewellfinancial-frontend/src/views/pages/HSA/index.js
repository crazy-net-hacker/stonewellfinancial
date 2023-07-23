import React from 'react'
import { Container, Grid, Hidden } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider';

//components
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner';
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhatIs from './WhatIs';
import TripleTax from './TripleTax';
import LongTermApproach from './LongTermApproach';
import WhatClaim from './WhatClaim';
import TypeBenefit from './TypeBenefit';
import WhyUs from '../../../components/common/WhyUs'
import SectionContent from '../../../components/common/SectionContent'

// banner Title
const bannerTitle = ['Health Spending Account']

const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/hsa',
    name: 'Health Spending Account',
  },
]

const types = [
  {
    title: 'Small Group',
    img: 'students',
  },
  {
    title: 'Large Group 50+',
    img: 'companions',
  },
  {
    title: 'Affinity Markets',
    img: 'visitors',
  },
]

const stickyLeftMenu = [
  {
    href: '#what-is-hsa',
    title: 'HSA.WhatIs.Label',
  },
  {
    href: '#triple-tax-benefit',
    title: 'HSA.TripleTax.Label',
  },
  {
    href: '#long-term-approach',
    title: 'HSA.LongTermApproach.Label',
  },
  {
    href: '#what-can-group-benefits',
    title: 'HSA.WhatClaim.Label',
  },
  {
    href: '#type-of-group-benefit',
    title: 'HSA.TypeBenefit.Label',
  },
  {
    href: '#why-us',
    title: 'HSA.WhyUs.Label',
  },
]

export default function HSA({match}) {  
  const metaData = {
    title: 'Meta.HAS.Title',
    description: 'Meta.HAS.Description',
    canonical: match.url
  }
  return (
    <>
      <MetaTags data={metaData} />
      <Container>
        <Banner title={bannerTitle} links={links} />
        <Grid container justify="center" spacing={0}>
          <Hidden mdDown>
            <Grid item lg={2}>
              <StickyLeftMenu
                pageName={<Text tid={'Health Spending Account'} />}
                lists={stickyLeftMenu}
              />
            </Grid>
          </Hidden>
          <Grid item sm={12} lg={8}>
            <section id="what-is-hsa">
              <WhatIs />
            </section>
            <section id="triple-tax-benefit">
              <Grid item xs={12} style={{ marginTop: '5vh' }}>
                <TripleTax />
              </Grid>
            </section>
            <section id="long-term-approach">
              <Grid item xs={12} style={{ marginTop: '5vh' }}>
                <LongTermApproach />
              </Grid>
            </section>
            <section id="what-can-group-benefits">
              <Grid item xs={12} style={{ marginTop: '5vh' }}>
                <WhatClaim />
              </Grid>
            </section>
            <section id="type-of-group-benefit">
              <Grid item xs={12} style={{ marginTop: '5vh' }}>
                <TypeBenefit Products={types} />
              </Grid>
            </section>
            <section id="why-us">
              <Grid item xs={12} style={{ marginTop: '5vh' }}>
                <SectionContent
                  label="Banner.Whyus.label"
                  detail="Banner.Whyus.detail"
                />
              </Grid>
              <Grid item xs={12} style={{ maxWidth: '1000px' }}>
                <WhyUs />
              </Grid>
            </section>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}