import React from 'react'
import { useState } from 'react';
//3rd library
import Grid from '@material-ui/core/Grid'
//components
import MetaTags from '../../../components/common/MetaTags';
import Banner from '../../../components/common/Banner';
import SectionContent from '../../../components/common/SectionContent'
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '../../../components/common/Accordion'
// import WhyUs from '../../../components/common/WhyUs'
import BannerQuote from '../../../components/common/BannerQuote'
import IconCard from '../../../components/common/IconCard/IconCard';
import FeatureCard from '../../../components/common/IconCard/FeatureCard';
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import WhyUs from '../../../components/common/WhyUs'
// import CollapsibleTable from '../../../components/common/Tables/collapsibleTable';
// import Products from '../../../components/common/Product/Products';
import CustomizedTables from '../../../components/common/Tables/basicTable';
import Hidden from '@material-ui/core/Hidden'
import { Button } from '@material-ui/core';
//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
// banner Title
const bannerTitle = [<Text tid={'Canadian Traveler Plan'} />]
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
    to: '/travel-insurance/canadian-traveler',
    name: 'Canadian Traveler'
},  
] 
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
// Products
const whoIsCanadian = [
  {
    title: 'pr',
    src: '/imgs/icon/student.svg',
    src2: '/imgs/icon/student-bk.svg'
  },
  {
    title: 'canadian',
    src: '/imgs/icon/graduate.svg',
    src2: '/imgs/icon/graduate-bk.svg'
  },
  
  
]  
//The reason Why need student Ins
const coverages = [
  {
    title: 'canadianSumInsured',
    src: '/imgs/icon/dollar.svg',
    desc: 'We really don’t know when, where and how we’ll pass away but it will certainly happen in our life, having life insurance plan will bring you and your family peace of mind.',
  },
  {
    title: 'Dental',
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
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.SumInsured',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.SumInsured.Detail',
  },

  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyMedical.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.EmergencyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.NonEmergencyMedical.detail',
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.ProfessionalServices.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.Drug',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.Drug.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalEmergencies.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalEmergencies.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalAccident',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.DentalAccident.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.AirfareToReturnHome',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.AirfareToReturnHome.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.AirfareToReturnHome.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.FamilyTransportation.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnAttendantCompanion',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnAttendantCompanion.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnAttendantCompanion.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnPet',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnPet.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnPet.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnVehicle',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnVehicle.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnVehicle.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.VisitOriginCountry',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.VisitOriginCountry.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.VisitOriginCountry.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.IdentityFraud',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.IdentityFraud.detail',
    tooltip: 'TravelInsurance.Allianz.CAN.Benefit.list.IdentityFraud.tooltip'
  },
  {
    title: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.Allianz.CAN.Benefit.list.ReturnofDeceased.detail',
  },
  
]
const tugoBenefit = [
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.SumInsured',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.EmergencyAirTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.NonEmergencyMedical.detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FollowUpCanada.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.Drug.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalEmergencies',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalEmergencies.detail',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DentalAccident.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FractureTreatment.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.UnexpectedNewborn.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.hospitalAllowrance.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ChildCare.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnToDestination.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DelayFlight.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.DomesticServicesCanada.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.AirfareToReturnHome.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnCompanion.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnDependent.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnPet.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnVehicle.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.FamilyTransportation.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.OutOfPocket.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.VisitOriginCountry.tooltip',
  },
  
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.ExcessBaggage.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.RemoteEvacuation.tooltip',
  },
 
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids.detail',
    tooltip: 'TravelInsurance.TuGo.CAN.Benefit.list.VisionHearingAids.tooltip',
  },
  {
    title: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.TuGo.CAN.Benefit.list.ReturnofDeceased.detail',
  },
  
]
//bluecross
const blueCrossBenefit = [
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.SumInsured',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.SumInsured.Detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.Hospitalization',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.Hospitalization.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.EmergencyTransportation',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.EmergencyTransportation.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.NonEmergencyMedical',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.NonEmergencyMedical.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.NonEmergencyMedical.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.ProfessionalServices',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.ProfessionalServices.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.ProfessionalServices.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.Drug',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.Drug.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.Nurses',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.Nurses.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.TestsAndDiagnostics',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.TestsAndDiagnostics.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.MedicalDevices',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.MedicalDevices.detail',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.IncidentalExpenses',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.IncidentalExpenses.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.IncidentalExpenses.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.EmergencyDentalTreatment',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.EmergencyDentalTreatment.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.EmergencyDentalTreatment.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnofDeceased',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnofDeceased.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnofDeceased.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.TransportationExpenses',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.TransportationExpenses.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.TransportationExpenses.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.AdditionalTransportationExpenses',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.AdditionalTransportationExpenses.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.AdditionalTransportationExpenses.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.ExpensesForReturn',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.ExpensesForReturn.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.ExpensesForReturn.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnVehicle',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnVehicle.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.ReturnVehicle.tooltip',
  },
  {
    title: 'TravelInsurance.Bluecross.CAN.Benefit.list.SubsistenceAllowance',
    details: 'TravelInsurance.Bluecross.CAN.Benefit.list.SubsistenceAllowance.detail',
    tooltip: 'TravelInsurance.Bluecross.CAN.Benefit.list.SubsistenceAllowance.tooltip',
  },
  
]
const stickyLeftMenu = [
  {
    href: '#why-buy-travel-insurance',
    title: 'TravelInsurace.Canadian.Definition.label',
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

export default function TravelCanadian({match}) {  
  const metaData = {
    title: 'Meta.TravelInsurace.Canadian.Title',
    description: 'Meta.TravelInsurace.Canadian.Description',
    canonical: match.url
  }
  
  const [company, setCompany] = useState("Allianz")

  return (
    <>
    <MetaTags data={metaData} />
    <Banner title = {bannerTitle}  links={links} quote_url ='/travel-insurance/quote/trip-info' />
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
          <Grid item sm={12} lg={6}>
            
            <section className="target" id="why-buy-travel-insurance">
              <SectionContent
                label="TravelInsurance.WhyNeed.Canadian.label"
                detail="TravelInsurance.WhyNeed.Canadian.detail"
              />
            </section>
            <section id="who-is-eligible-student-insurance">
            <Grid container justify="center">
              <Grid item xs={12}>
                <SectionContent
                  label="TravelInsurance.Selection.Canadian.label"
                  detail=""
                />
              </Grid>
              <Grid item xs={12}>
                <IconCard Content={whoIsCanadian} />
               </Grid>
            </Grid>
            </section>
            <section id="benefit-summary">
            <Grid container>
              <Grid item xs={12}>
              <SectionContent
                  label="TravelInsurance.Canadian.Coverage.label"
                  detail="TravelInsurance.Canadian.Coverage.detail"
                />
               </Grid>
               <Grid item xs={12}>
                <FeatureCard titles={coverages} />
               </Grid>
               <Grid item xs={12} style={{ padding:'32px 0 0 32px', fontWeight:'700', color:'#666'}}>
               <Text tid={'TravelInsurance.BenefitByPlan.detail'} />
               </Grid>
                 {/* benefit summary table */}
                 <Grid item xs={12} style={{ padding:'32px', fontWeight:'700', color:'#666'}}>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'0 5px', background: company==="Allianz"? "#2a2f71": "#fff", color: company==="Allianz"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("Allianz")}>Allianz <Text tid={'Canadian Plan'} /></Button>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'0 5px', background: company==="TuGo"? "#2a2f71": "#fff", color: company==="TuGo"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("TuGo")}>TuGo <Text tid={'Canadian Plan'} /></Button>
                  <Button variant="outlined" style={{textTransform:'capitalize', margin:'0 5px', background: company==="BlueCross"? "#2a2f71": "#fff", color: company==="BlueCross"? "#fff": "rgba(0, 0, 0, 0.87)"}} onClick={() => setCompany("BlueCross")}>BlueCross <Text tid={'Canadian Plan'} /></Button>
               </Grid>
               
               <Grid item xs={12} style={{ padding:'32px 32px 16px 32px', marginTop:'-32px'}}>
               
               {/* <CollapsibleTable/> */}
                {company==="Allianz" ? 
                // <Hidden mdDown>
                  <>
                    <img
                      src={allianzLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    />
                    <CustomizedTables rows={allianzBenefit} />
                  </>
                // </Hidden>
                :null}
                {company==="TuGo" ? 
                <>
                    <img
                      src={tugoLogo}
                      alt='logo'
                      style={{width:'120px', display:'block', marginTop:'20px'}}
                    />
                    <CustomizedTables rows={tugoBenefit} />
                </>
                :null}
                 {company==="BlueCross" ? 
                 <>
                  <img
                    src={blueCrossLogo}
                    alt='logo'
                    style={{width:'120px', display:'block', marginTop:'20px'}}
                  />
                  <CustomizedTables rows={blueCrossBenefit} />
                 </>
                 :null}
            
               </Grid>

               <Grid item xs={12} style={{ padding:'0 32px', fontWeight:'600', fontSize:'12px', color:'red'}}>
               * <Text tid={'TravelInsurance.BenefitByPlan.policywording'} />
               </Grid>

               {/* <Grid item xs={12}  style={{margin:'2em'}}>
               <CollapsibleTable/>
               </Grid> */}
               
            </Grid>
            </section>

            <Grid container justify="center"  >
              <Grid item xs={12} style={{maxWidth:'1000px'}}>
                <BannerQuote
                  title="TravelInsurace.BannerQuote"
                  quote_Btn_Disable="false"
                  quote_url="/travel-insurance/quote/trip-info"
                />
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

