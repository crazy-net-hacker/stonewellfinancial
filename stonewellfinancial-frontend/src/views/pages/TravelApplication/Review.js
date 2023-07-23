import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core'
import {
    Grid, Typography,
    TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow,
  } from '@material-ui/core';

//common components
import { Text } from "../../../components/common/LanguageProvider"; 
import { LanguageContext } from "../../../components/common/LanguageProvider";
// functionalities
import { dateFormat, amountFormat } from '../../../controllers/dataFormat'
import { textLineBreak } from '../../../functionalities/TextFormat'
// icon
import Insurance from '../../../assets/imgs/icons/insurance.svg'
import Add from '../../../assets/imgs/icons/add.svg'
import Support from '../../../assets/imgs/icons/support.svg'

//styles
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)


export const Review = ({values,}) => {

    //set form data
    const classes = useStyles()

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

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
    
    let isMobile = (width < 769);

    let optionPlanSubTotal = [];

    return (
        <div>
            <Grid container justify='flex-start' style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-380px' : '0' }}>
                <Grid item container>
                                
                    <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '3vh' }}>  
                        <span className={classes.spanTitle}>
                            <Text tid={'Quote.TravelQuoteSummary'}/>
                        </span>
                    </Grid>

                    <Grid item container spacing={2} justify="center">
                        {/* Applicants & Products Information */}
                        <Grid item xs={12}>
                            <div >
                                {/* trip details */}       
                                {!isMobile?
                                <>
                                <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', fontSize: '14px', margin: '4vh 0 2vh 0' }}>
                                    <span> <Text tid={'Quote.ApplicantDetail'}/> </span>
                                </Grid>
                                <TableContainer>
                                    <Table >
                                    <TableHead style={{ background: '#efefef' }}>
                                        <TableRow>
                                        {/* <TableCell className={classes.cell_applicant_left_small}></TableCell> */}
                                        <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.FullName'}/></TableCell> 
                                        <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.BirthDate'}/></TableCell>
                                        <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.Gender'}/></TableCell>
                                        <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.OriginCountry'}/></TableCell>
                                        {/* <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.Beneficiary'}/></TableCell> */}
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
                                            <TableCell component="th" scope="row" className={classes.cell_contents_small}>
                                                {insuredPerson.lastName},{insuredPerson.firstName}
                                                <div className={classes.sub_title_summary}>{insuredPerson.relationship}</div>
                                            </TableCell>

                                            {/* Date of Birth / Age */}
                                            <TableCell className={classes.cell_contents_small}>
                                                {dateFormat(insuredPerson.birthDate)}
                                                <div className={classes.sub_title_summary}>{insuredPerson.age} yrs</div>
                                                {/* 10살 */}
                                            </TableCell>


                                            {/* Gender */}
                                            <TableCell className={classes.cell_contents_small}>{insuredPerson.gender}</TableCell>

                                            {/* Country of origin */}
                                            <TableCell className={classes.cell_contents_small}>{values.originCountryName} {values.originProvinceName}</TableCell>

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
                                            <Typography><Text tid={'Quote.OriginCountry'}/></Typography>
                                            {values.originCountryName} {values.originProvinceName}
                                        </Grid>
                                        
                                        {/* Insurance */}
                                        {insuredPerson.arrivalDate?
                                        <Grid item xs={12}>
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

                                                {/* {insuredPerson.physicalCard === true && insuredPerson.physicalCardFee > 0 && ( 
                                                    <>
                                                    <div className={classes.content_small}>
                                                        <img
                                                            src={Add}
                                                            alt="Add icon"
                                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                        />
                                                        <span> <Text tid={'TravelApplication.PhysicalCardFee'}/> {amountFormat(insuredPerson.physicalCardFee,2)}</span>
                                                    </div>
                                                    </>
                                                )} */}

                                                {insuredPerson.optionalCarewellService.isSelected && (
                                                    <>
                                                    <div className={classes.content_small}>
                                                        <img
                                                        src={Support}
                                                        alt="Insurance icon"
                                                        style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                        />
                                                        <span><Text tid={'CarewellServices'}/> {insuredPerson.optionalCarewellService.packageName}</span>
                                                    </div>
                                                    </>
                                                )}

                                            </Grid>
                                            <Grid item container xs={12} style={{paddingBottom:'2vh', borderBottom:'1px solid #eee', borderTop:'1px solid #eee', marginTop:'3vh'}}>
                                                <Grid item xs={12}>
                                                <Typography style={{ margin:'3vh 0 1vh 0', fontWeight:'700', fontSize:'16px' }}><Text tid={'Quote.CoveredPeriod'}/></Typography>
                                                </Grid>
                                                <Grid item xs={12} style={{ textAlign:'right' }}>
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

                                {!isMobile 
                                ?
                                <>
                                    {/* Coverage details */}
                                    <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', fontSize: '14px', margin: '4vh 0 2vh 0' }}>
                                    <span><Text tid={'Quote.CoverageDetail'}/></span>
                                    </Grid>

                                    <TableContainer >
                                        <Table>
                                            <TableHead>
                                            <TableRow>

                                                <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.FullName'}/></TableCell>
                                                <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.TripArrivalDate'}/></TableCell>
                                                <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.Insurance'}/></TableCell>
                                                <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.CoveredPeriod'}/></TableCell>
                                                <TableCell className={classes.cell_applicant_left_small}><Text tid={'Quote.Premium'}/></TableCell>
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
                                                    <TableCell className={classes.cell_contents_small}>{insuredPerson.lastName}, {insuredPerson.firstName}</TableCell>

                                                    {/* Arrival Date */}
                                                    <TableCell className={classes.cell_contents_small}>{insuredPerson.arrivalDate?dateFormat(insuredPerson.arrivalDate):''}</TableCell>
                                                    {/* <TableCell></TableCell> */}

                                                    {/* Company / Product / Sum insured / Deductible */}
                                                    <TableCell className={classes.cell_contents_small}>
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
                                                                : plan.planName)}
                                                            </div>
                                                            <div className={classes.sub_title}><Text tid={'Quote.SumInsured'}/> {amountFormat(plan.selectedCoverage, 0)}</div>
                                                            </div>
                                                        ))}
                                                        </>
                                                    )}

                                                    {/* {insuredPerson.physicalCard === true && insuredPerson.physicalCardFee > 0 && ( 
                                                        <>
                                                        <div className={classes.content_small}>
                                                            <img
                                                                src={Add}
                                                                alt="Add icon"
                                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                            />
                                                            <span> <Text tid={'TravelApplication.PhysicalCardFee'}/> {amountFormat(insuredPerson.physicalCardFee,2)}</span>
                                                        </div>
                                                        </>
                                                    )} */}

                                                    {insuredPerson.optionalCarewellService.isSelected && (
                                                        <>
                                                        <div className={classes.content_small}>
                                                            <img
                                                                src={Support}
                                                                alt="Insurance icon"
                                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                            />
                                                            <span><Text tid={'CarewellServices'}/> {insuredPerson.optionalCarewellService.packageName}</span>
                                                        </div>
                                                        </>
                                                    )}

                                                    </TableCell>


                                                    {/* Covered Period*/}
                                                    <TableCell className={classes.cell_contents_small}>
                                                    {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                                    <div className={classes.sub_title_summary}>{insuredPerson.tripPeriod} days</div>
                                                    {/* tripType */}
                                                    { insuredPerson.tripType === 'MULTI' &&
                                                        <div className={classes.sub_title_summary}>Multi trip for {insuredPerson.selectedPlan.coverages[0].trip_length_max} days</div>
                                                        // 4일
                                                    }
                                                    </TableCell>

                                                    {/* Total Premium*/}
                                                    <TableCell className={classes.cell_contents_small}>{amountFormat(insuredPerson.selectedPlan.calculatedInsuranceAmount, 2)}</TableCell>

                                                </TableRow>

                                                )) : null}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                                :null}
                            </div>

                            {/* total premium */}
                            <Grid item container xs={12} sm={12} spacing={1} style={{ fontWeight: '600', padding: '20px', fontSize: '16px', background: '#f6faf0', margin: '2vh 0' }}>
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

                                {/* <Grid item container>
                                    <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                        <Typography className={classes.title2} color="secondary" style={{ fontWeight:'600' }} gutterBottom>
                                            <img
                                                src={Add}
                                                alt="Add icon"
                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                            />
                                            <Text tid={'TravelApplication.PhysicalCardFee'}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                        <Typography className={classes.title2} color="textSecondary" style={{ fontWeight:'600' }} gutterBottom>
                                        {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.physicalCardFee), 0),2)}
                                        </Typography>
                                    </Grid>
                                </Grid> */}

                                {values.insuredPersons.filter(i => i.optionalCarewellService.isSelected).length > 0 && (
                                <>
                                    <Grid item container>
                                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                            <Typography className={classes.title2} color="secondary" style={{ fontWeight:'600' }} gutterBottom>
                                                <img
                                                    src={Support}
                                                    alt="Insurance icon"
                                                    style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                />
                                                <span><Text tid={'CarewellServices'}/></span>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                            <Typography className={classes.title2} color="textSecondary" style={{ fontWeight:'600' }} gutterBottom>
                                            {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.optionalCarewellService.isSelected === true ?v.optionalCarewellService.packageAmount:0), 0),2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </>
                                )}

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

                    <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '4vh', marginBottom: '4vh' }}>  
                        <span className={classes.spanTitle}>
                        <Text tid={'Quote.ContactInformation'}/>
                        </span>
                    </Grid>
                    <Grid item container spacing={2} justify="center">
                        <Grid  item container xs={12} spacing={1}>  
                            <Grid  item container xs={12} sm={12} spacing={1}>  
                            {values.maillingInCanada === true && (
                                <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                                        <span><Text tid={'Quote.Address'}/></span>
                                    </Grid>
                                    <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                                        <span>{values.mailStreetName} {values.mailUnitApartmentNo}, {values.mailCity} </span><br/>
                                        <span>{values.mailProvince}, {values.mailPostalCode}</span><br/>
                                        {/* <span>{values.mailCountry?countries.filter(f => f.country_code === values.mailCountry)[0].name:''}</span> */}
                                        <span>{values.mailCountry?values.mailCountry:''}</span>
                                    </Grid>
                                </Grid>
                            )}
                                <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <Grid item xs={4} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                                        <span><Text tid={'Quote.Email'}/></span>
                                    </Grid>
                                    <Grid item xs={8} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                                        <span>{values.contactEmail}</span>
                                    </Grid>
                                </Grid>
                                <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <Grid item xs={4} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                                    <span><Text tid={'Quote.Phone'}/></span>
                                    </Grid>
                                    <Grid item xs={8} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                                    <span>{values.contactPhone}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Payment Information */}
                    <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '5vh', marginBottom: '4vh' }}>  
                        <span className={classes.spanTitle}>
                        <Text tid={'Quote.PaymentInformation'}/>
                        </span>
                    </Grid>                        
                    <Grid container spacing={2} justify="center">
                        <Grid  item container xs={12} spacing={1} >  
                            <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <Grid  item container xs={12} sm={12} spacing={1}>  
                                        <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                                            <span><Text tid={'Quote.PaymentMethod'}/></span>
                                        </Grid>
                                        <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                                            <span >{values.paymentMethod}</span>
                                        </Grid>
                                    </Grid>
                                    {values.paymentMethod === 'Creditcard' 
                                        ? (<>
                                            <Grid  item container xs={12} sm={12} spacing={1}>  
                                                <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                                                <span><Text tid={'Quote.CardHolderName'}/></span>
                                                </Grid>
                                                <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                                                <span>{values.cardHolderName}</span>
                                                </Grid>
                                            </Grid>
                                            <Grid  item container xs={12} sm={12} spacing={1}>  
                                                <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                                                <span><Text tid={'Quote.CreditCardNumber'}/></span>
                                                </Grid>
                                                <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                                                <span>{values.creditCardNumber}</span>
                                                </Grid>
                                            </Grid>
                                            <Grid  item container xs={12} sm={12} spacing={1}>  
                                                <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                                                <span><Text tid={'Quote.CardExpiration'}/></span>
                                                </Grid>
                                                <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                                                <span>{values.cardExpired}</span>
                                                </Grid>
                                            </Grid>
                                        </>)
                                        :   
                                        <Grid  item container xs={12} sm={12} spacing={1}>  
                                            <Grid item xs={5} md={6}>
                                            <span><Text tid={'Quote.SenderName'}/></span>
                                            </Grid>
                                            <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                                            <span>{values.senderName}</span>
                                            </Grid>
                                        </Grid>
                                    }
                            </Grid>
                            
                        </Grid>
                    </Grid>


                    {/* Note */}
                    {values.note &&(
                        <>
                            <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '4vh', marginBottom: '4vh' }}>  
                                <span className={classes.spanTitle}>
                                    <Text tid={'TravelApplication.NoteTitle'}/>
                                </span>
                            </Grid>
                            <Grid item xs={12} style={{marginLeft: '2vh', fontWeight:'500'}}>
                                {textLineBreak(values.note)}
                            </Grid>
                        </>
                    )}


                </Grid>                
            </Grid>
        </div>
    )
}

export default Review
