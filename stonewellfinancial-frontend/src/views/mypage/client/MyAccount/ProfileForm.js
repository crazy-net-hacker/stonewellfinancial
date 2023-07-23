import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useFormik } from 'formik';
import * as Yup from 'yup';

// style
import formStyle from './../../../../assets/jss/styles/formStyle'
// core components
import { Card, CardContent } from '@material-ui/core'
import { Grid } from '@material-ui/core'
// common components
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'
import * as Validation from '../../../Validation'


const useStyles = makeStyles(formStyle)

export const ProfileForm = (props) => {

  const classes = useStyles()

  // form initial values & validation schema
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Validation.validRequiredField(),
      lastName: Validation.validRequiredField(),
      email: Validation.validEmail(),
    }),
    onSubmit: values => {
      console.log(values)
    },
  });


  return (
    <Card variant="outlined" >
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <RegularTextField
                {...formik.getFieldProps('lastName')}
                name="lastName"
                label="Last Name"
                helperText={formik.touched.lastName && formik.errors.lastName}
                error={!!formik.errors.lastName}
              />
          </Grid>

          <Grid item xs={12} sm={4}>
            <RegularTextField
                {...formik.getFieldProps('firstName')}
                name="firstName"
                label="First Name"
                helperText={formik.touched.firstName && formik.errors.firstName}
                error={!!formik.errors.firstName}
              />
          </Grid>

          <Grid item xs={12} sm={4}>
            <RegularTextField
                {...formik.getFieldProps('email')}
                name="email"
                label="Email"
                helperText={formik.touched.email && formik.errors.email}
                error={!!formik.errors.email}
              />
          </Grid>
        
          </Grid>
          <Grid item xs={12} className={classes.textEnd}>
            <Button color="primary" size="md" type="submit">
              Update
            </Button>
          </Grid>

        </form>
      </CardContent>
    </Card>
  );
};