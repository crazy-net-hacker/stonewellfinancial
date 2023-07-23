import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
import { Grid, Card, CardContent, Typography, makeStyles, 
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
// components
import { Text } from '../../../../components/common/LanguageProvider'
import Button from '../../../../components/common/CustomButtons/Button'
import TooltipInfo from '../../../../components/common/TooltipInfo';

//
import { dateFormat, amountFormat } from '../../../../controllers/dataFormat'
// payment componet modal
import PaymentInfoModal from './PaymentInfoModal'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckIcon from '@mui/icons-material/Check';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)

  // validationSchema
  const validationSchema = Yup.object({
    paymentMethod: Validation.validRequiredField(),
    creditCardNumber: Yup.string().when(["paymentByClient","paymentMethod"], 
      { is: (v_paymentByClient, v_paymentMethod) => 
              v_paymentByClient === false && v_paymentMethod === 'Creditcard',
        then: Validation.validCreditCardNumber()
      }),
    cardcvv: Yup.string().when(["paymentByClient","paymentMethod"], 
      { is: (v_paymentByClient, v_paymentMethod) => 
              v_paymentByClient === false && v_paymentMethod === 'Creditcard',
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
    cardExpired: Yup.string().when(["paymentByClient","paymentMethod"], 
      { is: (v_paymentByClient, v_paymentMethod) => 
              v_paymentByClient === false && v_paymentMethod === 'Creditcard',
        then: Validation.validCardEexpirationDate()
      }),
    cardHolderName: Yup.string().when(["paymentByClient","paymentMethod"], 
      { is: (v_paymentByClient, v_paymentMethod) => 
              v_paymentByClient === false && v_paymentMethod === 'Creditcard',
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
        render={(msg) => (
          <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>{msg}</div>
        )}
      />
    )
  }

// const Summary = ({ formData, setFormData, prevStep, countries, setSubmitted }) => {
  const Summary = ({ formData, setFormData, prevStep, setSubmitted }) => {

  const classes = useStyles()

  const [direction, setDirection] = useState('back')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [errorFlag, setErrorFlag] = useState(false)
  const [submitType, setSubmitType] = useState('')

  var totalInsuranceAmount = 0

  // Responsive Design
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
    
  // let isMobile = (width < 769);

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          values.submitType = submitType
          setFormData(values)
          // direction === 'back' ? prevStep() : nextStep()
          direction === 'back' ? prevStep() : handleSubmit()
        }}
      >
        {({ values, handleChange, setFieldValue, errors }) => (
          <Form>
            {values && (
              <Grid container spacing={3}>
                {/* Main Section*/}
                <Grid container item sm={12} md={12} lg={8}>
                  <Grid item xs={12} sm={12}>
                    <Card>
                      <Grid item xs={12} className={classes.applicant} >
                          <span><Text tid={'Vendor.Step4.Title'}/></span>
                      </Grid>
                      <CardContent>

                        {/* Applicants Information Section*/}
                        <Grid container spacing={3}>
                          <Grid item sm={12} md={12}>
                            <Grid container item>
                              <Grid item>
                                <Typography variant="h5" className={classes.summary_title}>
                                  <PersonIcon/><Text tid={'Vendor.Step4.ApplicantDetail'}/>
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Applicant Detail Table */}
                            <TableContainer >
                              <Table size="small" aria-label="a dense table">
                                <TableHead>
                                  <TableRow>
                                    {/* <TableCell className={classes.cell_applicant_left}></TableCell> */}
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.BirthDate'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Gender'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.HomeCountryOfResidence'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Beneficiary'}/></TableCell>
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
                                          <div className={classes.tripLength}>{insuredPerson.relationship}</div>
                                        </TableCell>

                                        {/* Date of Birth / Age */}
                                        <TableCell>
                                          {dateFormat(insuredPerson.birthDate)}
                                          <div className={classes.tripLength}>{insuredPerson.age} yrs</div>
                                        </TableCell>

                                        {/* Gender */}
                                        <TableCell>{insuredPerson.gender}</TableCell>
                                        
                                        {/* Country of origin */}
                                        <TableCell>{values.originCountryName}</TableCell>
                                        
                                        {/* Beneficiary Name / Beneficiary Relationship*/}
                                        <TableCell>
                                          {insuredPerson.beneficiaryName}
                                          <div className={classes.tripLength}>{insuredPerson.beneficiaryRelationship}</div>
                                        </TableCell>

                                      </TableRow>
                                    
                                    )):null}
                                </TableBody>
                              </Table>
                            </TableContainer>   

                            {/* insurance detail table */}
                            <Grid item container >
                              <Grid item>
                                <Typography variant="h5" className={classes.summary_title}>
                                  <FlightIcon/><Text tid={'Vendor.Step4.InsuranceSelection'}/>
                                </Typography>
                              </Grid>
                            </Grid>
                            <TableContainer >
                              <Table size="small" aria-label="a dense table">
                                <TableHead>
                                  <TableRow>
                                
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.SelectedPlan'}/></TableCell>
                                    {values.insuredGroupType!=='Group' 
                                      ? <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.TripArrivalDate'}/></TableCell>
                                      : null 
                                    }
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.CoveredPeriod'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Premium'}/></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {values.familyGroup.isSelected !== true 
                                    ?
                                      (values.insuredPersons && values.insuredPersons.length > 0
                                          ? values.insuredPersons.map((insuredPerson, index) => (
                                            <TableRow key={index} >
                                              {/* Fiull Name */}
                                              <TableCell>{insuredPerson.lastName}, {insuredPerson.firstName}</TableCell>

                                              {/* Company / Product / Sum insured / Deductible */}
                                              <TableCell>
                                                {insuredPerson.selectedPlan.compnayName} {insuredPerson.selectedPlan.selectedPlanName}
                                                <div className={classes.tripLength}><Text tid={'Quote.SumInsured'}/> {amountFormat(insuredPerson.selectedPlan.selectedCoverage, 0)}</div>
                                                <div className={classes.tripLength}><Text tid={'Quote.Deductible'}/> {amountFormat(insuredPerson.selectedPlan.selectedDeduct,0)}</div>
                                              </TableCell>

                                              {/* Arrival Date */}
                                              <TableCell>
                                                {values.insuredGroupType !=='Group' ? dateFormat(insuredPerson.arrivalDate) : null}
                                              </TableCell>
                                              
                                              {/* Covered Period*/}
                                              <TableCell>
                                                {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                                <div className={classes.tripLength}>{insuredPerson.tripPeriod} <Text tid={'Quote.Days'}/></div>
                                              </TableCell>

                                              {/* Total Premium*/}
                                              <TableCell>{amountFormat(insuredPerson.selectedPlan.insuranceAmount,2)}</TableCell>
                                              
                                            </TableRow>
                                          
                                            ))
                                          : null
                                      )
                                    :
                                      <TableRow>
                                        {/* Full Name */}
                                        <TableCell>
                                          {values.insuredPersons && values.insuredPersons.length > 0 &&
                                            values.insuredPersons.map((insuredPerson,pIndex) => (
                                              <div key={pIndex}>
                                                {insuredPerson.lastName}, {insuredPerson.firstName}</div>
                                          ))}
                                        </TableCell>

                                        {/* Company / Product / Sum insured / Deductible */}
                                        <TableCell>
                                          {values.insuredPersons[0].selectedPlan.compnayName} {values.insuredPersons[0].selectedPlan.selectedPlanName} {values.insuredGroupType}
                                          <div className={classes.tripLength}><Text tid={'Quote.SumInsured'}/> {amountFormat(values.insuredPersons[0].selectedPlan.selectedCoverage, 0)}</div>
                                          <div className={classes.tripLength}><Text tid={'Quote.Deductible'}/> {amountFormat(values.insuredPersons[0].selectedPlan.selectedDeduct,0)}</div>
                                        </TableCell>

                                        <TableCell>
                                          {values.insuredGroupType !=='Group' 
                                            ? dateFormat(values.insuredPersons[0].arrivalDate)
                                            : null}  
                                        </TableCell>
                                        
                                        {/* Covered Period*/}
                                        <TableCell>
                                          {dateFormat(values.insuredPersons[0].tripStartDate)} ~ {dateFormat(values.insuredPersons[0].tripEndDate)}
                                          <div className={classes.tripLength}>{values.insuredPersons[0].tripPeriod} <Text tid={'Quote.Days'}/></div>
                                        </TableCell>

                                        {/* Total Premium*/}
                                        <TableCell>{amountFormat(values.familyGroup.familyPremium,2)}</TableCell>

                                      </TableRow>
                                  }
                                </TableBody>
                              </Table>
                            </TableContainer>

                            {/* Physical Card Fee */}
                            <Grid item container >
                              <Grid item>
                                <Typography variant="h5" className={classes.summary_title}>
                                  <CreditCardIcon/> <Text tid={'TravelApplication.PhysicalCardFee'}/>
                                  <TooltipInfo info={<Text tid={'TravelApplication.PhysicalCardFee.Free'}/>} placement="right-end" color="primary"></TooltipInfo>
                                </Typography>
                              </Grid>
                            </Grid>
                            <TableContainer >
                              <Table size="small" aria-label="a dense table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.WhetherInsuranceCard'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.ShippingDate'}/></TableCell>
                                    <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.Fee'}/></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {values.insuredPersons && values.insuredPersons.length > 0 &&
                                    values.insuredPersons.map((insuredPerson, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{insuredPerson.lastName}, {insuredPerson.firstName}</TableCell>
                                          <TableCell>{insuredPerson.physicalCard === true ? 'Yes' : 'No'}</TableCell>
                                          <TableCell>{dateFormat(insuredPerson.deliverDateInsuranceCard)}</TableCell>
                                          <TableCell>{amountFormat(insuredPerson.physicalCardFee,2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>

                            {/* Optional Plan detail table */}
                            <Grid item container >
                              <Grid item>
                                <Typography variant="h5" className={classes.summary_title}>
                                  <AddCircleIcon/> <Text tid={'Vendor.Step4.OptionalSelection'}/>
                                </Typography>
                              </Grid>
                            </Grid>

                            {values.insuredPersons.map(person => 
                                // person.optionalAddOnPlans.map(i=>i.planTypes.filter(f=>f.isSelected === true).length).reduce((a, b) => a + b))[0] > 0
                                person.optionalAddOnPlans.map(i=>i.planTypes.filter(f=>f.isSelected === true).length).reduce((a, b) => a + b, 0)).reduce((pa, pb) => pa + pb, 0) > 0
                                ?
                                <TableContainer >
                                <Table size="small" aria-label="a dense table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.SelectedPlan'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.CoveredPeriod'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.Premium'}/></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {values.insuredPersons && values.insuredPersons.length > 0 &&
                                      values.insuredPersons.map(insuredPerson => (
                                        insuredPerson.optionalAddOnPlans.map(optionalAddOnPlan => (
                                            optionalAddOnPlan.planTypes.map((planType, pIndex) => (
                                              <React.Fragment key={pIndex}>
                                                {planType.isSelected === true &&
                                                  <TableRow >

                                                    {/* Fiull Name */}
                                                    <TableCell>{insuredPerson.lastName}, {insuredPerson.firstName}</TableCell>

                                                    {/* Company / Product / Sum insured / Deductible */}
                                                    <TableCell>
                                                      {planType.planName}
                                                      <div className={classes.tripLength}><Text tid={'Quote.SumInsured'}/> {amountFormat(planType.selectedCoverage, 0)}</div>
                                                    </TableCell>
                                                    
                                                    {/* Covered Period*/}
                                                    <TableCell>
                                                      {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                                      <div className={classes.tripLength}>{insuredPerson.tripPeriod} <Text tid={'Quote.Days'}/></div>
                                                    </TableCell>

                                                    {/* Total Premium*/}
                                                    <TableCell>{amountFormat(planType.calculatedAddOnAmount)}</TableCell>
                                                  </TableRow>
                                                }
                                              </React.Fragment>
                                            ))
                                          ))
                                      ))}
                                  </TableBody>
                                </Table>
                                </TableContainer>
                              : 
                              <Grid item container className={classes.naBox} justify="center">
                                <Grid item>
                                    <Text tid={'Vendor.Step3.NotSelected'}/>
                                </Grid>
                              </Grid>
                            }

                            {/* Carewell Service detail table */}
                            <Grid container item>
                                <Grid item>
                                  <Typography variant="h5" className={classes.summary_title}>
                                    <SupportAgentIcon/> <Text tid={'Vendor.Step4.CarewellSelection'}/>
                                  </Typography>
                                </Grid>
                            </Grid>

                            {values.insuredPersons.map(person => 
                                  (person.optionalCarewellService.packageAmount)).reduce((a, b) => a + b) > 0
                              ? 
                                <TableContainer >
                                <Table size="small" aria-label="a dense table">
                                  <TableHead>
                                    <TableRow>
                                      {/* <TableCell className={classes.cell_applicant_left}></TableCell> */}
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Quote.FullName'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.SelectedPlan'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.ServicePeriod'}/></TableCell>
                                      <TableCell className={classes.cell_applicant_left}><Text tid={'Vendor.Step4.Fee'}/></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {values.insuredPersons && values.insuredPersons.length > 0 &&
                                      values.insuredPersons.map((insuredPerson, index) => (
                                        <React.Fragment key={index}>
                                          {insuredPerson.optionalCarewellService.packageAmount !== 0 &&
                                              <TableRow>
                                                {/* Full Name / Relationship */}
                                                <TableCell component="th" scope="row">
                                                  {insuredPerson.lastName},{insuredPerson.firstName}
                                                </TableCell>

                                                {/* Plan */}
                                                <TableCell>
                                                  {insuredPerson.optionalCarewellService.packageName}
                                                </TableCell>

                                                {/* Service Period */}
                                                <TableCell>
                                                  {dateFormat(insuredPerson.tripStartDate)} ~ {dateFormat(insuredPerson.tripEndDate)}
                                                  <div className={classes.tripLength}>{insuredPerson.tripPeriod} <Text tid={'Quote.Days'}/></div>
                                                </TableCell>
                                                
                                                {/* Service Fee */}
                                                <TableCell>
                                                  {amountFormat(insuredPerson.optionalCarewellService.packageAmount,2)}
                                                </TableCell>
                                              </TableRow>
                                          }
                                        </React.Fragment>
                                      ))}
                                  </TableBody>
                                </Table>
                                </TableContainer>  
                              : 
                              <Grid item container className={classes.naBox} justify="center">
                                <Grid item>
                                    <Text tid={'Vendor.Step3.NotSelected'}/>
                                </Grid>
                              </Grid>
                              }

                          </Grid>

                          {/* total premium */}
                          <Grid item container>
                              <div style={{ display: 'none' }}>
                                {totalInsuranceAmount = 0}
                                {totalInsuranceAmount = values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium}
                              </div>
                              <Grid item xs={12} style={{ background:'#f9f9f9', padding:'15px'}}>
                                <Typography variant="h4" className={classes.premium} style={{ marginTop:'0' }}>
                                  <Text tid={'Vendor.Step3.TotalPaymentAmount'}/> {`${amountFormat(totalInsuranceAmount,2)}`}
                                </Typography>
                              </Grid>
                            </Grid>
                        </Grid>

                        
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                {/* Right Section*/}
                <Grid container item sm={12} md={12} lg={4} style={{ height:'fit-content' }}>
                  {/* Main Applicant*/}
                  <Grid item xs={12} sm={12} style={{ marginBottom: 20 }}>
                    <Card className={classes.summaryCard} m={2}>

                      <Grid item xs={12} className={classes.applicant} >
                          <span><Text tid={'Quote.MailingAddress'}/></span>
                      </Grid>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {`${values.mailStreetName}, ${values.mailUnitApartmentNo},`} {`${values.mailCity} ${values.mailProvince}`} {`${values.mailPostalCode}`} {`${values.mailCountry}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Mailing Address*/}
                  <Grid item xs={12} sm={12} style={{ marginBottom: 20 }}>
                    <Card>
                      <Grid item xs={12} className={classes.applicant} >
                          <span><Text tid={'Quote.Contact'}/></span>
                      </Grid>
                      <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            <b><Text tid={'Quote.Phone'}/></b>
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {`${values.contactPhone}`}
                          </Typography>
                          <hr/>
                          <Typography color="textSecondary" gutterBottom>
                            <b><Text tid={'Quote.Email'}/></b>
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {`${values.contactEmail}`}
                          </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Note */}
                  {values.note.length > 0 ?
                  <Grid item xs={12} sm={12} style={{ marginBottom: 20 }}>
                    <Card className={classes.summaryCard} m={2}>

                      <Grid item xs={12} className={classes.applicant} >
                          <span><Text tid={'TravelApplication.NoteTitle'}/></span>
                      </Grid>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {values.note}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  :null}

                  {/* Payment*/}
                  <Grid item xs={12} sm={12}>
                    <Card>
                      <Grid item xs={12} className={classes.applicant} >
                          <span><Text tid={'Quote.PaymentMethod'}/></span>
                      </Grid>
                      <CardContent>
                       {/* Payment Type */}
                        <Grid item xs={12}>      
                          <Typography color="textSecondary" gutterBottom>
                            <b><Text tid={'Quote.SelectPayment'}/></b>
                          </Typography>
                          <ToggleButtonGroup
                              orientation= { width < 1748 && width > 1279 ? "vertical" : "horizontal" }
                              className={classes.toggleButtonGroup}
                              name={`paymentMethod`}
                              value={values.paymentMethod}
                              exclusive
                              onChange={(e) => {
                                const paymentType = e.currentTarget.value
                                values.paymentMethod = paymentType
                                if (paymentType !== 'Creditcard' ){
                                    values.paymentByClient = false
                                    values.cardHolderName = ''
                                    values.creditCardNumber = ''
                                    values.cardcvv = ''
                                    values.cardExpired = ''
                                } 
                                if  (paymentType !== 'E-transfer' ){
                                    values.senderName = ''
                                } 
                                setFieldValue('paymentMethod', paymentType)
                                if (paymentType !== 'Billback'){
                                    setPaymentOpen(true)
                                }
                                
                            }}
                          >
                              <ToggleButton value="Creditcard" disabled={values.userRole==='VEN'&&values.paymentByClient&&values.creditCardNumber?true:false} className={classes.toggleButton} style={{ padding:'7px' }}>
                                  <Text tid={'Quote.CreditCard'}/>
                              </ToggleButton>
                              <ToggleButton value="E-transfer"  disabled={values.userRole==='VEN'&&values.paymentByClient&&values.creditCardNumber?true:false} className={classes.toggleButton} style={{ padding:'7px' }}>
                                  <Text tid={'Vendor.Step4.E-transfer'}/>
                              </ToggleButton>
                              <ToggleButton value="Billback"  disabled={values.userRole==='VEN'&&values.paymentByClient&&values.creditCardNumber?true:false} className={classes.toggleButton} style={{ padding:'7px' }}>
                                  <Text tid={'Quote.Billback'}/>
                              </ToggleButton>
                          </ToggleButtonGroup>
                          {validMessage(`paymentMethod`)}
                          
                          {values.paymentMethod === 'Creditcard' &&
                            <Grid item container>
                                <Grid item container xs={12} style={{ margin:'2vh 0 1vh 0' }}>
                                  <Typography color="textSecondary" gutterBottom>
                                    <CheckIcon/> <b><Text tid={'Quote.PaymentValues'}/> {values.paymentByClient===true?'- 고객직접입력':null}</b>
                                  </Typography>
                                </Grid>
                                <Grid item container xs={12}>
                                  {values.userRole==='VEN'&&values.paymentByClient===true
                                    ? null
                                    :
                                      <Grid item container xs={12}>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            <Text tid={'Quote.CardHolderName'}/>
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            {`${values.cardHolderName}`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                  }
                                </Grid>
                                
                                {values.userRole==='VEN'&&values.paymentByClient===true
                                  ? null
                                  :
                                    <Grid item container xs={12}>
                                      <Grid item container xs={12}>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            <Text tid={'Quote.CardExpiration'}/>
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            {`${values.cardExpired}`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            <Text tid={'Quote.CardCVV'}/>
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Typography color="textSecondary" gutterBottom>
                                            {`${values.cardcvv}`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                }
                            </Grid>
                          }
                          

                          {values.senderName && 
                            <Grid item container>
                                <Grid item container xs={12} style={{ margin:'2vh 0 1vh 0' }}>
                                  <Typography color="textSecondary" gutterBottom>
                                    <CheckIcon/> <b><Text tid={'Quote.PaymentValues'}/></b>
                                  </Typography>
                                </Grid>
                                <Grid item container xs={12}>
                                  <Grid item container xs={12}>
                                    <Grid item xs={12} md={6}>
                                      <Typography color="textSecondary" gutterBottom>
                                        <Text tid={'Quote.SenderName'}/>
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Typography color="textSecondary" gutterBottom>
                                        {`${values.senderName}`}
                                      </Typography>
                                    </Grid>
                                  </Grid>    
                                </Grid>
                            </Grid>
                          }

                          {errorFlag === true &&
                            <Grid item style={{margin:'1vh'}}>
                                  <Alert
                                    severity='error'
                                    onClose={() => setErrorFlag(false)}
                                  > 
                                    {values.paymentMethod && values.paymentMethod !== 'Billback' 
                                      ? <> <Text tid={`Quote.${values.paymentMethod==='Creditcard'?'CreditCard':'E-transfer'}`}/> {' - '} </>
                                      : null
                                    }
                                    <Text tid={'Quote.Error.CompleteInformation'}/>
                                  </Alert>
                            </Grid>
                          }

                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

            </Grid>
            )}

            {paymentOpen === true && totalInsuranceAmount > 0 &&
              <PaymentInfoModal
                payableAmount ={totalInsuranceAmount}
                values={values}
                setFieldValue={setFieldValue}
                // countries={countries}
                open={paymentOpen}
                handleClose={setPaymentOpen}
              />
            }

            <Grid container style={{ margin: '5vh 0 5vh 0' }}>
                <Grid item container xs={12} sm={12} md={6} lg={4}>
                  <Grid item xs={12} sm={12} md={6} lg={6} style={{display: (values.currentStatus==='Modifying'?'none':null)}}>
                    <Button 
                        type='submit' 
                        color="secondary" 
                        className={classes.next_button} 
                        onClick={() => {
                          if (Object.getOwnPropertyNames(errors).length > 0){
                              setErrorFlag(true)
                            } 
                            setTimeout(() => {
                              setErrorFlag(false)
                            }, 3000);
                          setDirection('forward')
                          setSubmitType('draft')
                        }}
                    >
                        <Text tid={'Button.Save'}/>
                    </Button>
                  </Grid>
                </Grid>

                <Grid item container xs={12} sm={12} md={6} lg={8} spacing={1} justify="flex-end">
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={4}>
                    <Button 
                        // type="submit" 
                        color="secondary" 
                        className={classes.back_button} 
                        onClick={() => { 
                          setFormData(values)
                          setDirection('back')
                          prevStep()
                        }}
                    >
                        <Text tid={'Button.Previous'}/>
                    </Button>
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} lg={6} xl={4}>
                    <Button 
                        type='submit' 
                        color="dark" 
                        className={classes.next_button} 
                        onClick={() => {
                          if (Object.getOwnPropertyNames(errors).length > 0){
                              setErrorFlag(true)
                            } 
                            setTimeout(() => {
                              setErrorFlag(false)
                            }, 3000);
                          setDirection('forward')
                          setSubmitType('submit')
                        }}
                    >
                        {!values.currentStatus?<Text tid={'Button.Apply'}/>:'Modify'}
                    </Button>
                  </Grid>
                </Grid>

            </Grid>

          </Form>
        )}
      </Formik>

    </>
  )
}

Summary.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  // nextStep: PropTypes.func.isRequired,
}

export default Summary