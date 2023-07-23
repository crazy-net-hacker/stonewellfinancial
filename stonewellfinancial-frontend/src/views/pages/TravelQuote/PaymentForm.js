import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as Validation from '../../Validation'
// core components
import {
  Grid, Typography, IconButton
  // RadioGroup, Radio, FormControl, FormControlLabel, Box
} from '@material-ui/core';
// import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
// components
import { Text, LanguageContext } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
import PaymentInfoModal from './PaymentInfoModal';
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
import WindowDimension from '../../../components/common/WindowDimension'
//icon
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Checked from '../../../assets/imgs/icons/checked.svg'
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
//
import { amountFormat } from '../../../controllers/dataFormat'
import { calculatePackageAmount } from '../../../controllers/CalculateValue';
//style
import formStyle from '../../../assets/jss/styles/formStyle';


const useStyles = makeStyles(formStyle)

const carewellService = [
  { name: 'Package', dayValue: 0.6, yearValue: 99, minValue: 79, boundType:['InBound', 'OutBound'] },
  { name: 'Package + Plus', dayValue: 1.4, yearValue: 299, minValue: 199, boundType:['InBound'] }
]

// let carewellServiceAmount = ""

  // validationSchema
  const validationSchema = Yup.object({
    paymentMethod: Validation.validRequiredField(),
    creditCardNumber: Yup.string().when("paymentMethod", 
      { is: (value) => 
              value === 'Creditcard',
              then: Validation.validCreditCardNumber()
      }),
    cardcvv: Yup.string().when("paymentMethod", 
      { is: (value) => 
              value === 'Creditcard',
              // then: Validation.validCardCCV()
              then: Yup.string().when('creditCardType', (creditCardType) => {
                return Yup.string().required("This field is required!")
                      .min(3, 'Enter correct digits number')
                      .test('Card CVV', function(value) {
                        if (!value) {
                          return this.createError({ message: `This field is required!` })
                        }
                        else{
                          // MasterCard Visa - 3 digit number code
                          // AMEX  - 4 digit number code
                          const regEx = /^\d{3}$/;
                          const amxRegEx = /^\d{4}$/;
                          if (creditCardType === 'AmericanExpress' && amxRegEx.test(value.replace(/\s/g, ''))) {
                            return true;
                          }else if ((creditCardType === 'Visa' || creditCardType === 'MasterCard') && regEx.test(value.replace(/\s/g, ''))){
                            return true;
                          }
                          else {
                            return this.createError({ message: `Invalid Secret code` })
                          }
                        }
                      })
              })
      }),
    cardExpired: Yup.string().when("paymentMethod", 
      { is: (value) => 
              value === 'Creditcard',
              then: Validation.validCardEexpirationDate()
      }),
    cardHolderName: Yup.string().when("paymentMethod", 
      { is: (value) => 
              value === 'Creditcard',
              then: Validation.validRequiredField()
      }),
    // billStreetName: Validation.validRequiredField(),
    billStreetName: Yup.string().when("paymentMethod", 
      { is: (value) => 
              value === 'Creditcard',
              then: Validation.validRequiredField()
      }),
    // billProvince: Validation.validRequiredField(),
    billCity: Yup.string().when("paymentMethod", 
    { is: (value) => 
            value === 'Creditcard',
            then: Validation.validRequiredField()
    }),
    billProvince: Yup.string().when("paymentMethod", 
    { is: (value) => 
            value === 'Creditcard',
            then: Validation.validRequiredField()
    }),
    billPostalCode: Yup.string().when("paymentMethod", 
    { is: (value) => 
            value === 'Creditcard',
            then: Yup.string().when("billCountry", 
            { is: (value) => 
                    value === 'CA',
                    then: Validation.validPostalCode(),
                    otherwise: Validation.validRequiredField()
            })
    }),
    billCountry: Yup.string().when("paymentMethod", 
    { is: (value) => 
            value === 'Creditcard',
            then: Validation.validRequiredField()
    }),
    senderName: Yup.string().when("paymentMethod", 
    { is: (value) => 
            value === 'E-transfer',
            then: Validation.validRequiredField()
    }),
  })

  // ValidMessage
  function validMessage(fieldName) {
    return (
        <ErrorMessage
            name={fieldName}
            render={(msg) => 
                <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
                    <Text tid={`Validation.${msg}`}></Text>
                </div>
            }
        />
    );
  }

const PaymentForm = (props) => {
  const { formData, countries } = props;

  const classes = useStyles();

  const [direction, setDirection] = useState('back');

  // Payment information input Modal Form
  const [openPaymentInfo, setOpenPaymentInfo] = useState(false);

  const [errorFlag, setErrorFlag] = useState(false)

    
  var total = 0
  let height = '0px'

  //Mobile design
  // const [width, setWidth] = useState(window.innerWidth);
  // function handleWindowSizeChange() {
  //   setWidth(window.innerWidth);
  // }
  
  // useEffect(() => {
  //   window.addEventListener('resize', handleWindowSizeChange);
  //   return () => {
  //       window.removeEventListener('resize', handleWindowSizeChange);
  //   }
  // }, []);

  const { width } = WindowDimension();

  let isMobile = (width < 768);
    

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
    let url = ''
    if (kind === 'plan'){
      if (insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase())).length > 0){
            url = process.env.REACT_APP_S3_URL + insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))[0].document_url
      }
    } else if (kind === 'carewell') {
      // set carewell brochure url
      if(currentLanguage==='ko'){
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-Korean.pdf'
      }else{
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-English.pdf'
      } 
    } else
    {
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }

  return (
      <>
      <StepHeader height={height} activeStep={4} data={formData} />
      
      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.PaymentInformation'}/>
        <span className={classes.title_question_sub2}><Text tid={'Quote.PaymentInformation.Note'}/></span>
      </Typography>
  
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={values => {
            // console.log(values)
            window.scrollTo(0, 0)
            // direction === 'back' ? prevStep() : nextStep();
            props.updateFormData(values);
            direction === 'back' 
            ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
            : props.history.push(pathDirection(props.location.pathname, values).nextStep);

          }}
        >
          {({ values, setFieldValue, errors }) => (
  
          <Form className={classes.formWrapper}>

            <Grid container spacing={2} justify="center">
              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} justify="center" spacing={1}>

                  {/* Total Premium  */}
                  <div style={{ display: 'none' }}>
                    {total = 0}
                    {values.insuredPersons.map((person, pIndex) => (
                        <div key={pIndex}>
                        {person.selectedPlan.calculatedInsuranceAmount = person.selectedPlan.insuranceAmount
                                + (person.optionalAddOnPlans
                                          .find(plan => plan.compnayName === person.selectedPlan.compnayName)
                                    ? person.optionalAddOnPlans
                                          .find(plan => plan.compnayName === person.selectedPlan.compnayName).planTypes
                                          .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                    :0)
                                + (person.optionalCarewellService.isSelected ? person.optionalCarewellService.packageAmount : 0)
                        }
                        </div>
                      ))
                    }
                    {total = values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium}
                  </div>

                  <Grid item container xs={12} sm={12} md={12} lg={8} xl={8} justify="center" style={{ marginBottom:'5vh', padding:'3vh 0', background:'rgb(240, 248, 255)', position: isMobile ? 'block':'sticky', top: isMobile ? 'auto':'120px', borderBottom:'1px solid #999', zIndex:'999'}}>
                      <Grid item xs={12} className={classes.app_box}>
                        <span className={classes.app_name_box}><Text tid={'Quote.TotalPremium'}/></span>
                      </Grid>
                      <Grid item xs={12} className={classes.app_box}>
                        <span className={classes.app_amount_box}>{amountFormat(total,2)}</span>
                      </Grid>
                  </Grid>
              
              {/* Optional Carewell Service  */}
              <Grid item container xs={12} spacing={1} style={{ margin: '2vh 0 2vh 0' }} justify="center" >
                <span className={classes.titleSmall_sub}>
                  <Text tid={'Quote.AddCarewellServices'}/>
                </span>
              </Grid>

              {/* <Grid item container style={{margin: '0 0 2vh 0' }} justify="center" spacing={1}>
                <Grid item container xs={12} sm={12} md={8} lg={8} 
                      style={{border:'1px solid #efefef', borderRadius:'10px', margin:'10px'}}
                      spacing={1}>

                  <Grid item container xs={12} style={{ background:values.insuredPersons[0].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb', borderRadius:'10px 10px 0 0' }}>
                      <Grid item xs={12} md={12}>
                        <span style={{ color: '#2a2f71', fontSize:'14px', fontWeight:'600' }}>
                            <Text tid={'Quote.AdditionalServices'}/>
                        </span>
                      </Grid>
                  </Grid>

                  <Grid item xs={12} md={7} style={{ fontSize: !isMobile ? '14px' : '12px', fontFamily:'heebo', fontWeight:'300' }}>
                        <Text tid={'Quote.AdditionalServicesAbout'}/>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <div style={{ display: 'none' }}>
                      {values.insuredPersons.map(person => (
                            person.optionalCarewellService.packageAmount 
                              = calculatePackageAmount(carewellService, person.optionalCarewellService.packageName, values.insuredPersons[0].tripPeriod) 
                      ))}
          
                    </div>
                    <FormControl >
                        <RadioGroup
                          aria-label="carewell"
                          name={`insuredPersons.${0}.optionalCarewellService.packageName`}
                          style={{ flexDirection: 'initial' }}
                          value={values.insuredPersons[0].optionalCarewellService.packageName}
                          onChange={(e) => {
                              let carewellServiceAmount = calculatePackageAmount(carewellService, values.insuredPersons[0].optionalCarewellService.packageName, values.insuredPersons[0].tripPeriod)  
                              for (const i in values.insuredPersons) { 
                                values.insuredPersons[i].optionalCarewellService.packageName = e.currentTarget.value
                              values.insuredPersons[i].optionalCarewellService.packageAmount = carewellServiceAmount
                              }
                              setFieldValue(`insuredPersons.${0}.optionalCarewellService.packageAmount`, carewellServiceAmount)
                          }}>
                          {
                            // carewellService.map((carewell) => (
                            carewellService.map((c)=> ({name: c.name, numIncludedType: c.boundType.filter(f => f === values.tripDirection).length}))
                                            .filter( i => i.numIncludedType > 0).map(carewell => ( 
                            <FormControlLabel 
                              key={carewell.name} 
                              style={{ justifyContent: 'flex-start', padding: '0 30px' }}
                              value={carewell.name}
                              control={
                                <Radio
                                  // id ='carewell_select_option'
                                  disableRipple
                                  color="default"
                                  checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                                  icon={<span className={classes.icon} />}
                                  value={carewellService.name}
                                />}
                              label={carewell.name }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                  </Grid> 


                <Grid item container xs={12} style={{ background:values.insuredPersons[0].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>
                  <Grid item xs={12} md={5} className={classes.priceBox} style={{ background:values.insuredPersons[0].optionalCarewellService.isSelected === true ? 'rgb(240, 245, 255)' : '#f8fafb' }}>
                    <div style={{fontStyle:'italic', fontSize:'12px', color:'#1c1c1c', marginTop:'1.5vh'}}>
                      <Text tid={'Quote.IncludeTax'}/>
                    </div>
                  </Grid>
                  
                  <Grid item xs={12} md={7} >
                    <Typography variant="body2" className={classes.priceOpt}>
                      {amountFormat(values.insuredPersons.map(i=> i.optionalCarewellService.packageAmount).reduce(function(a, b){ return a + b; }), 2)}
                    </Typography>
                    <Typography className={classes.subDescriptionOpt}>
                      <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[0].tripPeriod} <Text tid={'Quote.Days'}/> /  {values.insuredPersons.length} applicants
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={12}>
                    <Box textAlign='right'>
                      <Button
                        name={`insuredPersons.${0}.selectedCarewellService.isSelected`}
                        color={values.insuredPersons[0].optionalCarewellService.isSelected ? 'secondary' : 'dark'}
                        className={classes.next_button}
                        onClick={() => {
                          let carewellServiceAmount = calculatePackageAmount(carewellService, values.insuredPersons[0].optionalCarewellService.packageName, values.insuredPersons[0].tripPeriod)  
                              for (const i in values.insuredPersons) { 
                                values.insuredPersons[i].optionalCarewellService.packageName = carewellService.name
                              values.insuredPersons[i].optionalCarewellService.packageAmount = carewellServiceAmount
                              }
                              setFieldValue(`insuredPersons.${0}.optionalCarewellService.packageAmount`, carewellServiceAmount)

                          const val = !values.insuredPersons[0].optionalCarewellService.isSelected
                          for (const i in values.insuredPersons) { 
                            values.insuredPersons[i].optionalCarewellService.isSelected = val
                          }
                          setFieldValue(`values.insuredPersons.${0}.optionalCarewellService.packageName`, carewellService.name)
                        }}
                      >
                        {values.insuredPersons[0].optionalCarewellService.isSelected ?  (
                          <>
                          <img
                              src={Checked}
                              alt="Selected mark"
                              style={{marginRight:'15px', paddingBottom:'3px'}} 
                            /> 
                            <span><Text tid={'Quote.Added'}/></span>
                          </>
                        ) 
                        : (
                          <span><Text tid={'Quote.Add'}/></span>
                        ) }
                      </Button>

                    </Box>
                  </Grid>
                </Grid>

                </Grid>
              </Grid> */}

              <Grid container spacing={2} justify="center" style={{marginTop:'2vh'}} >
                {carewellService.map((c)=> ({name: c.name, numIncludedType: c.boundType.filter(f => f === values.tripDirection).length}))
                                            .filter( i => i.numIncludedType > 0).map(carewell => (
                  <React.Fragment key={carewell.name}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Button
                        color={values.insuredPersons[0].optionalCarewellService.packageName === carewell.name && values.insuredPersons[0].optionalCarewellService.isSelected ? 'primary' : "secondary"}
                        className={classes.button}
                        style={{padding:'3vh', width:'100%', margin:'1vh 0 0 0', height:'22vh'}}
                        onClick={() => {
                          let prviousPackageName = values.insuredPersons[0].optionalCarewellService.isSelected=== false? '': values.insuredPersons[0].optionalCarewellService.packageName
                          if (prviousPackageName === carewell.name){
                              for (const i in values.insuredPersons) { 
                                        values.insuredPersons[i].optionalCarewellService.isSelected = false
                                        values.insuredPersons[i].optionalCarewellService.packageName = ''
                                        values.insuredPersons[i].optionalCarewellService.packageAmount = 0
                                      }
                          }else{
                              for (const i in values.insuredPersons) { 
                                values.insuredPersons[i].optionalCarewellService.isSelected = true
                                values.insuredPersons[i].optionalCarewellService.packageName = carewell.name
                                values.insuredPersons[i].optionalCarewellService.packageAmount = calculatePackageAmount(carewellService, carewell.name, values.insuredPersons[i].tripPeriod)
                              }
                          }
                          setFieldValue(`values.insuredPersons.${0}.optionalCarewellService.packageName`, carewellService.name)
                        }}
                    >
                        <div>
                          {values.insuredPersons[0].optionalCarewellService.isSelected &&
                            values.insuredPersons[0].optionalCarewellService.packageName === carewell.name
                            ? (<img
                                      src={Checked}
                                  alt="Selected mark"
                                  style={{marginRight:'15px', paddingBottom:'3px'}} 
                                />) 
                            : null }
                          {carewell.name}
                          <Typography style={{marginTop:'1vh', fontSize:'28px', fontWeight:'600', color:values.insuredPersons[0].optionalCarewellService.isSelected && values.insuredPersons[0].optionalCarewellService.packageName === carewell.name ?'#eee':'#666'}}>
                            {amountFormat((calculatePackageAmount(carewellService, carewell.name, values.insuredPersons[0].tripPeriod) * values.insuredPersons.length), 2)}
                          </Typography>
                          <Typography style={{marginTop:'1vh', fontSize:'14px', color: values.insuredPersons[0].optionalCarewellService.isSelected && values.insuredPersons[0].optionalCarewellService.packageName === carewell.name ?'#eee':'#666'}}>
                            <Text tid={carewell.name==='Package'?'Quote.CarewellPackage.Description':'Quote.CarewellPackagePlus.Description'}/>
                          </Typography>
                        </div>
                      </Button>
                      <IconButton aria-label="view" color="primary" style={{ borderRadius:'0', width:'100%', marginTop:'1vh', background:'rgb(240, 248, 255)'}}
                          onClick={() => handleOpenPDFViewer('carewell',values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName=== values.familyGroup.selectedCompnayName)[0])}
                      >
                        <DescriptionIcon />
                        <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                            <Text tid={'Quote.SeeMoreBenefit'}/>            
                        </Typography>
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>

              {/* Payment Type */}
              <Grid item container xs={12} spacing={1} style={{ marginTop: '10vh' }} justify="center" >
                  {/* <Grid  item container xs={12} sm={12} spacing={1} >   */}
                      <span className={classes.titleSmall_sub} style={{ marginBottom:'0'}}>
                        <Text tid={'Quote.SelectPaymentType'}/>
                      </span>
                  {/* </Grid> */}
              </Grid>

              <Grid container spacing={2} justify="center" style={{marginTop:'2vh'}} >

                  <Grid  item xs={12} sm={6} md={4} style={{marginTop:'2vh'}} >  
                      <Button
                        color={values.paymentMethod === 'Creditcard' ? 'primary' : "secondary"} 
                        style={{ padding:'3vh' }}
                        className={classes.paymentBtn}
                        onClick={() => {
                          setFieldValue('paymentMethod','Creditcard')
                          setOpenPaymentInfo(true)
                        }}
                      >
                        <div>
                          <CreditCardIcon style={{ width:'50px', height:'50px' }} />
                          <Typography style={{ color:values.paymentMethod === 'Creditcard' ?'#eee':'#666' }}>
                            <Text tid={'Quote.CreditCard'}/>
                          </Typography>
                        </div>
                      </Button>
                  </Grid>

                  <Grid  item xs={12} sm={6} md={4} style={{marginTop:'2vh'}}>  
                      <Button
                        color={values.paymentMethod === 'E-transfer' ? 'primary' : "secondary"} 
                        style={{ padding:'3vh' }}
                        className={classes.paymentBtn}
                        onClick={() => {
                          setFieldValue('paymentMethod','E-transfer')
                          setOpenPaymentInfo(true)
                          
                        }}
                      >
                        <div>
                          <LocalAtmIcon style={{ width:'50px', height:'50px' }} />
                          <Typography style={{ color:values.paymentMethod === 'E-transfer' ?'#eee':'#666' }}>
                            <Text tid={'Quote.E-transfer'}/>
                          </Typography>
                        </div>
                      </Button>
                  </Grid>
                  {validMessage('paymentMethod')}

              </Grid>
              
            {errorFlag === true&&
              <Grid item container spacing={1} justify="center" style={{marginTop:'3vh'}}>
                    <Alert
                        severity='error'
                        onClose={() => setErrorFlag(false)}
                    > 
                        {values.paymentMethod === 'Creditcard' 
                          ? <Text tid={'Quote.CreditCard'}/>
                          : <Text tid={'Quote.E-transfer'}/>
                        } {' - '}
                        <Text tid={'Quote.Error.CompleteInformation'}/>
                    </Alert>
              </Grid>
            }


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
                <Button 
                  type='submit' 
                  color="dark" 
                  className={classes.next_button} 
                  onClick={() => {
                    if (errors&&!!errors){
                      setErrorFlag(true)
                    } 
                    setTimeout(() => {
                      setErrorFlag(false)
                    }, 3000);
                    setDirection('forward')
                  }}
                >
                  {/* <Text tid={'Button.Review'}/> */}
                  <Text tid={'Button.Next'}/>
                </Button>
              </Grid>
            </Grid>


            {openPaymentInfo === true && total > 0 &&
              <PaymentInfoModal
                payableAmount ={total}
                values={values}
                countries={countries}
                open={openPaymentInfo}
                handleClose={setOpenPaymentInfo}
              />
            }

            {/* PDF Viewer Modal  */}
            {openPDFViewer === true &&
              <PDFViewer
                title={pdfOption.title}
                pdf={pdfOption.brochures_url} 
                openPDFViewer={openPDFViewer}
                setOpenPDFViewer={setOpenPDFViewer}
              />
            }

          </Form>
  
          )}
          
        </Formik>

          
  
      </>
      
  );
  
};

// ProtoTypes
PaymentForm.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default PaymentForm;