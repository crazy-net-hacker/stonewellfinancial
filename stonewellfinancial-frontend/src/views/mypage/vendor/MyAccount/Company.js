import React, { useState } from 'react';

// form and validation
import { Formik, Form } from 'formik'
// import { ErrorMessage } from 'formik'

import * as Yup from 'yup'
import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Typography, Grid } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider'
import MuiPhoneInput from 'material-ui-phone-number'
import { Field } from 'formik'

// import MuiPhoneInput from 'material-ui-phone-number'

// common components
// import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'

// Modal
// import EditProfileModal from './EditProfileModal'

// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// style
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)


export const Company = ({company,data}) => {
  const classes = useStyles()

  const initialValues = {
    // firstName: profile[0]?profile[0].firstname:'',
    // lastName: profile[0]?profile[0].lastname:'',
    // birthDate: profile[0]?profile[0].birthDate:'',
    // gender: profile[0]?profile[0].gender:'',
    logo: '',
    organizationName: 'Stonewell Financial',
    email: 'info@stonewellfinancial.com',
    phone: '1-416-645-3858',
  }

    const [openEdit, setOpenEdit] = useState(false)

  const validationSchema = Yup.object({
    // questionType: Validation.validRequiredField(),
    organizationName: Validation.validRequiredField(),
    emailAdd: Validation.validEmail(),
    phone: Validation.validPhoneNumber(),
  })
  
  // function validMessage(fieldName) {
  //   return (
  //       <ErrorMessage
  //           name={fieldName}
  //           render={(msg) => <div style={{ color: 'red',  marginLeft: '2vh', fontSize: 12}}>{msg}</div>}
  //         />
  //   )
  // }
  
  const handleSubmit = (values) => {
    values.status = 'requested'
    console.log(values)
  }

  return (
      <div>
        <Card variant="outlined">
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <Grid container>
                    <Grid item container style={{  marginBottom:openEdit === true ? '0':'30px', borderBottom:'1px solid #efefef', paddingBottom:'15px' }}>
                      <Grid item xs={10} style={{ alignSelf: 'center' }}>
                        <Typography className={classes.cardBoxTitle}>
                          {/* <Text tid={'Vendor.StartApplication'} /> */}
                          <AccountCircleIcon/>
                          <span style={{ marginLeft:'5px' }}>
                            <Text tid={'Dashboard.Organization'} />
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ textAlign:'right' }}>
                        <Button 
                          color="primary" 
                          size="md" 
                          // type="submit"
                          // onClick={() => handleEditData(profile)}
                          onClick={() => setOpenEdit(!openEdit)}
                        >
                          {openEdit === true ? 'Save' : 'Edit'}
                        </Button>
                      </Grid>
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Dashboard.OrganizationName'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='organizationName'
                            label=''
                            value={values.organizationName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.organizationName}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Phone'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <Field
                            name="phone"
                            className="form-control"
                            // size="small"
                            style={{ margin:'8px 0' }}
                            variant="outlined"
                            value={values.phone}
                            type="tel"
                            as={MuiPhoneInput}
                            defaultCountry={'ca'}
                            onlyCountries={['ca', 'kr']}
                            disableAreaCodes={true}
                            countryCodeEditable={false}
                            onChange={(value) => setFieldValue('phone', value)}
                            // label="Phone Number"
                          />
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                             {values.phone}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Email'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='email'
                            label=''
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                             {values.email}
                         </Grid>
                      }
                    </Grid>

                </Grid>

                {/* {openEditProfile === true &&
                  <EditProfileModal
                    editData={editData}
                    // company={insurance.company}
                    // plan={insurance.plan}
                    // type={insurance.type}
                    open={openEditProfile}
                    handleClose={setOpenEditProfile}
                  />
                } */}
              </Form>
              
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
