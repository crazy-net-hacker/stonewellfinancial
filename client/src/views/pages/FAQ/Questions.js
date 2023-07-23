import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'

const useStyles = makeStyles((theme) => ({
    root: {
    },
    greenlineBox: {
        paddingBottom: '1em'
    },
    greenline: {
        width: "2.5rem",
        height: "3px",
        background: "#8EC641",
        display: "inline-block",
        borderRadius: '100px'
    },
}))

/* question and answers are ordered with keys in 1-based indexing system where first digit is the section and second digit is the question number within the section
   if a new question is added follow the key convention and also add the question with same key to SearchBar.js*/

const FAQ = [
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI',
    answer: 'TravelInsurace.FAQ.list.WhyNeedCanadianTI.detail',
  }, 
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting',
    answer: 'TravelInsurace.FAQ.list.CanBuyTIWithPreExisting.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.Pre-existing',
    answer: 'TravelInsurace.FAQ.list.Pre-existing.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.WaitingPeriod',
    answer: 'TravelInsurace.FAQ.list.WaitingPeriod.detail',
  },
  {
    type: 'Travel',    
    question: 'TravelInsurace.FAQ.list.WhoContact',
    answer: 'TravelInsurace.FAQ.list.WhoContact.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.WhenBuyTI',
    answer: 'TravelInsurace.FAQ.list.WhenBuyTI.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.HowToExtendTI',
    answer: 'TravelInsurace.FAQ.list.HowToExtendTI.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.CovidCovered',
    answer: 'TravelInsurace.FAQ.list.CovidCovered.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.WhatDeductible',
    answer: 'TravelInsurace.FAQ.list.WhatDeductible.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.WhatBeneficiary',
    answer: 'TravelInsurace.FAQ.list.WhatBeneficiary.detail',
  },

  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.HowToClaim',
    answer: 'TravelInsurace.FAQ.list.HowToClaim.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.HowRefund',
    answer: 'TravelInsurace.FAQ.list.HowRefund.detail',
  },
  {
    type: 'Travel',
    question: 'TravelInsurace.FAQ.list.OutofPocket',
    answer: 'TravelInsurace.FAQ.list.OutofPocket.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.ShouldIBuy',
    answer: 'LifeInsurance.FAQ.list.ShouldIBuy.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage',
    answer: 'LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.WhichInsuranceCompany',
    answer: 'LifeInsurance.FAQ.list.WhichInsuranceCompany.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost',
    answer: 'LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.CanBeDeclined',
    answer: 'LifeInsurance.FAQ.list.CanBeDeclined.detail',
  },
  {
    type: 'Life',
    question: 'LifeInsurance.FAQ.list.HowLongShouldNonSmoke',
    answer: 'LifeInsurance.FAQ.list.HowLongShouldNonSmoke.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.WhyNeed',
    answer: 'HealthInsurance.FAQ.list.WhyNeed.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.CantJustGHIP',
    answer: 'HealthInsurance.FAQ.list.CantJustGHIP.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.qualifyHealthIns',
    answer: 'HealthInsurance.FAQ.list.qualifyHealthIns.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.differByProvince',
    answer: 'HealthInsurance.FAQ.list.differByProvince.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.howToQuote',
    answer: 'HealthInsurance.FAQ.list.howToQuote.detail',
  },
  {
    type: 'Health',
    question: 'HealthInsurance.FAQ.list.familySamePlan',
    answer: 'HealthInsurance.FAQ.list.familySamePlan.detail',
  },    
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.PriceSameForFullAndPart',
    answer: 'GroupBenefits.FAQ.list.PriceSameForFullAndPart.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.Eligibility',
    answer: 'GroupBenefits.FAQ.list.Eligibility.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.BenefitMaximums',
    answer: 'GroupBenefits.FAQ.list.BenefitMaximums.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.HowToApply',
    answer: 'GroupBenefits.FAQ.list.HowToApply.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.Payment',
    answer: 'GroupBenefits.FAQ.list.Payment.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.WhatInsuranceCompany',
    answer: 'GroupBenefits.FAQ.list.WhatInsuranceCompany.detail',
  },
  {
    type: 'GroupBenefit',
    question: 'GroupBenefits.FAQ.list.HowSoonStart',
    answer: 'GroupBenefits.FAQ.list.HowSoonStart.detail',
  }
]

// search matched words
const textLowerCase = (text) =>{
  return (text.toLowerCase().replace(/\s/g,'') )
}


export default function Questions(props) {
  const { searchText } = props
  const classes = useStyles();

  const translateFAQs = []
  FAQ.map(i=>
      translateFAQs.push({type: i.type, question: Text({tid:i.question}), answer: Text({tid:i.answer}), isTranslated: true})
  )

  const insuranceFAQ = translateFAQs.filter(f=> (textLowerCase(f.question).includes(textLowerCase(searchText)))
                                                ||(textLowerCase(f.answer).includes(textLowerCase(searchText))));

  return (
      <>
      <Grid container justify='center' spacing={0}>
          <Grid id="header0" item xs={12} >
              <div className={classes.greenlineBox}>
                  <span className={classes.greenline}></span>
              </div>
              <Typography variant="h2">
                  <Text tid={'FAQ.Header1'} />
              </Typography>
          </Grid>
          <Grid item xs={12}>
              <Accordion faqLists={insuranceFAQ.filter(f=>f.type === 'Travel')} />
          </Grid>
          <Grid id="header1" item xs={12} >
              <div className={classes.greenlineBox}>
                  <span className={classes.greenline}></span>
              </div>
              <Typography variant="h2">
                  <Text tid={'FAQ.Header2'} />
              </Typography>
          </Grid>
          <Grid item xs={12}>
              <Accordion faqLists={insuranceFAQ.filter(f=>f.type === 'Life')} />
          </Grid>
          <Grid id="header2" item xs={12} >
              <div className={classes.greenlineBox}>
                  <span className={classes.greenline}></span>
              </div>
              <Typography variant="h2">
                  <Text tid={'FAQ.Header3'} />
              </Typography>
          </Grid>
          <Grid item xs={12}>
              <Accordion faqLists={insuranceFAQ.filter(f=>f.type === 'Health')} />
          </Grid>
          <Grid id="header3" item xs={12} >
              <div className={classes.greenlineBox}>
                  <span className={classes.greenline}></span>
              </div>
              <Typography variant="h2">
                  <Text tid={'FAQ.Header4'} />
              </Typography>
          </Grid>
          <Grid item xs={12}>
              <Accordion faqLists={insuranceFAQ.filter(f=>f.type === 'GroupBenefit')} />
          </Grid>
      </Grid>
      </>
  )
}