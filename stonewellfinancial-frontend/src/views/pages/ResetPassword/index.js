import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
//redux
import { useDispatch, connect } from 'react-redux'
import { verifyUserRequest, changePasswordRequest } from '../../../redux/actions/userAction'
import { createStructuredSelector } from 'reselect'
import {
  makeSelectResetPasswordLoading,
  makeSelectResetPasswordError,
  makeVerification
} from '../../../redux/selectors/userSelector'
//Formik
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation'
//core components
import { Grid, Paper, Typography,
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
// common components
import { Text } from '../../../components/common/LanguageProvider'
import Button from '../../../components/common/CustomButtons/Button'

const useStyles = makeStyles(theme => ({
  form: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(700 + theme.spacing(2) * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    maxWidth: 500
  },
  paper: {
    paddingBottom: theme.spacing(3),
    padding:'40px', 
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      paddingBottom: theme.spacing(6),
      padding:'40px', 
    },
    boxShadow:'0 15px 30px 0 rgb(0 0 0 / 20%)', 
    paddingTop:'40px',
    border: '0',
    borderRadius: '0'
  },
  formControl: {
    maxWidth: 500,
  },
  title: {
    // marginBottom: theme.spacing(3),
    color: '#212529',
    fontWeight: '600',
    fontSize: '22px',
    // marginBottom: '8vh',
    marginTop: '1vh',
    marginBottom: '40px',
    textAlign: 'center',
  },
  label: {
    color:'#212529', 
    fontSize:'14px', 
    fontWeight:'600',
    marginBottom:'5px',
    marginTop:'15px',
    display:'inline-block'
  },
  remember: {
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize:'14px'
  },
  buttonEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down(600 + theme.spacing(3) * 2)]: {
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  button: {
    margin: theme.spacing(3, 1, 1, 1),
  },
  logo: {
    textAlign: 'center',
    '& img': {
      height: 100,
      width: 300,
    },
    [theme.breakpoints.down(600)]: {
      justifyContent: 'center',
      textAlign: 'center',
      '& img': {
        height: 100,
        width: 100,
      },
    },
  },
  signUpLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
    [theme.breakpoints.down(600)]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
}))

// formik
const initialValues = {
  email: '',
  lastName: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
}

// Validation
const validationSchema = Yup.object({
  email: Validation.validEmail(),
  lastName: Validation.validRequiredField(),
  verificationCode: Validation.validRequiredField(),
  newPassword: Validation.validPassword(),
  confirmPassword: Yup.string().when('newPassword', 
    {is: (value) => 
          (value && value.length > 0 ? true : false),
          then: Yup.string().oneOf(
                [Yup.ref('newPassword')],
                'PasswordsNotMatch'
                ),
    })
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

const ResetPassword = ({
  // isAuthenticated,
  verificationInfo,
  error,
  loading,
  history,
}) => {
  const classes = useStyles()

  const [alertOpen, setAlertOpen] = useState(false)
  

  const [verificationStep, setVerificationStep] = useState(1)

  // validate by step
  function IsStepValidated(values, setFieldTouched, errors) {
    let result = false

    if (verificationStep === 1){     
      // Step1 - verify email
      if (values.email && values.lastName && !errors.email && !errors.lastName ){
          result = true
      }else{
        setFieldTouched(`email`)
        setFieldTouched(`lastName`)
      }
    } else if (verificationStep === 2){
      // Step2 - verify code
      if (values.verificationCode && !errors.verificationCode){
          result = true
      }else{
        setFieldTouched(`verificationCode`)
      }
  } else if (verificationStep === 3){
      // Step3 - change password
      if (values.newPassword && values.confirmPassword && !errors.newPassword && !errors.confirmPassword){
        result = true
      }else{
        setFieldTouched(`newPassword`)
        setFieldTouched(`confirmPassword`)
      }
  } 
    return result
  }

  // show Error Message
  function showResultMessage() {
      // scrollToElement();
      setAlertOpen(true)
      setTimeout(() => {
        setAlertOpen(false)
      }, 7000);
  }
  

  const dispatch = useDispatch()
  
  useEffect(() => {
    if (error) {
      showResultMessage(true)
    }
    if (!error && !loading) {
      // history.push('/myportal/dashboard')
      setVerificationStep(verificationStep+1)
      // if (verificationStep === 4){
      //   history.push('/signin')
      // }
    }
  }, [error, loading, history])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = values => {
    dispatch(changePasswordRequest({email:values.email, password:values.newPassword}))
  }

  return (
  <div style={{ background:'#f6f7fc', padding:'10vh 0 5vh 0'}}>
    <main className={classes.form}>
      <Paper className={classes.paper}>
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, handleChange, setFieldTouched, errors }) => (
              <Form>
                {/* {console.log(errors)} */}
                <Grid container
                  // spacing={3}
                  style={{ justifyContent: 'center' }}
                >
                  <Grid item xs={8} sm={12} className={classes.logo}>
                    {/* <img src={SWLogo} alt="Company Logo" /> */}
                    <Typography variant="h3" gutterBottom className={classes.title}>
                      <Text tid={'ResetPassword.Label'} />
                      {/* Reset password */}
                    </Typography>
                  </Grid>
                  
                  {alertOpen && error &&
                    <Grid item xs={12} style={{ marginBottom:'1vh' }}>
                      <Alert severity={error.status} onClose={() => setAlertOpen(false)}>    
                      <AlertTitle>Error</AlertTitle>
                        <strong>{error.status !== 'success' ? error.message : ''}</strong>
                      </Alert>
                      </Grid>
                  }

                  {verificationStep === 1 &&(
                    <>
                      <Grid item xs={12}>
                        <Typography>
                          Forgot password?
                          {/* 비밀번호를 분실하셨습니까? */}
                        </Typography>
                        <Typography>
                          We will send you a verification code to reset your password.
                          {/* 이메일과 성(Last name)을 입력하시면 비밀번호를 안전하게 초기화할 수 있는 인증 코드를 보내드립니다. */}
                        </Typography>
                      </Grid>

                      <Grid item xs={8} sm={12}>
                        <span className={classes.label}>
                          <Text tid={'Quote.EmailAddress'} />
                        </span>
                        <Field
                          className="form-control"
                          type="text"
                          value={values.email}
                          onChange={handleChange}
                          name="email"
                        />
                        {validMessage('email')}
                      </Grid>

                      <Grid item xs={8} sm={12} style={{ marginBottom:'25px' }}>
                        <span className={classes.label}>
                          <Text tid={'Quote.LastName'} />
                          {/* Last Name */}
                        </span>
                        <Field
                          className="form-control"
                          type="text"
                          value={values.lastName}
                          onChange={handleChange}
                          name="lastName"
                        />
                        {validMessage('lastName')}
                      </Grid>


                      <Grid item container xs={12} style={{ width:'100%' }}>
                        <Button
                          color="primary"
                          style={{ width:'100%' }}
                          onClick ={()=>{
                            // will check email whether it exists or not
                            // if email exists, send verification code to user
                            // if not, display error message
                            if(IsStepValidated(values, setFieldTouched, errors) === true){
                              //check email whether it exists or not
                              dispatch(verifyUserRequest({verificationType:'email', email:values.email, lastName:values.lastName}))
                            }
                          }}
                        >
                          {/* <Text tid={'Button.ResetPassword'} /> */}
                          {/* <Text tid={'Button.Next'} /> */}
                          {/* 인증 전송 */}
                          Send verification
                        </Button>
                      </Grid>

                      <Grid item className={classes.signUpLinks}>
                        <Typography>
                          Back to <Link to="/signin">Sign in</Link>
                        </Typography>
                      </Grid>


                    </>
                  )}

                  {verificationStep === 2 &&(
                    <>
                      {/*  if user get  verification Code*/}
                      <Grid item xs={8} sm={12} style={{ marginTop:'25px' }}>
                        <Typography>
                          Enter the verification code we sent you via email.
                        </Typography>

                        <span className={classes.label}>
                          {/* <Text tid={'SignIn.'} /> */}
                          Verification code
                        </span>
                        <Field
                          className="form-control"
                          type="text"
                          value={values.verificationCode}
                          onChange={handleChange}
                          name="verificationCode"
                        />
                        {validMessage('verificationCode')}
                      </Grid>

                      <Grid item container xs={12} style={{ width:'100%', marginTop: '25px' }}>
                        <Button
                          color="primary"
                          style={{ width:'100%' }}
                          onClick ={()=>{
                            if(IsStepValidated(values, setFieldTouched, errors) === true){
                              //check email whether it exists or not
                              dispatch(verifyUserRequest({verificationType:'code', email:values.email, lastName:values.lastName, code: values.verificationCode}))
                            }
                          }}
                        >
                          {/* <Text tid={'Button.ResetPassword'} /> */}
                          <Text tid={'Button.Next'} />
                        </Button>
                      </Grid>
                    </>
                  )}

                  {verificationStep === 3 &&(
                    <>
                      <Grid item xs={8} sm={12}>
                        <span className={classes.label}>
                          {/* <Text tid={'SignIn.Password'} /> */}
                          New password
                        </span>
                        <Field
                          className="form-control"
                          type="password"
                          value={values.newPassword}
                          onChange={handleChange}
                          name="newPassword"
                        />
                        {validMessage('newPassword')}
                      </Grid>

                      <Grid item xs={8} sm={12} style={{ marginBottom:'25px' }}>
                        <span className={classes.label}>
                          {/* <Text tid={'SignIn.Password'} /> */}
                          Confirm password
                        </span>
                        <Field
                          className="form-control"
                          type="password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          name="confirmPassword"
                        />
                        {validMessage('confirmPassword')}
                      </Grid>

                      <Grid item container xs={12} style={{ width:'100%' }}>
                        <Button
                          type="submit"
                          color="primary"
                          style={{ width:'100%' }}
                          onClick ={()=>{
                            if(IsStepValidated(values, setFieldTouched, errors) === true){
                            }
                          }}
                          
                        >
                          {/* <Text tid={'Button.ResetPassword'} /> */}
                          Submit
                        </Button>
                      </Grid>
                    </>
                  )}

                  {verificationStep === 4 &&(
                    <Grid item xs={12} style={{ marginBottom:'1vh' }}>
                    <Alert severity={verificationInfo.users.status} >    
                    <AlertTitle>{verificationInfo.users.status !== 'success' ? 'Error' : 'Sucess'}</AlertTitle>
                      <strong>{verificationInfo.users.message}</strong>
                    </Alert>

                    <Grid item className={classes.signUpLinks}>
                        <Typography>
                          <Link to="/signin">Sign in</Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                </Grid>

              </Form>
            )}
          </Formik>

        </Grid>
      </Paper>
    </main>
  </div>
  )
}

ResetPassword.propTypes = {
  verifyUserRequest: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  email: PropTypes.string,
  lastName: PropTypes.string,
  verificationCode: PropTypes.string,
  newPassword: PropTypes.string,
  confirmPassword: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectResetPasswordLoading,
  error: makeSelectResetPasswordError,
  verificationInfo : makeVerification
})

export default connect(mapStateToProps, null)(ResetPassword)
