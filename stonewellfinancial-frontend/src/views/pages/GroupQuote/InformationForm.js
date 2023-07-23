import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getProvince } from '../../../redux/actions/countries';
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import clsx from 'clsx';
import { Grid, Typography } from '@material-ui/core';
import MuiPhoneInput from 'material-ui-phone-number';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Autocomplete } from '@material-ui/lab';
// common components
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField';
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
// style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

const contactMethod = [
  { code: 'Phone', desc: 'Phone' },
  { code: 'Email', desc: 'Email' },
]

// Validation
const validationSchema = Yup.object({
  // Company Information
  companyName: Validation.validRequiredField(),
  natureOfBusiness: Validation.validRequiredField(),
  contactPerson: Validation.validRequiredField(),
  phone: Validation.validPhoneNumber(),
  email: Validation.validEmail(),
  contactMethod: Validation.validRequiredField(),
  businessYear: Yup.number()
    .test('len', 'Invalid Year',
      val => val && val.toString().length === 4).max(new Date().getFullYear(), 'Invalid Year'),
  numberOfFullTime: Yup.number()
    .required('FieldIsRequired')
    .min(3, 'MinimunNumberShouldBeAtLeast3'),
  numberOfcovered: Validation.validRequiredNumberMin1Field().when('numberOfFullTime', (numberOfFullTime) => {
    if (numberOfFullTime) {
      return Validation.validRequiredNumberMin1Field().max(+numberOfFullTime, "NumberEmployeesExceed")
    }
  }),
  reasonNotSame: Yup.string().when(['numberOfFullTime', 'numberOfcovered'],{
    is: (numberOfFullTime, numberOfcovered) =>
        numberOfFullTime > numberOfcovered,
    then: Validation.validRequiredField()
  }),

  insuredPersons: Yup.array().of(
    Yup.object().shape({
      firstName: Validation.validRequiredField(),
      lastName: Validation.validRequiredField(),
      birthDate: Validation.validRequiredBrithDateField(),
      gender: Validation.validRequiredField(),
      type: Validation.validRequiredField().nullable(),
      province: Validation.validRequiredField(),
    })
  )
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

const InformationForm = (props) => {
  const { groupFormData } = props;    
  
  const provinces = useSelector(state => state.countryReducer.provinces)
  const classes = useStyles();
  const dispatch = useDispatch();

  const [direction, setDirection] = useState('back');

  // useEffect
  useEffect(() => {
    dispatch(getProvince())
  }, [dispatch]);

  // add Insured person(s) information
  function addInsuredInfo(numberOfFullTime, insuredPersons) {
    const insured = (parseInt(numberOfFullTime)) - insuredPersons.length
    if (insured <= 0) {
      // remove insured information
      for (var ii = 0; ii < (insured * -1); ii++) {
        insuredPersons.pop()
      }
    }
    else {
      // add insured information
      for (var i = 0; i < insured; i++) {
        insuredPersons.push({
          key: i,
          firstName: '',
          lastName: '',
          birthDate: null,
          gender: '',
          type: null,
          province: '',
          covered: true
        })
      }
    }
    return insuredPersons
  }

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }

    // useEffect 
    useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  let isMobile = (width <= 768);
  let height = '0px'

  return (
    <>
      <QuoteBanner2 title={'Quote.GroupIns.Title'} subTitle={'Quote.GroupIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={2} />
      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.Group.TellUsAboutCompany'}/>
        <span className={classes.title_question_sub2}><Text tid={'Quote.Group.TellUsAboutCompany.Notice'}/></span>
      </Typography>
     
      <Formik
        initialValues={groupFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          props.updateGroupFormData(values);
            direction === 'back' 
                ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                : props.history.push(pathDirection(props.location.pathname, values).nextStep);
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
          <Form className={classes.formWrapper}>
            <Grid container justify="center" spacing={2}>
              <Grid item container  xs={12} sm={10} md={10} lg={8}>
                <Typography variant='h5' className={classes.inputPaddingTitle} >
                  <div>
                    <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.Group.CompanyInformation'}/>
                </Typography>
              </Grid>
              <Grid item container xs={12} sm={10} md={10} lg={8} justify="center">
                <Grid item xs={12} sm={5} md={5}>
                  <RegularTextField
                    label={'Quote.Group.CompanyName'}
                    name="companyName"
                    // defaultValue="Default Value"
                    className={classes.textField}
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {validMessage('companyName')}
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <RegularTextField
                    label={'Quote.Group.NatureOfBusiness'}
                    name="natureOfBusiness"
                    // className={classes.textField}
                    value={values.natureOfBusiness}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {validMessage('natureOfBusiness')}
                </Grid>

                <Grid item xs={12} sm={2} md={2}>
                  <RegularTextField
                    label={'Quote.Group.BusinessYear'}
                    name="businessYear"
                    className={clsx(classes.margin, classes.textField)}
                    value={values.businessYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">Year</InputAdornment>,

                    }}
                    inputProps={{ maxLength: 4 }}
                  />
                  {validMessage('businessYear')}

                </Grid>
              </Grid>
              <Grid item container xs={12} sm={10} md={10} lg={8}>

                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <RegularTextField
                    label={'Quote.Group.ContactPerson'}
                    name="contactPerson"
                    value={values.contactPerson}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {validMessage('contactPerson')}
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={4} style={{marginTop:'12px'}}>
                  {/* <Text tid={`Quote.${'Phone'}`}/> */}
                  <Grid item xs={12} style={{ marginBottom:'8px' }}>
                    <span style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                      <Text tid={'Quote.Phone'}/>
                    </span>
                  </Grid>
                  <Field
                      className={classes.textField}
                      // fullWidth
                      name='phone'
                      // label="Phone Number"
                      // size="small"
                      variant="outlined"
                      value = {values.phone}
                      type = 'tel'
                      as={MuiPhoneInput}
                      defaultCountry= {"ca"}
                      onlyCountries={['ca','kr']}
                      disableAreaCodes={true}
                      countryCodeEditable={false}
                      // inputProps={{ autoFocus: true }}
                      onChange={(value) => setFieldValue('phone', value)}
                      onBlur={handleBlur}
                  />
                  {validMessage('phone')}
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={4}>
                  {/* <Text tid={`Quote.${'Email'}`}/> */}
                  <RegularTextField
                    // className={classes.textField}
                    type="text"
                    name="email"
                    label={'Quote.Email'}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {validMessage('email')}
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.PreferContactMethod'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="contactMethod" 
                        value = {values.contactMethod}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`contactMethod`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`contactMethod`)}
                    >
                      {contactMethod.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage(`contactMethod`)}
                </Grid>

              </Grid>

              

            
              {/* Employees Information */}
              <Grid item container xs={12} sm={10} md={10} lg={8}>
                <Grid item container  xs={12}>
                  <Typography variant='h5' className={classes.inputPaddingTitle} >
                    <div>
                      <span className={classes.grayLine}></span>
                    </div>
                    <Text tid={'Quote.Group.EmployeesInformation'}/>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  {/* <Text tid={'Quote.numberOfFullTime'}/> */}
                  <RegularTextField
                    type="number"
                    name="numberOfFullTime"
                    label={'Quote.Group.NumberOfFullTime'}
                    value={values.numberOfFullTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {validMessage('numberOfFullTime')}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <RegularTextField
                    type="number"
                    name="numberOfcovered"
                    label={'Quote.Group.NumberOfcovered'}
                    value={values.numberOfcovered}
                    onChange={(e) => {
                      values.numberOfcovered = e.currentTarget.value
                      setFieldValue('numberOfcovered', e.currentTarget.value)
                      setFieldValue('insuredPersons', addInsuredInfo(e.currentTarget.value, values.insuredPersons))
                      if (values.numberOfFullTime === e.currentTarget.value)
                          {setFieldValue('reasonNotSame', '')}
                    }}
                    onBlur={handleBlur}
                  />
                  {validMessage('numberOfcovered')}
                </Grid>

                {(!!values.numberOfcovered) && (+values.numberOfcovered < +values.numberOfFullTime) &&
                  <Grid item xs={12} sm={12}>
                    <RegularTextField
                      label={'Quote.Group.ReasonNotSame'}
                      name="reasonNotSame"
                      multiline
                      rows={10}
                      value={values.reasonNotSame}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {validMessage('reasonNotSame')}
                  </Grid> 
                }
              </Grid>
            </Grid>

            {/* <Grid item container justify="center"> */}
              <FieldArray
                name='insuredPersons'
                render={() => (
                  values.insuredPersons && (values.insuredPersons.length > 0) && !(values.numberOfcovered > values.numberOfFullTime)
                    ? values.insuredPersons.map((insuredPerson, index) => (
                      <div key={index}>
                      <Grid item container justify="center">
                        <Grid item container xs={12} sm={10} md={10} lg={8} style={{ marginTop:'5vh'}}>
                          <Grid item xs={8}>
                            <small><b>{`${index + 1}`}</b></small>
                          </Grid>
                          <Grid item xs={4} style={{ fontSize: '12px', margin: 'auto', textAlign: 'right' }}>
                              <ToggleButtonGroup
                                  className={classes.toggleButtonGroup}
                                  name={`insuredPersons.${index}.type`}
                                  value={insuredPerson.type}
                                  exclusive
                                  onChange={(e) => {
                                      setFieldValue(`insuredPersons.${index}.type`, e.currentTarget.value)
                                  }}
                                  onBlur={() => setFieldTouched(`insuredPersons.${index}.type`)}
                              >
                                  <ToggleButton id='Family' value="Family" className={classes.toggleButton}>
                                      Family
                                  </ToggleButton>
                                  <ToggleButton id='Single' value="Single" className={classes.toggleButton}>
                                      Single
                              </ToggleButton>
                              </ToggleButtonGroup>
                              {validMessage(`insuredPersons.${index}.type`)}
                            
                          </Grid>
                        </Grid>

                        <Grid item container xs={12} sm={10} md={10} lg={8}>

                            <Grid item xs={12} sm={6} md={4} lg={2}>
                              <RegularTextField
                                label={'Quote.FirstName'}
                                name={`insuredPersons.${index}.firstName`}
                                placeholder="First Name"
                                value={insuredPerson.firstName}
                                // onChange={handleChange}
                                onChange={(e) => {
                                  setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                }}                
                                onBlur={handleBlur}
                              />
                              {validMessage(`insuredPersons.${index}.firstName`)}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={2}>
                              <RegularTextField
                                label={'Quote.LastName'}
                                name={`insuredPersons.${index}.lastName`}
                                placeholder="Last Name"
                                value={insuredPerson.lastName}
                                // onChange={handleChange}
                                onChange={(e) => {
                                  setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                }}                
                                onBlur={handleBlur}
                              />
                              {validMessage(`insuredPersons.${index}.lastName`)}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Typography style={{marginLeft: 6, marginBottom: 6, marginTop: 12 }}><Text tid={'Quote.BirthDate'}/></Typography>
                              <KeyboardDatePickerField
                                  value={values.insuredPersons[index].birthDate}
                                  name={`insuredPersons.${index}.birthDate`}
                                  style={{ width: '100%' }}
                                  maxDate={new Date()}
                                  onChange={(e) => {
                                      values.insuredPersons[index].birthDate = e
                                      setFieldValue(`insuredPersons.${index}.birthDate`, e)
                                  }}
                              />
                              {validMessage(`insuredPersons.${index}.birthDate`)}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Autocomplete
                                name={`insuredPersons.${index}.province`}
                                value={insuredPerson.province ? provinces.find(c => c.country_code === 'CA' && c.province_code === insuredPerson.province) : null}
                                options={provinces.filter(i => i.country_code === 'CA')}
                                getOptionLabel={(option) => option.province_name}
                                size="small"
                                renderInput={(params) =>
                                  <RegularTextField {...params}
                                    placeholder="Province"
                                    label={'Quote.Province'}
                                  />}
                                onChange={(e, selectedVal) => {
                                  insuredPerson.province = selectedVal? selectedVal.province_code: ''
                                }}
                                onBlur={() => setFieldTouched(`insuredPersons.${index}.province`)}
                              />
                              {validMessage(`insuredPersons.${index}.province`)}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4} lg={2} style={{paddingLeft: isMobile ? 0 : '12px' }}>
                              <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Gender'}/></Typography>
                              
                              <ToggleButtonGroup
                                  className={classes.toggleButtonGroup}
                                  name={`insuredPersons.${index}.gender`}
                                  value={insuredPerson.gender}
                                  exclusive
                                  onChange={(e) => {
                                    setFieldValue(`insuredPersons.${index}.gender`, e.currentTarget.value)
                                  
                                  }}
                                  onBlur={() => setFieldTouched(`insuredPersons.${index}.gender`)}
                              >
                                  <ToggleButton id='male' value="Male" className={classes.toggleButton}>
                                      <Text tid={'Quote.Male'}/>
                                  </ToggleButton>
                                  <ToggleButton id='female' value="Female" className={classes.toggleButton}>
                                    <Text tid={'Quote.Female'}/>
                              </ToggleButton>
                              </ToggleButtonGroup>
                              {validMessage(`insuredPersons.${index}.gender`)}
                          </Grid>

                        </Grid>
                      </Grid>
                    </div>
                    )) : null)}
              />
            {/* </Grid> */}

            <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Button
                    // type='submit'
                    // variant='contained'
                    color="secondary" 
                    className={classes.back_button}
                    // onClick={() => prevStep()}
                    onClick={() => {
                      props.updateGroupFormData(values); 
                      props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    }}
                  >
                    <Text tid={'Button.Privous'}/>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Button
                    type='submit'
                    // variant='contained'
                    color="dark" 
                    className={classes.next_button}
                    // onClick={() => nextStep()}
                    onClick={() => setDirection('forward')}
                  >
                    <Text tid={'Button.ReviewMyApplication'}/>
                  </Button>
                </Grid>
            </Grid>

          </Form>
        )}
      </Formik>
    </>
  );
};

// ProtoTypes
InformationForm.propTypes = {
  groupFormData: PropTypes.object.isRequired,
};

export default InformationForm;