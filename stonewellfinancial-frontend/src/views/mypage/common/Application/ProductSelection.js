import React, { useState, useRef, useContext } from 'react'
import { PropTypes } from 'prop-types'
import { Formik, Form } from 'formik'
// core components
import { Box, Grid, Typography, makeStyles, 
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
//common components
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider'
import Button from '../../../../components/common/CustomButtons/Button'
import { SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
// PDF Viewer
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
// functionalities
import { amountFormat } from '../../../../controllers/dataFormat'
import { calculateInsuranceAmount } from '../../../../functionalities/CalculateInsurance';
import { isApplyFamilyRate, familyPlan } from '../../../../functionalities/ProductFamilyPlan'
import { groupBy } from '../../../../functionalities/GroupArray';
// medical Questions
import { isMedicalQuestionAnswered } from '../../../../functionalities/MedicalQuestion';
// medical questionniar
import MedQuestionTugoForm from '../../../../components/common/MedicalQuestion/MedQuestionTugoForm';
import MedQuestionAllianzForm from '../../../../components/common/MedicalQuestion/MedQuestionAllianzForm';
// medical eligibility confirm
import MedEligibilityAllianzForm from '../../../../components/common/MedicalQuestion/MedEligibilityAllianzForm'
// logos
import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
import gmsLogo from '../../../../assets/imgs/logo/gms-logo.png'
import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'
//icons
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)


const ProductSelection = ({ formData, setFormData, nextStep, prevStep, questions }) => {
  const classes = useStyles()
  //current language
  const currentLanguage = useContext(LanguageContext).userLanguage

  const [direction, setDirection] = useState('back')
  const [errormsg, setErrormsg] = useState('')
  const [alterOpen, setAlterOpen] = useState(false)
  const [addOption, setAddOption] = useState(
                                      formData.insuredPersons.map(person => 
                                        person.optionalAddOnPlans.map(i=>i.planTypes.filter(f=>f.isSelected === true).length).reduce((a, b) => a + b, 0)).reduce((pa, pb) => pa + pb, 0) > 0
                                    )

  const scrollRef = useRef(null);
  const scrollToElement = () => scrollRef.current.scrollIntoView();

  var totalInsuranceAmount = 0;
  // check whether all applicant's coverage and deduct values are same or not
  // if not same, show coverage and deduct each applicant
  var showIndividualCoverage = formData.insuredPersons[0].selectedWhenSave && formData.insuredPersons[0].selectedWhenSave.coverage
                                ? groupBy(formData.insuredPersons.filter(f=> f.selectedWhenSave)
                                                                  .map(i=> i.selectedWhenSave),['coverage','deductible'],'insuranceCompany').length > 1 
                                : false ;
  
  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
      let url = ''
      // if (kind === 'plan'){
      //   if (insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'KO')).length > 0){
      //         url = process.env.REACT_APP_S3_URL + insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'KO'))[0].document_url
      //   }
      // } else {
      //   // set url
      //   url = ''
      // }
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
        // set carewell brochure url
        url = ''
      }
  

      setPdfOption({
              brochures_url : url,
              title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
          })
      setOpenPDFViewer(true)
  }

  // Insurance Plans List
  const insurancePlans = []
  formData.insuredPersons.forEach(person => {
    person.insurancePlans.forEach(plan => {
      if (insurancePlans.filter(f=>f.companyName === plan.compnayName).length === 0){
        insurancePlans.push({
          companyName : plan.compnayName,
          coverages : plan.coverages,
          selectedCoverage: plan.selectedCoverage,
          order: plan.compnayName === 'Allianz' ? 1 : (plan.compnayName === 'Tugo' ? 2 : 3)
        })
      }
    })
  });

  // Optional Plans List
  const optionalPlans = []
  formData.insuredPersons.forEach(person => {
    person.optionalAddOnPlans.forEach(plan => {
      if (person.insurancePlans.filter(f => f.compnayName === plan.compnayName).length > 0 &&
          optionalPlans.filter(f=>f.companyName === plan.compnayName).length === 0){
          
            optionalPlans.push({
            companyName : plan.compnayName,
            planTypes: plan.planTypes,

            order: plan.compnayName === 'Allianz' ? 1 : (plan.compnayName === 'Tugo' ? 2 : 3)
          })
      }
    })
  });

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

  // showError
  function showError(msg) {
    scrollToElement();
    setAlterOpen(true)
    setErrormsg(msg) 
    setTimeout(() => {
        setAlterOpen(false)
        setErrormsg('')
    }, 5000);
  
}

  // validate
  function validate(insuredPersons) {     
    
    if (insuredPersons.filter(p=> (p.eligilbeIns === 'VISITOR' || p.eligilbeIns === 'CANADIAN') && p.age > 59)
          .map(i => i.insurancePlans.filter(f=> ((f.compnayName === 'Allianz' || f.compnayName === 'Tugo') && f.medicalQuestion.answered===true)).length
          )[0] === 0 ){
        return (   
          <Button
            color="dark"
            className={classes.back_button} 
            onClick={() => {
                insuredPersons.every((person, i) => {
                    if ((person.eligilbeIns === 'VISITOR' || person.eligilbeIns === 'CANADIAN') && person.age > 59) {
                          person.insurancePlans.map( plan => {
                              if (((plan.compnayName === 'Allianz' || plan.compnayName === 'Tugo') 
                                  && plan.medicalQuestion.answered===true) === false ){
                                  showError('CompleteMedicalQuestionnare' )
                                  return false
                                }
                                return true;
                          })
                    }
                    return true;
                })
            }}
          >
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else if ((insuredPersons.filter(person => person.selectedPlan.length === 0)).length > 0) {
        return (   
          <Button
            // variant='contained'
            color="dark"
            className={classes.back_button} 
            onClick={() => {
                insuredPersons.every((person, i) => {
                  if (person.selectedPlan.length === 0 ){
                      showError('SelectPlansAllApplicants' )
                      return false
                    }
                    return true;
                })
            }}
          >
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else if (insuredPersons.filter(f=> f.selectedPlan.insuranceAmount===0).length > 0) {
        return (
          <Button
            // variant='contained'
            color="dark"
            className={classes.back_button} 
            onClick={() => {
              setAlterOpen(true)
              setErrormsg('NotEligibleToPurchase')
            }}
          >
            <Text tid={'Button.Next'} />
          </Button>
        )
    } else {

        return (
          <Button
            type='submit'
            // variant='contained'
            color="dark"
            className={classes.back_button} 
            onClick={() => {
              setDirection('forward')
            }}
          >
            {/* <Text tid={'Button.Purchase'} /> */}
            <Text tid={'Button.Next'} />
          </Button>
        )
    }
  }

  //studentSelectTugo
  function studentSelectTugo(index, insuredPersons){
    return (
      insuredPersons[index].eligilbeIns === 'STUDENT' &&
        insuredPersons[index].travelType !== 'SS' && 
        !(insuredPersons[index].travelType === 'PW' && insuredPersons[index].yearDateAfterGraduated >= insuredPersons[index].tripEndDate) &&
        insuredPersons.filter(f=> f.travelType==='SS' && f.selectedPlan.compnayName === 'Tugo').length > 0
    )

  }


  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={(values) => {
          setFormData(values)
          direction === 'back' ? prevStep() : nextStep()
        }}
      >
        {({ values, setFieldValue }) => (
          <Form style={{ width:'100%' }}>
            <TableContainer className={classes.table_container}>
            <Table style={{ tableLayout: 'auto', border:'1px solid #ddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.cell_title}>
                    <Text tid={'Dashboard.SelectPlan'}/>   
                    {values.insuredPersons[0].selectedWhenSave &&values.insuredPersons[0].selectedWhenSave.insuranceCompany && !values.insuredPersons[0].selectedPlan.compnayName &&
                      <Button
                          id='getSelectedPlan'
                          onClick = {()=>{
                              // console.log(column.selectedWhenSave)
                              values.insuredPersons.forEach((person, index) => {
                                if(person.selectedWhenSave){
                                    const selectedCompany = person.selectedWhenSave.insuranceCompany
                                    insurancePlans.filter(f=>f.companyName===selectedCompany)
                                                  .map(p=>(p.selectedCoverage = person.selectedWhenSave.coverage.toString()))
                                    person.insurancePlans.filter(f=> f.compnayName === selectedCompany)
                                                          .map(insurance => (
                                                            <>
                                                              {insurance.selectedCoverage = person.selectedWhenSave.coverage.toString()}
                                                              
                                                              {insurance.coverages[0].type_deduct.length > 0
                                                                ?
                                                                  insurance.coverages.filter(f=> f.price_code === person.selectedWhenSave.coverage.toString())
                                                                                    .map(i=> i.deduct = (insurance.coverages.filter(f=> f.price_code === person.selectedWhenSave.coverage.toString())
                                                                                                                            .map(i=> i.type_deduct.filter(f=>f.value ===person.selectedWhenSave.deductible)
                                                                                                                                                    .map(d=>d.discount)[0])[0])
                                                                                    )
                                                                :  null
                                                              }
                                                              { insurance.medicalQuestion = person.selectedWhenSave.medicalQuestion }
                                                            </>
                                                            ))

                                    if (person.selectedWhenSave.insured_group_type === 'Family'){
                                      // click one time
                                      if (index===0){document.getElementById(`${selectedCompany}_selecteFamilyPlan_button`).click()}
                                    } else{ 
                                      document.getElementById(`${selectedCompany}_${index}_selectePlan_button`).click()  
                                    }
                                    // optional plan
                                    person.selectedWhenSave.optionPlan.forEach(option => {
                                      // document.getElementById(`${selectedCompany}_${index}_${option.optionPlanName}_button`).click()
                                      person.optionalAddOnPlans && 
                                        person.optionalAddOnPlans.filter(f=>f.compnayName===person.selectedWhenSave.insuranceCompany)
                                                                  .map(o=>o.planTypes.filter(t=>t.planName === option.optionPlanName)
                                                                                      // .map(op=>op.isSelected = true)
                                                                                      .map(op=>{ op.isSelected = true
                                                                                                  op.selectedCoverage = option.optionPlanCoverage.toString()
                                                                                                  return op})
                                                                      )
                                    });
                                    
                                }  // if (person.selectedWhenSave)
                              });  //forEach

                            // show optioanl plan
                            if (values.insuredPersons.filter(f=> f.selectedWhenSave && f.selectedWhenSave.optionPlan && f.selectedWhenSave.optionPlan.length > 0).length > 0){
                              setAddOption(!addOption)
                            }

                          }}
                      >
                        선택된 보험 불러오기
                      </Button>    
                    }          
                  </TableCell>         
                  {values.insuredPersons.map((column, index) => (
                    <TableCell key={index} className={classes.cell_applicant} ref={scrollRef}>
                      {column.lastName}, {column.firstName} {values.eligilbeIns}
                      {index !== 0 && values.insuredType==='STUDENT' && values.insuredGroupType==='Individual' 
                        ?  
                          <div className={classes.cell_applicant_age}>{column.relationship}, {column.age} yrs</div>
                        :
                          <div className={classes.cell_applicant_age}>{column.age} yrs</div>
                      }
                      {values.insuredType==='STUDENT' && values.insuredGroupType==='Individual' 
                        ?  
                          <div className={classes.cell_applicant_age}>
                            {column.travelType==='SS'?'Study':(column.travelType==='SF'?'StudentsFamily':'')}
                          </div>
                        : null
                      }            
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody style={{ background:'#fff' }}> 
                {/* Individual title only show when possible to apply for famly plan*/}
                {values.insuredPersons.length > 2 && isApplyFamilyRate(values) &&           
                  <TableRow className={classes.cell_subTitle}>
                    <TableCell colSpan={'100%'}>
                      Individual plans
                    </TableCell>
                  </TableRow>
                }
              {insurancePlans.sort((a,b)=> a.order - b.order)
                  .map((plan, rowIndex) => (
                    <React.Fragment key={rowIndex}>

                    <TableRow>
                      <TableCell>
                        <Grid container className={classes.cell_product}>
                          <Grid item container xs={12} lg={6}  className={classes.row_title}>
                            {/* Product Name */}
                            <Grid item container style={{ marginBottom:'10px' }}>
                              <Grid item xs={12} sm={12} md={2}>
                                <img
                                  src={plan.companyName === 'Tugo' 
                                        ? tugoLogo : plan.companyName === 'Allianz' 
                                          ? allianzLogo : plan.companyName === 'BlueCross'
                                            ? blueCrossLogo : gmsLogo}
                                  alt='logo'
                                  style={{ width: '90%'}}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={10} style={{ alignSelf: 'center'}} >
                                {plan.compnayName} {plan.coverages[0].generic_name}
                              </Grid>
                            </Grid>
                            
                            {/* Brochure */}
                            <Grid item xs={12} sm={12} md={6}>
                              <Button 
                                color="secondary"
                                size="sm"
                                // style={{ borderRadius:'0'}} 
                                onClick={() => {
                                  handleOpenPDFViewer('plan', plan)
                                }}
                              >
                                <Text tid={'Vendor.Step2.Brochure'} />
                              </Button>
                            </Grid>
                          </Grid>
                          { showIndividualCoverage === false && 
                            <>
                              {plan.coverages.length > 1 
                                  ?
                                    <Grid item xs={12} lg={3}>
                                        <SelectTextFieldSmall
                                          name= {'plan.selectedCoverage'}
                                          label = 'TravelApplication.Coverage'
                                          value={plan.selectedCoverage}
                                          onChange={(e) => {
                                            plan.selectedCoverage = e.currentTarget.value
                                            for (const i in values.insuredPersons) { 
                                                values.insuredPersons[i].insurancePlans
                                                  .filter(f=>f.compnayName ===plan.companyName)
                                                  .forEach(ins => {
                                                            ins.selectedCoverage = e.currentTarget.value
                                              })
                                            }
                                            setFieldValue('plan.selectedCoverage', e.currentTarget.value)
                                          }}
                                        >
                                            {
                                              values.insuredPersons[0].eligilbeIns !== 'CANADIAN' ?
                                                <>
                                                  {plan.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                    <option key={coverage.price_code} value={coverage.price_code}>
                                                      {amountFormat(coverage.price_code, 0)}
                                                    </option>
                                                  ))}
                                                </>
                                                :
                                                <>
                                                  {plan.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                    <option key={coverage.price_code} value={coverage.price_code}>
                                                      {amountFormat(coverage.price_code, 0)}
                                                    </option>
                                                  ))[0]}
                                                </>
                                            }
                                        </SelectTextFieldSmall>
                                    </Grid>
                                  :
                                    <Grid item xs={6} lg={3}>
                                      <Typography  component={'div'}  className={classes.titleSmall} color="textSecondary" gutterBottom>
                                        {/* {insurance.coverages[0].price_code} */}
                                        <div className={classes.cell_subTitle}><Text tid={'TravelApplication.Coverage'} /></div>
                                        {amountFormat(plan.coverages[0].price_code, 0)}
                                      </Typography>
                                    </Grid>
                              }

                              {plan.coverages.filter(f=> f.price_code === plan.selectedCoverage)
                                  .map((coverage, coverageIndex) => (
                                    <Grid item container xs={12} lg={3} key={coverageIndex}>
                                      {coverage.type_deduct.length > 0 &&
                                        <>
                                          <Grid item xs={12}>
                                            <SelectTextFieldSmall
                                              label="Quote.Deductible"
                                              name="deduct"
                                              value={(coverage.deduct || coverage.deduct === 0) ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                              onChange={(e) => {
                                                coverage.deduct = e.currentTarget.value
                                                for (const i in values.insuredPersons) { 
                                                  values.insuredPersons[i].insurancePlans
                                                    .filter(f=>f.compnayName ===plan.companyName)
                                                    .forEach(ins => {ins.coverages.filter(f=> f.price_code === plan.selectedCoverage)
                                                                                    .forEach(coverage => { coverage.deduct = e.currentTarget.value })
                                                    })
                                                }
                                                setFieldValue('coverage.deduct', e.currentTarget.value)
                                              }}
                                            >
                                              {/* Show all deductible option - original*/}
                                              {/* {coverage.type_deduct.sort((a,b)=> a.lable - b.lable).map((deduct) => (
                                                <option key={deduct.price_code} value={deduct.discount}>
                                                  {amountFormat(deduct.lable, 0)}
                                                </option>
                                              ))} */}
                                              {/* Show deductible only $0 and $500 when Allianz - updated*/}
                                              {plan.compnayName === 'Allianz' ?
                                                coverage.type_deduct
                                                  .filter(deduct => (deduct.price_code === 'PAVDM-0000' || deduct.price_code === 'PAVDM-0500'))
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
                                      }
                                  </Grid>           
                                  ))
                              }
                            </>
                          }

                        </Grid>
                        {/* Optional plan */}
                        {values.insuredGroupType==='Individual' &&
                          <Grid item xs={12} >
                            <Button 
                              color="secondary"
                              size="sm"
                              style={{ border:'0', background:'#fff'}} 
                              onClick={() => {
                                setAddOption(!addOption)
                              }}
                            >
                              {addOption === true
                                ? <> <RemoveIcon/> <Text tid={'Vendor.Step2.HiddOption'} /> </> 
                                : <> <AddIcon/> <Text tid={'Vendor.Step2.AddOption'} /> </>
                              }
                            </Button>
                          </Grid>
                        }
                      </TableCell>
                      {values.insuredPersons.map((rowInsuredPerson, colIndex) => (
                        <TableCell key={colIndex}>
                          {rowInsuredPerson.insurancePlans.filter(f=>f.compnayName===plan.companyName).length > 0 
                            ?
                              rowInsuredPerson.insurancePlans
                                .filter(f=>f.compnayName===plan.companyName)
                                .map((insurance, insIndex) => ( 
                                  <React.Fragment key={insIndex}>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        value={values.insuredGroupType+JSON.stringify(rowInsuredPerson.selectedPlan)}
                                        exclusive
                                        onChange={() => {
                                          // check whether can be selected or not (affect bring data from saved)
                                          const disabledSelect = (isMedicalQuestionAnswered(rowInsuredPerson.age, insurance)===false) ? true : false
                                          if (disabledSelect === false){
                                              rowInsuredPerson.selectedPlan = insurance
                                              rowInsuredPerson.selectedPlan.selectedPlanName = insurance.coverages[0].generic_name
                                              rowInsuredPerson.selectedPlan.tripType = insurance.coverages[0].trip_type
                                              // reset selection optional plan if select not same insurance company
                                              rowInsuredPerson.optionalAddOnPlans
                                                  .filter(f=>f.compnayName !== rowInsuredPerson.selectedPlan.compnayName)
                                                  .map(i=> i.planTypes.map(op=>op.isSelected = false))
                                              // reset dependent's selected plan if student insured person select Tugo plan
                                              if(rowInsuredPerson.selectedPlan.compnayName === 'Tugo' &&
                                                  rowInsuredPerson.travelType === 'SS')
                                                  {values.insuredPersons.map((i, pIndex) => (
                                                                              (i.eligilbeIns === 'STUDENT' && i.travelType !== 'SS' && 
                                                                                !(i.travelType === 'PW' && i.yearDateAfterGraduated >= i.tripEndDate) &&
                                                                                i.selectedPlan.compnayName === 'Allianz'
                                                                                ) ? values.insuredPersons[pIndex].selectedPlan = []
                                                                                  : null
                                                                            )) 
                                              }
                                              //
                                              setFieldValue(`insuredPersons.${colIndex}.selectedPlan`,rowInsuredPerson.selectedPlan)
                                              //
                                              values.insuredGroupType = 'Individual'
                                              values.familyGroup.isSelected = false
                                              values.familyGroup.selectedCompnayName = ''
                                              values.familyGroup.totalPremium = 0
                                              values.familyGroup.familyPremium = 0
                                              values.familyGroup.discountPremium = 0
                                        }
                                        }}              
                                      >
                                        <ToggleButton 
                                          id = {values.insuredPersons[0].selectedWhenSave &&values.insuredPersons[0].selectedWhenSave.insuranceCompany && !values.insuredPersons[0].selectedPlan.compnayName
                                                  ? insurance.compnayName+"_"+colIndex+"_selectePlan_button"
                                                  : insurance.compnayName.toLowerCase()+"_selectePlan_button"}
                                          className={classes.toggleButton}
                                          value={'Individual'+JSON.stringify(insurance)} 
                                          // disabled={((isMedicalQuestionAnswered(rowInsuredPerson.age, insurance)===false) ||
                                          //             (studentSelectTugo(colIndex, values.insuredPersons) 
                                          //                 && insurance.compnayName === 'Allianz' )
                                          //             ) ? true : false}
                                          disabled={(studentSelectTugo(colIndex, values.insuredPersons) && insurance.compnayName === 'Allianz') ? true : false}
                                        >
                                          {insurance.coverages
                                              .filter(f => f.price_code === plan.selectedCoverage)
                                              .map( coverage =>
                                                    <div key={coverage.price_code}>
                                                        <div style={{ display: 'none' }}>
                                                          {/* changed rate by medicalQuestionAnswer */}
                                                          {insurance.medicalQuestion.chargeRate
                                                            ? coverage.value = ((insurance.coverages.filter((c) => c.trip_type === coverage.trip_type && c.price_code === coverage.price_code && c.generic_name === coverage.generic_name)[0]
                                                                                                                .rate).filter(r => r.rate === (insurance.medicalQuestion.chargeRate !== '0'? insurance.medicalQuestion.chargeRate: '1') 
                                                                                                                                                  && r.period_code === coverage.period_code)[0].value)
                                                            : null}
                                                          {calculateInsuranceAmount(values)}
                                                        </div>
                                                        { isMedicalQuestionAnswered(rowInsuredPerson.age, insurance) === true
                                                          ? (<>
                                                              {amountFormat(insurance.insuranceAmount, 2)} 
                                                              <div className={classes.tripLength}>{rowInsuredPerson.tripPeriod}<Text tid={'Quote.Days'} /></div>
                                                              {/* Canadian Multi Trip  */}
                                                              {rowInsuredPerson.multiTripDays > 0 && (
                                                                <div className={classes.tripLength}>    
                                                                    <Text tid={'Quote.MultiTripDays'}/> {coverage.trip_length_max} <Text tid={'Quote.Days'}/>
                                                                </div>
                                                              )}
                                                            </>)
                                                          : (<>
                                                              {(rowInsuredPerson.eligilbeIns !== 'STUDENT' 
                                                                  && (insurance.compnayName !== 'BlueCross' && insurance.compnayName !== 'GMS') 
                                                                  && rowInsuredPerson.age >= 60 
                                                                  && insurance.medicalQuestion.answered===false) &&
                                                                      <Typography variant="body2" style={{color:'#3f51b5', paddingBottom:'1vh', textAlign:'right', fontWeight:'500'}} >
                                                                        <Text tid={'Quote.MedicalQuestionnaire.Instruction'}/>
                                                                      </Typography>
                                                              }
                                                              
                                                              {(rowInsuredPerson.age >= 60 && insurance.medicalQuestion.answered===true && insurance.medicalQuestion.chargeRate === '0') &&
                                                                  <Typography variant="body2" style={{color:'#3f51b5', paddingBottom:'1vh', textAlign:'right', fontWeight:'500'}}>
                                                                    <Text tid={'Quote.MedicalQuestionnaire.NotBeEligible'}/>
                                                                  </Typography>
                                                              }
                                                            </>)
                                                        }
                                                    </div>
                                              )                                                      
                                          }
                                        </ToggleButton>
                                      </ToggleButtonGroup>

                                      {/* Medical Question */}
                                      <div className={classes.subDescription}>
                                        {
                                          (rowInsuredPerson.eligilbeIns === 'VISITOR' || rowInsuredPerson.eligilbeIns === 'CANADIAN') && rowInsuredPerson.age > 59 ?
                                            <>
                                              {(insurance.compnayName === 'Tugo' || insurance.compnayName === 'Allianz') &&
                                                <Button
                                                  size="md"
                                                  style={{ 
                                                    backgroundColor: insurance.medicalQuestion.answered === true ? "#fff" : "#2a2f71",
                                                    color: insurance.medicalQuestion.answered === true ? "#2a2f71": "#fff",
                                                    border: insurance.medicalQuestion.answered === true ? "1px solid #2a2f71": "none",
                                                  }}
                                                  onClick={(e) => {
                                                    if (insurance.compnayName === 'Tugo'){
                                                      handleOpenTugoQuestion(rowInsuredPerson, values)  
                                                    } else if(insurance.compnayName === 'Allianz'){
                                                          if(rowInsuredPerson.eligilbeIns === 'CANADIAN'){
                                                            handleOpenAllianzQuestion(rowInsuredPerson)
                                                          }else{
                                                            handleOpenAllianzEligibility(rowInsuredPerson)
                                                          }
                                                    }
                                                  }}
                                                >
                                                  {insurance.medicalQuestion.answered === true ?
                                                    <>
                                                      <EditIcon style={{ color: '#2a2f71', height: '0.8em' }} />
                                                      <Text tid={'Quote.MedicalQuestionnaire.Edit'}/>
                                                    </>
                                                    : <Text tid={'Quote.MedicalQuestionnaire'}/>}
                                                    
                                                </Button>
                                              }
                                            </>
                                            : null
                                          }

                                          {/* hide Medical charge Rate & charge  */}
                                          <div style={{ display: 'none' }}>
                                          {/* <div> */}
                                            {insurance.medicalQuestion.answered === true
                                              && (rowInsuredPerson.eligilbeIns === 'VISITOR' || rowInsuredPerson.eligilbeIns === 'CANADIAN')
                                              && rowInsuredPerson.age > 59 ?
                                              <>
                                                {insurance.compnayName === 'Tugo'
                                                  ?
                                                  <Typography variant="body2" >
                                                    Medical surcharge: {insurance.medicalQuestion.surcharge.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                  </Typography>
                                                  :
                                                  <>
                                                    {rowInsuredPerson.eligilbeIns === 'CANADIAN' &&
                                                      <>
                                                        <Typography variant="body2" >
                                                          Medical charge Rate: {insurance.medicalQuestion.chargeRate}
                                                        </Typography>
                                                        <Typography variant="body2" >
                                                          Medical extra charge:  {insurance.medicalQuestion.surcharge * 100} %
                                                        </Typography>
                                                        <Typography variant="body2" >
                                                          Medical discount charge:  {insurance.medicalQuestion.discount * 100} %
                                                        </Typography>
                                                      </>
                                                    }
                                                  </>
                                                }
                                              </>
                                              : null
                                            }
                                          </div>

                                      </div>  

                                      {showIndividualCoverage &&
                                        insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).length > 0 &&
                                        insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).map((coverage, coverageIndex) => (
                                            <div key={coverageIndex}>
                                              <Grid item container spacing={1} style={{padding:'5px'}}>
                                                {/* coverage up to */}
                                                <Grid item xs={12} style={{ textAlign:'center' }}>
                                                  <span style={{ fontSize: '14px',fontWeight: '600' }}>
                                                    <Text tid={'Quote.SumInsured'}/>
                                                    {/* Coverage up to */}
                                                  </span>
                                                  {insurance.coverages.length > 1 ?
                                                    <SelectTextFieldSmall
                                                      //label="Coverage"
                                                      name="coverage"
                                                      value={insurance.selectedCoverage}
                                                      onChange={(e) => {
                                                        insurance.selectedCoverage = e.currentTarget.value
                                                        setFieldValue('insurance.selectedCoverage', e.currentTarget.value)
                                                      }}
                                                    >
                                                      {
                                                        rowInsuredPerson.eligilbeIns !== 'CANADIAN' ?
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
                                                    </SelectTextFieldSmall>
                                                    :
                                                    <Typography color="textSecondary" gutterBottom style={{ marginTop:'2vh', fontWeight:'500' }}>
                                                      {amountFormat(insurance.coverages[0].price_code, 0)}
                                                    </Typography>
                                                  }
                                                </Grid>

                                                {/* Deductible */}
                                                {coverage.type_deduct.length > 0 
                                                  ?
                                                    <Grid item xs={12} style={{textAlign:'center'}}>
                                                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                        <Text tid={'Quote.Deductible'}/>
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
                                                        {plan.compnayName === 'Allianz' ?
                                                          coverage.type_deduct
                                                            .filter(deduct => (deduct.price_code === 'PAVDM-0000' || deduct.price_code === 'PAVDM-0500'))
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
                                                  :
                                                    <Grid item xs={12} style={{textAlign:'center'}}>
                                                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                        <Text tid={'Quote.Deductible'}/>
                                                      </span>
                                                      <Typography color="textSecondary" gutterBottom style={{ marginTop:'2vh', textAlign:'center', fontWeight: '500' }}>
                                                        $0.00
                                                      </Typography>
                                                    </Grid>
                                                }

                                              </Grid>
                                            </div>
                                        ))
                                      }
                                    </React.Fragment>
                                ))
                            : 
                              <Typography style={{ color:'#aaa',}} align="center"> N/A </Typography>
                          }
                          </TableCell>
                      ))}
                    </TableRow>

                    {/* Optional Plan Selection */}  
                    {/* For calculating option plan price, it must be shown, only hide when values.insuredGroupType==='Individual' */}
                    {addOption && 
                      optionalPlans
                      .filter(o => o.companyName === plan.companyName)
                      .sort((a,b)=> a.order - b.order)
                      .map(optionalPlan => (
                        optionalPlan.planTypes
                        .map((planType, planIndex)=> (
                          <TableRow key={planIndex} style={{ display: (values.insuredGroupType==='Individual'?'':'none'), background:'#f9f9f9'}}>
                            <TableCell>
                              <Grid container className={classes.cell_product}>
                                <Grid item container xs={12} lg={6}  className={classes.row_title}>
                                  <Grid item container style={{ marginBottom:'10px' }}>
                                    <Grid item xs={12} sm={12} md={2}>
                                      <img
                                        src={optionalPlan.companyName === 'Tugo' 
                                              ? tugoLogo : optionalPlan.companyName === 'Allianz' 
                                                ? allianzLogo : optionalPlan.companyName === 'BlueCross'
                                                  ? blueCrossLogo : gmsLogo}
                                        alt='logo'
                                        style={{ width: 20, height: 20}}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={10}>
                                      {planType.planName}
                                    </Grid>
                                  </Grid>
    
                                  {/* Brochure */}
                                  <Grid item xs={12} sm={12} md={6}>
                                    <Button 
                                      color="secondary"
                                      size="sm"
                                      onClick={() => {
                                        handleOpenPDFViewer('plan', planType)
                                        
                                      }}
                                    >
                                      <Text tid={'Vendor.Step2.Brochure'} />
                                    </Button>
                                  </Grid>
                                  {/* <div className={classes.subButton} style={{marginTop:'5px'}}><CgChevronRightO/> <Text tid={'Vendor.Step2.Brochure'} /></div> */}
                                  {/* <div className={classes.subButton}><CgChevronRightO/> <Text tid={'Vendor.Step2.PolicyWording'} /></div> */}
                                </Grid>
                                {/* coverage up to */}
                                <Grid item xs={12} md={5} >
                                  <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                    <Text tid={'Quote.SumInsured'}/>
                                  </span>
    
                                  <SelectTextFieldSmall
                                    // label="Coverage"
                                    name={`planType.selectedCoverage`}
                                    value={planType.selectedCoverage}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      planType.selectedCoverage = e.currentTarget.value
                                      // set all insured optional coverage
                                      for (const i in values.insuredPersons) { 
                                        values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===plan.companyName)[0].planTypes[planIndex].selectedCoverage = e.currentTarget.value
                                      }
                                      setFieldValue(`planType.selectedCoverage`, e.currentTarget.value)
                                    }}
                                  >
                                    {planType.coverages
                                      .sort((a,b)=> a.price_code - b.price_code)
                                      .map((o) => (
                                        <option key={o.price_code} value={o.price_code}>
                                          {amountFormat(o.price_code,0)}
                                        </option>
                                      ))
                                    }
                                  </SelectTextFieldSmall>
                                </Grid>
    
                              </Grid>
                            </TableCell> 
                            {/* Individual Optional Plan */}
                            {values.insuredPersons.map((rowInsuredPerson, colIndex) => (
                              <TableCell key={colIndex}>
                              {rowInsuredPerson.insurancePlans.filter(f => f.compnayName === optionalPlan.companyName).length > 0 
                                ? 
                                  rowInsuredPerson.insurancePlans.filter(f => f.compnayName === optionalPlan.companyName).length > 0 &&
                                  rowInsuredPerson.optionalAddOnPlans.filter(f => f.compnayName === optionalPlan.companyName)
                                    .map(AddOnPlan => (
                                          AddOnPlan.planTypes.filter(f => f.planName === planType.planName)
                                              .map(AddOnPlanType => (
                                                      AddOnPlanType.coverages.filter(i => i.price_code === planType.selectedCoverage && i.insured_type === rowInsuredPerson.eligilbeIns)
                                                          .map((coverage, coverageIndex) => (
                                                                <React.Fragment key={coverageIndex}>
                                                                  <Button
                                                                    // id ={coverage.compnay_name+'_'+colIndex+'_'+coverage.generic_name+"_button"}
                                                                    className={classes.toggleButtonGroup}
                                                                    style={{ border:'1px solid #efefef', background:AddOnPlanType.isSelected === true ? '#3f51b5' : '#FFFFFF' }}
                                                                    name={`AddOnPlanType.isSelected`}
                                                                    value={AddOnPlanType.isSelected}
                                                                    disabled={values.insuredGroupType === 'Individual' &&
                                                                              rowInsuredPerson.selectedPlan.compnayName && 
                                                                              rowInsuredPerson.selectedPlan.compnayName===optionalPlan.companyName ? false : true}
                                                                    onClick={() => {
                                                                      AddOnPlanType.isSelected = !AddOnPlanType.isSelected
                                                                      setFieldValue(`AddOnPlanType.isSelected`, AddOnPlanType.isSelected)
                                                                    }}
                                                                  >
                                                                    <div style={{ display: 'none' }}>
                                                                      {/* {AddOnPlanType.calculatedAddOnAmount = coverage.calculate_rate === 'D'
                                                                        ? (coverage.value * rowInsuredPerson.tripPeriod)
                                                                        : (coverage.value)} */}
    
                                                                        {/* Accidental Death & Dismemberment optional plan Amount at least 
                                                                                              Allianz : $16 for Accidental Death & Dismemberment */}
                                                                        {AddOnPlanType.calculatedAddOnAmount = 
                                                                            coverage.calculate_rate === 'D'
                                                                              ? (optionalPlan.companyName === 'Allianz' 
                                                                                  && AddOnPlanType.coverageType === 'ADD' 
                                                                                  && coverage.value * rowInsuredPerson.tripPeriod < 16
                                                                                    ? 16
                                                                                    : coverage.value * rowInsuredPerson.tripPeriod)
                                                                              : (coverage.value)
                                                                        }
                                                                    </div>
                                                                    <Typography component={'div'} className={classes.toggleButton} style={{ color:AddOnPlanType.isSelected === true ? '#fff':'#3f51b5' }}>
                                                                      {amountFormat(AddOnPlanType.calculatedAddOnAmount,2)}    
                                                                      <div className={classes.tripLength}>
                                                                        {rowInsuredPerson.tripPeriod} <Text tid={'Quote.Days'}/>
                                                                      </div>
                                                                    </Typography>
                                                                  </Button>
                                                                </React.Fragment>
                                                          ))
                                              ))
                                    ))
                                  
                              :
                                <Typography style={{ color:'#aaa',}} align="center"> N/A </Typography>
                            }
                              </TableCell>
                            ))}
    
                            </TableRow>
                        ))
                    ))}

                  </React.Fragment>
                ))}

                {/* Family Plan */}
                {values.insuredPersons.length > 2 && isApplyFamilyRate(values) && (
                  <>
                    <TableRow className={classes.cell_subTitle}>
                      <TableCell colSpan={'100%'}>
                        Family plans
                      </TableCell>
                    </TableRow>

                    {familyPlan(values).filter(f=> f.totalPremium > 0)
                            .sort((a,b)=> values.tripDirection === 'InBound'? (a.inSort -  b.inSort): (a.outSort - b.outSort))
                            .map((family, fIndex) => (
                              <React.Fragment key={fIndex}>
                                {/* insurace plan */}
                                <TableRow>
                                    {insurancePlans.filter(fp=>fp.companyName === family.companyName)
                                      .map((plan, planIndex) => (       
                                      <TableCell key={planIndex}>
                                        <Grid item container>
                                            {/* Plan Name */}
                                            <Grid item container xs={12} lg={6}  className={classes.row_title}>
                                              <Grid item container style={{ marginBottom:'10px' }}>
                                                <Grid item xs={12} sm={12} md={2}>
                                                  <img
                                                    src={family.companyName === 'Tugo' 
                                                          ? tugoLogo : family.companyName === 'Allianz' 
                                                            ? allianzLogo : family.companyName === 'BlueCross'
                                                              ? blueCrossLogo : null}
                                                    alt='logo'
                                                    style={{ width: '90%'}}
                                                  />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={10}>
                                                  {values.tripDirection === 'InBound'? "Visitor Family Plan" : "Canadian Family Plan"} 
                                                </Grid> 
                                            </Grid>

                                            {/* Brochure */}
                                            <Grid item xs={12} sm={12} md={6}>
                                              <Button 
                                                color="dark"
                                                size="sm"
                                                // style={{ borderRadius:'0'}} 
                                                onClick={() => {
                                                  handleOpenPDFViewer('plan', plan)
                                                }}
                                              >
                                                <Text tid={'Vendor.Step2.Brochure'} />
                                              </Button>
                                            </Grid>
                                            
                                            {/* Optional plan */}
                                            {values.insuredGroupType==='Family' &&
                                              <Grid item xs={12} >
                                                <Button 
                                                  color="secondary"
                                                  size="sm"
                                                  style={{ border:'0', background:'#fff'}} 
                                                  onClick={() => {
                                                    setAddOption(!addOption)
                                                  }}
                                                >
                                                  {addOption === true
                                                    ? <> <RemoveIcon/> <Text tid={'Vendor.Step2.HiddOption'} /> </> 
                                                    : <> <AddIcon/> <Text tid={'Vendor.Step2.AddOption'} /> </>
                                                  }
                                                </Button>
                                              </Grid>
                                            }

                                          </Grid>

                                          {/* Coverage */}
                                          <Grid item xs={12} lg={3}>
                                              <SelectTextFieldSmall
                                                name= {'plan.selectedCoverage'}
                                                label = 'Coverage'
                                                value={plan.selectedCoverage}
                                                onChange={(e) => {
                                                  plan.selectedCoverage = e.currentTarget.value
                                                  for (const i in values.insuredPersons) { 
                                                      values.insuredPersons[i].insurancePlans
                                                        .filter(f=>f.compnayName ===plan.companyName)
                                                        .forEach(ins => {
                                                                  ins.selectedCoverage = e.currentTarget.value
                                                    })
                                                  }
                                                  setFieldValue('plan.selectedCoverage', e.currentTarget.value)
                                                }}
                                              >
                                                  {
                                                    values.insuredPersons[0].eligilbeIns !== 'CANADIAN' ?
                                                      <>
                                                        {plan.coverages.map((coverage) => (
                                                          <option key={coverage.price_code} value={coverage.price_code}>
                                                            {amountFormat(coverage.price_code, 0)}
                                                          </option>
                                                        ))}
                                                      </>
                                                      :
                                                      <>
                                                        {plan.coverages.map((coverage) => (
                                                          <option key={coverage.price_code} value={coverage.price_code}>
                                                            {amountFormat(coverage.price_code, 0)}
                                                          </option>
                                                        ))[0]}
                                                      </>
                                                  }
                                              </SelectTextFieldSmall>
                                          </Grid>

                                          {plan.coverages
                                              .filter(f=> f.price_code === plan.selectedCoverage)
                                              .map((coverage, coverageIndex) => (
                                                <Grid item container xs={12} lg={3} key={coverageIndex}>
                                                  {coverage.type_deduct.length > 0 &&
                                                    <>
                                                      <Grid item xs={12}>
                                                        <SelectTextFieldSmall
                                                          label="Quote.Deductible"
                                                          name="deduct"
                                                          value={coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                          onChange={(e) => {
                                                            coverage.deduct = e.currentTarget.value
                                                            for (const i in values.insuredPersons) { 
                                                              values.insuredPersons[i].insurancePlans
                                                                .filter(f=>f.compnayName ===plan.companyName)
                                                                .forEach(ins => {ins.coverages.filter(f=> f.price_code === plan.selectedCoverage)
                                                                                                .forEach(coverage => { coverage.deduct = e.currentTarget.value })
                                                                })
                                                            }
                                                            setFieldValue('coverage.deduct', e.currentTarget.value)
                                                          }}
                                                        >
                                                          
                                                          {/* Show all deductible option - original*/}
                                                          {/* {coverage.type_deduct.map((deduct) => (
                                                            <option key={deduct.price_code} value={deduct.discount}>
                                                              {amountFormat(deduct.lable, 0)}
                                                            </option>
                                                          ))} */}
                                                          {/* Show deductible only $0 and $500 when Allianz - updated*/}
                                                          {plan.compnayName === 'Allianz' ?
                                                            coverage.type_deduct
                                                              .filter(deduct => (deduct.price_code === 'PAVDM-0000' || deduct.price_code === 'PAVDM-0500'))
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
                                                  }
                                              </Grid>           
                                              ))
                                          }
                                            
                                        </Grid>
                                      </TableCell> 
                                    ))}

                                    <TableCell colSpan={'100%'}>
                                      <ToggleButtonGroup 
                                        className={classes.toggleButtonGroup}
                                        value={values.insuredGroupType+values.familyGroup.selectedCompnayName}
                                        exclusive
                                        onChange={() => {
                                          //setFamilyPremium
                                          values.insuredGroupType = 'Family'
                                          values.familyGroup.isSelected = true
                                          values.familyGroup.selectedCompnayName = family.companyName
                                          values.familyGroup.totalPremium = family.totalPremium
                                          values.familyGroup.familyPremium = family.familyPremium
                                          values.familyGroup.discountPremium = family.discountPremium

                                          // set selected Plan
                                          for (let i = 0; i < values.insuredPersons.length; i++) {
                                            if (values.insuredPersons[i].selectedPlan && values.insuredPersons[i].selectedPlan.isSelected === true ){
                                              values.insuredPersons[i].selectedPlan = []
                                              }
                                              values.insuredPersons[i].insurancePlans
                                                .filter(f=>f.compnayName ===values.familyGroup.selectedCompnayName)
                                                .forEach(ins => {
                                                          values.insuredPersons[i].selectedPlan = ins
                                                          values.insuredPersons[i].selectedPlan.isSelected = true
                                                          ins.coverages
                                                              .filter(cf=>cf.price_code === ins.selectedCoverage)
                                                              .forEach(coverage => {
                                                                  values.insuredPersons[i].selectedPlan.selectedPlanName = coverage.generic_name
                                                                  values.insuredPersons[i].selectedPlan.selectedPlanNameKr = coverage.generic_name_kr
                                                                  values.insuredPersons[i].selectedPlan.tripType = coverage.trip_type
                                                              })          
                                                })
                                          }

                                          // retset optional plan
                                          values.insuredPersons.map(i => i.optionalAddOnPlans.map(o => o.planTypes.map(t=>t.isSelected = false) ))
                                          setFieldValue(`familyGroup.selectedCompnayName`,  family.companyName)
                                        }}
                                      >
                                        <ToggleButton  
                                          id = {family.companyName+"_selecteFamilyPlan_button"}
                                          className={classes.toggleButton}
                                          value={'Family'+family.companyName}
                                          >
                                            <div>
                                              {amountFormat(family.familyPremium,2)}
                                              <div className={classes.tripLength}>{values.insuredPersons[0].tripPeriod}<Text tid={'Quote.Days'} /></div>
                                              {/* Canadian Multi Trip  */}
                                              {values.insuredPersons[0].multiTripDays > 0 && (
                                                <div className={classes.tripLength}>    
                                                    <Text tid={'Quote.MultiTripDays'}/> 
                                                    {values.insuredPersons[0].insurancePlans
                                                      .filter(f=>f.compnayName ===family.companyName)
                                                      .map(i=>i.coverages[0].trip_length_max)[0]} 
                                                    <Text tid={'Quote.Days'}/>
                                                </div>
                                              )}  
                                            </div>
                                      </ToggleButton>
                                      </ToggleButtonGroup>
                                    </TableCell>
                                </TableRow> 
                                {/*  Family optional plan */}
                                {values.insuredGroupType==='Family' &&
                                  addOption && 
                                  optionalPlans
                                  .filter(o => o.companyName === family.companyName)
                                  .sort((a,b)=> a.order - b.order)
                                  .map(optionalPlan => (
                                    optionalPlan.planTypes
                                    .map((planType, planIndex)=> (
                                      
                                      <TableRow key={planIndex} style={{ background:'#f9f9f9'}}>
                                        <TableCell>
                                          <Grid container className={classes.cell_product}>
                                            <Grid item container xs={12} lg={6}  className={classes.row_title}>
                                              <Grid item container style={{ marginBottom:'10px' }}>
                                                <Grid item xs={12} sm={12} md={2}>
                                                  <img
                                                    src={optionalPlan.companyName === 'Tugo' 
                                                          ? tugoLogo : optionalPlan.companyName === 'Allianz' 
                                                            ? allianzLogo : optionalPlan.companyName === 'BlueCross'
                                                              ? blueCrossLogo : gmsLogo}
                                                    alt='logo'
                                                    style={{ width: 20, height: 20}}
                                                  />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={10}>
                                                  {planType.planName}
                                                </Grid>
                                              </Grid>
                
                                              {/* Brochure */}
                                              <Grid item xs={12} sm={12} md={6}>
                                                <Button 
                                                  color="secondary"
                                                  size="sm"
                                                  onClick={() => {
                                                    handleOpenPDFViewer('plan', planType)
                                                    
                                                  }}
                                                >
                                                  <Text tid={'Vendor.Step2.Brochure'} />
                                                </Button>
                                              </Grid>
                                            </Grid>
                                            {/* coverage up to */}
                                            <Grid item xs={12} md={5} >
                                              <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                <Text tid={'Quote.SumInsured'}/>
                                              </span>
                
                                              <SelectTextFieldSmall
                                                // label="Coverage"
                                                name={`planType.selectedCoverage`}
                                                value={planType.selectedCoverage}
                                                // onChange={handleChange}
                                                onChange={(e) => {
                                                  planType.selectedCoverage = e.currentTarget.value
                                                  // set all insured optional coverage
                                                  values.insuredPersons.map(person=>
                                                          person.optionalAddOnPlans.filter(f=>f.compnayName===family.companyName)
                                                                                    [0].planTypes.filter(f=>f.coverageType===planType.coverageType)
                                                                                                  .map(i=>{
                                                                                                    i.selectedCoverage= e.currentTarget.value
                                                                                                    i.calculatedAddOnAmount = 
                                                                                                      i.coverages.filter(cf=>cf.price_code===e.currentTarget.value)
                                                                                                                  .map(coverage => 
                                                                                                                        coverage.calculate_rate === 'D'
                                                                                                                          ? (optionalPlan.companyName === 'Allianz' 
                                                                                                                              && coverage.coverageType === 'ADD' 
                                                                                                                              && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                                                                                                ? 16
                                                                                                                                : coverage.value * values.insuredPersons[0].tripPeriod)
                                                                                                                          : (coverage.value)
                                                                                                                  )[0]
                                                                                                    return i
                                                                                                  }))

                                                  for (const i in values.insuredPersons) { 
                                                    values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===family.companyName)[0].planTypes[planIndex].selectedCoverage = e.currentTarget.value
                                                  }
                                    
                                                  setFieldValue(`planType.selectedCoverage`, e.currentTarget.value)
                                                }}
                                              >
                                                {planType.coverages
                                                  .sort((a,b)=> a.price_code - b.price_code)
                                                  .map((o) => (
                                                    <option key={o.price_code} value={o.price_code}>
                                                      {amountFormat(o.price_code,0)}
                                                    </option>
                                                  ))
                                                }
                                              </SelectTextFieldSmall>
                                            </Grid>
                
                                          </Grid>
                                        </TableCell> 
                                        {/* Family Optional Plan */}
                                          <TableCell colSpan={'100%'}>
                                          {values.insuredPersons[0].insurancePlans.filter(f => f.compnayName === optionalPlan.companyName).length > 0 
                                            ? 
                                            values.insuredPersons[0].insurancePlans.filter(f => f.compnayName === optionalPlan.companyName).length > 0 &&
                                            values.insuredPersons[0].optionalAddOnPlans.filter(f => f.compnayName === optionalPlan.companyName)
                                                .map(AddOnPlan => (
                                                      AddOnPlan.planTypes.filter(f => f.planName === planType.planName)
                                                          .map(AddOnPlanType => (
                                                                  AddOnPlanType.coverages.filter(i => i.price_code === planType.selectedCoverage && i.insured_type === values.insuredPersons[0].eligilbeIns)
                                                                      .map((coverage, coverageIndex) => (
                                                                            <React.Fragment key={coverageIndex}>
                                                                              
                                                                              <Button
                                                                                // id ={coverage.compnay_name+'_'+colIndex+'_'+coverage.generic_name+"_button"}
                                                                                className={classes.toggleButtonGroup}
                                                                                style={{ border:'1px solid #efefef', background:AddOnPlanType.isSelected === true ? '#3f51b5' : '#FFFFFF' }}
                                                                                name={`AddOnPlanType.isSelected`}
                                                                                value={AddOnPlanType.isSelected}
                                                                                disabled={values.insuredGroupType === 'Family' &&
                                                                                          values.insuredPersons[0].selectedPlan.compnayName && 
                                                                                          values.insuredPersons[0].selectedPlan.compnayName===optionalPlan.companyName ? false : true}
                                                                                onClick={() => {
                                                                                  const isSelected = !AddOnPlanType.isSelected
                                                                                  AddOnPlanType.isSelected = isSelected

                                                                                  for (const i in values.insuredPersons) { 
                                                                                    // values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===family.companyName)[0].planTypes[coverageIndex].isSelected = isSelected 
                                                                                    values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===family.companyName)[0].planTypes.filter(pf=>pf.coverageType === AddOnPlanType.coverageType)[0].isSelected = isSelected 
                                                                                    }

                                                                                  setFieldValue(`AddOnPlanType.isSelected`, isSelected)
                                                                                }}
                                                                              >
                                                                                <div style={{ display: 'none' }}>
                                                                                    {AddOnPlanType.calculatedAddOnAmount = 
                                                                                        coverage.calculate_rate === 'D'
                                                                                          ? (optionalPlan.companyName === 'Allianz' 
                                                                                              && AddOnPlanType.coverageType === 'ADD' 
                                                                                              && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                                                                ? 16
                                                                                                : coverage.value * values.insuredPersons[0].tripPeriod)
                                                                                          : (coverage.value)
                                                                                    }  
                                                                                    
                                                                                    
                                                                                </div>
                                                                                <Typography component={'div'} className={classes.toggleButton} style={{ color:AddOnPlanType.isSelected === true ? '#fff':'#3f51b5' }}>
                                                                                  {amountFormat(AddOnPlanType.calculatedAddOnAmount * values.insuredPersons.length ,2)}    
                                                                                  <div className={classes.tripLength}>
                                                                                    {values.insuredPersons[0].tripPeriod} <Text tid={'Quote.Days'}/>
                                                                                  </div>
                                                                                </Typography>
                                                                              </Button>
                                                                            </React.Fragment>
                                                                      ))
                                                          ))
                                                ))
                                              
                                          :
                                            <Typography style={{ color:'#aaa',}} align="center"> N/A </Typography>
                                        }
                                          </TableCell>
                
                                        </TableRow>
                                    ))
                                ))}

                              </React.Fragment>

                    ))}
                  </>
                )}

              </TableBody>
            </Table>
            
            {/*  */}
            {alterOpen && (
              <Grid item xs={12} style={{ margin: '1vh' }}>
                
                <Alert
                    severity='error'
                    onClose={() => setAlterOpen(false)}
                >
                    <Text tid={`Quote.Error.${errormsg}`}/>
                </Alert>
              </Grid>
            )}

            </TableContainer>


            <Grid container >
              <Grid item xs style={{  background:'#f9f9f9', marginTop:'2vh' }}>

                <Box style={{ margin: 20 }}>
                  <Grid container className={classes.premium}>
                    <Grid item xs={12} sm={8}></Grid>
                    <Grid
                      item xs={12} sm={4}
                      style={{
                        fontWeight: '500',
                        color: '#2a2f71',
                        fontSize: '20px',
                        textAlign:'end'
                      }}
                    >
                      <div style={{ display: 'none' }}>
                        {totalInsuranceAmount = 0}
                        {values.insuredPersons.map((person, pIndex) => (
                            person.selectedPlan.calculatedInsuranceAmount = person.selectedPlan.insuranceAmount
                                    + (person.optionalAddOnPlans
                                              .find(plan => plan.compnayName === person.selectedPlan.compnayName)
                                        ? person.optionalAddOnPlans
                                              .find(plan => plan.compnayName === person.selectedPlan.compnayName).planTypes
                                              .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                        :0)
                                    // + (person.optionalCarewellService.isSelected ? person.optionalCarewellService.packageAmount : 0)
                        ))}
                        {totalInsuranceAmount = values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium}
                      </div>
                      <Text tid={'Vendor.Step3.TotalPremium'} />
                      <span style={{ marginLeft:'30px' }}>{amountFormat(totalInsuranceAmount,2)}</span>
                    </Grid>
                  </Grid>
                </Box>

              </Grid>
            </Grid>
            

            <Grid container style={{ margin: '5vh 0 5vh 0' }} spacing={1}
                  className={classes.textEnd} >
                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        type="submit" 
                        color="secondary" 
                        className={classes.back_button} 
                        onClick={() => { setDirection('back')}}
                    >
                        <Text tid={'Button.Previous'}/>
                    </Button>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    {validate(values.insuredPersons)}
                  </Grid>
            </Grid>

        </Form>
        )}
      </Formik>

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
    </>
  )
}

ProductSelection.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
}

export default ProductSelection