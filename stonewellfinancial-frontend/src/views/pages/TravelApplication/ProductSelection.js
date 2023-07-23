import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
import { 
  Typography, IconButton, Grid, 
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
// import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
// common
import { Text, LanguageContext } from "../../../components/common/LanguageProvider"; 
import { SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import Button from '../../../components/common/CustomButtons/Button'
import TooltipInfo from '../../../components/common/TooltipInfo';
// controllers
import { dateFormat, amountFormat } from '../../../controllers/dataFormat'
import { CalculateTripDays } from '../../../controllers/CalculateValue'
import { isMedicalQuestionAnswered,
        calculateSurchargeTugoMedicalQuestion } from '../../../functionalities/MedicalQuestion';
// medical questionniar
import MedQuestionTugoForm from '../../../components/common/MedicalQuestion/MedQuestionTugoForm';
import MedQuestionAllianzForm from '../../../components/common/MedicalQuestion/MedQuestionAllianzForm';
// medical eligibility confirm
import MedEligibilityAllianzForm from '../../../components/common/MedicalQuestion/MedEligibilityAllianzForm'
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
// AddOnProduct (Optional plan) 
import AddOnProduct from './AddOnProduct';
// style
import formStyle from '../../../assets/jss/styles/formStyle';
//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
//icons
import Checked from '../../../assets/imgs/icons/checked.svg'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import { SelectTextFieldSmall } from "../../../components/common/CustomTextFields/TextFieldSmall";

// Style
const useStyles = makeStyles(formStyle)

const ProductSelection = (props) => {
  const { personInfo, questions, values,
    setFieldValue,
    // handleChange
  } = props;

  const classes = useStyles() 
  
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage


  // Selection optional product Modal
  const [openSelectPlan, setOpenSelectPlan] = useState(false);

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
      let url = ''
      if (kind === 'plan'){
        const brochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))
        if (brochure.length > 0){
          url = process.env.REACT_APP_S3_URL + brochure[0].document_url
        }else{
          const enBrochure = insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'EN'))
          if (enBrochure.length > 0){
            url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url
          } 
        }  
      } else {
        // set url
        url = ''
      }

      setPdfOption({
              brochures_url : url,
              title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
          })
      setOpenPDFViewer(true)
  }

    // Medical Question & Answer
    const [medQuestion, setMedQuestion] = useState([]);

    // Tugo Medical Question Modal Form
    const [openTugoQuestion, setOpenTugoQuestion] = useState(false);
    const handleOpenTugoQuestion = (insuredPerson) => {
      // console.log(insuredPerson)
      setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Tugo')).map(pi => {
        return {
          planMedQuestion: pi,
          // travelType: insuredPerson.travelType,
          eligilbeIns: insuredPerson.eligilbeIns,
          insuredBirthDate: insuredPerson.birthDate,
          isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Tugo' ?'Y':'N'
        }
      }))
      setOpenTugoQuestion(true)
    }
  
  
  
    // Allianz Medical Question Modal Form
    const [openAllianzQuestion, setOpenAllianzQuestion] = useState(false);
    const handleOpenAllianzQuestion = (insuredPerson) => {
      // console.log(insuredPerson)
      setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Allianz')).map(pi => {
        return {
          planMedQuestion: pi,
          // travelType: insuredPerson.travelType,
          eligilbeIns: insuredPerson.eligilbeIns,
          insuredBirthDate: insuredPerson.birthDate,
          isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Allianz' ?'Y':'N'
        }
      }))
      setOpenAllianzQuestion(true)
    }
  
    // Allianz Medical Eligibility Modal Form
    const [openAllianzEligibility, setOpenAllianzEligibility] = useState(false);
    const handleOpenAllianzEligibility = (insuredPerson) => {
      // console.log(insuredPerson.insurancePlans.filter(i=>(i.compnayName ==='Allianz')).map( pi => pi))
      setMedQuestion(insuredPerson.insurancePlans.filter(i => (i.compnayName === 'Allianz')).map(pi => {
        return {
          planMedQuestion: pi,
          // travelType: insuredPerson.travelType,
          eligilbeIns: insuredPerson.eligilbeIns,
          insuredBirthDate: insuredPerson.birthDate,
          isSelectedPlan: insuredPerson.selectedPlan.compnayName === 'Allianz' ?'Y':'N'
        }
      }))
      setOpenAllianzEligibility(true)
    }
  
  
  //Mobile design
  const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }
    useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
    }, []);
    
    let isMobile = (width < 768);



  return (
    <div>

      <Grid container >
        {/* Product */}
        {values.insuredPersons[personInfo.personIndex].insurancePlans.length > 0 
        ?( 
          <>
            <Grid item container xs={12}>
              {/* coverage selection box */}
              <Grid item>
                <div>
                  {values.insuredPersons[personInfo.personIndex].insurancePlans.map((insurance) => (
                    <Grid item container key={insurance.compnayName + insurance.generic_name}>
                      <Grid item xs={12}>
                        {insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).length > 0 &&
                            insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).map((coverage, coverageIndex) => (
                              <div key={coverageIndex}>
                                <Grid item container>
                                    {/* Insurance Product */}
                                    <Grid item container 
                                      style={{ 
                                        alignItems: 'center', 
                                        backgroundColor: 'white', 
                                        padding:'15px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '10px',
                                        borderTop: isMobile ? '1px solid #ddd': '10px solid #2a2f71'
                                      }}
                                    >
                                      {/* Product */}
                                      <Grid item container spacing={3}> 
                                          <Grid item xs={12} sm={3} style={{ textAlign: !isMobile ? 'left' : 'center', background: !isMobile ? 'none' : '#f9f9f9'}}>
                                              <img
                                                src={values.application.applicationCompany === 'Tugo' 
                                                        ? tugoLogo : values.application.applicationCompany === 'Allianz' 
                                                        ? allianzLogo : values.application.applicationCompany === 'BlueCross'
                                                            ? blueCrossLogo : null}
                                                alt='logo'
                                                style={{width: values.application.applicationCompany === 'Allianz' ? '100px' : values.application.applicationCompany ==='Tugo' ? '110px' : 'auto', height: values.application.applicationCompany ==='BlueCross' ? '70px' : 'auto'}}
                                              />
                                          </Grid>

                                          <Grid item container xs={12} sm={9} md={9} spacing={1} style={{ alignSelf:'center' }}>
                                            <p style={{ fontWeight: '600', fontSize:'16px', marginBottom:'0', textAlign: 'center', padding: isMobile ? '1vh': 'none', width: '100%' }}>
                                              {/* {insurance.compnayName + ' ' + coverage.generic_name} */}
                                              {
                                                  (currentLanguage === 'ko' 
                                                    ? (coverage.generic_name_kr ? coverage.generic_name_kr : coverage.generic_name) 
                                                    : coverage.generic_name)
                                              }
                                            </p>
                                            <div style={{ width:'100%', textAlign: 'center' }}>
                                              <IconButton aria-label="view" color="primary" 
                                                  style={{ padding: isMobile ? '1vh': '0' }}
                                                  onClick={() => handleOpenPDFViewer('plan',insurance)}
                                              >
                                                <DescriptionIcon />
                                                <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '300'  }}>
                                                  <Text tid={'Quote.SeeMoreBenefit'}/>
                                                </Typography>
                                              </IconButton>   
                                            </div>
                                          </Grid>
                                          {/* See more benefits */}
                                          {/* <Grid item container xs={12} sm={4} md={4} spacing={1}>
                                            <IconButton aria-label="view" color="primary" 
                                                onClick={() => handleOpenPDFViewer('plan',insurance)}
                                            >
                                              <DescriptionIcon />
                                              <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '300'  }}>
                                                <Text tid={'Quote.SeeMoreBenefit'}/>
                                              </Typography>
                                            </IconButton>   
                                          </Grid> */}
                                        
                                        <Grid item container xs={6} sm={4} md={4} style={{ borderTop: '1px solid #ddd' }}> 
                                          {/* coverage up to */}
                                          <Grid item xs={12} style={{ textAlign:'center' }}>
                                            <span style={{ fontSize: '14px',fontWeight: '600' }}>
                                              <Text tid={'Quote.SumInsured'}/>
                                              {/* Coverage up to */}
                                            </span>
                                            {insurance.coverages.length > 1 ?
                                              <SelectTextField
                                                //label="Coverage"
                                                name="coverage"
                                                value={insurance.selectedCoverage}
                                                onChange={(e) => {
                                                  insurance.selectedCoverage = e.currentTarget.value
                                                  setFieldValue('insurance.selectedCoverage', e.currentTarget.value)
                                                }}
                                              >
                                                {
                                                  values.insuredPersons[personInfo.personIndex].eligilbeIns !== 'CANADIAN' ?
                                                    <>
                                                      {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                        <option key={coverage.price_code} value={coverage.price_code}>
                                                          {amountFormat(coverage.price_code, 0)}
                                                        </option>
                                                      ))}
                                                    </>
                                                    :
                                                    <>
                                                      {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                        <option key={coverage.price_code} value={coverage.price_code}>
                                                          {amountFormat(coverage.price_code, 0)}
                                                        </option>
                                                      ))[0]}
                                                    </>
                                                }
                                              </SelectTextField>
                                              :
                                              <Typography color="textSecondary" gutterBottom style={{ marginTop:'2vh', fontWeight:'500' }}>
                                                {amountFormat(insurance.coverages[0].price_code, 0)}
                                              </Typography>
                                            }
                                          </Grid>
                                        </Grid>

                                        <Grid item container xs={6} sm={4} md={4} style={{ borderTop:'1px solid #ddd' }}> 
                                            {/* Deductible */}
                                            {coverage.type_deduct.length > 0 ?
                                              <>
                                                <Grid item xs={12} style={{textAlign:'center'}}>
                                                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                    <Text tid={'Quote.Deductible'}/>
                                                    <TooltipInfo info={<Text tid={'Tooltip.Deductible'}/>}/>
                                                  </span>
                                                  <SelectTextFieldSmall
                                                    //label="Deductible"
                                                    name="deduct"
                                                    // tooltipTitle={'Tooltip.Deductible'}
                                                    //defaultValue={coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                    value={coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                    onChange={(e) => {
                                                      coverage.deduct = e.currentTarget.value
                                                      setFieldValue('insurance.coverage.deduct', e.currentTarget.value)
                                                    }}
                                                  >
                                                    {/* Show all deductible option - original*/}
                                                    {/* {coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                      <option key={deduct.price_code} value={deduct.discount}>
                                                        {amountFormat(deduct.lable, 0)}
                                                      </option>
                                                    ))} */}

                                                     {/* Show deductible only $0 and $500 when Allianz - updated*/}
                                                     {insurance.compnayName === 'Allianz' ?
                                                        coverage.type_deduct
                                                          .filter(deduct => (deduct.price_code === 'PAVDM-0000' || deduct.price_code === 'PAVDM-0500' || deduct.price_code === 'PACDM-0000' || deduct.price_code === 'PACDM-0500'))
                                                          .sort((a, b) => a.value - b.value)
                                                          .map(deduct => (
                                                            <option key={deduct.price_code} value={deduct.discount}>
                                                              {amountFormat(deduct.lable, 0)}
                                                            </option>
                                                          ))
                                                        :
                                                        coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                          <option key={deduct.price_code} value={deduct.discount}>
                                                            {amountFormat(deduct.lable, 0)}
                                                          </option>
                                                        ))
                                                      }
                                                  </SelectTextFieldSmall>
                                                </Grid>
                                              </>
                                              :
                                              <Grid item xs={12} style={{textAlign:'center'}}>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                  <Text tid={'Quote.Deductible'}/>
                                                  <TooltipInfo info={<Text tid={'Tooltip.Deductible'}/>}/>
                                                </span>
                                                <Typography color="textSecondary" gutterBottom style={{ marginTop:'2vh', textAlign:'center', fontWeight: '500' }}>
                                                  $0.00
                                                </Typography>
                                              </Grid>
                                            }
                                        </Grid>

                                          {
                                            (values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN' || values.insuredPersons[personInfo.personIndex].eligilbeIns === 'VISITOR') &&
                                            <div style={{ display: 'none' }}>
                                              {/* coverage.value_rate */}
                                              {/* {insurance.compnayName === 'Allianz' ? coverage.value_rate = insurance.medicalQuestion.chargeRate : null} */}
                                              {/* coverage.value */}
                                              {coverage.value = (insurance.coverages.filter((c) => c.trip_type === coverage.trip_type && c.price_code === coverage.price_code && c.generic_name === coverage.generic_name)[0]
                                                                            .rate).filter(r => r.rate === (insurance.medicalQuestion.chargeRate !== '0'? insurance.medicalQuestion.chargeRate: '1') && r.period_code === coverage.period_code)[0].value
                                              }
                                            </div>
                                          }

                                          <div style={{ display: 'none' }}>

                                            {
                                              /* insuranceAmount at least 
                                                Tugo : amount of 10 days for STUDENT */
                                              values.insuredPersons[personInfo.personIndex].tripPeriodDays 
                                                  = (values.insuredPersons[personInfo.personIndex].tripPeriod <= 10 && insurance.compnayName === 'Tugo' && values.insuredPersons[personInfo.personIndex].eligilbeIns === 'STUDENT' )
                                                                                              ? 10
                                                                                              : values.insuredPersons[personInfo.personIndex].tripPeriod
                                            }

                                            {
                                              /*  insuranceAmount */
                                              insurance.insuranceAmount =
                                              (coverage.calculate_rate === 'D'
                                                ? (coverage.value * values.insuredPersons[personInfo.personIndex].tripPeriodDays) 
                                                : (coverage.value * 1))
                                              // + (insurance.compnayName === 'Tugo' ? insurance.medicalQuestion.surcharge : 0)
                                            }

                                            {
                                              /* add surcharge after recalculated if Tugo Medical question is answered and then chanaged coverage */
                                                insurance.compnayName === 'Tugo' 
                                                  && insurance.medicalQuestion.surcharge > 0 
                                                  && insurance.medicalQuestion.answered === true
                                                  ? (values.insuredPersons[personInfo.personIndex].eligilbeIns === 'VISITOR'
                                                      ? insurance.insuranceAmount += calculateSurchargeTugoMedicalQuestion(insurance)
                                                      : insurance.insuranceAmount += insurance.medicalQuestion.surcharge 
                                                    )
                                                  : null
                                            }

                                            {
                                              /*  insuranceAmount - deduct amount */
                                              insurance.insuranceAmount =
                                              (coverage.calculate_rate === 'D'
                                                ? insurance.insuranceAmount 
                                                    - (insurance.insuranceAmount * coverage.deduct) 
                                                    // - ((values.insuredPersons[personInfo.personIndex].eligilbeIns === 'STUDENT' && 
                                                    //       parseInt(values.insuredPersons[personInfo.personIndex].tripPeriod) === 365 && 
                                                    //       coverage.insured_type) 
                                                    //       ? coverage.discount 
                                                    //       : 0
                                                    //   )
                                                : insurance.insuranceAmount - (insurance.insuranceAmount * coverage.deduct))
                                            }

                                            {
                                              /* insuranceAmount at least 
                                                Allianz : $30 for STUDENT. $20 for VISITOR and CANADIAN  */
                                              insurance.compnayName === 'Allianz' && insurance.insuranceAmount > 0
                                                ? values.insuredPersons[personInfo.personIndex].eligilbeIns === 'STUDENT' 
                                                  ? (insurance.insuranceAmount < 30 ? insurance.insuranceAmount = 30 :null)
                                                  : (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                : null
                                            }

                                            {
                                              /* insuranceAmount at least 
                                                Tugo : $20 for VISITOR and CANADIAN  */
                                              insurance.compnayName === 'Tugo' && insurance.insuranceAmount > 0 && values.insuredPersons[personInfo.personIndex].eligilbeIns !== 'STUDENT' 
                                                  ? (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                  : null
                                            }

                                            {
                                              /* insuranceAmount at least 
                                                BlueCross : $25 for CANADIAN  */
                                                insurance.compnayName === 'BlueCross' && insurance.insuranceAmount > 0 && values.insuredPersons[personInfo.personIndex].eligilbeIns !== 'STUDENT' 
                                                  ? (insurance.insuranceAmount < 25 ? insurance.insuranceAmount = 25 :null)
                                                  : null
                                            }

                                            {
                                              (values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN' && values.insuredPersons[personInfo.personIndex].age > 60 && insurance.compnayName === 'Allianz' && 
                                                (insurance.medicalQuestion.surcharge !== 0 || insurance.medicalQuestion.discount !== 0 )
                                                  ?
                                                  (<>
                                                      {/* surcharge rate */}
                                                      {insurance.insuranceAmount = (insurance.insuranceAmount + Math.ceil(insurance.insuranceAmount *  insurance.medicalQuestion.surcharge)) }
                                                      {/* discount rate */}
                                                      {insurance.insuranceAmount = insurance.insuranceAmount - Math.floor(insurance.insuranceAmount * insurance.medicalQuestion.discount)}
                                                  </>)
                                                  : null
                                              )
                                            }

                                            {
                                              values.insuredPersons[personInfo.personIndex].physicalCard === true
                                              ? values.insuredPersons[personInfo.personIndex].physicalCardFee 
                                                  = (parseFloat(values.insuredPersons[personInfo.personIndex].selectedPlan.insuranceAmount) < 114 ? 7.99 :0)
                                              : values.insuredPersons[personInfo.personIndex].physicalCardFee = 0
                                            }

                                            {
                                              insurance.calculatedInsuranceAmount = insurance.insuranceAmount
                                              + (values.insuredPersons[personInfo.personIndex].optionalAddOnPlans
                                                        .find(plan => plan.compnayName === insurance.compnayName)
                                                ? values.insuredPersons[personInfo.personIndex].optionalAddOnPlans
                                                        .find(plan => plan.compnayName === insurance.compnayName).planTypes
                                                        .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                                :0)
                                              + (values.insuredPersons[personInfo.personIndex].optionalCarewellService.isSelected ? values.insuredPersons[personInfo.personIndex].optionalCarewellService.packageAmount : 0)
                                              + values.insuredPersons[personInfo.personIndex].physicalCardFee
                                            }

                                          </div>
                                          

                                          {/* Total Premium insurance Amount and Days */}
                                          {/* <Grid item xs={12} sm={4} md={5} lg={5} > */}
                                          <Grid item xs={12} sm={8} md={4} lg={4} style={{ borderTop: '1px solid #ddd', textAlign: 'center'}}>

                                              {/* {insurance.insuranceAmount !== 0 */}
                                              {isMedicalQuestionAnswered(values.insuredPersons[personInfo.personIndex].age, insurance) === true
                                              ? 
                                              <>
                                                <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                  <Text tid={'Quote.Premium'}/>
                                                </Typography>
                                                <Typography style={{ fontSize:'18px', fontWeight:'600' }}>
                                                {amountFormat(insurance.insuranceAmount, 2)}
                                                </Typography>
                                                <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                  <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[personInfo.personIndex].tripPeriod} <Text tid={'Quote.Days'}/>
                                                  {/* multi trip days */}
                                                  {values.insuredPersons[personInfo.personIndex].multiTripDays > 0 && (
                                                    <>
                                                      <br/>
                                                      {/* Multi Trip for {coverage.trip_length_max} days */}
                                                      <Text tid={'Quote.MultiTripDays'}/> {coverage.trip_length_max} <Text tid={'Quote.Days'}/>
                                                    </>
                                                  )}
                                                  {/* waiting */}
                                                  {values.inDestination === true 
                                                    && insurance.compnayName !== 'GMS' 
                                                    && values.insuredPersons[personInfo.personIndex].eligilbeIns === 'VISITOR' && (
                                                    <>
                                                      <br/>
                                                      <Text tid={'Quote.ArrivedAt'}/> {dateFormat(values.insuredPersons[personInfo.personIndex].arrivalDate)} ({CalculateTripDays(values.insuredPersons[personInfo.personIndex].arrivalDate,values.insuredPersons[personInfo.personIndex].tripStartDate) -1} <Text tid={'Quote.DaysBefore'}/>)
                                                      <br/>
                                                      <Text tid={'Quote.Waiting'}/>
                                                      { insurance.compnayName === 'Allianz'
                                                          ? (<> 48 <Text tid={'Quote.Hours'}/></>)
                                                          : (CalculateTripDays(values.insuredPersons[personInfo.personIndex].arrivalDate,values.insuredPersons[personInfo.personIndex].tripStartDate) -1 > 59
                                                              ? (<> 7 <Text tid={'Quote.Days'}/></>)
                                                              : (<> 48 <Text tid={'Quote.Hours'}/></>)
                                                            )
                                                      }
                                                    </>)
                                                  }
                                                </Typography>
                                              </>
                                              :
                                              <div style={{ alignSelf:'center' }}>
                                                {(values.insuredPersons[personInfo.personIndex].eligilbeIns !== 'STUDENT' 
                                                    && (insurance.compnayName !== 'BlueCross' && insurance.compnayName !== 'GMS') 
                                                    && values.insuredPersons[personInfo.personIndex].age >= 60 
                                                    && insurance.medicalQuestion.answered===false) &&
                                                    <Typography variant="body2" style={{color:'#3f51b5', marginTop:'1vh', fontWeight:'600'}} >
                                                      * <Text tid={'Quote.MedicalQuestionnaire.Instruction'}/>
                                                    </Typography>
                                                }
                                                {(values.insuredPersons[personInfo.personIndex].age >= 60 && insurance.medicalQuestion.answered===true && insurance.medicalQuestion.chargeRate === '0') &&
                                                    <Typography variant="body2" style={{color:'red', paddingBottom:'1vh', marginTop:'1vh', textAlign:'left', fontWeight:'600'}}>
                                                      * <Text tid={'Quote.MedicalQuestionnaire.NotBeEligible'}/>
                                                    </Typography>
                                                }
                                              </div>
                                              }
                                              {/* {isMedicalQuestionAnswered(values.insuredPersons[personInfo.personIndex].age, insurance) === true
                                                  ? <Typography style={{ fontSize:'18px', fontWeight:'600' }}>
                                                    {amountFormat(insurance.insuranceAmount, 2)}
                                                    </Typography>
                                                  : 
                                                    //<AttachMoneyIcon />
                                                    <div>
                                                      {(values.insuredPersons[personInfo.personIndex].eligilbeIns !== 'STUDENT' 
                                                          && (insurance.compnayName !== 'BlueCross' && insurance.compnayName !== 'GMS') 
                                                          && values.insuredPersons[personInfo.personIndex].age >= 60 
                                                          && insurance.medicalQuestion.answered===false) &&
                                                          <Typography variant="body2" style={{color:'#3f51b5', paddingLeft:'1.5vh', fontWeight:'600'}} >
                                                            <Text tid={'Quote.MedicalQuestionnaire.Instruction'}/>
                                                          </Typography>
                                                      }
                                                      {(values.insuredPersons[personInfo.personIndex].age >= 60 && insurance.medicalQuestion.answered===true && insurance.medicalQuestion.chargeRate === '0') &&
                                                          <Typography variant="body2" style={{color:'#3f51b5', paddingBottom:'1vh', textAlign:'right', fontWeight:'500'}}>
                                                            <Text tid={'Quote.MedicalQuestionnaire.NotBeEligible'}/>
                                                          </Typography>
                                                      }
                                                    </div>
                                                  
                                                  } */}


                                                  <div style={{ display: 'none' }}>
                                                    <Grid item xs={4}>
                                                      {/* Select this button */}
                                                      <Button
                                                        id = {insurance.compnayName ==='Allianz'?"allianz_selectePlan_button":"tugo_selectePlan_button"}
                                                        // variant='contained'
                                                        style={{ width: '100%', fontSize:'14px' }}
                                                        color={values.insuredPersons[personInfo.personIndex].selectedPlan === insurance ? 'secondary' : 'dark'}
                                                        className={classes.next_button}
                                                        onClick={() => {
                                                          values.insuredPersons[personInfo.personIndex].selectedPlan = insurance
                                                          values.insuredPersons[personInfo.personIndex].selectedPlan.selectedPlanName = coverage.generic_name
                                                          values.insuredPersons[personInfo.personIndex].selectedPlan.selectedPlanNameKr = coverage.generic_name_kr
                                                          values.insuredPersons[personInfo.personIndex].selectedPlan.tripType = coverage.trip_type
                                                          setFieldValue(`insuredPersons.${personInfo.personIndex}.selectedPlan`, values.insuredPersons[personInfo.personIndex].selectedPlan)
                                                        }}
                                                      >
                                                        {values.insuredPersons[personInfo.personIndex].selectedPlan === insurance ? (
                                                          <>
                                                          <img
                                                              src={Checked}
                                                              alt="Selected mark"
                                                              style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                            /> 
                                                            {/* <span><Text tid={'Quote.Selected'}/></span> */}
                                                            <span>Selected</span>
                                                          </>
                                                        ) 
                                                        : (
                                                          // <span><Text tid={'Quote.Select'}/></span>
                                                          <span>Select</span>
                                                        ) }
                                                      </Button>
                                                    </Grid>
                                                  </div>
                                          </Grid>

                                              <Grid item xs={12}>
                                                  {/* Medical Question */}
                                                  <Grid container >
                                                    <Grid item xs={12} style={{ textAlign:'right' }}>
                                                      {
                                                        (values.insuredPersons[personInfo.personIndex].eligilbeIns === 'VISITOR' || values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN') && values.insuredPersons[personInfo.personIndex].age > 59 ?
                                                          <>
                                                            {insurance.compnayName === 'Tugo' &&
                                                              <Button
                                                                id ="medical_button"
                                                                color='primary'
                                                                size="md"
                                                                className={classes.button}
                                                                onClick={(e) => handleOpenTugoQuestion(values.insuredPersons[personInfo.personIndex], values)}
                                                              >
                                                                {insurance.medicalQuestion.answered === true ?
                                                                <>
                                                                  <EditIcon style={{ color: '#fff', height: '0.8em' }} />
                                                                  <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                </>
                                                                  // 'Edit '
                                                                  : 
                                                                  <Text tid={'Quote.MedicalQuestionnaire'}/>}
                                                                
                                                              </Button>
                                                            }
                                                            {insurance.compnayName === 'Allianz' ?
                                                              values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN'
                                                                ?
                                                                  <Button
                                                                    color='primary'
                                                                    size="md"
                                                                    className={classes.button}
                                                                    onClick={(e) => { handleOpenAllianzQuestion(values.insuredPersons[personInfo.personIndex]) }}
                                                                  >
                                                                    {insurance.medicalQuestion.answered === true ?
                                                                      <>
                                                                        <EditIcon style={{ color: '#fff', height: '0.8em' }} />
                                                                        <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                      </>
                                                                      :<Text tid={'Quote.MedicalQuestionnaire'}/>}
                                                                    
                                                                  </Button>
                                                                :
                                                                  <Button
                                                                    color='primary'
                                                                    size="md"
                                                                    // className={classes.button}
                                                                    onClick={(e) => { handleOpenAllianzEligibility(values.insuredPersons[personInfo.personIndex]) }}
                                                                  >
                                                                    {insurance.medicalQuestion.confirmEligibility === true ?
                                                                      <>
                                                                        <EditIcon style={{ color: '#fff', height: '0.8em' }} />
                                                                        <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                                      </>
                                                                      // 'Edit '
                                                                      : <Text tid={'Quote.MedicalQuestionnaire'}/> }
                                                                    
                                                                  </Button>
                                                              : null
                                                            }
                                                          </>
                                                          : null
                                                      }
                                                    </Grid>

                                                    <div style={{ display: 'none' }}>
                                                      <Grid item xs={12}>
                                                        {insurance.medicalQuestion.answered === true
                                                          && (values.insuredPersons[personInfo.personIndex].eligilbeIns === 'VISITOR' || values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN')
                                                          && values.insuredPersons[personInfo.personIndex].age > 59 
                                                            ?
                                                              <>
                                                                {insurance.compnayName === 'Tugo'
                                                                  ?
                                                                    <Typography variant="body2" >
                                                                      Medical surcharge: {insurance.medicalQuestion.surcharge.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                                    </Typography>
                                                                  :
                                                                  <>
                                                                    {values.insuredPersons[personInfo.personIndex].eligilbeIns === 'CANADIAN' && 
                                                                      <>
                                                                        <Typography variant="body2" >
                                                                          Medical charge Rate: {insurance.medicalQuestion.chargeRate}
                                                                        </Typography>
                                                                        <Typography variant="body2" >
                                                                          Medical extra charge:  {insurance.medicalQuestion.surcharge * 100} %
                                                                        </Typography>
                                                                      </>
                                                                    }
                                                                  </>
                                                                }
                                                              </>
                                                            : null
                                                        }
                                                      </Grid>
                                                    </div>
                                                    

                                                  </Grid>
                                                </Grid>


                                        {/* calculations for insurance amount */}                                          
                                        <div style={{ display: 'none' }}>
                                          {/* selectedDeduct */}
                                          {insurance.selectedDeduct = 
                                                  (coverage.deduct 
                                                    ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value)[0]
                                                    : coverage.type_deduct&&
                                                      coverage.type_deduct.filter(d => d.default === true).map(i => i.value)[0]
                                                  )}
                                          {/* calculatedDeductAmount */}
                                          {insurance.calculatedDeductAmount =
                                            (coverage.calculate_rate === 'D'
                                              ? (coverage.value * values.insuredPersons[personInfo.personIndex].tripPeriod * coverage.deduct)
                                              : (coverage.value * 1 * coverage.deduct))
                                          }
                                          
                                          {values.insuredPersons[personInfo.personIndex].selectedPlan.selectedPlanName = coverage.generic_name}
                                          {values.insuredPersons[personInfo.personIndex].selectedPlan.selectedPlanNameKr = coverage.generic_name_kr}
                                          {values.insuredPersons[personInfo.personIndex].selectedPlan.tripType = coverage.trip_type}
                                          {values.insuredPersons[personInfo.personIndex].selectedPlan.selectedDeduct = insurance.selectedDeduct}
                                        </div>
                                        
                                      </Grid>

                                    </Grid>
                                    
                                    <Grid item container style={{ margin:'2vh 0' }}>
                                    
                                      {/* Add optional plan btn */}
                                      {values.insuredPersons[personInfo.personIndex].optionalAddOnPlans.length > 0 &&
                                        <>
                                          {/* <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: !isMobile ? 'left' : 'center', color:'#2a2f71', marginTop: !isMobile ? '0' : '5vh', marginBottom:'1vh' }}>                                    
                                              <span className={classes.sectionSubTitle}>
                                              <AddIcon/>  
                                              <Text tid={`Customized Product`}/>
                                              </span>
                                          </div> */}
                                          <Grid item container>
                                            <Button
                                              color= 'dark'
                                              disabled={isMedicalQuestionAnswered(values.insuredPersons[personInfo.personIndex].age, insurance) === false}
                                              onClick={() => {setOpenSelectPlan(true)}}
                                              style={{ width: '100%', fontSize:'14px' }}
                                              >
                                                  <AddCircleOutlineIcon/>
                                                  <Text tid={'Add Optional Plan'}/>
                                            </Button>
                                          </Grid>
                                        </>
                                      }
                                    </Grid>


                                    {/* physicalCard */}
                                    {/* <Grid item container spacing={3} style={{ 
                                        alignItems: 'center', 
                                        backgroundColor: 'white', 
                                        // padding:!isMobile ? 0 : '3px', 
                                        // border: !isMobile ? 'none' : '1px solid #ddd', 
                                        margin: !isMobile ? '1vh 0' : '1px',
                                      }}
                                    >
                                        
                                      <Grid item xs={12} sm={12} md={8} lg={6}>
                                        <Typography variant="h5" style={{ fontWeight:'600' }}>
                                            <Text tid={'Quote.PhysicalCard'}/>
                                            <TooltipInfo info={<Text tid={'Tooltip.PhysicalCard'}/>}/>
                                        </Typography>
                                        
                                      </Grid>

                                      <Grid item xs={12} sm={12} md={4} lg={6}>
                                          <ToggleButtonGroup
                                              name={`insuredPersons.${personInfo.personIndex}.physicalCard`}
                                              value={values.insuredPersons[personInfo.personIndex].physicalCard}
                                              exclusive
                                              style={{ width:'100%' }}
                                              onChange={(e) => {
                                                  const val = e.currentTarget.value === 'true' ? true : false
                                                  setFieldValue(`insuredPersons.${personInfo.personIndex}.physicalCard`, val)
                                                  
                                              }}
                                          >
                                              <ToggleButton value={true} className={classes.toggleButton}>
                                              <Text tid={'Button.Yes'}/>
                                              </ToggleButton>
                                              <ToggleButton value={false} className={classes.toggleButton}>
                                              <Text tid={'Button.No'}/>
                                              </ToggleButton>
                                          </ToggleButtonGroup>
                                      </Grid>

                                    </Grid> */}

                                </Grid>

                              </div>

                            ))
                        }
                        
                      </Grid>

                    </Grid>
                    
                  ))
                  }
                </div>

              </Grid>
            </Grid>
          </>
        )
        :(
          <Grid item container xs={12}>
            <Grid item xs={12}>
              <Alert severity='warning'>
                {'We are sorry! No Plan for '}
                {values.insuredPersons[personInfo.personIndex].firstName
                  ? values.insuredPersons[personInfo.personIndex].firstName
                  : personInfo.personIndex ===0 ? 'Primary':`Family ${personInfo.personIndex}.`}
                <br/>
                {values.insuredPersons[personInfo.personIndex].ageDays < 15 
                  ? 
                  // <Text tid={''}/>}
                  // '이 보험의 경우 태어난지 15일 이상부터 가입 가능합니다' 
                  'For apply this insurance, days old from birth should be 15 days or more.'
                  :null }
              </Alert>
            </Grid>
          </Grid>
        )
        }
                

      </Grid>
      {/*  Add On Plan Modal*/}
      {
          openSelectPlan === true &&
          <AddOnProduct
            openSelectPlan={openSelectPlan}
            setOpenSelectPlan={setOpenSelectPlan}
            applyType={'individual'}
            personInfo={personInfo}
            values={values}
            // handleChange={handleChange}
            setFieldValue={setFieldValue}
            currentLanguage={currentLanguage}
          />
      }

      {/* PDF Viewer Modal  */}
      {
        openPDFViewer === true &&
        <PDFViewer
          title={pdfOption.title}
          pdf={pdfOption.brochures_url} 
          openPDFViewer={openPDFViewer}
          setOpenPDFViewer={setOpenPDFViewer}
        />
      }

      {/* modal for medical question  */}
      {
        openTugoQuestion === true &&
        <MedQuestionTugoForm
          medQuestion={medQuestion}
          questionnaire={medQuestion.map(m => m.eligilbeIns)[0] === 'CANADIAN'
            ? questions.filter(q => q.company_id === 'ICO00002' && q.code === 'TQU-TMQ-4')
            : questions.filter(q => q.company_id === 'ICO00002' && q.code === 'TQU-VMQ-1')
          }
          open={openTugoQuestion}
          handleClose={setOpenTugoQuestion}
        />
      }

      {
        openAllianzQuestion === true &&
        <MedQuestionAllianzForm
          medQuestion={medQuestion}
          questionnaire={questions.filter(q => q.company_id === 'ICO00001' && q.code === 'AQU-CMQ-1')}
          open={openAllianzQuestion}
          handleClose={setOpenAllianzQuestion}
        />
      }

      {
        openAllianzEligibility === true &&
        <MedEligibilityAllianzForm
          medQuestion={medQuestion}
          questionnaire={questions.filter(q => q.company_id === 'ICO00001' && q.code === 'AQU-VEQ-1')}
          open={openAllianzEligibility}
          handleClose={setOpenAllianzEligibility}
        />
      }

  
    </div>
  );
}

export default ProductSelection;