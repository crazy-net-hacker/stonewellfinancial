import React from 'react'

//components (common)
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
//components
// import Types from './Types'
import ListItem from '../../../components/common/List/List'
//3rd library
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'



// banner Title
const bannerTitle = ['Health Insurance']

const faqLists = [
  {
    question: 'HealthInsurance.FAQ.list.WhyNeed',
    answer: 'HealthInsurance.FAQ.list.WhyNeed.detail',
  },
  {
    question: 'HealthInsurance.FAQ.list.CantJustGHIP',
    answer: 'HealthInsurance.FAQ.list.CantJustGHIP.detail',
  },
  {
    question: 'HealthInsurance.FAQ.list.qualifyHealthIns',
    answer: 'HealthInsurance.FAQ.list.qualifyHealthIns.detail',
  },
  {
    question: 'HealthInsurance.FAQ.list.differByProvince',
    answer: 'HealthInsurance.FAQ.list.differByProvince.detail',
  },
  {
    question: 'HealthInsurance.FAQ.list.howToQuote',
    answer: 'HealthInsurance.FAQ.list.howToQuote.detail',
  },
  {
    question: 'HealthInsurance.FAQ.list.familySamePlan',
    answer: 'HealthInsurance.FAQ.list.familySamePlan.detail',
  },
]
const stickyLeftMenu = [
  {
    href: '#do-you-need-life-insurance',
    title: 'HealthInsurance.What.label',
  },
  {
    href: '#why-do-you-need-life-insurance',
    title: 'HealthInsurance.WhyNeed.label',
  },
  {
    href: '#types-of-life-insurance',
    title: 'HealthInsurance.Type.label',
  },
  {
    href: '#you-should-know-what-you-are-buying',
    title: 'LifeInsurance.FAQ.label',
  },
  {
    href: '#why-us-life-insurance',
    title: 'Banner.Whyus.label',
  },
]
// Breadcrumbs
const links = [
  {

      to: '/',
      name: 'Home'
  },
  {
 
      to: '/health-insurance',
      name: 'Health Insurance'
  },  
]  

//Who needs health Insurance list
const needHealthIns = [
  {
    title: 'HealthInsurance.WhenNeed.notInGroupIns',
  },
  {
    title: 'HealthInsurance.WhenNeed.noGroupIns',
  },
  {
    title: 'HealthInsurance.WhenNeed.additonalBenefits',
  },

]

//Coverage options
const OptionsHealthIns = [
  {
    title: 'HealthInsurance.Type.basicDrugs',
  },
  {
    title: 'HealthInsurance.Type.enhancedDrugs',
  },
  {
    title: 'HealthInsurance.Type.dentalCare',
  },
  {
    title: 'HealthInsurance.Type.hospitalCash',
  },
  {
    title: 'HealthInsurance.Type.annualTravel',
  },

]

export default function HealthInsurance({match}) { 
  const metaData = {
    title: 'Meta.HealthInsurace.Title',
    description: 'Meta.HealthInsurace.Description',
    canonical: match.url
  }

  return (
    <>
    <MetaTags data={metaData} />
    <Banner title = {bannerTitle} links={links} quote_url="/health-insurance/quote/product-selection" />
    <Grid container justify="center" spacing={0}>
          <Hidden mdDown>
            <Grid item lg={2}>
              <StickyLeftMenu
                pageName={<Text tid={'Health Insurance'} />}
                lists={stickyLeftMenu}
                quote_url="/health-insurance/quote/product-selection"
                title={<Text tid={'Health Insurance'}/>}
              />
            </Grid>
          </Hidden>
          <Grid item sm={12} lg={6}>
            
            <section className="target" id="do-you-need-life-insurance">
              <SectionContent
                label="HealthInsurance.What.label"
                detail="HealthInsurance.What.detail"
              />
            </section>
            <section id="why-do-you-need-life-insurance">
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="HealthInsurance.WhyNeed.label"
                  detail="HealthInsurance.WhyNeed.detail"
                />
              </Grid>
              <Grid item xs={12}>
                {/* <FeatureCard titles={needLifeIns} /> */}
                <ListItem titles={needHealthIns} />
              </Grid>
            </Grid>
            </section>
            <section id="types-of-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="HealthInsurance.Type.label"
                  detail="HealthInsurance.Type.detail"
                />
                <ListItem titles={OptionsHealthIns} />
              </Grid>
              {/* <Grid item xs={12}>
                <Types />
              </Grid> */}
            </Grid>
            </section>
{/* 
            <section id="when-you-need-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="HealthInsurance.WhenNeed.label"
                  detail=""
                />
               </Grid>
               <Grid item xs={12}>
                <IconCard Content={eventsLifeIns} />
               </Grid>
            </Grid>
            </section> */}

            <section id="you-should-know-what-you-are-buying">
            <Grid container>
                <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
                  <SectionContent
                    label="LifeInsurance.FAQ.label"
                    detail=""
                  />
                </Grid>
                <Grid item xs={12}>
                  <Accordion faqLists={faqLists} />
                </Grid>
              </Grid>
            </section>

            <Grid container justify="center"  >
              <Grid item xs={12} style={{maxWidth:'1000px'}}>
                <BannerQuote
                  title="HealthInsurance.BannerQuote"
                  quote_Btn_Disable="false"
                  quote_url="/health-insurance/quote/product-selection"
                />
              </Grid>
            </Grid>
            
            <section
              id="why-us-life-insurance"
              style={{ marginBottom: '80px' }}
            >
              <Grid container justify="center">
                <Grid item xs={12} >
                  <SectionContent
                    label="Banner.Whyus.label"
                    detail="Banner.Whyus.detail"
                  />
                </Grid>
                <Grid item xs={12} style={{maxWidth:'1000px'}}>
                  <WhyUs />
                </Grid>
              </Grid>
            </section>
          </Grid>
        </Grid>
    </>
  )
}

