import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
import {
  Dialog, DialogContent, TextField, Typography, Grid, 
  FormControlLabel, Checkbox
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// import { Autocomplete } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import { MdClose } from 'react-icons/md'
import { IconButton } from "@material-ui/core";
// components
import { Text } from '../../../../components/common/LanguageProvider';
import Button from '../../../../components/common/CustomButtons/Button';
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'
//
import { amountFormat } from '../../../../controllers/dataFormat'
// icon
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { FaCcVisa, FaCcMastercard, FaCcAmex  } from "react-icons/fa";
//style
import formStyle from '../../../../assets/jss/styles/formStyle';

const useStyles = makeStyles(formStyle)

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
            render={(msg) => 
                <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
                    <Text tid={`Validation.${msg}`}></Text>
                </div>
            }
        />
    );
  }


const PaymentInfoModal = (props) => {
  // const { payableAmount, values, setFieldValue, countries, open, handleClose } = props;
  const { payableAmount, values, setFieldValue, open, handleClose } = props;

  const classes = useStyles()

  // get credit card icon
  function getCrditCardIcon(cardNumber) {
    switch(cardNumber) {
    case '4':
      return <FaCcVisa />
    case '5':
      return <FaCcMastercard />
    case '3':
      return <FaCcAmex />
    default:
      return <CreditCardIcon />
    }
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
  

  // handleSubmit
  const handleSubmit = async (data) => {
    if (data.paymentMethod === 'Creditcard'){
        values.paymentByClient = data.paymentByClient
        values.cardHolderName = data.cardHolderName
        values.creditCardNumber = data.creditCardNumber
        values.creditCardType = data.creditCardType
        values.cardcvv = data.cardcvv
        values.cardExpired = data.cardExpired  
        values.senderName = ''
    } else{
        values.paymentByClient = false
        values.cardHolderName = ''
        values.creditCardNumber = ''
        values.creditCardType = ''
        values.cardcvv = ''
        values.cardExpired = ''
        values.billStreetName = ''
        values.billUnitApartmentNo = ''
        values.billCity = ''
        values.billProvince = ''
        values.billPostalCode = ''
        values.billCountry = ''
        values.senderName = data.senderName
    }

    setFieldValue(`senderName`, values.paymentByClient)
    setFieldValue(`senderName`, values.senderName)

    handleClose(false)
  }


  return (
    <div>
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
            {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'} 
            {/* <Text tid={'Quote.CreditCard'}/> */}
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

          <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, errors }) => (
              <Form>
                {/* {console.log('errors',errors)} */}
                <div>      
                  <Grid  container>
                    <Grid item container style={{ background:"#efefef", padding:'2vh', marginTop:'2vh', textAlign: isMobile ? 'center' : 'left' }}>
                      <Grid item xs={12} sm={6}>
                        <Text tid={'Quote.PaymentAmount'}/>
                      </Grid>
                      <Grid item xs={12} sm={6} style={{ textAlign: isMobile ? 'center' : 'right', fontSize:'18px', fontWeight:'700', color:'#2a2f71'}}>
                        {amountFormat(payableAmount,2)}
                      </Grid>
                    </Grid>
                    {values.paymentMethod === 'Creditcard'
                      ?
                        <Grid item xs={12}>
                          <Grid item container spacing={1} justify="center" style={{marginTop:'2vh'}}>
                              <Grid  item container xs={12} sm={12} spacing={1}>  
                                  <span className={classes.titleSmall_sub}>
                                    <Text tid={'Quote.EnterCreditCardInformation'}/>
                                  </span>
                              </Grid>
                              <Grid  item container xs={12} sm={12} spacing={1}>  
                                  <span className={classes.titleSmall_description}>
                                    <Text tid={'Quote.CreditCardInfo.Description'}/>
                                  </span>
                              </Grid>
                          </Grid>
                      
                          <Grid item container spacing={1} style={{marginTop:'2vh'}}>
                            <Grid item xs={12} sm={12} md={12}>
                              <FormControlLabel
                                  style={{ justifyContent:"flex-start" }}
                                  control={<Checkbox
                                              checked={values.paymentByClient}
                                              size="small"
                                              name={`paymentByClient`}
                                              color="primary"
                                              onChange={(e)=>{
                                                setFieldValue('paymentByClient', e.target.checked)
                                                if (e.target.checked=== true){
                                                  setFieldValue('cardHolderName','')
                                                  setFieldValue('creditCardNumber','')
                                                  setFieldValue('creditCardType','')
                                                  setFieldValue('cardcvv','')
                                                  setFieldValue('cardExpired','') 
                                                }
                                              }}
                                            />
                                  } 
                                  label={<Text tid={`Vendor.DirectPaymentByClient`}/>}
                                  // label={'Vendor.DirectPaymentByClient'}
                              />
                            </Grid>

                          </Grid>
                          
                          {values.paymentByClient === false &&
                            <Grid item container spacing={1} style={{marginTop:'1vh'}}>
                                <Grid item xs={12} sm={6} md={6}>   
                                  <RegularTextField
                                    name={`cardHolderName`}
                                    type="text"
                                    value={values.cardHolderName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label= {'Quote.CardHolderName'}
                                  />
                                  {validMessage(`cardHolderName`)}
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>   
                                  <label className={classes.inputLabel}><Text tid={'Quote.CreditCardNumber'}/></label>
                                  <InputMask
                                    name={`creditCardNumber`}
                                    mask= {values.creditCardNumber.substr(0,1) === '3'?"9999 999999 99999":"9999 9999 9999 9999" }
                                    value={values.creditCardNumber}
                                    onChange={(e)=>{
                                        setFieldValue(`creditCardNumber`,e.target.value )
                                        if (values.creditCardNumber){
                                          var cardType = e.target.value.slice(0,1)
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
                                  >
                                    {() => (
                                      <TextField
                                        type="text"
                                        name="creditCardNumber"
                                        variant="outlined"
                                        size="small" 
                                        style={{ width: '100%' }}
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

                                <Grid item xs={12} sm={6} md={6}>   
                                  <label className={classes.inputLabel} style={{paddingLeft:'12px'}}><Text tid={'Quote.CardCVV'}/></label>
                                    <InputMask
                                      name={`cardcvv`}
                                      mask= {values.creditCardNumber.substr(0,1) === '3'?"9999":"999" }
                                      style={{ width: '100%' }}
                                      onChange={handleChange}                      
                                      onBlur={handleBlur}
                                      value={values.cardcvv}
                                    >
                                      {() => (
                                        <TextField
                                          type="text"
                                          name="cardcvv"
                                          style={{ width: '100%' }}
                                          variant="outlined"
                                          size="small" 
                                        />
                                      )}
                                    </InputMask>
                                    {validMessage(`cardcvv`)}
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>   
                                  <label className={classes.inputLabel}><Text tid={'Quote.CardExpiration'}/></label>
                                    <InputMask
                                      name={`cardExpired`}
                                      mask="99/99"
                                      style={{ width: '100%' }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.cardExpired}
                                      placeholder="MM/YY"
                                    >
                                      {() => (
                                        <TextField
                                          type="text"
                                          name="cardExpired"
                                          style={{ width: '100%' }}
                                          variant="outlined"
                                          size="small"
                                        />
                                      )}
                                    </InputMask>
                                    {validMessage(`cardExpired`)}
                                </Grid>

                            </Grid>
                          }

                        </Grid>
                      :
                        <Grid item container xs={12}>
                          <Grid item container spacing={1} style={{marginTop:'1vh'}}>
                            <Grid item container spacing={1} justify="center" style={{marginTop:'1vh'}}>
                                <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <span className={classes.titleSmall_sub}>
                                      <Text tid={'Quote.Etransfer.Title'}/>
                                    </span>
                                </Grid>
                                <Grid  item container xs={12} sm={12} spacing={1}>  
                                    <span className={classes.titleSmall_description} style={{marginBottom:'2vh'}}>
                                      <Text tid={`Quote.Etransfer.Description`}/>
                                    </span>
                                </Grid>
                            </Grid>
                              <Grid  item container xs={12} sm={12} spacing={1} >
                                  <ul style={{padding:'2vh 4vh', border:'1px solid #ddd', borderRadius:'5px', width:'100%', fontSize: isMobile ? '14px' : '16px', fontWeight:'500'}}>
                                    <li>
                                      <Text tid={'Quote.Email'}></Text> : justin@stonewellfinancial.com
                                    </li>
                                    {/* <li>
                                      <Text tid={'Quote.Recipient'}></Text> : Jeong Kim
                                    </li>   */}
                                    <li>
                                      <Text tid={'Quote.AmountToSend'}></Text> : {amountFormat(payableAmount,2)}
                                    </li>                    
                                  </ul>
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>   
                                <RegularTextField
                                    name={`senderName`}
                                    type="text"
                                    value={values.senderName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Quote.SenderName'}
                                  />
                                {validMessage(`senderName`)}
                              </Grid>
                          </Grid>
                        </Grid>
                    }  
                  </Grid>  

                </div>

                <Grid item container style={{ margin: '5vh 0 5vh 0' }} justify="center" spacing={1}>

                  <Grid item xs={6}>
                      <Button
                        color="secondary"
                        className={classes.back_button}
                        onClick={() => {handleClose(false)}}
                      >
                        Cancel
                        {/* <Text tid={'Button.Close'}/> */}
                      </Button>
                    </Grid>

                  <Grid item xs={6}>
                    <Button
                      color="dark"
                      type="submit"
                      className={classes.next_button}
                      // onClick={() => {handleClose(false)}}
                    >
                      Save
                      {/* <Text tid={'Button.Save'}/> */}
                    </Button>
                  </Grid>
                </Grid>

                
              </Form>
            )}
          </Formik>
        </DialogContent>

      </Dialog>
    </div>
  );
}

export default PaymentInfoModal;