import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
//core components
import {
  Dialog, DialogContent, DialogActions,
  Typography, IconButton, Grid, Box,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
//style
import formStyle from '../../../assets/jss/styles/formStyle'
//common components
import { SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import Button from '../../../components/common/CustomButtons/Button'
import { Text } from "../../../components/common/LanguageProvider";
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
// style
// import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
// import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
//icons
import Checked from '../../../assets/imgs/icons/checked.svg'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Add from '../../../assets/imgs/icons/add.svg'
// import Support from '../../../assets/imgs/icons/support.svg'
// import ErrorIcon from '@material-ui/icons/Error';



// brochures
const REACT_APP_S3_URL = "https://stonewell-bucket.s3.ca-central-1.amazonaws.com/"

const useStyles = makeStyles(formStyle)

const AddOnProduct = (props) => {
  const { openSelectPlan, setOpenSelectPlan, 
    applyType,
    personInfo,
    values,
    // handleChange,
    setFieldValue,
    currentLanguage
  } = props;

  // set form style
  const classes = useStyles();
  
  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (insurance) => {
      if (insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'KO')).length > 0){
        setPdfOption({
            brochures_url : REACT_APP_S3_URL + insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === 'KO'))[0].document_url,
            title : `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}`
        })
      } else{
        setPdfOption({
            brochures_url : '',
            title : `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}`
        })
      }
      setOpenPDFViewer(true)
  }

  // amount Format 
  function amountFormat(amount, decimal) {
    return (
    parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
    )
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
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={openSelectPlan} 
        onClose={() =>setOpenSelectPlan(false)}
        >
        <MuiDialogTitle disableTypography style={{ background:'#2a2f71' }}>
          <Typography style={{ fontSize:'18px', color:'#fff', fontWeight:'500'}}>
            {/* {title} */}
             <Text tid={'TravelApplication.AddOnProducts.Title'}/>
          </Typography>
          <Typography style={{ fontSize:'14px', color:'#fff' }}>
            <Text tid={'TravelApplication.AddOnProducts.Description'}/>
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            style={{ color:'#fff' }}
            onClick={() => {setOpenSelectPlan(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>

        {/* Add Optional Plan */}          
        {values.insuredPersons[personInfo.personIndex].insurancePlans && 
          <>
            <Grid container>
              {/* coverage selection box */}
              <Grid item xs={12}>
                <div className={classes.companionSection} style={{ border:'none', padding:'0' }}>

                  {values.insuredPersons[personInfo.personIndex].insurancePlans.map((insurance) => (
                    <Grid container key={insurance.compnayName + insurance.generic_name} >
                      <Grid item xs={12}>
                        {insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).length > 0 &&
                          insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).map((coverage, coverageIndex) => (
                            <div key={coverageIndex}>

                              {/* Add Optional Plan */}          
                              {values.insuredPersons[personInfo.personIndex].insurancePlans && 
                                <>
                                  <Grid container>
                                    {/* coverage selection box */}
                                    <Grid item xs={12}>
                                      <div className={classes.companionSection} style={{ border:'none', padding:'0' }}>

                                        {values.insuredPersons[personInfo.personIndex].insurancePlans.map((insurance) => (
                                          <Grid container key={insurance.compnayName + insurance.generic_name} >
                                            <Grid item xs={12}>
                                              {insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).length > 0 &&
                                                insurance.coverages.filter(i => i.price_code === insurance.selectedCoverage).map((coverage, coverageIndex) => (
                                                  <div key={coverageIndex}>
                                                    
                                                    {/* Optional Plan addition */}
                                                    {values.insuredPersons[personInfo.personIndex].selectedPlan === insurance ? (
                                                      <>
                                                        {values.insuredPersons[personInfo.personIndex].optionalAddOnPlans.map((AddOnPlan, AddOnIndex) => (
                                                          <div key={AddOnIndex}>
                                                            {AddOnPlan.compnayName === insurance.compnayName
                                                              ? (<>
                                                                {AddOnPlan.planTypes.map((optionPlans, idx) => (
                                                                  <div key={idx}>
                                                                    {optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[personInfo.personIndex].eligilbeIns).length > 0 &&
                                                                      optionPlans.coverages.filter(i => i.price_code === optionPlans.selectedCoverage && i.insured_type === values.insuredPersons[personInfo.personIndex].eligilbeIns).map((coverage, coverageIndex) => (
                                                                        <div key={coverageIndex}>
                                                                          <Grid item container spacing={3} style={{ padding: !isMobile ? '15px' : 'none', border: '1px solid #ddd', borderRadius: '10px', marginTop: '1vh', marginBottom: '1vh'}}>

                                                                              <Grid item xs={12} sm={5} style={{ background: !isMobile ? 'none' : '#f9f9f9', textAlign: !isMobile ? 'left' : 'center', borderRadius: '10px 10px 0 0'}}>
                                                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                                  {insurance.compnayName + ' ' + 
                                                                                      (currentLanguage === 'ko' 
                                                                                        ? (coverage.generic_name_kr ? coverage.generic_name_kr : coverage.generic_name) 
                                                                                        : coverage.generic_name)
                                                                                  }
                                                                                </span>
                                                                                <div>
                                                                                  <IconButton aria-label="view" color="primary" 
                                                                                      onClick={() => handleOpenPDFViewer(optionPlans)}
                                                                                  >
                                                                                      <DescriptionIcon />
                                                                                      <Typography style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '300'  }}>
                                                                                        <Text tid={'Quote.SeeMoreBenefit'}/> 
                                                                                      </Typography>
                                                                                  </IconButton>   
                                                                                </div>
                                                                              </Grid>
                                                                              
                                                                              {/* coverage up to */}
                                                                              <Grid item xs={12} sm={4} >
                                                                                <span style={{ fontSize: '14px', marginLeft: '13px', fontWeight: '600' }}>
                                                                                  <Text tid={'TravelApplication.Coverage'}/>
                                                                                </span>

                                                                                <SelectTextField
                                                                                  // label="Coverage"
                                                                                  name={`insuredPersons.${personInfo.personIndex}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.selectedCoverage`}
                                                                                  value={optionPlans.selectedCoverage}
                                                                                  // onChange={handleChange}
                                                                                  onChange={(e)=>{
                                                                                    setFieldValue(`insuredPersons.${personInfo.personIndex}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.selectedCoverage`, e.currentTarget.value)
                                                                                    if (applyType === 'family'){
                                                                                      for (const i in values.insuredPersons) { 
                                                                                        values.insuredPersons[i].optionalAddOnPlans[AddOnIndex].planTypes[idx].selectedCoverage = e.currentTarget.value
                                                                                      }
                                                                                    }
                                                                                  }}
                                                                                >
                                                                                  {optionPlans.coverages
                                                                                    .filter(c => c.insured_type === values.insuredPersons[personInfo.personIndex].eligilbeIns &&
                                                                                      (c.trip_length_min <= values.insuredPersons[personInfo.personIndex].tripPeriod && c.trip_length_max >= values.insuredPersons[personInfo.personIndex].tripPeriod))
                                                                                    .map((o) => (
                                                                                      <option key={o.price_code} value={o.price_code}>
                                                                                        {parseFloat(o.price_code).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                                                      </option>
                                                                                    ))
                                                                                  }
                                                                                </SelectTextField>
                                                                              </Grid>

                                                                              {/* Total Premium and Days */}
                                                                              <Grid item xs={12} sm={3} lg={3} style={{ textAlign:'center', background: !isMobile ? 'none' : '#f9f9f9' }}>
                                                                                <div style={{ display: 'none' }}>
                                                                                  {/* {optionPlans.calculatedAddOnAmount = coverage.calculate_rate === 'D'
                                                                                    ? (coverage.value * values.insuredPersons[personInfo.personIndex].tripPeriod)
                                                                                    : (coverage.value)} */}
                                                                                    
                                                                                  {/* Accidental Death & Dismemberment optional plan Amount at least 
                                                                                          Allianz : $16 for Accidental Death & Dismemberment */}
                                                                                  {optionPlans.calculatedAddOnAmount = 
                                                                                      coverage.calculate_rate === 'D'
                                                                                        ? (AddOnPlan.compnayName === 'Allianz' 
                                                                                            && optionPlans.coverageType === 'ADD' 
                                                                                            && coverage.value * values.insuredPersons[personInfo.personIndex].tripPeriod < 16
                                                                                              ? 16
                                                                                              : coverage.value * values.insuredPersons[personInfo.personIndex].tripPeriod)
                                                                                        : (coverage.value)
                                                                                  }
                                                                                </div>
                                                                                <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                                                  <Text tid={'Vendor.Step3.TotalPremium'}/>
                                                                                </Typography>
                                                                                <Typography style={{ fontSize:'18px', fontWeight:'600' }}>
                                                                                  {amountFormat((
                                                                                      optionPlans.calculatedAddOnAmount
                                                                                        * (applyType === 'family' ? values.insuredPersons.length: 1)) 
                                                                                  )}
                                                                                </Typography>
                                                                              
                                                                              </Grid>

                                                                              {/* Premium amount and Select this button */}
                                                                              <Grid item xs={12} style={{ background: !isMobile ? 'none' : '#f9f9f9', borderRadius:'0 0 10px 10px' }}>
                                                                                <Box textAlign='right'>
                                                                                  <Button
                                                                                    name={`insuredPersons.${personInfo.personIndex}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.isSelected`}
                                                                                    // variant='contained'
                                                                                    color={optionPlans.isSelected ? 'secondary' : 'dark'}
                                                                                    className={classes.next_button}
                                                                                    style={{ width: '100%', fontSize:'14px' }}
                                                                                    onClick={() => {
                                                                                      // optionPlans.isSelected = !optionPlans.isSelected
                                                                                      // setFieldValue(`insuredPersons.${personInfo.personIndex}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.selectedCoverage`, optionPlans.selectedCoverage)
                                                                                      const val = !optionPlans.isSelected
                                                                                      if (applyType === 'family'){
                                                                                        for (const i in values.insuredPersons) { 
                                                                                          values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0].planTypes[idx].isSelected = val
                                                                                          if (val === true){
                                                                                              values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0]
                                                                                                                          .planTypes[idx].calculatedAddOnAmount = coverage.calculate_rate === 'D'
                                                                                                                                                                      // ? (coverage.value * values.insuredPersons[0].tripPeriod)
                                                                                                                                                                      ? (values.familyGroup.selectedCompnayName === 'Allianz' 
                                                                                                                                                                          && optionPlans.coverageType === 'ADD' 
                                                                                                                                                                          && coverage.value * values.insuredPersons[0].tripPeriod < 16
                                                                                                                                                                            ? 16
                                                                                                                                                                            : coverage.value * values.insuredPersons[0].tripPeriod)
                                                                                                                                                                      : coverage.value 
                                                                                          }else{
                                                                                              values.insuredPersons[i].optionalAddOnPlans.filter(f=>f.compnayName===values.familyGroup.selectedCompnayName)[0]
                                                                                                                      .planTypes[idx].calculatedAddOnAmount = 0
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                      setFieldValue(`insuredPersons.${personInfo.personIndex}.optionalAddOnPlans.${AddOnIndex}.planTypes.${idx}.isSelected`, val)
                                                                                    }}
                                                                                  >
                                                                                    {optionPlans.isSelected ? (
                                                                                      <>
                                                                                      <img
                                                                                          src={Checked}
                                                                                          alt="Selected mark"
                                                                                          style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                                                        /> 
                                                                                        <span> <Text tid={'Quote.Added'}/></span>
                                                                                      </>
                                                                                    ) 
                                                                                    : (
                                                                                      <>
                                                                                      <AddCircleOutlineIcon/>
                                                                                      <span><Text tid={'Quote.Add'}/></span>
                                                                                      </>
                                                                                    ) }
                                                                                  </Button>
                                                                                </Box>
                                                                              </Grid>

                                                                          </Grid>

                                                                        </div>
                                                                      ))}
                                                                  </div>
                                                                ))
                                                                }

                                                              </>
                                                              )
                                                              : null
                                                            }
                                                          </div>

                                                        ))}
                                                      </>
                                                    ) : null}

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
                              }

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
        }

        {/* PDF Viewer Modal  */}
        {
          openPDFViewer === true &&
          <PDFViewer
            // title={'Tugo Studnet'}
            title={pdfOption.title}
            pdf={pdfOption.brochures_url} 
            openPDFViewer={openPDFViewer}
            setOpenPDFViewer={setOpenPDFViewer}
          />
        }
    
        </DialogContent>

        {/* You selected */}
        {values.insuredPersons[personInfo.personIndex].selectedPlan.length !== 0 && (
          <>
            <Grid item xs={12}>
    
            { width !== '667'  ? (
              <Card style={{ textAlign: 'left', background:'#f9f9f9', borderRadius:'0', boxShadow:'none' }}>
                <CardContent className={classes.cardContentBox} style={{ paddingBottom:'0' }}>
                    
                    <Grid item xs={12} style={{textAlign: 'left', paddingBottom:'1vh' }}>
                      <Typography style={{fontWeight:600, fontSize:'12px', color:'#000000DE'}}>
                        <Text tid={'TravelApplication.AddOnProducts.Selected'}/>
                      </Typography>
                    </Grid>
                    
                    
                    {values.insuredPersons[personInfo.personIndex].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[personInfo.personIndex].selectedPlan.compnayName).planTypes.filter(plan => plan.isSelected === true).map((plan, idx) => (
                      <Grid item container key={idx}>
                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                          <Typography className={classes.title2} color="textSecondary" gutterBottom>
                          <img
                          src={Add}
                          alt="Add icon"
                          style={{marginRight:'10px', paddingBottom:'3px'}} 
                          />
                            {(currentLanguage === 'ko' ? (plan.planNameKr? plan.planNameKr: plan.planName) : plan.planName)}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                          {/* Optional Fee */}
                          <Typography className={classes.title2} color="textSecondary" gutterBottom>
                            {amountFormat(plan.calculatedAddOnAmount * (applyType === 'family' ? values.insuredPersons.length: 1) )}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}

                
                    <Grid item container xs={12} style={{color:'#3f51b5', background:'#fff', padding:'1vh', marginTop:'1vh'}}>
                      <Grid item xs={6} sm={4}>
                          <span style={{fontWeight:400, fontSize:'12px', color:'#000000DE'}}>
                            <Text tid={"TravelApplication.YourTotal"}/> : 
                          </span>
                      </Grid>
                      <Grid item xs={6} sm={8} style={{ textAlign:'right', fontWeight:'600', fontSize:'14px' }}>
                          <span>
                            {/* {((values.insuredPersons[personInfo.personIndex].age >= 60 && values.insuredPersons[personInfo.personIndex].selectedPlan.medicalQuestion.answered === true)
                                                                  ||(values.insuredPersons[personInfo.personIndex].age < 60))
                                                                  ? amountFormat(values.insuredPersons[personInfo.personIndex].selectedPlan.calculatedInsuranceAmount, 2)
                                                                  : <ErrorIcon />} */}
                            {amountFormat(
                              values.insuredPersons[personInfo.personIndex]
                                  .optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[personInfo.personIndex].selectedPlan.compnayName)
                                      .planTypes.filter(plan => plan.isSelected === true)
                                        .reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                * (applyType === 'family' ? values.insuredPersons.length: 1)
                            )}
                          </span>
                      </Grid>
                    </Grid>
                </CardContent>
              </Card>
            ) : null}

            </Grid>
          </>
        )}

        <DialogActions>
          <Button 
            style={{ width: '100%' }}
            autoFocus
            onClick={() => {
              setOpenSelectPlan(false)
            }}
            color="dark"
          >
            <Text tid={"TravelApplication.Save"}/>
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}

export default AddOnProduct;