import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import * as Validation from '../../../Validation'
// core components
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Container, CssBaseline,
          Grid, Typography, TextField,
          // IconButton,
} from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { SelectTextField } from '../../../../components/common/CustomTextFields/TextField'
import { Text } from '../../../../components/common/LanguageProvider' 
import SubmitResult from './SubmitResult'


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
// const validationSchema = Yup.object({
//   app_status: Validation.validRequiredField(),
//   insuredpersons: Yup.array().when("app_status", 
//   { is: (value) => 
//           value === 'Approved',
//           then: Yup.array().of(
//                   Yup.object().shape({
//                       policyNo: Validation.validRequiredField().nullable(),
//                       optionPlanPolicyNo: Yup.string().when(["compnayName","eligilbeIns","optionPlanPrice"], 
//                         { is: (v_companyName, v_eligilbeIns, v_optionPlanPrice) => 
//                                 v_companyName === 'Allianz' && v_eligilbeIns === 'STUDENT' && v_optionPlanPrice > 0,
//                           then: Validation.validRequiredField().nullable(),
//                           otherwise: Yup.string().nullable()
//                         }),
//                       carewellPolicyNo: Yup.string().when("carewellServiceAmount", 
//                         { is: (value) => 
//                                 value > 0,
//                                 then: Validation.validRequiredField().nullable(),
//                                 otherwise: Yup.string().nullable()
//                         })
//                   }))
//   }),
//   remark: Yup.string().when(["app_status","source_from"], 
//   { is: (v_appStatus, v_sourceFrom) => 
//         ((v_appStatus === 'Draft' &&  v_sourceFrom === 'V')|| v_appStatus === 'Void'),
//     then : Validation.validRequiredField().nullable()
//   }),
// })


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


const ProcessUpdateModal = (props) => {
  // const { updateData, statusProcess, statusCodes, open, setOpen, onConfirm } = props
  const { updateData, statusCodes, open, setOpen, onConfirm } = props
  // console.log(props)
  // declaration
  const classes = useStyles()

  const [submitted, setSubmitted] = useState(false)
  const [creditcardId, setCreditcardId] = useState('')
  const [updateFormData, setUpdateFormData] = useState([])

  const rowCount = 1 + (updateData[0].isOptionPlanPolicy===true?1:0) + (updateData[0].carewell_service_price>0?1:0);
  
  // formik - initialValues
  function initialValues(){
    const data = {
      ...updateData[0],
      remark: ''
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
    setCreditcardId()
    onConfirm(result)
    setOpen(false)
  }
  
  // handleSubmit
  const handleSubmit = async (values) => {
        setSubmitted(true)
        setUpdateFormData(values)
        setCreditcardId(values.creditcard_id)
  }


  return (
    <>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        onClose={handleClose}
        // maxWidth="md"
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Update - {updateData[0].creditcard_id}
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
              // validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                <Form className={classes.form}>
                  {/* {console.log('errors',errors)} */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* {updatedApplication.message} */}
                    </Grid>
                      <Grid item xs={3+(rowCount===2?1:0)}>
                          <Typography variant="subtitle1" component="div" className={classes.label}>
                            Process
                          </Typography>
                      </Grid>  
                      <Grid item xs={9-(rowCount===2?1:0)}>
                        <SelectTextField
                          name={`status`}
                          value={values.status}
                          // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                          onChange={(e) => {
                            handleChange(e)
                            values.status = e.currentTarget.value;
                            setFieldValue( values.status, e.currentTarget.value);
                            // console.log(values)
                          }}
                        >
                          <option value="" hidden>Select status </option>
                          {statusCodes.map((item) => (
                            <option key={item.code_name} value={item.code_name}
                            >
                              {item.code_desc}
                            </option>
                          ))}
                        </SelectTextField>
                        {validMessage('status') } 
                      </Grid>

                      {(values.app_status ==='Request Update') &&
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" className={classes.label}>
                            Note
                          </Typography>
                          <TextField
                            name="remark"
                            value={values.remark}
                            multiline
                            variant="filled"
                            rows={5}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {validMessage('remark') } 
                        </Grid>
                      }


                  </Grid>
                  
                  {submitted === false &&
                    <div className={classes.submitArea}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '2vh' }}
                        className={classes.submit}
                        // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                      >
                        Update
                        {/* <Text tid={'Button.Save'}/> */}
                      </Button>
                      <Button
                        color="secondary"
                        className={classes.submit}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                        {/* <Text tid={'Button.Close'}/> */}
                      </Button>
                    </div>
                  }

                </Form>
              )}
            </Formik>

            {submitted === true && creditcardId &&
              <SubmitResult
                id={creditcardId}
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

export default ProcessUpdateModal