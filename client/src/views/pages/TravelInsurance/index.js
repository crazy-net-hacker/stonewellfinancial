import React, { useContext, useEffect } from 'react'
// import { makeStyles } from '@material-ui/core/styles';
//components (common)
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { LanguageContext, Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
//components
// import Selection from './Selection'
// import ProductLarge from '../../../components/common/Product/ProductLarge'
import Products from '../../../components/common/Product/Products'
//3rd library
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
// import { Typography } from '@material-ui/core';


// banner Title
const bannerTitle = ['Travel Insurance']
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
  
] 
// Products
const travelProducts = [
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.ComingCanada`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.ComingCanada.Who`} />,
    img: 'coming-canada',
    url: 'travel-insurance/inbound',
  },
  {
    title: <Text tid={`TravelInsurace.WhichPlan.list.GoingOutsideCanada`} />,
    description: <Text tid={`TravelInsurace.WhichPlan.list.GoingOutsideCanada.Who`} />,
    img: 'out-from-canada',
    url: 'travel-insurance/outbound',
  },
  
] 

export default function TravelInsurance({match}) { 
  const metaData = {
    title: 'Meta.TravelInsurace.Title',
    description: 'Meta.TravelInsurace.Description',
    canonical: match.url
  }

  // set userLanguage if url incluede /language
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  useEffect(() => {
    if (match.params.language){
      userLanguageChange(match.params.language)
    }
  },[match.params.language, userLanguageChange, userLanguage])
    
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
              <Grid item xs={12}>
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