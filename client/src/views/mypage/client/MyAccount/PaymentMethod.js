import React from 'react';

// form and validation
import { Formik, Form /*ErrorMessage, Field, validateYupSchema */} from 'formik'
//import * as Yup from 'yup'
import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Grid } from '@material-ui/core'

// common components
import { RegularTextField, /*SelectTextField*/ } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'

// style
//import { makeStyles } from '@material-ui/core/styles'
//import formStyle from './../../../../assets/jss/styles/formStyle'

//const useStyles = makeStyles(formStyle);

const initialValues = {
    cardHolder: '',
    cardNum: '',
    expireDate: '',
    cCV: ''
}

// need to make validation components for card numbers and cCVs
const validationSchema = {
    cardHolder: Validation.validRequiredField(),
    cardNum: Validation.validRequiredField(),
    expireDate: Validation.validRequiredDateField(),
    cCV: Validation.validRequiredField()
}

export const PaymentMethod = (props) => {
  //const classes = useStyles();

  return (
    <div>
      <Card variant='outlined'>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // handleSubmit(values)
              console.log(values)
            }}>
            {({ values  }) => (
            <Form>
              <Grid container spacing={2}>

                <Grid item container xs={12} sm={10}>
                <Grid item xs={12} sm={4}>
                  <RegularTextField
                      name='cardHolder'
                      label='Card Holder'
                      value={values.cardHolder}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <RegularTextField
                      name='cardNum'
                      label='Card Number'
                      value={values.cardNum}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <RegularTextField
                      name='expireDate'
                      label='Expire Date'
                      value={values.expireDate}
                      type='date'
                  />
                </Grid >

                <Grid item xs={12} sm={1}>
                  <RegularTextField
                      name='cCV'
                      label='CCV'
                      value={values.cCV}
                  />
                </Grid>
                </Grid>

                <Grid item container xs={12} sm={2} spacing={2} direction='column' alignItems='center' justify='center'>
                <Grid item>
                  <Button color='primary' size='md'>
                      Update
                  </Button>
                </Grid>

                <Grid item>
                  <Button color='warning' size='md'>
                      Delete
                  </Button>
                </Grid>
                </Grid>

              </Grid>
            </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}