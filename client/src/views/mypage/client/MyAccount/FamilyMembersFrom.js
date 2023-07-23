import React from 'react';

// form and validation
import { Formik, Form, FieldArray, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Grid } from '@material-ui/core'

// common components
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'

// style
import { makeStyles } from '@material-ui/core/styles'
import formStyle from './../../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

export const FamilyMembers = (props) => {
  const classes = useStyles()

  const initialValues = {
    members : [
      {
        firstName: '',
        lastName: ''
      }
    ]
  };

  function validMessage(fieldName) {
    return (
        <ErrorMessage
            name={fieldName}
            render={(msg) => <div style={{ color: 'red',  marginLeft: '2vh', fontSize: 12}}>{msg}</div>}
          />
    )
  }

  return (
    <div className={classes.root}>
      <Card variant='outlined'>
        <CardContent>
          <Grid container>

            <Formik
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                // handleSubmit(values)
                console.log(values)
              }}>
              {({ values, setFieldValue, handleChange, touched }) => (
              <Form>
                <FieldArray
                  name="members"
                  render={({ push, remove }) => (
                  <div>
                    {values.members && values.members.length > 0
                      ? values.members.map((member, index) => (
                          <div key={index}>
  
                            <Grid  item xs={12}>
                            <RegularTextField
                              name={`members.${index}.firstName`}
                              values={member.firstName}
                            />
                            {validMessage(`members.${index}.firstName`)}
                            </Grid>

                            <Button
                              color="secondary" size="md" 
                              onClick={() => {
                                remove(index)
                              }} // remove a member
                            >
                              Delete this member
                            </Button>                          
                            <br />
                            <br />
                          </div>
                        ))
                      : null}
                    <Button
                      color="primary" size="md" 
                      onClick={() =>
                        push({
                          firstName: "",
                          lastName: "",
                        })
                      } // insert an empty string at a position
                    >
                      add a member
                    </Button>
                    <br />
                    <br />
                  </div>

                  )}
                />

              </Form>
              )}
            </Formik>


            </Grid>
            
        </CardContent>
      </Card>
    </div>
  )
}
