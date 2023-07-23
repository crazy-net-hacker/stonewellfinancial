import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
//Redux
import { useSelector, useDispatch } from 'react-redux';
import { postVendorUser } from '../../../../redux/actions/vendorAccountAction'
import { updateVendorUser } from '../../../../redux/actions/vendorAccountAction';
//
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
//
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {
  Dialog, Container, CssBaseline, Grid, Typography, MenuItem, 
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Alert, AlertTitle } from '@material-ui/lab';
import {blue} from '@material-ui/core/colors'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextFieldSmall, SelectMenuTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
import KeyboardDatePickerField from '../../../../components/common/CustomDatePickers'
import { Text } from '../../../../components/common/LanguageProvider' 


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
    // padding: theme.spacing(1),
    marginTop: theme.spacing(3)

  },
  label: { 
    fontWeight: 600,
    marginLeft: 5,
    marginBottom: 0,
    fontSize:'14px',
    color:'#2c3e50',
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
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(5, 0, 3),
  },
}))

// formik
const validationSchema = Yup.object({
  firstName: Validation.validRequiredField(),
  lastName: Validation.validRequiredField(),
  email: Validation.validEmail(),
  vendorRole: Yup.string().nullable().when("isActive",
    { is: (value) => 
            value === true,
            then: Validation.validRequiredField()
    }),
  activeDate: Yup.date().nullable().when("isActive",
    { is: (value) => 
            value === true,
            then: Validation.validRequiredDateField().nullable(),
            otherwise: Yup.date().nullable().when("closeDate",
              { is: (value) => 
                      value !== null,
                      then: Validation.validRequiredDateField().nullable()
              })
    }),
  closeDate: Yup.date().nullable()
                .min(Yup.ref("activeDate"), "closeDateShouldBeGreaterThanActiveDate"),                  
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


const VendorUserAuthModal = (props) => {
  const { addEditMode, addEditData, open, setOpen, onConfirm } = props

  // declaration
  const classes = useStyles()
  const dispatch = useDispatch();
  const userResult = useSelector(state => state.vendorAccountReducer.resultUser)
  const loading = useSelector(state => state.vendorAccountReducer.loadingUser)
  const error = useSelector(state => state.vendorAccountReducer.errorUser)

  const [submit, setSubmit] = useState(false);

  // modal close
  const handleClose = () => {
    setOpen(false)
    setSubmit(false)
  }

  // handleSubmit
  const handleSubmit = (values) => {
        setSubmit(true)
        if(addEditMode==='Add'){
          dispatch(postVendorUser(values))
        }else{
          dispatch(updateVendorUser({vendor_id:values.vendor_id, user_id:values.user_id, data: values})) 
        }
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
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            {addEditMode==='Add'?<Text tid={'Dashboard.UserRegistration'} />:<Text tid={'Dashboard.UserActivation'} />}
          </Typography>
        </MuiDialogTitle>

        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Formik
              initialValues={addEditData[0]}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur,setFieldValue, errors }) => (
                <Form className={classes.form}>
                  {/* {console.log(errors)} */}
                  <Grid container spacing={2}>

                    <Grid item xs={6} >
                      <RegularTextFieldSmall
                        name = "firstName"
                        disabled = {addEditMode === 'Add'? false: true}
                        value={values.firstName}
                        label= {'Quote.FirstName'}
                        // onChange={handleChange}
                        onChange={(e) => {
                          setFieldValue(`firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                        }}
                        onBlur={handleBlur}
                      />
                      {validMessage('firstName') }
                    </Grid>

                    <Grid item xs={6}>
                      <RegularTextFieldSmall
                        name = "lastName"
                        disabled = {addEditMode === 'Add'? false: true}
                        value={values.lastName}
                        label= {'Quote.LastName'}
                        // onChange={handleChange}
                        onChange={(e) => {
                          setFieldValue(`lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                        }}
                        onBlur={handleBlur}
                      />
                      {validMessage('lastName') }
                    </Grid>

                    <Grid item xs={12}>
                      <RegularTextFieldSmall
                        name = "email"
                        disabled = {addEditMode === 'Add'? false: true}
                        value={values.email}
                        label= {'Quote.Email'}
                        // onChange={handleChange}
                        onChange={(e) => {
                          setFieldValue(`email`, e.currentTarget.value.toLowerCase())
                        }}
                        onBlur={handleBlur}
                      />
                      {validMessage('email') }
                    </Grid>

                        <Grid item xs={6}>
                          <label className={classes.label} style={{ marginBottom:'8px'}}>
                            <Text tid={'Quote.Activation'} />
                          </label>
                          <ToggleButtonGroup
                              name ="isActive"
                              value={values.isActive}
                              exclusive
                              style={{ width:'100%' }}
                              onChange={(e) => {
                                  const val = e.currentTarget.value === 'true' ? true : false
                                  setFieldValue(`isActive`, val)
                                  if (val === true){
                                    setFieldValue(`closeDate`, null)
                                  }
                              }}
                          >
                              <ToggleButton value={true} className={classes.toggleButton} style={{ padding:'7px', width:'50%' }}>
                              <Text tid={'Button.Yes'}/>
                              </ToggleButton>
                              <ToggleButton value={false} className={classes.toggleButton} style={{ padding:'7px', width:'50%' }}>
                              <Text tid={'Button.No'}/>
                              </ToggleButton>
                          </ToggleButtonGroup>
                        </Grid>

                        <Grid item xs={6} >
                          <SelectMenuTextFieldSmall
                            label= {'Quote.vendorRole'}
                            // label= "Role"
                            value={values.vendorRole}
                            name="vendorRole"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            >
                            {[{code: 'S', name: 'Staff'}, 
                              {code: 'A', name: 'Admin'}]
                                .map((item) => (
                                    <MenuItem key={item.code} value={item.code}>
                                      {/* <Text tid={`Quote.${item.name}`}/> */}
                                      {item.name}
                                    </MenuItem>
                            ))}
                        </SelectMenuTextFieldSmall>
                        {validMessage('vendorRole') }
                      </Grid>

                        <Grid item xs={6}>
                          <label className={classes.label}>
                            <Text tid={`Quote.ActivatedDate`}/>
                          </label>
                          <KeyboardDatePickerField 
                            name="activeDate"
                            disabled = {!values.isActive}
                            value={values.activeDate}
                            // maxDate={new Date()}
                            onChange={(e) => {
                                values.activeDate = e
                                setFieldValue(`activeDate`, e)
                                }}
                            style={{ width:'100%', margin:'4px 0 4px 0' }}
                          />
                          {validMessage(`activeDate` )}
                        </Grid>
                        <Grid item xs={6}>
                          <label className={classes.label}>
                            <Text tid={`Quote.CloseDate`}/>
                          </label>
                          <KeyboardDatePickerField 
                            name="closeDate"
                            disabled = {values.isActive}
                            value={values.closeDate}
                            // maxDate={new Date()}
                            onChange={(e) => {
                                values.closeDate = e
                                setFieldValue(`closeDate`, e)
                                }}
                            style={{ width:'100%', margin:'4px 0 4px 0' }}
                          />
                          {validMessage(`closeDate` )}
                        </Grid>

                  </Grid>
                  
                  {submit===true&& !error && !loading && userResult && userResult.status && (
                    <Alert severity={userResult.status} >    
                      <AlertTitle>{userResult.status.charAt(0).toUpperCase() + userResult.status.slice(1)}</AlertTitle>
                        {userResult.message}
                    </Alert>
                  )}

{/* {console.log('userResult',userResult)} */}
                  {submit===true && userResult && userResult.status === 'success' &&
                      <div className={classes.submitArea}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginRight: '2vh' }}
                          onClick={()=>{
                            onConfirm(userResult.status)
                            handleClose()
                          }}
                        >
                          Okay
                        </Button>
                      </div>
                  }

                  {!(submit===true && userResult && userResult.status === 'success') && 
                      <div className={classes.submitArea}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          style={{ marginRight: '2vh' }}
                        >
                          {addEditMode==='Add'?<Text tid={'Dashboard.Register'} />:<Text tid={'Dashboard.Save'} />}
                        </Button>

                        <Button
                            color="secondary"
                            onClick={() => {handleClose()}}
                        >
                          <Text tid={'Dashboard.Close'} />
                          {/* <Text tid={'Button.Close'}/> */}
                        </Button>
                      </div>
                  }

                </Form>
              )}
            </Formik>
          </div>
        </Container>
      </Dialog>
    </>
  )
}

export default VendorUserAuthModal