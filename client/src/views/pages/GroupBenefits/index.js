import React from 'react'
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
import ListItem from '../../../components/common/List/List'
import SimpleTabs from '../../../components/common/Tabs/tabsHorizontal'
// import Types from './Types'
import IconCard from '../../../components/common/IconCard/IconCard'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
// import Button from '../../../components/common/CustomButtons/Button'
// banner Title
const bannerTitle = ['Group Benefits']
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/group-benefits',
    name: 'Group Benefits',
  },
]

const faqLists = [
  {
    question: 'GroupBenefits.FAQ.list.PriceSameForFullAndPart',
    answer: 'GroupBenefits.FAQ.list.PriceSameForFullAndPart.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.Eligibility',
    answer: 'GroupBenefits.FAQ.list.Eligibility.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.BenefitMaximums',
    answer: 'GroupBenefits.FAQ.list.BenefitMaximums.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.HowToApply',
    answer: 'GroupBenefits.FAQ.list.HowToApply.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.Payment',
    answer: 'GroupBenefits.FAQ.list.Payment.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.WhatInsuranceCompany',
    answer: 'GroupBenefits.FAQ.list.WhatInsuranceCompany.detail',
  },
  {
    question: 'GroupBenefits.FAQ.list.HowSoonStart',
    answer: 'GroupBenefits.FAQ.list.HowSoonStart.detail',
  },
]
const stickyLeftMenu = [
  {
    href: '#do-you-need-life-insurance',
    title: 'GroupBenefits.What.label',
  },
  {
    href: '#why-do-you-need-life-insurance',
    title: 'GroupBenefits.WhyNeed.label',
  },
  {
    href: '#types-of-life-insurance',
    title: 'GroupBenefits.Type.label',
  },
  {
    href: '#when-you-need-life-insurance',
    title: 'GroupBenefits.WhenNeed.label',
  },
  {
    href: '#Optimized-solutions-group-insurance',
    title: 'GroupBenefits.Optimized.label',
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

//Events
const benefitLists = [
  {
    title: 'prescriptionDrugs',
    src: '/imgs/icon/NewToCanada.svg',
  },
  {
    title: 'dentalCare',
    src: '/imgs/icon/StartingBusiness.svg',
  },
  {
    title: 'disabilityPrograms',
    src: '/imgs/icon/GettingMarried.svg',
  },
  {
    title: 'lifeCriticalAccdientIns',
    src: '/imgs/icon/HavingBaby.svg',
  },
  {
    title: 'HSA',
    src: '/imgs/icon/BuyingHome.svg',
  },
  {
    title: 'expatsOrNewtoCanada',
    src: '/imgs/icon/EstatePlanning.svg',
  },
  {
    title: 'retiressOrSelfEmployed',
    src: '/imgs/icon/EstatePlanning.svg',
  },
  {
    title: 'travelIns',
    src: '/imgs/icon/EstatePlanning.svg',
  },
]


//Optimized solutions 
const OptimizedServices = [
  {
    title: 'GroupBenefits.Optimized.Analysis',
  },
  {
    title: 'GroupBenefits.Optimized.Design',
  },
  {
    title: 'GroupBenefits.Optimized.Implementation',
  },
  {
    title: 'GroupBenefits.Optimized.Administrative',
  },
  {
    title: 'GroupBenefits.Optimized.Claims',
  },
  {
    title: 'GroupBenefits.Optimized.Renewal',
  },
  {
    title: 'GroupBenefits.Optimized.Cost',
  },
  {
    title: 'GroupBenefits.Optimized.Marketing',
  },

]
//why offer a benefit plan? - accordion
const whyOffer = [
  {
    question: <Text tid={'GroupBenefits.WhyNeeds.Employees.Title'} />,
    answer: (
      <>
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'GroupBenefits.WhyNeeds.Employees.Title'} />
      </h4>
      <ul>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ReducedCost'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ProtectFamily'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ReduceStress'} />
        </li>
      </ul>
      </>
    )
  },
  {
    question: <Text tid={'GroupBenefits.WhyNeeds.Company.Title'} />,
    answer: (
      <>
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'GroupBenefits.WhyNeeds.Company.Title'} />
      </h4>
      <ul>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Productivity'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.LessExpensive'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.BusinessExpense'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Competitive'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Attract'} />
        </li>
      </ul>
      </>
    )
  },
]
//tabs
const tabs = [
  
  { 
    id: 0,
    label: <Text tid={'GroupBenefits.WhyNeeds.Employees.Title'} />,
    // value: 'value 1',
    value : (
      <>
      <h3 style={{margin:'2vh 0'}}>
        <Text tid={'GroupBenefits.WhyNeeds.Employees.Title'} />
      </h3>
      <ul>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ReducedCost'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ProtectFamily'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Employees.ReduceStress'} />
        </li>
      </ul>
      </>
    )
  },
  {
    id: 1,
    label: <Text tid={'GroupBenefits.WhyNeeds.Company.Title'} />,
    value : (
      <>
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'GroupBenefits.WhyNeeds.Company.Title'} />
      </h4>
      <ul>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Productivity'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.LessExpensive'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.BusinessExpense'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Competitive'} />
        </li>
        <li>
          <Text tid={'GroupBenefits.WhyNeeds.Company.Attract'} />
        </li>
      </ul>
      </>
    )
  }
]


export default function GroupBenefits({match}) { 
  const metaData = {
    title: 'Meta.GroupBenefits.Title',
    description: 'Meta.GroupBenefits.Description',
    canonical: match.url
  }

  return (
    <> 
      <MetaTags data={metaData} />
      <Banner title={bannerTitle} links={links} quote_url="/group-benefits/quote/product-selection" />
      <Grid container justify="center" spacing={0}>
        <Hidden mdDown>
          <Grid item lg={2}>
            <StickyLeftMenu
              pageName={<Text tid={'Group Benefits'} />}
              lists={stickyLeftMenu}
              quote_url="/group-benefits/quote/product-selection"
              title={<Text tid={'Group Benefits'}/>}
            />
          </Grid>
        </Hidden>
        <Grid item sm={12} lg={6}>
          <section className="target" id="do-you-need-life-insurance">
            <SectionContent
              label="GroupBenefits.What.label"
              detail="GroupBenefits.What.detail"
            />
          </section>
          <section id="why-do-you-need-life-insurance">
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="GroupBenefits.WhyNeed.label"
                  detail="GroupBenefits.WhyNeed.detail"
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Types /> */}
                <Hidden mdDown>
                  <SimpleTabs tabs={tabs}/>
                </Hidden>
                <Hidden lgUp>
                  <Accordion faqLists={whyOffer} />
                </Hidden>
              </Grid>
            </Grid>
          </section>
          <section id="types-of-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="GroupBenefits.Type.label"
                  detail="GroupBenefits.Type.detail"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Types />
              </Grid> */}
               <Grid item xs={12}>
                <IconCard Content={benefitLists} />
              </Grid>
            </Grid>
          </section>
          <section id="Optimized-solutions-group-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="GroupBenefits.Optimized.label"
                  detail="GroupBenefits.Optimized.detail"
                />
                <ListItem titles={OptimizedServices} />
              </Grid>
              {/* <Grid item xs={12}>
                <Types />
              </Grid> */}
            </Grid>
          </section>
          {/* <section id="when-you-need-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="GroupBenefits.WhenNeed.label"
                  detail="GroupBenefits.WhenNeed.detail"
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={eventsLifeIns} />
              </Grid>
            </Grid>
          </section> */}

          <Grid container justify="center">
            <Grid item xs={12} style={{ maxWidth: '1000px' }}>
              <BannerQuote
                title="GroupBenefits.BannerQuote"
                quote_Btn_Disable="false"
                quote_url="/group-benefits/quote/product-selection"
              />
            </Grid>
          </Grid>

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

          <section id="why-us-life-insurance" style={{ marginBottom: '80px' }}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="Banner.Whyus.label"
                  detail="Banner.Whyus.detail"
                />
              </Grid>
              <Grid item xs={12} style={{ maxWidth: '1000px' }}>
                <WhyUs />
              </Grid>
            </Grid>
          </section>
        </Grid>
      </Grid>
    </>
  )
}
