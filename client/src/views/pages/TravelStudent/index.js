import { useState, useContext, useEffect } from 'react';
// core components
import { Grid, Typography, IconButton } from '@material-ui/core';
//components
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner';
import SectionContent from '../../../components/common/SectionContent'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
import BannerQuote from '../../../components/common/BannerQuote'
import IconCard from '../../../components/common/IconCard/IconCard';
import FeatureCard from '../../../components/common/IconCard/FeatureCard';
import CustomizedTables from '../../../components/common/Tables/basicTable';
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
import Hidden from '@material-ui/core/Hidden'
import { Button } from '@material-ui/core';
//icons
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'

// banner Title
const bannerTitle = [<Text tid={`Student and Companion Plan`} />]
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
    to: '/travel-insurance/student',
    name: 'Student and Companion Plan'
},  
] 
const faqLists = [
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
// Products
const whoIsStudent = [
  {
    title: 'students',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'graduates',
    src: '/imgs/icon/graduate.svg',
    src2: '/imgs/icon/graduate-bk.svg'
  },
  {
    title: 'companions',
    src: '/imgs/icon/companion.svg',
    src2: '/imgs/icon/companion-bk.svg'
  },
  
]  
//The reason Why need student Ins
const coverages = [
  {
    title: 'studentSumInsured',
    src: '/imgs/icon/dollar.svg',
    desc: 'We really don’t know when, where and how we’ll pass away but it will certainly happen in our life, having life insurance plan will bring you and your family peace of mind.',
  },
  {
    title: 'DentalHealthEyes',
    src: '/imgs/icon/dental.svg',
    desc: 'if you’re the main income stream earner in your family and loved ones financially depend on you, you must have a life insurance or similar back up plans in case you unexpectedly pass away. Life insurance can be very affordable and easy plans than other backup plans',
  },
  {
    title: 'ProServices',
    src: '/imgs/icon/doctor.svg',
    desc: 'You don’t want your family and loved ones in financial stress with outstanding mortgage, auto loan and other final expenses such as funeral costs.',
  },
  {
    title: 'prescriptionDrug',
    src: '/imgs/icon/drugs.svg',
    desc: 'Life insurance proceed can be used pay esate taxes. As we all know, life insurance proceed is tax free and this can minimize and significantly reduce the taxes to your heir',
  },
 
]

//benefit detail table
const allianzBenefit = [
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyMedical.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EmergencyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.ProfessionalServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.Drug',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.Drug.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.DentalEmergencies.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.DentalAccident.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.WisdomTeeth',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.WisdomTeeth.detail',
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.EyeExamination.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.PhysicalExamination.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.Maternity.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.TutorialServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.FamilyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath.detail',
    tooltip: 'TravelInsurance.Allianz.ST.Benefit.list.AccidentalDeath.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.ST.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.Allianz.ST.Benefit.list.ReturnofDeceased.detail',
  },  
]

const tugoBenefit = [
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.SumInsured',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyHospital',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyHospital.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EmergencyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.NonEmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Drug',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Drug.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.DentalEmergencies.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.DentalAccident.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.WisdomTeeth',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.WisdomTeeth.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.EyeExamination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.PhysicalExamination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Maternity.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.Fracture.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination.detail',
    tooltip: 'TravelInsurance.TuGo.ST.Benefit.list.vaccination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.AccidentalDeath',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.AccidentalDeath.detail',
  },
  {
    title: 'TravelInsurance.TuGo.ST.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.ST.Benefit.list.ReturnofDeceased.detail',
  },
]


const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Student.Definition.label',
  },
  {
    href: '#who-is-eligible-student-insurance',
    title: 'TravelInsurace.Student.WhoEligible.label',
  },
  {
    href: '#benefit-summary',
    title: 'TravelInsurace.Student.Benefit.label',
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

const brochures = [
  {company:'Allianz',
    documents: [{"language" : "EN", "document_url" : "Brochures/Allianz-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Allianz-International-Student-Korean.pdf"}, 
                {"language" : "AR", "document_url" : "Brochures/Allianz-International-Student-Arabic.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Allianz-International-Student-Chinese(Simplified).pdf"}, 
                {"language" : "CH_T", "document_url" : "Brochures/Allianz-International-Student-Chinese(Traditional).pdf"}, 
                {"language" : "PT_BR", "document_url" : "Brochures/Allianz-International-Student-Portuguese(Brazil).pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Allianz-International-Student-Spanish.pdf"}]
  },
  {company:'Tugo',
    documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-International-Student-English.pdf"}, 
                {"language" : "KO", "document_url" : "Brochures/Tugo-International-Student-Korean.pdf"}, 
                {"language" : "AR", "document_url" : "Brochures/Tugo-International-Student-Arabic.pdf"}, 
                {"language" : "CH_S", "document_url" : "Brochures/Tugo-International-Student-Chinese(Simplified).pdf"}, 
                {"language" : "JA", "document_url" : "Brochures/Tugo-International-Student-Japanese.pdf"}, 
                {"language" : "ES", "document_url" : "Brochures/Tugo-International-Student-Spanish.pdf"}]
  }
]


export default function TravelStudent({match}) {

  const metaData = {
    title: 'Meta.TravelInsurace.Student.Title',
    description: 'Meta.TravelInsurace.Student.Description',
    canonical: match.url
  }    

  const [company, setCompany] = useState("Allianz")

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

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
    <Banner title = {bannerTitle}  links={links} quote_url ='/travel-insurance/quote/trip-info' />
      <Grid container justify="center">
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
          <Grid item sm={12} lg={6}>
            
            <section className="target" id="why-buy-travel-insurance">
              <SectionContent
                label="TravelInsurace.WhyNeed.Student.label"
                detail="TravelInsurace.WhyNeed.Student.detail"
              />
            </section>
            <section id="who-is-eligible-student-insurance">
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="TravelInsurace.Selection.Student.label"
                  detail=""
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={whoIsStudent} />
               </Grid>
            </Grid>
            </section>
            <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="TravelInsurance.Coverage.label"
                  detail="TravelInsurance.Coverage.detail"
                />
               </Grid>
               <Grid item xs={12}>
                <FeatureCard titles={coverages} />
               </Grid>
               
               {/* benefit summary table */}
               <Grid item xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666'}}>
                <Text tid={'TravelInsurance.BenefitByPlan.detail'} /><br/><br/>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'0 5px', background: company==="Allianz"? "#2a2f71": "#fff", color: company==="Allianz"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Allianz")}>Allianz <Text tid={'Student Plan'} /></Button>
                <Button variant="outlined" style={{textTransform:'capitalize', margin:'0 5px', background: company==="TuGo"? "#2a2f71": "#fff", color: company==="TuGo"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("TuGo")}>TuGo <Text tid={'Student Plan'} /></Button>
               </Grid>
               <Grid item container xs={12} style={{ padding:'0 32px 16px 32px', marginTop:'-32px'}}>
                  {/* Logo Image and download brochure*/}
                  <Grid item xs={12} sm={12} md={3} lg={3}>
                    <img
                      src={company==="Allianz"?allianzLogo:tugoLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    />
                  </Grid>
                  {/* Brochure */}
                  <Grid item xs={12} sm={12} md={9} lg={9} style={{ paddingTop:'32px' }}>
                    <IconButton aria-label="view" color="primary" 
                        onClick={() => {
                          let url = ''
                            const companyBrochure = brochures.filter(f => f.company.toLowerCase() === company.toLowerCase())
                            if (companyBrochure.length>0){
                              const brochure = companyBrochure[0].documents.filter(f => f.language === currentLanguage.toUpperCase())
                              if (brochure.length>0){
                                url = process.env.REACT_APP_S3_URL + brochure[0].document_url
                              }else{
                                const enBrochure = companyBrochure[0].documents.filter(f => f.language === 'EN')
                                if (enBrochure.length>0){
                                  url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url
                                }
                              }
                            }
                          window.open(url, '_blank')
                        }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                        <Text tid={'Quote.SeeMoreBenefit'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* Benefit summary */}
                  <Grid item xs={12}>
                    <CustomizedTables rows={company==="Allianz"?allianzBenefit:tugoBenefit} />
                  </Grid>
               </Grid>

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>
               
            </Grid>
            </section>

            <Grid container justify="center"  >
            <Grid item xs={12} style={{maxWidth:"1000px"}}>
                <BannerQuote 
                  title = "TravelInsurace.BannerQuote"
                  quote_Btn_Disable ="false" 
                  quote_url ='/travel-insurance/quote/trip-info'/>
              </Grid>
            </Grid>

            <section id="you-should-know-what-you-are-buying">
            <Grid container>
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

