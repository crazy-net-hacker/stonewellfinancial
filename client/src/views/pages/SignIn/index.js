import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { signInRequest } from '../../../redux/actions/userAction'
import {
  makeSelectSignInLoading,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectSignInError,
  makeSelectIsAuthenticated,
  makeSelectSignInInfo,
} from '../../../redux/selectors/userSelector'
//Components
import { Text } from '../../../components/common/LanguageProvider'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import * as Validation from '../../Validation'
// import SWLogo from '../../../assets/imgs/stonewell_logo.png'
import Button from '../../../components/common/CustomButtons/Button'
import { Alert, AlertTitle } from '@material-ui/lab';

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
  password: '',
  type: '',
  // confirmationCode: '',
}

// Validation
const validationSchema = Yup.object({
  email: Validation.validEmail(),
  password: Validation.validPassword(),
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

const SignIn = ({
  isAuthenticated,
  signInInfo,
  error,
  loading,
  email,
  password,
  history,
  match,
  
}) => {
  const classes = useStyles()
  // const [rememberMe, setRememberMe] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      showResultMessage()
    }
    if (isAuthenticated && !error && !loading) {
      history.push('/myportal/dashboard')
    }
  }, [error, isAuthenticated, loading, history])

  // show Message
  function showResultMessage() {
    setAlertOpen(true)
    setTimeout(() => {
      setAlertOpen(false)
    }, 5000);
  }

  const handleSubmit = values => {
    dispatch(signInRequest(values.email, values.password))
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
            {({ values, handleChange }) => (
              <Form>
                <Grid
                  container
                  // spacing={3}
                  style={{ justifyContent: 'center' }}
                >
                  <Grid item xs={8} sm={12} className={classes.logo}>
                    {/* <img src={SWLogo} alt="Company Logo" /> */}
                    <Typography variant="h3" gutterBottom className={classes.title}>
                      <Text tid={'SignIn.Label'} />
                    </Typography>
                  </Grid>

                  {alertOpen && (
                    <Grid item xs={12} style={{ marginBottom:'1vh' }}>
                      <Alert severity={error ? 'error' : 'success'} onClose={() => setAlertOpen(false)}>    
                        <AlertTitle>{error ? 'Error' : 'Success'}</AlertTitle>
                          <strong>{error ? error.error : signInInfo ? signInInfo.success : ''}</strong>
                        </Alert>
                    </Grid>
                  )}

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
                    ></Field>
                    {validMessage('email')}
                  </Grid>
                  <Grid item xs={8} sm={12} style={{ marginBottom:'10px' }}>
                    <span className={classes.label}>
                      <Text tid={'SignIn.Password'} />
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

                  <Grid item container xs={8} sm={12} style={{ marginBottom:'25px' }}>
                    <Grid item xs={12} sm={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="remember"
                              color="primary"
                              // onChange={e => setRememberMe(e.target.checked)}
                            />
                          }
                          className={classes.remember}
                          label={<Text tid={'SignIn.RememberMe'} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} style={{ alignSelf:'center', textAlign:'end', marginTop:'-5px', fontSize:'14px'}}>
                      <Typography>
                        <Link to="/reset-password">Forgot Password?</Link>
                      </Typography>
                    </Grid>
                  </Grid>


                  <Grid item container xs={12} style={{ width:'100%' }}>
                    <Button
                      type="submit"
                      color="primary"
                      style={{ width:'100%' }}
                    >
                      <Text tid={'Button.SignIn'} />
                    </Button>
                  </Grid>
                </Grid>
                {/* <Grid item className={classes.signUpLinks}>
                  <Typography>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </Typography>
                </Grid> */}
              </Form>
            )}
          </Formik>

        </Grid>
      </Paper>
    </main>
  </div>
  )
}

SignIn.propTypes = {
  isAuthenticated: PropTypes.bool,
  signInInfo: PropTypes.func,
  signInRequest: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  email: PropTypes.string,
  password: PropTypes.string,

  type: PropTypes.string,
  confirmationCode: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  signInInfo: makeSelectSignInInfo,
  isAuthenticated: makeSelectIsAuthenticated,
  loading: makeSelectSignInLoading,
  error: makeSelectSignInError,
  email: makeSelectEmail,
  password: makeSelectPassword,
})

export default connect(mapStateToProps, null)(SignIn)
