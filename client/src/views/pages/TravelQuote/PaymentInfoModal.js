import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as Validation from '../../Validation'
// core components
import {
  Dialog, DialogContent, 
  Typography, Grid
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Autocomplete } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import TextField from "@material-ui/core/TextField";
import { MdClose } from 'react-icons/md'
import { IconButton } from "@material-ui/core";
// components
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
//
import { amountFormat } from '../../../controllers/dataFormat'
// icon
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { FaCcVisa, FaCcMastercard, FaCcAmex  } from "react-icons/fa";
//style
import formStyle from '../../../assets/jss/styles/formStyle';

const useStyles = makeStyles(formStyle)

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


const PaymentInfoModal = (props) => {
  const { payableAmount, values, countries, open, handleClose } = props;

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
        values.cardHolderName = data.cardHolderName
        values.creditCardNumber = data.creditCardNumber
        values.creditCardType = data.creditCardType
        values.cardcvv = data.cardcvv
        values.cardExpired = data.cardExpired
        values.billStreetName = data.billStreetName
        values.billUnitApartmentNo = data.billUnitApartmentNo
        values.billCity = data.billCity
        values.billProvince = data.billProvince
        values.billPostalCode = data.billPostalCode
        values.billCountry = data.billCountry
        values.senderName = ''
    } else{
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
                      <>
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
                                  onBlur={handleBlur} 
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
                                    placeholder="MM/YY"
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

                          {/* Billing Address */}
                          <Grid item container xs={12} spacing={1} justify="center" style={{marginTop:'5vh'}}>
                              <Grid  item container xs={12} sm={12} spacing={1} >  
                                  <span className={classes.titleSmall_sub}>
                                    <Text tid={'Quote.EnterBillingAddress'}/>
                                  </span>
                              </Grid>
                              <Grid  item container xs={12} sm={12} spacing={1}>  
                                  <span className={classes.titleSmall_description}>
                                    <Text tid={'Quote.BillingAddress.Description'}/>
                                  </span>
                              </Grid>
                          </Grid>
                          
                          <Grid item container spacing={1} justify="center" style={{marginTop:'1vh'}}>
                              <Grid item xs={12} sm={8} md={8}>   
                                <RegularTextField
                                    name={`billStreetName`}
                                    type="text"
                                    value={values.billStreetName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={'Quote.Street'}
                                  />
                                {validMessage(`billStreetName`)}
                              </Grid>

                              <Grid item xs={12} sm={4} md={4}>   
                                <RegularTextField
                                      name={`billUnitApartmentNo`}
                                      type="text"
                                      value={values.billUnitApartmentNo}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      label={'Quote.UnitNumber'}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={6}>   
                                <RegularTextField
                                    name={`billCity`}
                                    type="text"
                                    value={values.billCity}
                                    // onChange={handleChange}
                                    onChange={(e)=> setFieldValue(`billCity`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                    onBlur={handleBlur}
                                    label={'Quote.City'}
                                  />
                                {validMessage(`billCity`)}
                              </Grid>

                              <Grid item xs={12} sm={6} md={6}>
                                {/* Do not use Autocomplete componet becuase system does not know user mail country */}  
                                <RegularTextField
                                    name={`billProvince`}
                                    type="text"
                                    value={values.billProvince}
                                    // onChange={handleChange}
                                    onChange={(e)=> setFieldValue(`billProvince`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                    onBlur={handleBlur}
                                    label={'Quote.Province'}
                                  />
                                {validMessage(`billProvince`)}
                              </Grid>
                              <Grid item xs={12} sm={5} md={4}>   
                                <RegularTextField
                                    name={`billPostalCode`}
                                    type="text"
                                    value={values.billPostalCode}
                                    // onChange={handleChange}
                                    onChange={(e)=>setFieldValue(`billPostalCode`,e.target.value.toUpperCase())}
                                    onBlur={handleBlur}
                                    label= {'Quote.PostalCode'}
                                  />
                                {validMessage(`billPostalCode`)}
                              </Grid>

                              <Grid item xs={12} sm={7} md={8}>   
                                <Autocomplete 
                                    name={`billCountry`}           
                                    options={countries}
                                    value = {values.billCountry?countries.find(c=>c.country_code===values.billCountry):null}
                                    getOptionLabel={(option) => option.name}
                                    size="small"
                                    renderInput={(params) => 
                                        <RegularTextField {...params} 
                                          label= {'Quote.Country'}
                                        />
                                    }
                                    onChange={(e, selectedVal)=>{
                                      // console.log(selectedVal? selectedVal.country_code: '')
                                      values.billCountry = selectedVal? selectedVal.country_code: ''
                                      setFieldValue(`billCountry`, selectedVal?selectedVal.country_code:'')
                                    }}
                                    onBlur={() => setFieldTouched(`billCountry`)}
                                />
                                {validMessage(`billCountry`)}
                              </Grid>
                          </Grid>

                        </Grid>

                        
                      </>
                      :
                      <>
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
                        
                        

                      </>
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