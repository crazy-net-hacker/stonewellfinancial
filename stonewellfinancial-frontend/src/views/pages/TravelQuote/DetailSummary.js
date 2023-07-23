import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form
import { Formik, Form } from 'formik';
// core components
import {
  Grid, Typography,
  TableContainer, Table, TableBody, TableCell,
  TableHead, TableRow,
} from '@material-ui/core';
// common components
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import Button from '../../../components/common/CustomButtons/Button';
import { dateFormat, amountFormat } from '../../../controllers/dataFormat'
//icons
import Insurance from '../../../assets/imgs/icons/insurance.svg'
import Add from '../../../assets/imgs/icons/add.svg'
import Support from '../../../assets/imgs/icons/support.svg'
//
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';

//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

  const DetailSummary = (props) => {
    const { formData } = props;

    const classes = useStyles();

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage
    
    const [direction, setDirection] = useState('back');

    let height = '0px'

    let optionPlanSubTotal = [];

    //Responsive Design
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


    let isMobile = (width <= 768);

    return (
      <>

        <StepHeader height={height} activeStep={2} data={formData} />

        <Typography variant="h5" gutterBottom className={classes.title_question}>
          <Text tid={'Quote.TravelQuoteSummary'}/>
        </Typography>

        <Formik
          initialValues={formData}
          onSubmit={values => {
            window.scrollTo(0, 0)
            props.updateFormData(values);
            direction === 'back' 
            ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
            : props.history.push(pathDirection(props.location.pathname, values).nextStep);            

          }}
        >
          {({ values }) => (

            <Form className={classes.formWrapper}>
              <Grid container spacing={2} justify="center">
                <Grid item xs={12} sm={10} md={10} lg={8} xl={7}>
                      <div >
                        {/* trip details */}       
                        {!isMobile?
                          <>
                          <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', fontSize: '18px', margin: '4vh 0' }}>
                              <span> <Text tid={'Quote.ApplicantDetail'}/> </span>
                          </Grid>
                          <TableContainer>
                            <Table >
                              <TableHead style={{ background: '#efefef' }}>
                                <TableRow>
                                  {/* <TableCell className={classes.cell_applicant_left}></TableCell> */}
                                  <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell> 
                                  <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.BirthDate'}/></TableCell>
                                  <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Gender'}/></TableCell>
                                  <TableCell className={classes.cell_applicant_left}><Text tid={ values.tripArrivalDate < new Date()?'Quote.HomeCountryOfResidenceBefore':'Quote.HomeCountryOfResidence'}/></TableCell>
                                  {/* <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Beneficiary'}/></TableCell> */}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values.insuredPersons && values.insuredPersons.length > 0
                                  ? values.insuredPersons.map((insuredPerson, index) => (

                                    <TableRow
                                      key={index}
                                    >
                                      {/* <TableCell>{index+1}</TableCell> */}

                                      {/* Full Name / Relationship */}
                                      <TableCell component="th" scope="row">
                                        {insuredPerson.lastName},{insuredPerson.firstName}
                                        <div className={classes.sub_title_summary}>{insuredPerson.relationship}</div>
                                      </TableCell>

                                      {/* Date of Birth / Age */}
                                      <TableCell>
                                        {dateFormat(insuredPerson.birthDate)}
                                        <div className={classes.sub_title_summary}>{insuredPerson.age} yrs</div>
                                        {/* 10살 */}
                                      </TableCell>


                                      {/* Gender */}
                                      <TableCell>{insuredPerson.gender}</TableCell>

                                      {/* Country of origin */}
                                      <TableCell>{values.originCountryName} {values.originProvinceName}</TableCell>

                                    </TableRow>

                                  )) 
                                    : null
                                  }
                              </TableBody>
                            </Table>
                          </TableContainer>
                          </>
                        :
                          <>
                            {values.insuredPersons && values.insuredPersons.length > 0
                              ? values.insuredPersons.map((insuredPerson, index) => (
                                <Grid item container key={index}>
                                  <Grid item xs={12} style={{margin:'2vh 0', fontWeight:'600', textAlign:'center', background:'#eee', padding:'1vh' }}>
                                    <Text tid={'Quote.Step.Applicant'}/> {index+1}
                                  </Grid>
                                  <Grid item xs={7} style={{margin:'1vh 0'}}>
                                    <Typography><Text tid={'Quote.FullName'}/></Typography>
                                    {insuredPerson.lastName},{insuredPerson.firstName} ({insuredPerson.relationship})
                                  </Grid>
                                  <Grid item xs={5} style={{margin:'1vh 0'}}>
                                    <Typography><Text tid={'Quote.Gender'}/></Typography>
                                    {insuredPerson.gender}
                                  </Grid>
                                  <Grid item xs={7} style={{margin:'1vh 0'}}>
                                    <Typography><Text tid={'Quote.BirthDate'}/></Typography>
                                    {dateFormat(insuredPerson.birthDate)} ({insuredPerson.age}yrs)
                                  </Grid>
                                  <Grid item xs={5} style={{margin:'1vh 0'}}>
                                    <Typography><Text tid={ values.tripArrivalDate < new Date()?'Quote.HomeCountryOfResidenceBefore':'Quote.HomeCountryOfResidence'}/></Typography>
                                    {values.originCountryName} {values.originProvinceName}
                                  </Grid>
                                  
                                  {/* Insurance */}
                                  {insuredPerson.arrivalDate?
                                  <Grid item container>
                                    <Typography><Text tid={'Quote.TripArrivalDate'}/></Typography>
                                      {dateFormat(insuredPerson.arrivalDate)}
                                  </Grid>
                                  :null}

                                  <Grid item container xs={12} style={{ border:'1px solid #eee', borderRadius:'5px', padding:'2vh', marginTop:'2vh'}}>
                                    <Grid item xs={12}>
                                      <Typography style={{ marginBottom:'1vh', fontWeight:'700', fontSize:'16px' }}><Text tid={'Quote.Insurance'}/></Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <img
                                            src={Insurance}
                                            alt="Insurance icon"
                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                          />
                                          {insuredPerson.selectedPlan.compnayName} 
                                          {(currentLanguage === 'ko' 
                                              ? (insuredPerson.selectedPlan.selectedPlanNameKr ? insuredPerson.selectedPlan.selectedPlanNameKr : insuredPerson.selectedPlan.selectedPlanName) 
                                              : insuredPerson.selectedPlan.selectedPlanName)}
                                          <div className={classes.sub_title}><Text tid={'Quote.SumInsured'}/> {amountFormat(insuredPerson.selectedPlan.selectedCoverage, 0)}</div>
                                          <div className={classes.sub_title}><Text tid={'Quote.Deductible'}/> {amountFormat((parseFloat(insuredPerson.selectedPlan.selectedDeduct)),0)}</div>
                                          {/* <div className={classes.sub_title}>Deductible {amountFormat(insuredPerson.selectedPlan.calculatedDeductAmount, 2)}</div> */}

                                          {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName) &&
                                            values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName).planTypes.filter(plan => plan.isSelected === true).length > 0 && (
                                            <>
                                              {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName)
                                                .planTypes.filter(plan => plan.isSelected === true).map((plan, opIndex) => (
                                                <div key={opIndex}>
                                                  <div className={classes.content_small}>
                                                    <img
                                                        src={Add}
                                                        alt="Insurance icon"
                                                        style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                      />
                                                    {(currentLanguage === 'ko' 
                                                        ? (plan.planNameKr ? plan.planNameKr : plan.planName) 
                                                        : plan.planName === 'Accidental Death & Dismemberment'? 'A D & D': plan.planName)}
                                                  </div>
                                                  <div className={classes.sub_title}><Text tid={'Quote.SumInsured'}/> {amountFormat(plan.selectedCoverage, 0)}</div>
                                                </div>
                                              ))}
                                            </>
                                          )}

                                          {insuredPerson.optionalCarewellService.isSelected && (
                                            <>
                                              
                                              <div className={classes.content_small}>
                                                <img
                                                  src={Support}
                                                  alt="Insurance icon"
                                                  style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                />
                                                Carewell {insuredPerson.optionalCarewellService.packageName}
                                              </div>
                                            </>
                                          )}

                                      </Grid>
                                      <Grid item container xs={12} style={{paddingBottom:'2vh', borderBottom:'1px solid #eee', borderTop:'1px solid #eee', marginTop:'3vh'}}>
                                        <Grid item xs={3}>
                                          <Typography style={{ margin:'3vh 0 1vh 0', fontWeight:'700', fontSize:'16px' }}><Text tid={'Quote.CoveredPeriod'}/></Typography>
                                        </Grid>
                                        <Grid item xs={9} style={{ margin:'3vh 0 1vh 0', textAlign:'right' }}>
                                          {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                          <div className={classes.sub_title_summary} style={{textAlign:'right'}}>{insuredPerson.tripPeriod} days</div>
                                            {/* tripType */}
                                            { insuredPerson.tripType === 'MULTI' &&
                                              <div className={classes.sub_title_summary}>Multi trip for {insuredPerson.selectedPlan.coverages[0].trip_length_max} days</div>
                                              // 4일
                                          }
                                        </Grid>
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <Grid item xs={6}>
                                          <Typography style={{ margin:'3vh 0 1vh 0', fontWeight:'700', fontSize:'16px' }}><Text tid={'Quote.Premium'}/></Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Typography style={{ margin:'3vh 0 1vh 0', fontWeight:'700', fontSize:'22px', color:'#1261C9', textAlign:'right' }}>
                                            {amountFormat(insuredPerson.selectedPlan.calculatedInsuranceAmount, 2)}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                  </Grid>
                                </Grid>
                              )):null
                            }
                          </>
                        }

                        {!isMobile ?
                        <>
                        {/* Coverage details */}
                        <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', fontSize: '18px', margin: '4vh 0' }}>
                          <span><Text tid={'Quote.CoverageDetail'}/></span>
                        </Grid>

                        <TableContainer >
                          <Table>
                            <TableHead>
                              <TableRow>

                                <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.TripArrivalDate'}/></TableCell>
                                <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Insurance'}/></TableCell>
                                <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.CoveredPeriod'}/></TableCell>
                                <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Premium'}/></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {values.insuredPersons && values.insuredPersons.length > 0
                                ? values.insuredPersons.map((insuredPerson, index) => (

                                  <TableRow
                                    key={index}
                                  >
                                    {/* <TableCell>{index+1}</TableCell> */}

                                    {/* Fiull Name */}
                                    <TableCell>{insuredPerson.lastName}, {insuredPerson.firstName}</TableCell>

                                    {/* Arrival Date */}
                                    <TableCell>{insuredPerson.arrivalDate?dateFormat(insuredPerson.arrivalDate):''}</TableCell>
                                    {/* <TableCell></TableCell> */}

                                    {/* Company / Product / Sum insured / Deductible */}
                                    <TableCell>
                                      <img
                                        src={Insurance}
                                        alt="Insurance icon"
                                        style={{marginRight:'10px', paddingBottom:'3px'}} 
                                      />
                                      {insuredPerson.selectedPlan.compnayName} 
                                      {(currentLanguage === 'ko' 
                                          ? (insuredPerson.selectedPlan.selectedPlanNameKr ? insuredPerson.selectedPlan.selectedPlanNameKr : insuredPerson.selectedPlan.selectedPlanName) 
                                          : insuredPerson.selectedPlan.selectedPlanName)}
                                      <div className={classes.sub_title}><Text tid={'Quote.SumInsured'}/> {amountFormat(insuredPerson.selectedPlan.selectedCoverage, 0)}</div>
                                      <div className={classes.sub_title}><Text tid={'Quote.Deductible'}/> {amountFormat((parseFloat(insuredPerson.selectedPlan.selectedDeduct)),0)}</div>
                                      {/* <div className={classes.sub_title}>Deductible {amountFormat(insuredPerson.selectedPlan.calculatedDeductAmount, 2)}</div> */}

                                      {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName) &&
                                        values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName).planTypes.filter(plan => plan.isSelected === true).length > 0 && (
                                        <>
                                          {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName)
                                            .planTypes.filter(plan => plan.isSelected === true).map((plan, opIndex) => (
                                            <div key={opIndex}>
                                              <div className={classes.content_small}>
                                                <img
                                                  src={Add}
                                                  alt="Insurance icon"
                                                  style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                />
                                                {/* {plan.planName === 'Accidental Death & Dismemberment' ?
                                                'A D & D' : plan.planName
                                                } */}
                                                {(currentLanguage === 'ko' 
                                                  ? (plan.planNameKr ? plan.planNameKr : plan.planName) 
                                                  : plan.planName)}
                                              </div>
                                              <div className={classes.sub_title}><Text tid={'Quote.SumInsured'}/> {amountFormat(plan.selectedCoverage, 0)}</div>
                                            </div>
                                          ))}
                                        </>
                                      )}

                                      {insuredPerson.optionalCarewellService.isSelected && (
                                        <>
                                          
                                          <div className={classes.content_small}>
                                            <img
                                              src={Support}
                                              alt="Insurance icon"
                                              style={{marginRight:'10px', paddingBottom:'3px'}} 
                                            />
                                            Carewell {insuredPerson.optionalCarewellService.packageName}
                                          </div>
                                        </>
                                      )}

                                    </TableCell>


                                    {/* Covered Period*/}
                                    <TableCell>
                                    {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                      <div className={classes.sub_title_summary}>{insuredPerson.tripPeriod} days</div>
                                      {/* tripType */}
                                      { insuredPerson.tripType === 'MULTI' &&
                                        <div className={classes.sub_title_summary}>Multi trip for {insuredPerson.selectedPlan.coverages[0].trip_length_max} days</div>
                                        // 4일
                                      }
                                    </TableCell>

                                    {/* Total Premium*/}
                                    <TableCell>{amountFormat(insuredPerson.selectedPlan.calculatedInsuranceAmount, 2)}</TableCell>

                                  </TableRow>

                                )) : null}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        </>
                    :null}
                        {/* </div>
                ))
                : null
              } */}
                      </div>

                  {/* total premium */}
                  <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', padding: '20px', fontSize: '18px', background: '#f6faf0', margin: '2vh 0' }}>
                    <Grid item container>
                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                            <Typography className={classes.title2} style={{ fontWeight: values.familyGroup.familyPremium > 0 ? '400' : '600' }} color="secondary" gutterBottom>
                            <img
                                src={Insurance}
                                alt="Insurance icon"
                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                            />
                                <Text tid={'Quote.RegularPremium'}/>
                            </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                            <Typography className={classes.title2} style={{ fontWeight: values.familyGroup.familyPremium > 0 ? '400' : '600' }} color="textSecondary" gutterBottom>
                              {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.insuranceAmount), 0),2)}
                            </Typography>
                        </Grid>
                    </Grid>

                    { values.familyGroup.familyPremium > 0 &&
                      <>
                      {/* <Grid item xs={6} md={6} style={{ color:'red',fontWeight:'400' }}>
                          <span><Text tid={'Quote.FamilyDiscountAmount'}/></span>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', fontSize: '18px', color:'red', fontWeight:'400' }}>
                            - {amountFormat(values.familyGroup.discountPremium,2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} style={{ fontWeight:'500', color:'#1261C9' }}>
                          <span><Text tid={'Quote.FamilyPlanPremium'}/></span>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', color:'#1261C9', fontWeight:'700', fontSize:'1.5rem'}}>
                            {amountFormat(values.familyGroup.familyPremium,2)}
                          </Typography>
                        </Grid> */}

                        <Grid item container>
                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                <Typography className={classes.title2} style={{ color:'red' }} gutterBottom>
                                  <img
                                      src={Insurance}
                                      alt="Insurance icon"
                                      style={{marginRight:'10px', paddingBottom:'3px', opacity:'0'}} 
                                  />
                                  (<Text tid={'Quote.FamilyDiscountAmount'}/>)
                                </Typography>
                            </Grid>
                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                <Typography className={classes.title2} style={{ color:'red' }} gutterBottom>
                                  - {amountFormat(values.familyGroup.discountPremium,2)}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item container>
                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                <Typography className={classes.title2} color="secondary" style={{ fontWeight:'600' }} gutterBottom>
                                  <img
                                      src={Insurance}
                                      alt="Insurance icon"
                                      style={{marginRight:'10px', paddingBottom:'3px'}} 
                                  />
                                  <Text tid={'Quote.FamilyPlanPremium'}/>
                                </Typography>
                            </Grid>
                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                <Typography className={classes.title2} color="textSecondary" style={{ fontWeight:'600' }} gutterBottom>
                                    {amountFormat(values.familyGroup.familyPremium,2)}
                                </Typography>
                            </Grid>
                        </Grid>
                      </>
                    }

                    {/* <Grid item xs={6} md={6} style={{ fontWeight:'400' }}>
                      <span>Optional Premium</span>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', fontSize: '18px' }}>
                        {amountFormat(
                          values.insuredPersons
                                  .map( i => i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName) 
                                              ? i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName)
                                                                      .planTypes.filter(plan => plan.isSelected === true)
                                                                                .map((plan) => plan.calculatedAddOnAmount).reduce((a, v) => a = a + parseFloat(v), 0)
                                              :0
                                  ).reduce((a, o) => a = a + parseFloat(o), 0)
                        )}
                      </Typography>                        
                    </Grid>   */}
                    <div style={{ display: 'none' }}>
                      {values.insuredPersons
                                    .map( i => i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName) 
                                                ? i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName)
                                                                        .planTypes.filter(pt => pt.isSelected === true)
                                                                                  .map((pt) => ( optionPlanSubTotal.push({name : pt.planName,  
                                                                                                            nameKr : pt.planNameKr,
                                                                                                            premium: parseFloat(pt.calculatedAddOnAmount)
                                                                                                        })))
                                                :null
                                    )
                      }
                    </div>
                    

                    {optionPlanSubTotal && 
                      optionPlanSubTotal.reduce((total, val)=>{
                          let foundItemIndex = total.findIndex((obj)=>obj.name === val.name);
                          if(foundItemIndex < 0) total.push(val) 
                          else total[foundItemIndex].premium += parseFloat(val.premium);
                          return total;
                          }, []).map((i, index)=> (
                                  <React.Fragment key={index}>
                                    {/* <Grid item xs={6} md={6} style={{ fontWeight:'400' }}>
                                      <span>
                                      {(currentLanguage === 'ko' ? (i.nameKr? i.nameKr: i.name) : i.name)}
                                        </span>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                      <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', fontSize: '18px' }}>
                                        {amountFormat(i.premium)}
                                      </Typography>  
                                    </Grid> */}
                                    <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                      <Typography className={classes.title2} color="textSecondary" style={{ fontWeight:'600' }} gutterBottom>
                                        <img
                                        src={Add}
                                        alt="Add icon"
                                        style={{marginRight:'10px', paddingBottom:'3px'}} 
                                        />
                                        {(currentLanguage === 'ko' ? (i.nameKr? i.nameKr: i.name) : i.name)}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                      <Typography className={classes.title2} color="textSecondary" style={{ fontWeight:'600' }} gutterBottom>
                                        {amountFormat(i.premium)}
                                      </Typography>  
                                    </Grid>
                                  </React.Fragment>
                          ))
                    }

                    {values.insuredPersons.filter(i => i.optionalCarewellService.isSelected).length > 0 && (
                      <>
                        <Grid item xs={6} md={6} style={{ fontWeight:'400' }}>
                          <span><Text tid={'CarewellServices'}/></span>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', fontSize: '18px' }}>
                            {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.optionalCarewellService.isSelected === true ?v.optionalCarewellService.packageAmount:0), 0),2)}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    {/* <Grid item xs={6} md={6} style={{ fontWeight:'400' }}>
                      <span><Text tid={'Quote.TotalPremium'}/></span>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Typography variant="h5" className={classes.titleSmall} style={{ textAlign: 'right', fontSize: '18px' }}>
                        {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium,2)}
                      </Typography>
                    </Grid> */}

                    <Grid item container xs={12} style={{color:'#3f51b5', background:'#fff', padding:'1.5vh', marginTop: isMobile ? '0':'2vh'}}>
                        {/* Total Premium  */}
                        <Grid item xs={12} sm={4}>
                            <span style={{fontWeight:400, fontSize:'14px', color:'#000000DE'}}>
                            <Text tid={'Quote.TotalPremium'}/> : 
                            </span>
                        </Grid>
                        <Grid item xs={12} sm={8} style={{ textAlign:'right', fontWeight:'600', fontSize:'18px' }}>
                            <span>
                            {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium,2)}
                            </span>
                        </Grid>
                    </Grid>
                  
                  </Grid>

                </Grid>

              </Grid>

              <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>

                <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button color="secondary" className={classes.back_button} 
                        onClick={() => {
                          props.updateFormData(values); 
                          props.history.push(pathDirection(props.location.pathname, values).prevStep)
                          }}
                >
                  <Text tid={'Button.Previous'}/>
                </Button>
                </Grid>

                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Button type='submit' color="dark" className={classes.next_button} onClick={() => setDirection('forward')}>
                    <Text tid={'Button.Next'}/>
                  </Button>
                </Grid>
              </Grid>
            </Form>

          )}

        </Formik>


      </>

    );

};

// ProtoTypes
DetailSummary.propTypes = {
  formData: PropTypes.object.isRequired
};

export default DetailSummary;