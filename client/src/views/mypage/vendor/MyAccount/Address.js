import React, { useEffect, useState } from 'react'

// form and validation
import { Formik, Form, ErrorMessage } from 'formik'
// import { Formik, Form} from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Typography, Grid } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider'
// import { Autocomplete } from '@material-ui/lab'

// common components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField  } from '../../../../components/common/CustomTextFields/TextField'

// Redux
// import { useSelector, useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getCountry } from '../../../../redux/actions/countries'
// import { getProvince } from '../../../../redux/actions/countries'

// styles
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// icons
import HomeIcon from '@mui/icons-material/Home';

const useStyles = makeStyles(dashboardStyles)

function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => <div style={{ color: 'red' }}>{msg}</div>}
    />
  )
}

const initialValues = {
  // questionType: '',
  streetName: '4576 Yonge Street',
  suiteNum: '608',
  city: 'Toronto',
  provinceName: 'Ontario',
  postalCode: 'M2N 6N4',
  countryName: 'Canada',
  status: 'requested',
}

const validationSchema = Yup.object({
  //questionType: Validation.validRequiredField(),
  streetName: Validation.validRequiredField(),
  suiteNum: Validation.validRequiredField(),
  provinceName: Validation.validRequiredField(),
  postalCode: Validation.validPostalCode(),
  countryName: Validation.validRequiredField(),
})

export const Address = (props) => {
  const classes = useStyles()

  const dispatch = useDispatch()
  // const countries = useSelector((state) => state.countryReducer.countries)
  // const provinces = useSelector((state) => state.countryReducer.provinces)

  useEffect(() => {
    dispatch(getCountry())
    // dispatch(getProvince())
  }, [dispatch])

  const handleSubmit = (values) => {
    values.status = 'requested'
    console.log(values)
  }

  const [openEdit, setOpenEdit] = useState(false)

  console.log(initialValues)
  return (
      <div className={classes.root} style={{ marginTop:'1vh' }}>
        <Card variant="outlined">
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ values, handleChange, handleBlur,  setFieldValue }) => (
                <Form>
                  <Grid container>

                    <Grid item container style={{ marginBottom:openEdit === true ? '0':'30px', borderBottom:'1px solid #efefef', paddingBottom:'15px' }}>
                        <Grid item xs={10} style={{ alignSelf: 'center' }}>
                          <Typography className={classes.cardBoxTitle}>
                            {/* <Text tid={'Vendor.StartApplication'} /> */}
                            <HomeIcon/>
                            <span style={{ marginLeft:'5px' }}>
                              <Text tid={'Dashboard.Address'} />
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
                            {openEdit === true ? 'Update' : 'Edit'}
                          </Button>
                        </Grid>
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Street'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='streetName'
                            label=''
                            value={values.streetName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('streetName')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.streetName}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.UnitNumber'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='suiteNum'
                            label=''
                            value={values.suiteNum}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('suiteNum')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.suiteNum}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.City'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='city'
                            label=''
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('city')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.city}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Province'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='provinceName'
                            label=''
                            value={values.provinceName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('provinceName')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.provinceName}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.PostalCode'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='postalCode'
                            label=''
                            value={values.postalCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('postalCode')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.postalCode}
                         </Grid>
                      }
                    </Grid>

                    <Grid item container style={{ margin:openEdit === true ? '0':'8px' }}>
                      <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                        <Text tid={'Quote.Country'} />
                      </Grid>
                      {openEdit === true ? 
                        <Grid item xs={12} sm={6} md={3}>
                          <RegularTextField
                            name='countryName'
                            label=''
                            value={values.countryName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // error={errors.lastName}
                          />
                          {validMessage('countryName')}
                        </Grid>
                      :  <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                            {values.countryName}
                         </Grid>
                      }
                    </Grid>




                    {/* <Grid item xs={12} sm={6} lg={4}>
                      <label>
                        <Field type="checkbox" name="addressInCanada" as={Checkbox} />
                        {'This is address in Canada'}
                      </label>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={4}>
                      <label>
                        <Field type="checkbox" name="sameMailAddress" as={Checkbox} />
                        {'This is also mailing address'}
                      </label>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <RegularTextField
                        label="Street Address"
                        value={values.streetName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="streetName"
                      />
                      {validMessage('streetName')}
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <RegularTextField
                        label="Suite/Unit"
                        value={values.suiteNum}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="suiteNum"
                      />
                      {validMessage('suiteNum')}
                    </Grid>

                    <Grid item container style={{ marginBottom:'30px' }}>
                        <Grid item xs={12} sm={5}>
                          <SelectTextField
                            label="Province"
                            value={values.provinceName}
                            name="provinceName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland and Labrador</option>
                            <option value="NT">Northwest Territories</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="NU">Nunavut</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                            <option value="YT">Yukon</option>
                          </SelectTextField>
                          {validMessage('provinceName')}
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <RegularTextField
                            label="Postal Code"
                            value={values.postalCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="postalCode"
                          />
                          {validMessage('postalCode')}
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            name="countryName"
                            options={countries}
                            value={
                              values.countryName
                                ? countries.find(
                                    (c) => c.country_code === values.countryName
                                  )
                                : null
                            }
                            getOptionLabel={(option) => option.name}
                            getOptionDisabled={(option) =>
                              option.country_code ===
                              (values.destCountry !== 'CA'
                                ? values.destCountry
                                : null)
                            }
                            size="small"
                            renderInput={(params) => (
                              <RegularTextField {...params} label="Country" />
                            )}
                            onChange={(e, selectedVal) => {
                              values.originCountry = selectedVal
                                ? selectedVal.country_code
                                : ''
                              values.originCountryName = selectedVal
                                ? selectedVal.name
                                : ''
                              setFieldValue(
                                'originCountry',
                                selectedVal ? selectedVal.country_code : ''
                              )
                              setFieldValue('originProvince', '')
                            }}
                            onBlur={handleBlur}
                          />
                          {validMessage('countryName')}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign:'right' }}>
                      <Button color="primary" size="md" type="submit">
                        Update
                      </Button>
                    </Grid> */}

                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
  )
}
