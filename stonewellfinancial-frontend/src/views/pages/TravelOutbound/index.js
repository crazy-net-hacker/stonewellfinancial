import React from 'react'
// import { makeStyles } from '@material-ui/core/styles';
//components (common)
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
// import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
import Products from '../../../components/common/Product/Products'
import WhyUs from '../../../components/common/WhyUs'

//3rd library
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'


// banner Title
const bannerTitle = [<Text tid={`Going abroad from Canada`} />]
const faqLists = [
  {
    question: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI',
    answer: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting',
    answer: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.Pre-existing',
    answer: 'TravelInsurace.FAQ.list.Pre-existing.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WaitingPeriod',
    answer: 'TravelInsurace.FAQ.list.WaitingPeriod.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhoContact',
    answer: 'TravelInsurace.FAQ.list.WhoContact.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhenBuyTI',
    answer: 'TravelInsurace.FAQ.list.WhenBuyTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.HowToExtendTI',
    answer: 'TravelInsurace.FAQ.list.HowToExtendTI.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.CovidCovered',
    answer: 'TravelInsurace.FAQ.list.CovidCovered.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhatDeductible',
    answer: 'TravelInsurace.FAQ.list.WhatDeductible.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.WhatBeneficiary',
    answer: 'TravelInsurace.FAQ.list.WhatBeneficiary.detail',
  },

  {
    question: 'TravelInsurace.FAQ.list.HowToClaim',
    answer: 'TravelInsurace.FAQ.list.HowToClaim.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.HowRefund',
    answer: 'TravelInsurace.FAQ.list.HowRefund.detail',
  },
  {
    question: 'TravelInsurace.FAQ.list.OutofPocket',
    answer: 'TravelInsurace.FAQ.list.OutofPocket.detail',
  },
]
const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Definition.label',
  },
  {
    href: '#why-do-you-travel-insurance',
    title: 'TravelInsurace.WhyNeed.label',
  },
  {
    href: '#selection-of-travel-insurance',
    title: 'TravelInsurace.Selection.label',
  },
 
  {
    href: '#you-should-know-what-you-are-buying',
    title: 'TravelInsurace.FAQ.label',
  },
  {
    href: '#why-us-travel-insurance',
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
 
      to: '/travel-insurance',
      name: 'Travel Insurance'
  },
  {
 
    to: '/travel-insurance/outbound',
    name: 'Going abroad from Canada'
},  
] 
// Products
const travelProducts = [
  {
    title: <Text tid={`Students & Companions`} />,
    description: <Text tid={`TravelProducts.StudentsCompanions.Description`} />,
    img: 'students',
    url: 'travel-insurance/student',
  },
  {
    title: <Text tid={`Visitors`} />,
    description: <Text tid={`TravelProducts.Visitors.Description`} />,
    img: 'visitors',
    url: 'travel-insurance/visitor',
  },
  {
    title: <Text tid={`Canadian Travelers`} />,
    description: <Text tid={`TravelProducts.Canadian Travelers.Description`} />,
    img: 'canadianTravel',
    url: 'travel-insurance',
  },
]

export default function TravelOutbound({match}) {  
  const metaData = {
    title: 'Meta.TravelInsurace.Outbound.Title',
    description: 'Meta.TravelInsurace.Outbound.Description',
    canonical: match.url
  }

  return (
    <>
      <MetaTags data={metaData} />
      <Banner 
        title={bannerTitle} 
        quote_url ='/travel-insurance/quote/trip-info' 
        links={links}
      />
    
      <Grid container justify="center" spacing={0}>
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
        <Grid item container md={12} lg={6}>
          <Grid item xs={12}>
          <section className="target" id="why-buy-travel-insurance">
            <SectionContent
              label="TravelInsurace.Definition.label"
              detail="TravelInsurace.Definition.detail"
            />
          </section>
          </Grid>
          <Grid item xs={12}>
          <section id="why-do-you-travel-insurance">
            <SectionContent
              label="TravelInsurace.WhyNeed.label"
              detail="TravelInsurace.WhyNeed.detail"
            />
          </section>
          </Grid>
          <section id="selection-of-travel-insurance" >
            <Grid container >
              <Grid item xs={12}>
              <SectionContent
                label="TravelInsurace.Selection.label"
                detail="TravelInsurace.Selection.detail"
              />
              </Grid>
              <Grid item xs={12} >
                {/* <Selection/> */}
                {/* <ProductLarge Products={travelProducts}/> */}
                <Products Products={travelProducts}/>
              </Grid>
            </Grid>
          </section>

          

          <section id="you-should-know-what-you-are-buying">
          <Grid container >
            <Grid item xs={12} style={{ marginBottom:'-2rem' }}>
              <SectionContent
                label="TravelInsurace.FAQ.label"
                detail=""
              />
            </Grid>
            <Grid item xs={12}>
              <Accordion faqLists={faqLists} />
            </Grid>
          </Grid>
          </section>

        
          {/* <BannerQuote title="TravelInsurace.BannerQuote" /> */}
          <Grid container justify="center"  >
              <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurace.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='/travel-insurance/quote/trip-info'/>
              </Grid>
          </Grid>

          <section id="why-us-travel-insurance">
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
          </section>
          
        </Grid>
      </Grid>
    </>
  )
}