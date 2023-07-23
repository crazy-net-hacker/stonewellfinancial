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
import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'

// Modal
// import EditProfileModal from './EditProfileModal'

// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// style
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)


export const Profile = ({profile,data}) => {
  const classes = useStyles()

  const initialValues = {
    // firstName: profile[0]?profile[0].firstname:'',
    // lastName: profile[0]?profile[0].lastname:'',
    // birthDate: profile[0]?profile[0].birthDate:'',
    // gender: profile[0]?profile[0].gender:'',
    firstName: 'Samantha',
    lastName: 'Jin',
    gender: 'Female',
    birthDate: '2000-01-01',
    ghip: 'Yes',
    // email: profile[0]?profile[0].email:'',
    // phoneNum: profile[0]?profile[0].phone:'',
    email: 'samantha@stonewellfinancial.com',
    phone: '1-416-645-3858',
    statusCanada: 'permResident',
    status: 'requested',
  }

   // Edit Profile modal
    // const [editData, setEditData] = useState([]);
    // const [openEditProfile, setOpenEditProfile] = useState(false)
    
    // const handleEditData = (profile) => {
    //   //  applications.filter(f => (f.insuredpersons.insuredPersonID === person.insuredPersonID))
    //   setEditData(profile)
    //   console.log(profile)
    //   setOpenEditProfile(true)
    // }
    const [openEdit, setOpenEdit] = useState(false)
    // console.log(profile)
    // console.log(data)
  
  const validationSchema = Yup.object({
    // questionType: Validation.validRequiredField(),
    firstName: Validation.validRequiredField(),
    lastName: Validation.validRequiredField(),
    birthDate: Validation.validRequiredDateField(),
    age: Validation.validRequiredNumberField(),
    gender: Validation.validRequiredField(),
    emailAdd: Validation.validEmail(),
    phoneNum: Validation.validPhoneNumber(),
    statusCanada: Validation.validRequiredField(),
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
                            <Text tid={'Dashboard.Profile'} />
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
                        <Text tid={'Quote.FirstName'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='firstName'
                            label=''
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.firstName}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.LastName'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='lastName'
                            label=''
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.lastName}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Gender'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='gender'
                            label=''
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.gender}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.BirthDate'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='birthDate'
                            label=''
                            type="date"
                            value={values.birthDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {/* {validMessage('firstName')} */}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                             {values.birthDate}
                         </Grid>
                      }
                    </Grid>


                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Dashboard.StatusInCanada'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <SelectTextField
                            name='StatusInCanada'
                            label=''
                            value={values.statusCanada}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          >
                          {/* {validMessage('firstName')} */}
                          <option hidden>Select status</option>
                          <option value="iStudent">International Student</option>
                          <option value="visitor">Visitor</option>
                          <option value="foreignWorker">Foreign Worker</option>
                          <option value="tempResident">Temporary Resident</option>
                          <option value="permResident">Permanent Resident</option>
                          <option value="citizen">Canadian Citizen</option>
                          </SelectTextField>
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                             {values.statusCanada}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px'  }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Dashboard.CoveredByGHIP'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <SelectTextField
                            name='CoveredByGHIP'
                            label=''
                            value={values.ghip}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          >
                          {/* {validMessage('firstName')} */}
                          <option hidden>Select option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          </SelectTextField>
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                             {values.ghip}
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
                      

                    {/* <Grid item xs={12} sm={6}>

                      <RegularTextField
                        name='lastName'
                        label='Last Name'
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        // error={errors.lastName}
                      />
                      {validMessage('lastName')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <RegularTextField
                        name="firstName"
                        label="First Name"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {validMessage('firstName')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <RegularTextField
                        name="birthDate"
                        label="Date of Birth"
                        type="date"
                        value={values.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {validMessage('birthDate')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <SelectTextField
                        name="gender"
                        label="Gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option hidden>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </SelectTextField>
                      {validMessage('gender')}
                    </Grid>

                    <Grid item xs={12} sm={6} style={{padding: 20}}>
                    <MuiPhoneInput
                      name="phoneNum"
                      label="Phone Number"
                      value={values.phoneNum}
                      defaultCountry={'ca'}
                      onlyCountries={['ca', 'kr']}
                      disableAreaCodes={true}
                      countryCodeEditable={false}
                      // onChange={handleChange}
                      onChange={(value) => setFieldValue('phoneNum', value)}
                      onBlur={handleBlur}
                      // render={(params) =>
                      //   <RegularTextField {...params} label="Phone #" />
                      // }
                    />
                      {validMessage('phoneNum')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <RegularTextField
                      name='email'
                      label="Email Address"
                      // defaultValue={initialValues.email}
                      value={values.email}
                      onChange={handleChange}
                      // onChange={(e) => setFieldValue(values.email, e.currentTarget.value)}
                      onBlur={handleBlur}
                    />
                      {validMessage('emailAdd')}
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <SelectTextField
                        name="statusCanada"
                        label="Status in Canada"
                        value={values.statusCanada}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option hidden>Select status</option>
                        <option value="iStudent">International Student</option>
                        <option value="visitor">Visitor</option>
                        <option value="foreignWorker">Foreign Worker</option>
                        <option value="tempResident">Temporary Resident</option>
                        <option value="permResident">Permanent Resident</option>
                        <option value="citizen">Canadian Citizen</option>
                      </SelectTextField>
                      {validMessage('statusCanada')}
                    </Grid>

                    <Grid item xs={12} sm={12} style={{ padding: 20 }}>
                      <label>
                        <Field type="checkbox" name="provHealthInsurance" as={Checkbox}/>
                        {'Covered by Provincial Health Insurance'}
                      </label>
                    </Grid> */}

                    {/* {profile[0].firstname} */}

                    
                    
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
