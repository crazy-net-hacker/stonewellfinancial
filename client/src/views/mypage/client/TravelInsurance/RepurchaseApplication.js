import React, { useEffect, useState } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getInsuranceByType } from '../../../../redux/actions/insurancePlans';
import { getCountry } from '../../../../redux/actions/countries';
import { getProvince } from '../../../../redux/actions/countries';
import { getMedicalQuestion } from '../../../../redux/actions/medicalQuestions';
//Formik
import { Formik, Form, ErrorMessage } from 'formik'
//validation
import * as Yup from 'yup'
import * as Validation from '../../../Validation'

//core components
import { Grid } from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { MdClose } from 'react-icons/md'
import { IconButton, Dialog, DialogContent, Typography } from "@material-ui/core";
// common components
import Button from '../../../../components/common/CustomButtons/Button'
import { Text } from '../../../../components/common/LanguageProvider'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

// controllers
import OptimizedPlan from '../../../../controllers/TravelQuote/Optimizedplan'
import AddOnPlan from '../../../../controllers/TravelQuote/AddOnPlan'
import { calculateInsuranceAmount } from '../../../../functionalities/CalculateInsurance';
//
import TripPeriod from '../../../pages/TravelApplication/TripPeriod'
import Applicants from '../../../pages/TravelApplication/Applicants'
import Product from '../../../pages/TravelApplication/Product'
import AdditionalInfo from '../../../pages/TravelApplication/AdditionalInfo'
import Payment from '../../../pages/TravelApplication/Payment'
import Review from '../../../pages/TravelApplication/Review'
import SubmitResult from '../../../pages/TravelApplication/SubmitResult';
//logos
import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle'
//setup form style
const useStyles = makeStyles(formStyle)

const current = new Date()

const companyName = [
    {name:'allianz', value:'Allianz'},
    {name:'tugo', value:'Tugo'},
    {name:'gms', value:'GMS'},
    {name:'bluecross', value:'BlueCross'},
]

// valication Schema
const validationSchema = Yup.object(
    {
        tripStartDate: Validation.validRequiredDateField().nullable()
            .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
        tripEndDate: Validation.validRequiredDateField().nullable()
            .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
        tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365'),
        tripArrivalDate: Yup.date().when("insuranceType", 
        { is: (value) => 
                value !== 'STUDENT',
                then: Validation.validRequiredDateField(),
                otherwise: Yup.date().nullable()
        }),
        multiTripDays: Yup.number().when("tripType", 
        { is: (value) => 
                value === 'MULTI',
                then: Validation.validRequiredNumberMin1Field()
                    .max(125, "Multi Trip days must be less than 125")
        }),
        originCountry: Yup.string().when("insuranceType", 
        { is: (value) => 
                value !== 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        originProvince: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        destCountry: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Validation.validRequiredField()
        }),
        destProvince: Yup.string().when("insuranceType", 
        { is: (value) => 
                value === 'CANADIAN',
                then: Yup.string().when("destCountry", 
                        { is: (value) => 
                                value === 'US',
                                then: Validation.validRequiredField()
                        }),
        }),
        eligilbeAgrement : Validation.validRequiredField().nullable(),
        contactPhone: Validation.validPhoneNumber(),
        contactEmail: Validation.validEmail(),
        maillingInCanada: Validation.validRequiredField(),
        mailStreetName:  Validation.validRequiredField(),
        mailCity:  Validation.validRequiredField(),
        mailPostalCode:  Validation.validPostalCode(),
        mailProvince:  Validation.validRequiredField(),
        mailCountry:  Validation.validRequiredField(),
        insuredNumber: Yup.number().when("insuredGroupType", 
        { is: (value) => 
                value === 'Individual',
                then: Validation.validRequiredNumberField(),
                otherwise: Yup.number().min(3,'MinimunNumberShouldBeAtLeast3').required('FieldIsRequired')
                // otherwise: Validation.validRequiredNumberField()
                // .min(3, 'Maximun days must be 365 !')
        }),
        insuredPersons: Yup.array().of(
            Yup.object().shape({
                lastName: Validation.validRequiredField(),
                firstName: Validation.validRequiredField(),
                gender: Validation.validRequiredField(),
                birthDate: Validation.validRequiredBrithDateField(),
                relationship: Validation.validRequiredField(),
                beneficiaryName: Validation.validRequiredField(),
                beneficiaryRelationship: Validation.validRequiredField(),
                // tripStartDate: Validation.validRequiredDateField().nullable()
                //         .min(new Date(current.setDate(current.getDate() - 1)), 'Start date must be grater than today'),
                // tripEndDate: Validation.validRequiredDateField().nullable()
                //             .min(Yup.ref("tripStartDate"), "Expiry date must be grater than effective date"),
                // tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'Maximun days must be 365 !'),
                // areEligible: Validation.validRequiredField(),
                physicalCard: Validation.validRequiredField().nullable(),
            })
        ),
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
                    return Yup.string().required("FieldIsRequired")
                        .min(3, 'Enter correct digits number')
                        .test('Card CVV', function(value) {
                            if (!value) {
                            return this.createError({ message: `FieldIsRequired` })
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
                                return this.createError({ message: `InvalidSecretCode` })
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
        //billing address
        billStreetName: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billCity: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billProvince:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        billPostalCode:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Yup.string().when("billCountry", 
                      { is: (value) => 
                              value === 'CA',
                              then: Validation.validPostalCode(),
                              otherwise: Validation.validRequiredField()
                      }),
        }),
        billCountry:  Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'Creditcard',
                then: Validation.validRequiredField()
        }),
        senderName: Yup.string().when("paymentMethod", 
        { is: (value) => 
                value === 'E-transfer',
                then: Validation.validRequiredField()
        })
    }
)

// ValidMessage
function validMessage(fieldName) {
    return (
        <ErrorMessage
        name={fieldName}
        render={(msg) => (
            <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
              <Text tid={`Validation.${msg}`}></Text>
            </div>
        )}
        />
    )
}


function getSteps() {
  return ['Quote.Tripinfo', 'Applicants', 'Quote.Product', 'Quote.Contact', 'Quote.Payment', 'Quote.ReviewApplication'];
}

function getStepContent(step, 
                        values, 
                        handleChange, 
                        handleBlur,
                        setFieldValue, 
                        setFieldTouched, 
                        errors, 
                        countries, 
                        provinces, 
                        insurances, 
                        questions) {
  switch (step) {
    case 0:
      return (
              <TripPeriod
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                validMessage={validMessage}
                countries={countries}
                provinces={provinces}
              />
            );
    case 1: 
      return (
              <Applicants
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors = {errors}
                  validMessage={validMessage}
              />
            );
    case 2: 
      return ( 
              <Product
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  errors = {errors}
                  validMessage={validMessage}
                  insurances ={insurances}
                  questions={questions}
              />
            );            
    case 3: 
      if (values.eligilbeAgrement === true){
        return ( 
                <AdditionalInfo 
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    validMessage={validMessage}
                    provinces={provinces}
                />
        );  
      } else{
        return null
      }
    case 4:
      if (values.eligilbeAgrement === true){
        return (
                <Payment 
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  validMessage={validMessage}
                  countries={countries}
                />
              );  
        } else{
          return null
        }
      case 5:
      if (values.eligilbeAgrement === true){
        return ( 
              <Review 
                values={values}
              />
        );  
      } else{
        return null
      }
  default:
      return '';
  }
}

export default function RepurchaseApplication({ renewData, insuraceCompany, insuraceType, applyType, width, isMobile, open, handleClose }) {

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  insuraceCompany = companyName.filter(f=>f.name === insuraceCompany).map(i=>i.value)[0]
  insuraceType = insuraceType.toUpperCase()

  const dispatch = useDispatch();
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)
  const insurances = useSelector(state => state.insurancePlanReducer.insurances)
  const questions = useSelector(state => state.medicalQuestionReducer.questions)

  // useEffect
  useEffect(()=>{
      dispatch(getCountry())
      dispatch(getProvince())
      dispatch(getInsuranceByType(insuraceType)) 
      dispatch(getMedicalQuestion())
  }, [dispatch,insuraceType]);

  // initail data
  // const [formData, setFormData] = useState(travelQuoteInit());
  const [formData, setFormData] = useState(renewData);


  formData.insuredGroupType = applyType.charAt(0).toUpperCase() + applyType.slice(1).toLowerCase()

  formData.tripType = 'SINGLE'
  formData.insuredNumber = 1
  formData.insuredPersons.map(i=>i.eligilbeIns = insuraceType)
  formData.sameMailAddress = false
  if (insuraceType === 'CANADIAN')
  {
      formData.originCountry = 'CA' ;
      formData.originCountryName = 'Canada'  
      formData.tripDirection = 'OutBound'   
  }else{
      formData.destCountry = 'CA'
      formData.destCountryName = 'Canada'
      formData.tripDirection = 'InBound'
  }
  formData.vendorCode = 'M'

  const [submitted, setSubmitted] = useState(false);
      
  // validate by step
  function IsStepValidated(values, setFieldTouched, errors) {
    let result = false

    if (activeStep === 0){
      
      // Step - Trip period
      if (values.tripPeriod > 0 && !errors.tripStartDate && !errors.tripEndDate && !errors.tripPeriod &&
        !errors.tripArrivalDate && !errors.originCountry && !errors.originProvince && !errors.destProvince &&
        !errors.tripType && !errors.multiTripDays){
          result = true
      }else{
        setFieldTouched(`tripStartDate`)
        setFieldTouched(`tripEndDate`)
        setFieldTouched(`tripPeriod`)
        setFieldTouched(`tripArrivalDate`)
        setFieldTouched(`originCountry`)
        setFieldTouched(`originProvince`)
        setFieldTouched(`destCountry`)
        setFieldTouched(`destProvince`)
        setFieldTouched(`tripType`)
        setFieldTouched(`multiTripDays`)
      }
    } else if (activeStep === 1){
      // Step - Applicants
      setFieldTouched(`eligilbeAgrement`)
      
      if (values.eligilbeAgrement === true){
          if (values.insuredPersons
                .filter(i=> i.birthDate && i.ageDays > 14 && i.relationship && i.firstName && i.lastName && i.gender &&
                            i.beneficiaryName && i.beneficiaryRelationship).length ===  values.insuredPersons.length
              ) { 
                  result = true
                  OptimizedPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type === 'MED' && ins.compnay_name === values.application.applicationCompany) })
                  AddOnPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type !== 'MED' && ins.compnay_name === values.application.applicationCompany) })
                  calculateInsuranceAmount(values)
                  //set selectedPlan
                  for (const i in values.insuredPersons) { 
                      values.insuredPersons[i].selectedPlan = values.insuredPersons[i].insurancePlans[0]
                      if(values.insuredPersons[i].insurancePlans.length > 0 && values.insuredPersons[i].insurancePlans[0].coverages.length > 0){   
                        values.insuredPersons[i].selectedPlan.selectedPlanName = values.insuredPersons[i].insurancePlans[0].coverages[0].generic_name     
                        values.insuredPersons[i].selectedPlan.selectedPlanNameKr = values.insuredPersons[i].insurancePlans[0].coverages[0].generic_name_kr     
                        values.insuredPersons[i].selectedPlan.tripType = values.insuredPersons[i].insurancePlans[0].coverages[0].tripType 
                      }
                    }
          } else {
            for (const i in values.insuredPersons) {
                setFieldTouched(`insuredPersons.${i}.firstName`)
                setFieldTouched(`insuredPersons.${i}.lastName`)
                setFieldTouched(`insuredPersons.${i}.gender`)
                setFieldTouched(`insuredPersons.${i}.birthDate`)
                setFieldTouched(`insuredPersons.${i}.ageDays`)
                setFieldTouched(`insuredPersons.${i}.relationship`)
                setFieldTouched(`insuredPersons.${i}.beneficiaryName`)
                setFieldTouched(`insuredPersons.${i}.beneficiaryRelationship`)
              }
            document.getElementById("isInsuredPersonVaild").click()
          }
      }
    } else if (activeStep === 2){
      // Step - Product
      if (values.eligilbeAgrement === true){
          if (values.insuredPersons
                .filter(i=> i.selectedPlan &&
                            (i.age > 59 
                              ? (i.selectedPlan.medicalQuestion.answered
                                  ? i.selectedPlan.medicalQuestion.chargeRate !== '0'? true: false
                                  : i.selectedPlan.medicalQuestion.answered) 
                              : true) === true).length ===  values.insuredPersons.length) {
                result = true
          } 
          else {
            document.getElementById("isInsuredPersonPlanVaild").click()
            document.getElementById("isInsuredPersonMedicalVaild").click()
          }
      }
    } else if (activeStep === 3){
      // Step - Contact
      setFieldTouched(`contactEmail`)
      setFieldTouched(`contactPhone`)
      setFieldTouched(`maillingInCanada`)
      setFieldTouched(`mailStreetName`)
      setFieldTouched(`mailCity`)
      setFieldTouched(`mailProvince`)
      setFieldTouched(`mailPostalCode`)
      if (!errors.contactEmail && !errors.contactPhone && 
          !errors.mailPostalCode && !errors.mailCity && !errors.mailProvince && !errors.mailPostalCode ){
          result = true
      }
    } else if (activeStep === 4){
       // Step - Payment
      if (!errors.paymentMethod && !errors.senderName && 
          !errors.cardHolderName && !errors.creditCardNumber && !errors.cardcvv && !errors.cardExpired &&
          !errors.billPostalCode && !errors.billCity && !errors.billProvince && !errors.billPostalCode){
          result = true
      }else{
        setFieldTouched(`paymentMethod`)
        setFieldTouched(`senderName`)
        setFieldTouched(`cardHolderName`)
        setFieldTouched(`creditCardNumber`)
        setFieldTouched(`cardcvv`)
        setFieldTouched(`cardExpired`)
        setFieldTouched(`billStreetName`)
        setFieldTouched(`billCity`)
        setFieldTouched(`billProvince`)
        setFieldTouched(`billPostalCode`)
      }  
    } 

    return result
  }



  if (submitted === false) {
    return (
      
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={values => {
              // console.log('values',values)
              setFormData(values);              
              setSubmitted(true);
          }} 
        >
          {({ values, handleChange, handleBlur, setFieldValue, setTouched, setFieldTouched, touched, errors}) => (
             <Dialog 
              fullScreen
              open={open} 
              onClose={() => handleClose(false)}
             >
             <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
               <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
                 {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
                 Repurchase Modal
               </Typography>
               <IconButton
                 aria-label="close"
                 className={classes.closeButton}
                 onClick={() => {handleClose(false)}}
               >
                 <MdClose />
               </IconButton>
             </MuiDialogTitle>

             <DialogContent>
            <Form  style={{ margin: '2vh'}}>
                {/* {console.log('errors', errors)} */}

                {/* Form title - mobile */}
                { isMobile ? (
                    <>
                        <div style={{ position: 'fixed', top:'50px', left:'0', textAlign:'center', padding:'1.5vh', background:"#2a2f71", width:'100%', fontWeight:'500', zIndex:'1000', color:'#fff', }}>
                            {`${values.application.applicationCompany} ${values.application.applicationType.charAt(0).toUpperCase() + values.application.applicationType.slice(1).toLowerCase()}  Plan Application `}
                        </div>
                        <div style={{ paddingTop:'5vh', textAlign:'center' }}>
                            {/* All information is secure      */}
                        </div>
                    </>
                ) : null}


                <Grid container direction='column' spacing={4}>
                    <Grid item xs={12} style={{textAlign:'center', fontWeight:400, fontSize:'1.6em', marginBottom:'1vh', borderBottom:'1px solid #f3f3f3', display: !isMobile ? 'block' : 'none'}}>
                        <img
                        src={values.application.applicationCompany === 'Tugo' 
                                ? tugoLogo : values.application.applicationCompany === 'Allianz' 
                                ? allianzLogo : values.application.applicationCompany === 'BlueCross'
                                    ? blueCrossLogo : null}
                        alt='logo'
                        style={{width: values.application.applicationCompany === 'Allianz' ? '110px' : values.application.applicationCompany ==='Tugo' ? '120px' : 'auto', height: values.application.applicationCompany ==='BlueCross' ? '70px' : 'auto', padding:'1vh'}}
                        />
                        <span>
                            {`${values.application.applicationType.charAt(0).toUpperCase() + values.application.applicationType.slice(1).toLowerCase()}  Plan Application `}
                        </span>
                    </Grid>
                  
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((label, index) => (
                        <Step key={label}>
                          {/* <StepLabel>{label}</StepLabel> */}
                          <StepLabel><Text tid={label}/></StepLabel>
                          <StepContent>
                            {getStepContent(
                              index, 
                              values, 
                              handleChange, 
                              handleBlur,
                              setFieldValue, 
                              setFieldTouched, 
                              errors, 
                              countries, 
                              provinces, 
                              insurances, 
                              questions
                            )}
                            
                            <Grid container style={{ margin: '4vh 0 1vh 0', marginLeft: width > 1400 ? '22vh' : '0' }} spacing={1}>
                                {activeStep !== 0 &&
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  <Button 
                                    color="secondary" 
                                    className={classes.back_button} 
                                    onClick={handleBack}
                                  >
                                    <Text tid={'Button.Previous'}/>
                                  </Button>
                                  </Grid>
                                }
                                <Grid item xs={6} sm={6} md={3} lg={3}>
                                  {activeStep < 5 &&
                                    <Button 
                                      color="dark" 
                                      className={classes.next_button}
                                      disabled = {(activeStep <= 1 || (activeStep > 1 && values.eligilbeAgrement))?false:true}
                                      onClick={()=>{
                                        if(IsStepValidated(values, setFieldTouched, errors) === true){
                                            handleNext() }

                                      }}
                                    >
                                      <Text tid={'Button.Next'}/>
                                    </Button>
                                  }
                                  {activeStep === 5 &&
                                    <Button 
                                      type='submit' 
                                      color="dark" 
                                      className={classes.next_button} 
                                      // onClick={console.log(formData)}
                                    >
                                      <Text tid={'Button.Apply'}/>
                                    </Button>
                                  }
                                </Grid>
                            
                            </Grid>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                
                </Grid>

              </Form>
              </DialogContent>

</Dialog>
          )}
        </Formik>

    );
  } else {
    return( 
        <SubmitResult
            formData={formData}
        />   
    )

  }
}