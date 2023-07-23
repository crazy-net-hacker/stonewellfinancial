import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
//Redux
import { signUpRequest } from '../../../redux/actions/userAction'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  makeSelectIsAuthenticated,
  selectUserInfo,
  selectUserInfoError,
} from '../../../redux/selectors/userSelector'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import ReCAPTCHA from 'react-google-recaptcha'

import { makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'

import * as Validation from '../../Validation'
//Components
import { Text } from '../../../components/common/LanguageProvider'
// import MuiPhoneInput from 'material-ui-phone-number'
import { Link } from 'react-router-dom'
import CustomButton from '../../../components/common/CustomButtons/Button'
import { selectSignUpLoading } from '../../../redux/selectors/userSelector'
import SnackPrompt from '../../../components/common/Snackbars'

const useStyles = makeStyles(theme => ({
  root: {},
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
    // marginBottom:'5px',
    // marginTop:'5px',
    display:'inline-block'
  },
  captcha: {
    display: 'flex',
    marginTop: '12px',
    marginLeft: '12px',
  },
  buttonEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  confirmed: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '1rem',
  },
  button: {
    margin: '2vh 0',
    width: '100%'
  },
  signUpLinks: {
    display: 'flex',
    justifyContent: 'center',
  },
  recaptcha: {
    display: 'flex',
    alignSelf: 'flex-end',
  },
}))

// ValidMessage
function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={msg => <div style={{ color: 'red' }}>{msg}</div>}
    />
  )
}

// formik
const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  confirmed: false,
}

// Validation
const validationSchema = Yup.object({
  firstName: Validation.validRequiredField(),
  lastName: Validation.validRequiredField(),
  phone: Validation.validPhoneNumber(),
  email: Validation.validEmail(),
  password: Validation.validPassword(),
  confirmPassword: Validation.confirmPassword(),
})

const SignUpForm = ({
  isAuthenticated,
  signUpInfo,
  error,
  loading,
  dispatch,
  history,
}) => {
  const classes = useStyles()
  const recaptchaRef = React.useRef()

  const [token, setToken] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleRecaptchaChange = value => {
    setToken(value)
    setVerified(true)
  }

  useEffect(() => {
    if (isAuthenticated && !error && !loading) {
      setSnackOpen(true)
      history.push('/dashboard')
    }
    if (error) {
      setSnackOpen(true)
    }
  }, [signUpInfo, history, error, loading, isAuthenticated])

  return (
    <div style={{ background:'#f6f7fc', padding:'10vh 0 5vh 0'}}>
      <main className={classes.form}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} style={{ justifyContent: 'center' }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={values => {
                // console.log(values)
                values.token = token
                values.roleId = 'CLT'
                values.confirmed = isConfirmed
                // console.log(validationSchema)
                dispatch(signUpRequest(values))
              }}
            >
              {({ values, handleChange, setFieldValue, isValid, dirty }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={8} sm={12} className={classes.logo}>
                      <Typography variant="h3" gutterBottom className={classes.title}>
                        <Text tid={'SignUp.Label'} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <span className={classes.label}>
                        <Text tid={'SignUp.FirstName'} />
                      </span>
                      <Field
                        className="form-control"
                        type="text"
                        value={values.firstName}
                        onChange={handleChange}
                        name="firstName"
                      />
                      {validMessage('firstName')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <span className={classes.label}>
                        <Text tid={'SignUp.LastName'} />
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
                    <Grid item xs={12} sm={12}>
                      <span className={classes.label}>
                        <Text tid={'SignUp.Email'} />
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
                    {/* <Grid item xs={12} sm={6}>
                      <Text tid={'SignUp.PhoneNumber'} />*
                      <Field
                        className="form-control"
                        name="phone"
                        size="small"
                        variant="outlined"
                        value=""
                        type="tel"
                        as={MuiPhoneInput}
                        defaultCountry={'ca'}
                        onlyCountries={['ca', 'kr']}
                        disableAreaCodes={true}
                        countryCodeEditable={false}
                        onChange={value => setFieldValue('phone', value)}
                      />
                      {validMessage('phone')}
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <span className={classes.label}>
                        <Text tid={'SignUp.Password'} />
                      </span>
                      <Field
                        className="form-control"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        name="password"
                      />
                      {validMessage('password')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <span className={classes.label}>
                        <Text tid={'SignUp.ConfirmPassword'} />
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
                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <ReCAPTCHA
                          name="recaptcha"
                          className={classes.captcha}
                          ref={recaptchaRef}
                          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                          onChange={e => handleRecaptchaChange(e)}
                          onExpired={() => {
                            setVerified(false)
                            recaptchaRef.current.reset()
                            recaptchaRef.current.execute()
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={12} sm={6} className={classes.recaptcha}>
                        <CustomButton
                          type="button"
                          color="primary"
                          size="sm"
                          className={`${classes.button}`}
                          onClick={() => recaptchaRef.current.reset()}
                        >
                          Reset Recaptcha
                        </CustomButton>
                      </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{ fontSize:'14px', paddingTop:'1vh' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="confirmed"
                          color="primary"
                          onChange={e => setIsConfirmed(e.target.checked)}
                        />
                      }
                      className={classes.confirmed}
                      label={<Text tid={'SignUp.ReceiveInfo'} />}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.buttonEnd}>
                    <CustomButton
                      type="submit"
                      color="primary"
                      size="md"
                      className={`${classes.button}`}
                      disabled={!verified || !isValid || !dirty}
                    >
                      <Text tid={'Button.SignUp'} />
                    </CustomButton>
                  </Grid>
                  <Grid item className={classes.signUpLinks}>
                    <Typography>
                      Have an account? <Link to="/signin"> Login</Link>
                    </Typography>
                    {/* <Typography>
                      <Link to="#">Need help getting started? Contact us.</Link>
                    </Typography> */}
                  </Grid>
                </Form>
              )}
            </Formik>

            {snackOpen && (
              <SnackPrompt
                openSnack={snackOpen}
                severity={error ? 'error' : 'success'}
                message={
                  error ? error.error : signUpInfo ? signUpInfo.success : ''
                }
                closeSnack={() => setSnackOpen(false)}
              />
            )}
          </Grid>
        </Paper>
      </main>
    </div>
  )
}

SignUpForm.propTypes = {
  error: PropTypes.any,
  signUpInfo: PropTypes.any,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = createStructuredSelector({
  signUpInfo: selectUserInfo,
  error: selectUserInfoError,
  loading: selectSignUpLoading,
  isAuthenticated: makeSelectIsAuthenticated,
})

export default connect(mapStateToProps, null)(SignUpForm)
