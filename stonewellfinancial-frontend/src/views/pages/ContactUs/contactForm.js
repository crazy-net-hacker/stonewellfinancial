import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation';
//
import { Grid } from '@material-ui/core';
//components
import Button from '../../../components/common/CustomButtons/Button'
import { Text } from '../../../components/common/LanguageProvider';
import SubmitResult from './SubmitResult';

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: "1280px",
    padding: '2em',
    marginTop: '2vh'
  },
  title: {
    paddingBottom: '2em'
  }
 
}));

// type of questions
// const questionType = [
//     {ocde: 'General', desc: 'General'},
//     {code: 'Complaint', desc: 'Complaint'},
//     {code: 'Other', desc: 'Other'}
//   ]

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

// formik
const initialValues = {
    // questionType: '',
    firstName: '',
    lastName: '',
    emailAdd: '',
    phoneNum: '',
    userID: '',
    contact: '',
    reqMessage: '',
    status: "requested"
}

const validationSchema = Yup.object({
    // questionType: Validation.validRequiredField(),
    firstName: Validation.validRequiredField(),
    lastName: Validation.validRequiredField(),
    emailAdd: Validation.validEmail(),
    // phoneNum: Validation.validPhoneNumber(),
    // contact: Validation.validRequiredField(),
    reqMessage: Validation.validRequiredField(),
  })


export const ContactForm = (props) => {
  const classes = useStyles();
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState([]);
  

  // handleSubmit
  const handleSubmit = async (values) => {
      values.status = 'requested';
      // console.log(values)
      setFormData(values) 
      setSubmitted(true)
  }
  
  if (submitted === false) {
  return (
    <div className={classes.root}>             
      <Grid container justify="center">
        <Grid item xs={12} className={classes.title}>
            <h4><Text tid={'ContactForm.Title'}/></h4>
            <p><Text tid={'ContactForm.Subtitle'}/></p>
        </Grid>
        <Grid item container xs={12}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={values => {
                handleSubmit(values) 
              }}
            >
              {({ values, handleChange}) => (
                <Form>
                    <Grid item container xs={12} spacing={2}>         

                      <Grid item xs={12} sm={6} >
                        <Text tid={`Quote.${'FirstName'}`}/> *
                        <Field
                          className="form-control"
                          type="text"
                          value = {values.firstName}
                          onChange={handleChange}
                          name="firstName"
                          autoComplete="first-name"
                        />
                        {validMessage('firstName') }
                      </Grid>

                      <Grid item xs={12} sm={6} >
                        <Text tid={`Quote.${'LastName'}`}/> *
                        <Field
                          className="form-control"
                          type="text"
                          value = {values.lastName}
                          onChange={handleChange}
                          name="lastName"
                          autoComplete="first-name"
                        />
                        {validMessage('lastName') }
                      </Grid>

                      <Grid item xs={12} >
                        <Text tid={`Quote.${'Email'}`}/> *
                        <Field
                          className="form-control"
                          type="text"
                          name="emailAdd"
                          value = {values.emailAdd}
                          onChange={handleChange}
                        />
                        { validMessage('emailAdd') }
                      </Grid>

                      <Grid item xs={12} sm={6}></Grid>

                      <Grid item xs={12}>
                      <Text tid={`Quote.${'Message'}`}/> *
                        <Field
                          className="form-control"
                          component="textarea"
                          rows="4"
                          value = {values.reqMessage}
                          name="reqMessage"
                          autoComplete="reqMessage"
                        />
                      {validMessage('reqMessage') }
                      </Grid>            

                      <Grid item xs={12} style={{ textAlign:'right' }}>
                        <Button
                          color="dark"
                          type="submit"
                          className={classes.next_button}
                        >
                          <Text tid={`Quote.${'SendMessage'}`}/>
                        </Button>
                      </Grid>
                    </Grid>
                
                </Form>
              )}
            </Formik>  

        </Grid>
      </Grid>
    </div>
  )

  } else {
      return( 
          <SubmitResult
              formData={formData}
          />   
      )

  }
}