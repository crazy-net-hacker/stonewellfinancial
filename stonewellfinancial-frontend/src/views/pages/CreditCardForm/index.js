import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation'
// core components
import { Grid, TextField } from '@material-ui/core'
import InputMask from 'react-input-mask'

// import { amountFormat } from '../../../controllers/dataFormat';
// common components
import { RegularTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import Button from '../../../components/common/CustomButtons/Button';
import { Text } from '../../../components/common/LanguageProvider';
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2'
import SubmitResult from './SubmitResult';

// icons
import InputAdornment from '@mui/material/InputAdornment'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa'

//style
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

// const queryString = new URLSearchParams(window.location.search).get('value')

const VALIDATION_SCHEMA = Yup.object().shape({
    paymentAmount: Validation.validRequiredNumberMin1Field(),
    firstName : Validation.validRequiredField(),
    lastName : Validation.validRequiredField(),
    email: Validation.validRequiredField(),
    cardHolderName: Validation.validRequiredField(),
    creditCardNumber : Validation.validCreditCardNumber(),
    cardExpired : Validation.validCardEexpirationDate(),
    cardcvv : Yup.string().when('creditCardType', (creditCardType) => {
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
})

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
    // get credit card icon
    function getCrditCardIcon(cardNumber) {
      switch(cardNumber) {
      case '4':
      return <FaCcVisa style={{ marginLeft:'1vh' }} />
      case '5':
      return <FaCcMastercard style={{ marginLeft:'1vh' }} />
      case '3':
      return <FaCcAmex style={{ marginLeft:'1vh' }} />
      default:
      return <CreditCardIcon style={{ marginLeft:'1vh' }} />
      }
  }


const CreditCardForm = (props) => {
  // const { } = props;
  const classes = useStyles()

  const queryString = new URLSearchParams(props.location.search);

  // inintal values
  const INITIAL_VALUES = {
    firstName: '',
    lastName: '',
    email: '',
    paymentAmount : queryString.get('paymentAmount')?parseFloat(queryString.get('paymentAmount')):0,
    // paymentAmount : amountFormat((queryString.get('paymentAmount')?parseFloat(queryString.get('paymentAmount')):0),2),
    creditCardType : '',
    cardHolderName : '',
    creditCardNumber : '',
    cardExpired: '',
    cardcvv : '',
}


const [submitted, setSubmitted] = useState(false);
const [formData, setFormData] = useState([]);

// handleSubmit
const handleSubmit = async (values) => {
    setFormData(values)
    setSubmitted(true)
}

if (submitted === false) {
  return (
    <>
      <QuoteBanner2 icon={<LockOutlinedIcon style={{ fontSize:'30px' }}/>} title={<Text tid={`Form.CreditCardPayment.Title`}/>} subTitle={''} links={[]}/>

      <Grid container justify="center">
        <Grid item container xs={11} sm={10} md={8} lg={4}>
          {/* <main className={classes.form} style={{ marginBottom:'8vh', padding:isMobile?'0':'0 2vh', border: isMobile ? 'none': '1px solid #efefef', boxShadow: isMobile?'none':'5px 5px 20px #efefef' }}> */}
          <main className={classes.form} style={{ marginBottom:'4vh', padding:'0 5vh', border: '1px solid #efefef', boxShadow: '5px 5px 20px #efefef' }}>
            <Formik
                initialValues={INITIAL_VALUES}
                validationSchema={VALIDATION_SCHEMA}
                onSubmit={(values) => {
                    // console.log(values)
                    handleSubmit(values)
                }} 
            >
                {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                <Form>
                    {/* {console.log(errors)} */}
                    <Grid item container className={classes.formWrapper2}>
                        
                      <Grid item container spacing={2}>
                          {/* Payment amount */}
                          <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                                <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                    <span className={classes.spanTitle}>
                                        <Text tid={'Quote.TotalPaymentAmount'}/>                   
                                    </span>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>   
                                    <RegularTextFieldSmall
                                        name={`paymentAmount`}
                                        readOnly={true}
                                        value={values.paymentAmount}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                    {validMessage(`paymentAmount`)}
                                </Grid>
                          </Grid>
                          {/* applicant info */}
                          <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                              <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                  <span className={classes.spanTitle}>
                                      <Text tid={'Quote.Step.Applicant'}/>                   
                                  </span>
                              </Grid>
                              

                              <Grid item xs={12} sm={6} md={6}>   
                                  <RegularTextFieldSmall
                                      name={`firstName`}
                                      type="text"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.firstName}
                                      label= {'Quote.FirstName'}
                                  />
                                  {validMessage(`firstName`)}
                              </Grid>

                              <Grid item xs={12} sm={6} md={6}>   
                                  <RegularTextFieldSmall
                                      name={`lastName`}
                                      type="text"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.lastName}
                                      label= {'Quote.LastName'}
                                  />
                                  {validMessage(`lastName`)}
                              </Grid>

                              <Grid item xs={12} sm={12} md={6} lg={12}>   
                                  <RegularTextFieldSmall
                                      name={`email`}
                                      type="text"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.email}
                                      label= {'Quote.Email'}
                                  />
                                  {validMessage(`email`)}
                              </Grid>
                          </Grid>                            

                          {/* credit card info */}
                          <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                              <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                    <span className={classes.spanTitle}>
                                        <Text tid={'TravelApplication.CreditCardInfo'}/>
                                    </span>
                              </Grid>

                              <Grid item xs={12} sm={6} md={6} lg={6}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CreditCardNumber'}/></label>
                                  <InputMask
                                      name={`creditCardNumber`}
                                      mask= {values.creditCardNumber.substr(0,1) === '3'?"9999 999999 99999":"9999 9999 9999 9999" }
                                      value={values.creditCardNumber}
                                      // style={{ width: '100%' }}
                                      placeholder="MM/YY"
                                      onChange={(e, val)=>{
                                      setFieldValue(`creditCardNumber`,e.target.value )
                                      if (values.creditCardNumber){
                                          let cardType = values.creditCardNumber.substr(0,1)
                                          if (cardType === '4'){
                                          setFieldValue(`creditCardType`,'Visa')
                                          } else if (cardType === '5'){
                                          setFieldValue(`creditCardType`,'MasterCard')
                                          } else if (cardType === '3'){
                                          setFieldValue(`creditCardType`,'AmericanExpress')
                                          } else {
                                          setFieldValue(`creditCardType`,'' )
                                          }
                                      }
                                  }}
                                      onBlur={handleBlur}                    >
                                      {() => (
                                      <TextField
                                          type="text"
                                          name="creditCardNumber"
                                          variant="outlined"
                                          size="small" 
                                          style={{ width:'100%' }}
                                          InputProps={{
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  {getCrditCardIcon(values.creditCardNumber.substr(0,1))}
                                              </InputAdornment>
                                          ),
                                          }}
                                      />
                                      )}
                                  </InputMask>
                                  {validMessage(`creditCardNumber`)}
                              </Grid>

                              <Grid item xs={6} sm={4} md={3} lg={6}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardExpiration'}/></label>
                                  <br/>
                                  <InputMask
                                      name={`cardExpired`}
                                      mask="99/99"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.cardExpired}
                                      placeholder="MM/YY"
                                      >
                                      {() => (
                                          <TextField
                                          type="text"
                                          name="cardExpired"
                                          variant="outlined"
                                          style={{ width:'100%' }}
                                          />
                                      )}
                                  </InputMask>
                                  {validMessage(`cardExpired`)}
                              </Grid>

                              <Grid item xs={6} sm={4} md={3} lg={6}>   
                                  <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardCVV'}/></label>
                                  <br/>
                                  <InputMask
                                      name={`cardcvv`}
                                      mask= {values.creditCardNumber.substr(0,1) === '3'?"9999":"999" }
                                      onChange={handleChange}                      
                                      onBlur={handleBlur}
                                      value={values.cardcvv}
                                      placeholder="MM/YY"
                                      >
                                      {() => (
                                          <TextField
                                          type="text"
                                          name="cardcvv"
                                          variant="outlined"
                                        //   size="small" 
                                          style={{ width:'100%' }}
                                          />
                                      )}
                                  </InputMask>
                                  {validMessage(`cardcvv`)}
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={6} lg={6}> 
                                  <RegularTextFieldSmall
                                      name={`cardHolderName`}
                                    //   name={`cardHolderName_${Math.random()}`} // Add a random attribute
                                      autoComplete="name"
                                      type="text"
                                      value={values.cardHolderName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      label= {'Quote.CardHolderName'}
                                  />
                                  {validMessage(`cardHolderName`)}
                              </Grid>
                              
                          </Grid>
                      </Grid>

                    </Grid>

                    <Grid item container style={{ justifyContent:'end', marginBottom:'3vh' }}>
                      <Button type='submit' color="dark">
                          <Text tid={"Button.ProceedApplication"}/>
                      </Button>
                    </Grid>

                </Form>
                )}
            </Formik>
          </main>
        </Grid>
      </Grid>
    </>
    )
} else {
    return( 
        <SubmitResult
            formData={formData}
        />
 
    )
  
}}

export default CreditCardForm
