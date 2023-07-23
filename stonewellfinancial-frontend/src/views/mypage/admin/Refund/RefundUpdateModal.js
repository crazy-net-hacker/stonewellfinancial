import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Container, CssBaseline,
          Grid, Typography,
} from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// import NumberFormat from 'react-number-format';
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../../components/common/CustomDatePickers'
import { Text } from '../../../../components/common/LanguageProvider' 
import CustomNumberFormat from '../../../../components/common/CustomNumberFormat' 
import SubmitResult from './SubmitResult'
// icon
import { SiMinutemailer } from "react-icons/si";
import { RiRefund2Fill } from "react-icons/ri";
import PersonIcon from '@mui/icons-material/Person';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    padding: theme.spacing(1)
  },
  label: { 
    marginTop: theme.spacing(2),
    fontWeight:"700"
  },
  searchFileIcon: {
    color: blue[900],
    marginTop: theme.spacing(2),
    fontWeight:"1000"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3, 0, 2),
  },
}))


// formik
const validationSchema = Yup.object({
  email_date: Validation.validRequiredDateField().nullable(),
  refunded: Validation.validRequiredField().nullable(),
  etransfer_email: Yup.string().nullable().when(["refunded","refund_payment_method"],
                { is: (v_refunded, v_refund_payment_method) => v_refunded !== 'Requested' && v_refund_payment_method === 'E-transfer',
                  then: Validation.validEmail().nullable(),
                }),
  etransfer_recipient: Yup.string().nullable().when(["refunded","refund_payment_method"],
                { is: (v_refunded, v_refund_payment_method) => v_refunded !== 'Requested' && v_refund_payment_method === 'E-transfer',
                  then: Validation.validRequiredField().nullable(),
                }),
  refund_payment_method: Yup.string().nullable().when("refunded",
                { is: (value) => (value === 'Fully' || value === 'Partially'),
                  then: Validation.validRequiredField()
                }),            
  refund_amount: Yup.number().nullable().when("refunded",
                { is: (value) => (value === 'Fully' || value === 'Partially'),
                  then: Validation.validRequiredNumberMin1Field()
                }),

  actual_refund_amount_sent: Yup.number().nullable().when("refunded",
                { is: (value) => (value === 'Fully' || value === 'Partially'),
                  then: Validation.validRequiredNumberMin1Field()
                }),
  refund_date: Yup.date().nullable().when("refunded",
                { is: (value) => value !== 'Requested',
                        then: Validation.validRequiredDateField()
                                        .min(Yup.ref("email_date"), "RefundDateShouldBeGreaterThanEmailDate"),
                }),
  etransfer_refund_date: Yup.date().nullable().when(["refunded","refund_payment_method"],
                { is: (v_refunded, v_refund_payment_method) => v_refunded !== 'Requested' && v_refund_payment_method === 'E-transfer',
                  then: Validation.validRequiredDateField()
                                  .min(Yup.ref("email_date"), "RefundDateShouldBeGreaterThanEmailDate"),
                }),
})


// ValidMessage
function validMessage(fieldName){
  return(
      <ErrorMessage
      name= {fieldName}
      render={(msg) => 
        <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
          <Text tid={`Validation.${msg}`}></Text>
        </div>
      }
      />
  );
}


const RefundUpdateModal = (props) => {
  const { updateData, user, open, setOpen, onConfirm } = props
  // console.log(props)
  // declaration
  const classes = useStyles()

  const [submitted, setSubmitted] = useState(false)
  const [refundId, setRefundId] = useState('')
  const [updateFormData, setUpdateFormData] = useState([])
  
  // formik - initialValues
  function initialValues(){
    const data = {
      ...updateData[0],
      email_date:updateData[0].email_date?new Date(updateData[0].email_date+'T00:00:00'):null,
      refunded:updateData[0].refunded?updateData[0].refunded:'Requested',
      refund_payment_method: updateData[0].refund_payment_method?updateData[0].refund_payment_method:'',
      refund_amount:updateData[0].refund_amount?updateData[0].refund_amount:'',
      etransfer_email: updateData[0].etransfer_email?updateData[0].etransfer_email:'',
      etransfer_recipient: updateData[0].etransfer_recipient?updateData[0].etransfer_recipient:'',
      admin_fee: updateData[0].admin_fee?updateData[0].admin_fee:'',
      discounted_amount: updateData[0].discounted_amount?updateData[0].discounted_amount:'',
      actual_refund_amount_sent: updateData[0].actual_refund_amount_sent?updateData[0].actual_refund_amount_sent:'',
      refund_date:updateData[0].refund_date?new Date(updateData[0].refund_date+'T00:00:00'):null,
      etransfer_refund_date:updateData[0].etransfer_refund_date?new Date(updateData[0].etransfer_refund_date+'T00:00:00'):null,
    }
    return data
  }

  // 
  const handleClose = () => {
    setOpen(false)
  }

  // 
  function handleUpdateResult(result){
    setSubmitted(false)
    setRefundId()
    onConfirm(result)
    setOpen(false)
  }
  
  // handleSubmit
  const handleSubmit = async (values) => {
        // request update data to backend
        values.userID = user
        values.timeZone= Intl.DateTimeFormat().resolvedOptions().timeZone;
        // console.log(values)
        setUpdateFormData(values)
        setRefundId(values.refund_id)
        setSubmitted(true)
  }


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        // maxWidth="md"
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Update Refund
          </Typography>
          {/* <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton> */}
        </MuiDialogTitle>

        <Container component="main" maxWidth="md">
          <CssBaseline />
          <div className={classes.paper}>

            <Formik
              initialValues={initialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, setFieldValue, errors }) => (
                <Form className={classes.form}>
                  {/* {console.log('errors',errors)} */}
                  <Grid container spacing={1}>
                      <Grid container style={{marginBottom:'1vh'}}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1" component="div" className={classes.label}>
                            <PersonIcon/> {values.lastname}, {values.firstname}
                          </Typography>
                        </Grid>  
                        <Grid item xs={6}>
                        <Typography variant="subtitle1" component="div" className={classes.label}>
                          Policy : {values.policy_number} 
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" component="div" className={classes.label}>
                          <SiMinutemailer/> Requested to provider
                        </Typography>
                      </Grid> 
                      <Grid item container style={{marginLeft:'2vh'}}> 
                        <Grid item xs={4}>
                          <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                            Email Date
                          </Typography>
                        </Grid>  
                        <Grid item xs={8}>
                          <KeyboardDatePickerField 
                              name="refund_date"
                              value={values.email_date}
                              onChange={(e) => {
                                values.email_date = e
                                setFieldValue(`email_date`, e)
                              }}                            
                          />
                          {validMessage('email_date') } 
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" component="div" className={classes.label}>
                          <RiRefund2Fill/> Refund
                        </Typography>
                      </Grid>

                      <Grid item container style={{marginLeft:'2vh'}}> 
                        <Grid item xs={4}>
                          <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                            Status
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <SelectTextField
                            name="refunded"
                            value={values.refunded}
                            onChange={(e) => {
                              values.refunded = e.currentTarget.value
                              setFieldValue(`refunded`, e.currentTarget.value)
                              if (values.refunded === 'Requested'){
                                  setFieldValue(`refund_date`,null);
                                  setFieldValue(`refund_payment_method`,'');
                                  setFieldValue(`etransfer_email`,'');
                                  setFieldValue(`etransfer_recipient`,'');
                                  setFieldValue(`refund_amount`,'');
                                  setFieldValue(`admin_fee`,'');
                                  setFieldValue(`discounted_amount`,'');
                                  setFieldValue(`actual_refund_amount_sent`,'');
                                  setFieldValue(`etransfer_refund_date`,null);

                              }else if (values.refunded === 'Rejected'){
                                  setFieldValue(`refund_payment_method`, '');
                                  setFieldValue(`refund_amount`, 0);
                                  setFieldValue(`etransfer_email`,'');
                                  setFieldValue(`etransfer_recipient`,'');
                                  setFieldValue(`admin_fee`,0);
                                  setFieldValue(`discounted_amount`,0);
                                  setFieldValue(`actual_refund_amount_sent`, 0);
                                  setFieldValue(`etransfer_refund_date`,null);

                              }else{
                                if (values.refund_payment_method !== 'E-transfer'){
                                  setFieldValue(`etransfer_email`,'');
                                  setFieldValue(`etransfer_recipient`,'');
                                  setFieldValue(`etransfer_refund_date`,null);
                                }
                                if (values.refund_amount === 0){
                                  setFieldValue(`refund_amount`,'');
                                  setFieldValue(`admin_fee`,'');
                                  setFieldValue(`discounted_amount`,'');
                                  setFieldValue(`actual_refund_amount_sent`,'');
                                }
                              }
                            }}
                          >
                            <option value="Requested">Requested</option>
                            <option value="Fully">Fully</option>
                            <option value="Partially">Partially</option>
                            <option value="Rejected">Rejected</option>
                          </SelectTextField>
                          {validMessage('refunded') } 
                        </Grid>

                        {values.refunded!=='Requested' &&
                          <>
                            {/* no show when Status is Rejected */}
                            {values.refunded !== 'Rejected' && 
                              <>
                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    Refund Payment Method
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <SelectTextField
                                    disabled = {values.refunded==='Rejected'?true:false}
                                    name={`refund_payment_method`}
                                    value={values.refund_payment_method}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      const payment_method = e.target.value
                                      values.refund_payment_method = payment_method
                                      if (payment_method !== 'E-transfer'){
                                        setFieldValue(`etransfer_email`,'');
                                        setFieldValue(`etransfer_recipient`,'');
                                        setFieldValue(`etransfer_refund_date`,null);
                                      }
                                      setFieldValue("refund_payment_method",payment_method)
                                    }}
                                  >
                                    <option value=""></option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="E-transfer">E-transfer</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Foreign transfer">Foreign transfer</option>
                                  </SelectTextField>
                                  {validMessage('refund_payment_method') } 
                                </Grid>
                              </>
                            }

                            {/* only use for E-transfer */}
                            {values.refund_payment_method === 'E-transfer' && 
                              <>
                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    Email For E-transfer
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <RegularTextField
                                      disabled = {values.refunded==='Rejected'?true:false}
                                      type="text"
                                      name="etransfer_email"
                                      value={values.etransfer_email}
                                      onChange={handleChange}
                                  />
                                  {validMessage('etransfer_email')}
                                </Grid>

                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    E-transfer Recipient
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <RegularTextField
                                    disabled = {values.refunded==='Rejected'?true:false}
                                    type="text"
                                    name={`etransfer_recipient`}
                                    value={values.etransfer_recipient}
                                    onChange={handleChange}
                                  />
                                  {validMessage('etransfer_recipient') } 
                                </Grid>
                              </>
                            }

                            <Grid item xs={4}>
                              <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                Refund Amount
                              </Typography>
                            </Grid>  
                            <Grid item xs={8}>
                              <RegularTextField
                                disabled = {values.refunded==='Rejected'?true:false}
                                name={`refund_amount`}
                                value={values.refund_amount}
                                onChange={(e) => {
                                  const amount = e.target.value
                                  values.refund_amount = amount
                                  values.actual_refund_amount_sent = (parseFloat((values.refund_amount?values.refund_amount:0))-(parseFloat(values.admin_fee?values.admin_fee:0) + parseFloat(values.discounted_amount?values.discounted_amount:0)))
                                  setFieldValue("refund_amount",amount)
                                }}
                                InputProps={{
                                  inputComponent: CustomNumberFormat,
                                }}
                              />
                              {validMessage('refund_amount') } 
                            </Grid>
                            {/* no show when Status is Rejected */}
                            {values.refunded !== 'Rejected' && 
                              <>
                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    Admin Fee
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <RegularTextField
                                    disabled = {values.refunded==='Rejected'?true:false}
                                    name={`admin_fee`}
                                    value={values.admin_fee}
                                    onChange={(e) => {
                                      const amount = e.target.value
                                      values.admin_fee = amount
                                      values.actual_refund_amount_sent = (parseFloat((values.refund_amount?values.refund_amount:0))-(parseFloat(values.admin_fee?values.admin_fee:0) + parseFloat(values.discounted_amount?values.discounted_amount:0)))
                                      setFieldValue("admin_fee",amount)
                                    }}
                                    InputProps={{
                                      inputComponent: CustomNumberFormat,
                                    }}
                                  />
                                  {validMessage('admin_fee') } 
                                </Grid>

                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    Discounted Amount
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <RegularTextField
                                    disabled = {values.refunded==='Rejected'?true:false}
                                    name={`discounted_amount`}
                                    value={values.discounted_amount}
                                    onChange={(e) => {
                                      const amount = e.target.value
                                      values.discounted_amount = amount
                                      values.actual_refund_amount_sent = (parseFloat((values.refund_amount?values.refund_amount:0))-(parseFloat(values.admin_fee?values.admin_fee:0) + parseFloat(values.discounted_amount?values.discounted_amount:0)))
                                      setFieldValue("discounted_amount",amount)
                                    }}
                                    InputProps={{
                                      inputComponent: CustomNumberFormat,
                                    }}
                                  />
                                  {validMessage('discounted_amount') } 
                                </Grid>

                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    Actual amount sent
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8}>
                                  <RegularTextField
                                    disabled = {values.refunded==='Rejected'?true:false}
                                    name={`actual_refund_amount_sent`}
                                    value={values.actual_refund_amount_sent}
                                    onChange={handleChange}
                                    InputProps={{
                                      inputComponent: CustomNumberFormat,
                                    }}
                                  />
                                  {validMessage('actual_refund_amount_sent') } 
                                </Grid>
                              </>
                            }

                            <Grid item xs={4}>
                              <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                Refund Date
                              </Typography>
                            </Grid>  
                            <Grid item xs={8}>
                              <KeyboardDatePickerField 
                                  name="refund_date"
                                  value={values.refund_date}
                                  minDate={values.email_date}
                                  onChange={(e) => {
                                    values.refund_date = e
                                    setFieldValue(`refund_date`, e)
                                  }}                            
                              />
                              {validMessage('refund_date') } 
                            </Grid>
                            
                            {/* only use for E-transfer */}
                            {values.refund_payment_method === 'E-transfer' &&
                              <>                            
                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                    E-transfer Refund Completed
                                  </Typography>
                                </Grid>  
                                <Grid item xs={8} >
                                  <KeyboardDatePickerField 
                                      name="etransfer_refund_date"
                                      value={values.etransfer_refund_date}
                                      minDate={values.email_date}
                                      onChange={(e) => {
                                        values.etransfer_refund_date = e
                                        setFieldValue(`etransfer_refund_date`, e)
                                      }}                            
                                  />
                                  {validMessage('etransfer_refund_date') } 
                                </Grid>
                              </>
                            }

                          </>
                        }
                      </Grid>

                  </Grid>
                  
                  {submitted === false &&
                    <div className={classes.submitArea}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '2vh' }}
                        className={classes.submit}
                      >
                        Update
                      </Button>
                      <Button
                        color="secondary"
                        className={classes.submit}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                      </Button>
                    </div>
                  }

                </Form>
              )}
            </Formik>

            {submitted === true && refundId &&
              <SubmitResult
                id={refundId}
                updateFormData={updateFormData}
                result = {handleUpdateResult}
              />
            }

          </div>
        </Container>
      </Dialog>
    </>
  )
}

export default RefundUpdateModal