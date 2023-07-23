import React from 'react'
//3rd library
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
//components (common)
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner'
import SectionContent from '../../../components/common/SectionContent'
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
//components
import FeatureCard from '../../../components/common/IconCard/FeatureCard'
// import Types from './Types'
import SimpleTabs from '../../../components/common/Tabs/tabsHorizontal'
import IconCard from '../../../components/common/IconCard/IconCard'


// banner Title
const bannerTitle = ['Life Insurance']

const faqLists = [
  {
    question: 'LifeInsurance.FAQ.list.ShouldIBuy',
    answer: 'LifeInsurance.FAQ.list.ShouldIBuy.detail',
  },
  {
    question: 'LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage',
    answer: 'LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage.detail',
  },
  {
    question: 'LifeInsurance.FAQ.list.WhichInsuranceCompany',
    answer: 'LifeInsurance.FAQ.list.WhichInsuranceCompany.detail',
  },
  {
    question: 'LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost',
    answer: 'LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost.detail',
  },
  {
    question: 'LifeInsurance.FAQ.list.CanBeDeclined',
    answer: 'LifeInsurance.FAQ.list.CanBeDeclined.detail',
  },
  {
    question: 'LifeInsurance.FAQ.list.HowLongShouldNonSmoke',
    answer: 'LifeInsurance.FAQ.list.HowLongShouldNonSmoke.detail',
  },
]
const insuranceType = [
  {
    question: 'Term Insurance',
    answer: (
      <>
      <h3 style={{ margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.term.what'} />
      </h3>
      <p>
        <Text tid={'LifeInsurance.Type.term.what.detail'} />
      </p>
      <br />
      <h3 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.term.benefit'} />
      </h3>
      <ul>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.affordable'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.protection'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.taxfree'} />
        </li>
      </ul>
      <br />
    
      <h3 style={{margin:'2vh 0'}}>
        <Text tid={`LifeInsurance.Type.term.right`} />
      </h3>
      <p>
        <Text tid={`LifeInsurance.Type.term.right.detail`} />
      </p>
      <ul>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.benefit`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.protection`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.businessOwner`} />
        </li>
      </ul>
      </>
    ),
  },
  {
    question: 'Whole Life Insurance',
    answer: (
      <>
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.what'} />
      </h4>
      <p>
        <Text tid={'LifeInsurance.Type.whole.what.detail'} />
      </p>
      <br />
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.benefit'} />
      </h4>
      <ul>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.lastLifetime'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.savingCash'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.deathBenefit'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.taxfree'} />
        </li>
      </ul>
      <br />
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.whenNeed'} />
      </h4>
      <p>
        <Text tid={'LifeInsurance.Type.whole.whenNeed.detail'} />
      </p>
      <ul>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.longProtection`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.businessOwner`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.familyLongitivity`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.protectAsset`} />
        </li>
      </ul>
      <br />
      </>
    ),
  },
  {
    question: 'Universal Life Insurance',
    answer:  (
      <>
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.what'} />
        </h4>
        <p>
          <Text tid={'LifeInsurance.Type.universal.what.detail'} />
        </p >
        <br />
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.benefit'} />
        </h4>
        <ul>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.flexibility'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.investment'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.depositsAdjustable'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.taxfree'} />
          </li>
        </ul>
        <br />
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.whenNeed'} />
        </h4>
        <ul>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.longProtection'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.businessOwner'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.familyLongitivity'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.protectAsset'} />
          </li>
        </ul>
      </>
    ),
  },
  
]
const stickyLeftMenu = [
  {
    href: '#do-you-need-life-insurance',
    title: 'LifeInsurance.Definition.label',
  },
  {
    href: '#why-do-you-need-life-insurance',
    title: 'LifeInsurance.WhyNeed.label',
  },
  {
    href: '#types-of-life-insurance',
    title: 'LifeInsurance.Type.label',
  },
  {
    href: '#when-you-need-life-insurance',
    title: 'LifeInsurance.WhenNeed.label',
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
      to: '/life-insurance',
      name: 'Life Insurance'
  },  
]  

//Events
const eventsLifeIns = [
  {
    title: 'newCanada',
    src: '/imgs/icon/NewToCanada.svg',
    src2: '/imgs/icon/NewToCanada-bk.svg'
  },
  {
    title: 'startBusiness',
    src: '/imgs/icon/StartingBusiness.svg',
    src2: '/imgs/icon/StartingBusiness-bk.svg'
  },
  {
    title: 'getMerried',
    src: '/imgs/icon/GettingMarried.svg',
    src2: '/imgs/icon/GettingMarried-bk.svg'
  },
  {
    title: 'haveBaby',
    src: '/imgs/icon/HavingBaby.svg',
    src2: '/imgs/icon/HavingBaby-bk.svg'
  },
  {
    title: 'buyHome',
    src: '/imgs/icon/BuyingHome.svg',
    src2: '/imgs/icon/BuyingHome-bk.svg'
  },
  {
    title: 'estatePlan',
    src: '/imgs/icon/EstatePlanning.svg',
    src2: '/imgs/icon/EstatePlanning-bk.svg'
  },
]
//The reason Why need Life Ins
const needLifeIns = [
  {
    title: 'bringPeace',
    src: '/imgs/icon/BringPeace.svg',
    desc: 'We really don’t know when, where and how we’ll pass away but it will certainly happen in our life, having life insurance plan will bring you and your family peace of mind.',
  },
  {
    title: 'protectFamily',
    src: '/imgs/icon/Protectfamily.svg',
    desc: 'if you’re the main income stream earner in your family and loved ones financially depend on you, you must have a life insurance or similar back up plans in case you unexpectedly pass away. Life insurance can be very affordable and easy plans than other backup plans',
  },
  {
    title: 'payoff',
    src: '/imgs/icon/PayDebts.svg',
    desc: 'You don’t want your family and loved ones in financial stress with outstanding mortgage, auto loan and other final expenses such as funeral costs.',
  },
  {
    title: 'protectTax',
    src: '/imgs/icon/ProtectEstate.svg',
    desc: 'Life insurance proceed can be used pay esate taxes. As we all know, life insurance proceed is tax free and this can minimize and significantly reduce the taxes to your heir',
  },
]
const tabs = [
  
  { 
    id: 0,
    label: 'Term Insurance',
    // value: 'value 1',
    value : (
      <>
      <h3 style={{margin:'2vh 0', fontSize:'1.1rem', fontWeight:'600' }}>
        <Text tid={'LifeInsurance.Type.term.what'} />
      </h3>
      <p>
        <Text tid={'LifeInsurance.Type.term.what.detail'} />
      </p>
      <br />
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.term.benefit'} />
      </h4>
      <ul>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.affordable'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.protection'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.term.what.list.taxfree'} />
        </li>
      </ul>
      <br />
    
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={`LifeInsurance.Type.term.right`} />
      </h4>
      <p>
        <Text tid={`LifeInsurance.Type.term.right.detail`} />
      </p>
      <ul>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.benefit`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.protection`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.term.right.list.businessOwner`} />
        </li>
      </ul>
      </>
    )
  },
  {
    id: 1,
    label: 'Whole Life Insurance',
    value : (
      <>
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.what'} />
      </h4>
      <p>
        <Text tid={'LifeInsurance.Type.whole.what.detail'} />
      </p>
      <br />
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.benefit'} />
      </h4>
      <ul>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.lastLifetime'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.savingCash'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.deathBenefit'} />
        </li>
        <li>
          <Text tid={'LifeInsurance.Type.whole.what.list.taxfree'} />
        </li>
      </ul>
      <br />
      <h4 style={{margin:'2vh 0'}}>
        <Text tid={'LifeInsurance.Type.whole.whenNeed'} />
      </h4>
      <p>
        <Text tid={'LifeInsurance.Type.whole.whenNeed.detail'} />
      </p>
      <ul>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.longProtection`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.businessOwner`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.familyLongitivity`} />
        </li>
        <li>
          <Text tid={`LifeInsurance.Type.whole.whenNeed.list.protectAsset`} />
        </li>
      </ul>
      <br />
      </>
    )
  },
  {
    id: 2,
    label: 'Universal Life Insurance',
    value : (
      <>
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.what'} />
        </h4>
        <p>
          <Text tid={'LifeInsurance.Type.universal.what.detail'} />
        </p >
        <br />
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.benefit'} />
        </h4>
        <ul>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.flexibility'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.investment'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.depositsAdjustable'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.benefit.list.taxfree'} />
          </li>
        </ul>
        <br />
        <h4 style={{margin:'2vh 0'}}>
          <Text tid={'LifeInsurance.Type.universal.whenNeed'} />
        </h4>
        <ul>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.longProtection'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.businessOwner'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.familyLongitivity'} />
          </li>
          <li>
            <Text tid={'LifeInsurance.Type.universal.whenNeed.list.protectAsset'} />
          </li>
        </ul>
      </>
    )
  },
]

export default function LifeInsurance({match}) { 

  const metaData = {
    title: 'Meta.LifeInsurace.Title',
    description: 'Meta.LifeInsurace.Description',
    canonical: match.url
  }

  return (
    <>
      <MetaTags data={metaData} />  
      <Banner title={bannerTitle} links={links} quote_url="/life-insurance/quote/product-selection" />
        <Grid container justify="center" spacing={0}>
          <Hidden mdDown>
            <Grid item lg={2}>
              <StickyLeftMenu
                pageName={<Text tid={'Life Insurance'} />}
                lists={stickyLeftMenu}
                quote_url="/life-insurance/quote/product-selection"
                title={<Text tid={'Life Insurance'} />}
              />
            </Grid>
          </Hidden>
          <Grid item sm={12} lg={6}>
            
            <section className="target" id="do-you-need-life-insurance">
              <SectionContent
                label="LifeInsurance.Definition.label"
                detail="LifeInsurance.Definition.detail"
              />
            </section>
            <section id="why-do-you-need-life-insurance">
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="LifeInsurance.WhyNeed.label"
                  detail="LifeInsurance.WhyNeed.detail"
                />
              </Grid>
              <Grid item xs={12}>
                <FeatureCard titles={needLifeIns} />
              </Grid>
            </Grid>
            </section>
            <section id="types-of-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="LifeInsurance.Type.label"
                  detail="LifeInsurance.Type.detail"
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Types /> */}
                <Hidden mdDown>
                  <SimpleTabs tabs={tabs}/>
                </Hidden>
                <Hidden lgUp>
                  <Accordion faqLists={insuranceType} />
                </Hidden>
              </Grid>
            </Grid>
            </section>

            <section id="when-you-need-life-insurance">
            <Grid container>
              <Grid item xs={12}>
                <SectionContent
                  label="LifeInsurance.WhenNeed.label"
                  detail="LifeInsurance.WhenNeed.detail"
                />
               </Grid>
               <Grid item xs={12}>
                <IconCard Content={eventsLifeIns} />
               </Grid>
            </Grid>
            </section>

            <Grid container justify="center"  >
              <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote
                  title="LifeInsurance.BannerQuote"
                  quote_Btn_Disable="false"
                  quote_url="/life-insurance/quote/product-selection"
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

            <section
              id="why-us-life-insurance"
            >
              <Grid container justify="center">
                <Grid item xs={12} >
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
