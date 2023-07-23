import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import {Grid, Typography } from '@material-ui/core';
import MuiPhoneInput from 'material-ui-phone-number';
// common components
import Button from '../../../components/common/CustomButtons/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField';
import { Text } from '../../../components/common/LanguageProvider';
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import { CalculateAge } from '../../../controllers/CalculateValue';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

//
const statusHealth = [
  {code: 'VeryGood', desc: 'Very Good'},
  {code: 'GoodWithMinorIllness', desc: 'Good with minor illness'},
  {code: 'ExistingMedicalConditions', desc: 'Existing medical conditions'}
]

const statusSmoke = [
  {code: 'Yes', desc: 'Yes'},
  {code: 'No', desc: 'No'},
]

const contactMethod = [
  {code: 'Phone', desc: 'Phone'},
  {code: 'Email', desc: 'Email'},
];


// Validation
const validationSchema = Yup.object({
  firstName: Validation.validRequiredField(),
  lastName: Validation.validRequiredField(),
  birthDate: Validation.validRequiredBrithDateField(),
  gender: Validation.validRequiredField(),
  smokeStatus: Validation.validRequiredField(),
  healthStatus: Validation.validRequiredField(),
  phone: Validation.validPhoneNumber(),
  email: Validation.validEmail(),
  contactMethod: Validation.validRequiredField()
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
    const { lifeFormData } = props;    
  
  const classes = useStyles();

  const [direction, setDirection] = useState('back');

  let height = '0px'

  return (
    <>
      <QuoteBanner2 title={'Quote.LifeIns.Title'} subTitle={'Quote.LifeIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={2}/>

      {/* Title */}
      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.TellUsAboutYou'}/>
        <span className={classes.title_question_sub2}><Text tid={'Quote.TellUsAboutYou.Notice'}/></span>
      </Typography>
      

      <Formik
        initialValues={lifeFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          // values.age = age
          values.healthStatusDesc = statusHealth.filter(p => p.code === values.healthStatus)[0].desc
          props.updateLifeFormData(values);
            direction === 'back' 
                ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                : props.history.push(pathDirection(props.location.pathname, values).nextStep);
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (

        <Form className={classes.formWrapper}>
          <Grid container spacing={0} justify="center">
            <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2}>
              {/* Personal Info */}
              <Grid item xs={12} className={classes.inputPaddingTitle}> 
                  <div>
                    <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.PersonalInfomation'}/>
              </Grid>

              {/* first Name */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
                <RegularTextField
                  label={'Quote.FirstName'}
                  name="firstName"
                  value={values.firstName}
                  // onChange={handleChange}
                  onChange={(e) => {
                    setFieldValue(`firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                  }}  
                  onBlur={handleBlur}
                />
                {validMessage('firstName')}
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
                <RegularTextField
                  label={'Quote.LastName'}
                  name="lastName"
                  value={values.lastName}
                  // onChange={handleChange}
                  onChange={(e) => {
                    setFieldValue(`lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                  }}  
                  onBlur={handleBlur}
                />
                {validMessage('lastName')}
              </Grid>

              {/* Birth Date */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} className={classes.textFieldWrapper}>
                  <Typography style={{marginLeft: 6, marginBottom: 6, marginTop: 12 }}><Text tid={'Quote.BirthDate'}/></Typography>
                  <KeyboardDatePickerField
                      value = {values.birthDate}
                      name="birthDate"
                      style={{ width: '100%' }}
                      maxDate={new Date()}
                      onChange={(e) => {
                        values.birthDate = e
                        setFieldValue('birthDate', e)
                        setFieldValue('age',CalculateAge(e))
                      }}
                      onBlur={handleBlur}
                    />
                    {validMessage('birthDate') }
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                  <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Gender'}/></Typography>
                  
                  <ToggleButtonGroup
                      className={classes.toggleButtonGroup}
                      name="gender"
                      value={values.gender}
                      exclusive
                      onChange={(e) => {
                        setFieldValue(`gender`, e.currentTarget.value)
                      
                      }}
                      onBlur={() => setFieldTouched(`gender`)}
                  >
                      <ToggleButton id='male' value="Male" className={classes.toggleButton}>
                        <Text tid={'Quote.Male'}/>
                      </ToggleButton>
                      <ToggleButton id='female' value="Female" className={classes.toggleButton}>
                        <Text tid={'Quote.Female'}/>
                  </ToggleButton>
                  </ToggleButtonGroup>
                  {validMessage(`gender`)}
              </Grid>
            
                {/* Age */}
                {/* <Grid item xs={4} lg={2}>
                  <RegularTextField
                      label="Age"
                      name="age"
                      value ={values.age}
                      disabled = {true}
                    />
                </Grid> */}

              {/* Smoking status */}
              <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.SmokeStatus'}/></Typography>
                
                <ToggleButtonGroup
                    className={classes.toggleButtonGroup}
                    name="smokeStatus"
                    value={values.smokeStatus}
                    exclusive
                    onChange={(e) => {
                      setFieldValue(`smokeStatus`, e.currentTarget.value)
                      
                    }}
                    onBlur={() => setFieldTouched(`smokeStatus`)}
                >
                  {statusSmoke.map((item) => (
                    <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                      <Text tid={`Button.${item.desc}`}/>
                    </ToggleButton>
                  ))} 
                </ToggleButtonGroup>
                {validMessage('smokeStatus')}
              </Grid>

              {/* Health status */}
              <Grid item xs={12} sm={12} md={12} lg={10} >
                  <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.HealthStatus'}/></Typography>
                  
                  <ToggleButtonGroup
                      className={classes.toggleButtonGroup}
                      name="healthStatus"
                      value={values.healthStatus}
                      exclusive
                      onChange={(e) => {
                        setFieldValue(`healthStatus`, e.currentTarget.value)
                        
                      }}
                      onBlur={() => setFieldTouched(`healthStatus`)}
                  >
                    {statusHealth.map((item) => (
                      <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                        <Text tid={`Quote.${item.code}`}/>
                      </ToggleButton>
                    ))} 
                  </ToggleButtonGroup>
                  {validMessage(`healthStatus`)}
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} className={classes.inputPaddingTitle}> 
                  <div>
                    <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.ContactInformation'}/>
              </Grid>

              {/* phone */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} style={{marginTop:'12px'}}>
                  {/* <Text tid={`Quote.${'Phone'}`}/> */}
                  <Grid item xs={12}  style={{ marginBottom:'8px' }}>
                    <span style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                      <Text tid={'Quote.Phone'}/>
                    </span>
                  </Grid>
                  <Field
                      className={classes.textField}
                      // fullWidth
                      name='phone'
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
                  />
                  { validMessage('phone') }
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
                <RegularTextField
                  type="text"
                  name="email"
                  label={'Quote.Email'}
                  value = {values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {validMessage('email')}
              </Grid>
                

              {/* Prefered Contact Method */}
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
                      <Text tid={`Quote.${item.desc}`}/>
                    </ToggleButton>
                  ))} 
                </ToggleButtonGroup>
                {validMessage(`contactMethod`)}
              </Grid>
          
            </Grid>
          </Grid>

          <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
            <Grid item xs={6} lg={3}>
              <Button
                // type='submit'
                // variant='contained'
                color="secondary" 
                className={classes.back_button}
                onClick={() => {
                  window.scrollTo(0, 0)
                  props.updateLifeFormData(values); 
                  props.history.push(pathDirection(props.location.pathname, values).prevStep)
                }}
              >
                <Text tid={'Button.Previous'}/>
              </Button>
            </Grid>
            <Grid item xs={6} lg={3}>
              <Button
                type='submit'
                // variant='contained'
                color="dark" 
                className={classes.next_button}
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
  lifeFormData: PropTypes.object.isRequired,
};

export default InformationForm;