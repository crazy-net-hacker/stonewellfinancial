import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import {Grid, Typography } from '@material-ui/core';
import MuiPhoneInput from 'material-ui-phone-number';
import { Autocomplete } from '@material-ui/lab';
// common components
import Button from '../../../components/common/CustomButtons/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { RegularTextField, SelectTextField } from '../../../components/common/CustomTextFields/TextField';
import { Text } from '../../../components/common/LanguageProvider';
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import CustomNumberFormat from '../../../components/common/CustomNumberFormat'
import { CalculateAge } from '../../../controllers/CalculateValue';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//Style
import formStyle from '../../../assets/jss/styles/formStyle';


//common styles
const useStyles = makeStyles(formStyle)

//
const statusHealth = [
  {code: 'VeryGood', desc: 'Very Good'},
  {code: 'GoodWithMinorIllness', desc: 'Good with minor illness'},
  {code: 'ExistingMedicalConditions', desc: 'Existing medical conditions'}
]
const status = [
  {code: 'Yes', desc: 'Yes'},
  {code: 'No', desc: 'No'},
]

const contactMethod = [
  {code: 'Phone', desc: 'Phone'},
  {code: 'Email', desc: 'Email'},
];

const relationship = [
  {code: 'Spouse', desc: 'Spouse'},
  {code: 'Child', desc: 'Child'},
];

// Validation
const validationSchema = Yup.object({
  phone: Validation.validPhoneNumber(),
  email: Validation.validEmail(),
  contactMethod: Validation.validRequiredField(),
  // Family Illness History
  familyIllnessHistory: Yup.string().when("insuranceKind", 
  // { is: "Disability", 
  { is: (insuranceKind) => /^(Critical|Disability)$/.test(insuranceKind), 
    then: Validation.validRequiredField()
  }),
  // ageIllness: Yup.number().when("familyIllnessHistory", 
  //     { is: "Yes", 
  //       then: Validation.validRequiredNumberField()
  //     }),
  nameIllness: Yup.string().when("familyIllnessHistory", 
      { is: "Yes", 
        then: Validation.validRequiredField()
      }),
  // Employment Information
  annualIncome: Yup.number().when("insuranceKind", 
      { is: "Disability", 
        then: Validation.validRequiredNumberField()
      }),
  occupation: Yup.string().when("insuranceKind", 
      { is: "Disability", 
        then: Validation.validRequiredField()
      }),
  roleAtWork: Yup.string().when("insuranceKind", 
      { is: "Disability", 
        then: Validation.validRequiredField()
      }),    
  //Family Member(insured) Information
  insuredNumber: Yup.number().when("insuranceKind", 
      { is: "Personal", 
        then: Validation.validRequiredNumberField()
      }),
  province: Validation.validRequiredField(),
  // Personal Information
  insuredPersons: Yup.array().of(
        Yup.object().shape({
          relationship: Validation.validRequiredField(),
          firstName: Validation.validRequiredField(),
          lastName: Validation.validRequiredField(),
          birthDate: Validation.validRequiredBrithDateField(),
          gender: Validation.validRequiredField(),
          smokeStatus: Validation.validRequiredField(),
          healthStatus: Validation.validRequiredField(),
        })
      )      
  // 
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
  const { healthFormData, provinces } = props;    

  const classes = useStyles();

  const [direction, setDirection] = useState('back');

  // add Insured person(s) information
  function addInsuredInfo(insuredNumber, insuredPersons){
    const insured = (parseInt(insuredNumber) + 1) - insuredPersons.length
    if (insured <= 0)
    { 
      // remove insured information
      for (var ii = 0; ii < (insured*-1); ii++) {
        insuredPersons.pop()
      }
    }
    else{
      // add insured information
      for (var i = 0; i < insured; i++) {
        insuredPersons.push({ 
          relationship: '',
          firstName: '',
          lastName: '',
          birthDate: null,
          age: 0,
          gender: '',
          smokeStatus: '',
          healthStatus: '',
        })
      }
 
    }

    return insuredPersons
}

  let height = '0px'

  return (
    <>
      <QuoteBanner2 title={'Quote.HealthIns.Title'} subTitle={'Quote.HealthIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={2}/>

      {/* Title 1 : About You */}
      <Typography variant="h5" gutterBottom className={classes.title_question}>
        {/* <Text tid={'Quote.PersonalInfomation'}/> */}
        <Text tid={'Quote.TellUsAboutYou'}/>
        <span className={classes.title_question_sub2}><Text tid={'Quote.TellUsAboutYou.Notice'}/></span>
      </Typography>

      {/* Form */}

      <Formik
        initialValues={healthFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          // console.log('submit')
          // console.log(values)
          props.updateHealthFormData(values);
            direction === 'back' 
                ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                : props.history.push(pathDirection(props.location.pathname, values).nextStep);
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (

        <Form className={classes.formWrapper}>

        <Grid container justify="center">
          <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2}>
            {/* Personal Info */}
            <Grid item xs={12} className={classes.inputPaddingTitle}> 
                <div>
                  <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.PersonalInfomation'}/>
            </Grid>
          
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
              <RegularTextField
                label={'Quote.FirstName'}
                name={`insuredPersons.${0}.firstName`}
                value={values.insuredPersons[0].firstName}
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue(`insuredPersons.${0}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                }}
                onBlur={handleBlur}
              />
              {validMessage(`insuredPersons.${0}.firstName`)}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
              <RegularTextField
                label={'Quote.LastName'}
                name={`insuredPersons.${0}.lastName`}
                value={values.insuredPersons[0].lastName}
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue(`insuredPersons.${0}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                }}
                onBlur={handleBlur}
              />
              {validMessage(`insuredPersons.${0}.lastName`)}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} className={classes.textFieldWrapper}>
              <Typography style={{marginLeft: 6, marginBottom: 6, marginTop: 12 }}><Text tid={'Quote.BirthDate'}/></Typography>
              <KeyboardDatePickerField
                  name={`insuredPersons.${0}.birthDate`}
                  value={values.insuredPersons[0].birthDate}
                  style={{ width: '100%' }}
                  maxDate={new Date()}
                  onChange={(e) => {
                      values.insuredPersons[0].birthDate = e
                      setFieldValue(`insuredPersons.${0}.birthDate`, e)
                      setFieldValue(`insuredPersons.${0}.age`, CalculateAge(e))
                  }}
                  // onBlur={handleBlur}
              />
              {validMessage(`insuredPersons.${0}.birthDate`)}
            </Grid>


            <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
              <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Gender'}/></Typography>
              
              <ToggleButtonGroup
                  className={classes.toggleButtonGroup}
                  name={`insuredPersons.${0}.gender`}
                  value={values.insuredPersons[0].gender}
                  exclusive
                  onChange={(e) => {
                    setFieldValue(`insuredPersons.${0}.gender`, e.currentTarget.value)
                    
                  }}
                  onBlur={() => setFieldTouched(`insuredPersons.${0}.gender`)}
              >
                  <ToggleButton id='male' value="Male" className={classes.toggleButton}>
                    <Text tid={'Quote.Male'}/>
                  </ToggleButton>
                  <ToggleButton id='female' value="Female" className={classes.toggleButton}>
                    <Text tid={'Quote.Female'}/>
              </ToggleButton>
              </ToggleButtonGroup>
              {validMessage(`insuredPersons.${0}.gender`)}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={10} >
              <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.HealthStatus'}/></Typography>
              
              <ToggleButtonGroup
                  className={classes.toggleButtonGroup}
                  name={`insuredPersons.${0}.healthStatus`}
                  value={values.insuredPersons[0].healthStatus}
                  exclusive
                  onChange={(e) => {
                    setFieldValue(`insuredPersons.${0}.healthStatus`, e.currentTarget.value)
                    setFieldValue(`insuredPersons.${0}.healthStatusDesc`, statusHealth.filter(p => p.code === e.currentTarget.value)[0].desc)   
                  }}
                  onBlur={() => setFieldTouched(`insuredPersons.${0}.healthStatus`)}
              >
                {statusHealth.map((item) => (
                  <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                    <Text tid={`Quote.${item.code}`}/>
                  </ToggleButton>
                ))} 
              </ToggleButtonGroup>
              {validMessage(`insuredPersons.${0}.healthStatus`)}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
              <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.SmokeStatus'}/></Typography>
              
              <ToggleButtonGroup
                  className={classes.toggleButtonGroup}
                  name={`insuredPersons.${0}.smokeStatus`}
                  value={values.insuredPersons[0].smokeStatus}
                  exclusive
                  onChange={(e) => {
                    setFieldValue(`insuredPersons.${0}.smokeStatus`, e.currentTarget.value)
                    
                  }}
                  onBlur={() => setFieldTouched(`insuredPersons.${0}.smokeStatus`)}
              >
                {status.map((item) => (
                  <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                    <Text tid={`Button.${item.desc}`}/>
                  </ToggleButton>
                ))} 
              </ToggleButtonGroup>
              {validMessage(`insuredPersons.${0}.smokeStatus`)}
            </Grid>

            {/* Province */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                name={`values.province`}
                value={ values.province ? provinces.find(c => c.country_code === 'CA' && c.province_code ===  values.province) : null}
                options={provinces.filter(i => i.country_code === 'CA')}
                getOptionLabel={(option) => option.province_name}
                size="small"
                renderInput={(params) =>
                  <RegularTextField {...params}
                    placeholder="Province"
                    label={'Quote.Province'}
                  />}
                onChange={(e, selectedVal) => {
                  values.province= selectedVal? selectedVal.province_code: ''
                  // setFieldValue(`insuredPersons.${0}.province`, selectedVal ? selectedVal.province_name : '');
                }}
                onBlur={() => setFieldTouched(`values.province`)}
              />
              {validMessage(`values.province`)}
            </Grid>

            

            {/* Contact Info */}
            <Grid item xs={12} className={classes.inputPaddingTitle}> 
                <div>
                  <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.ContactInformation'}/>
            </Grid>

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
              />
              { validMessage('phone') }
            </Grid>

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


            {/* When selected Critical illness or Disability */}
            { values.insuranceKind !== 'Personal' &&
              <>
                  {/* Family History */}
                  <Grid item xs={12} className={classes.inputPaddingTitle}> 
                      <div>
                        <span className={classes.grayLine}></span>
                      </div>
                        <Text tid={'Quote.Health.FamilyIllnessHistory'}/>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Text tid={`Quote.Health.FamilyIllnessHistory.${'Have'}`}/>
                  </Grid>

                  {/* familyI llness History */}
                  <Grid item xs={12} sm={6} md={6} lg={4}>  
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="familyIllnessHistory"
                        value = {values.familyIllnessHistory}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`familyIllnessHistory`, e.currentTarget.value)
                          if (e.currentTarget.value === 'No')
                            {
                              setFieldValue('ageIllness', '')
                              setFieldValue('nameIllness', '')
                            }
                        }}
                        onBlur={() => setFieldTouched(`familyIllnessHistory`)}
                    >
                      {status.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          <Text tid={'Button.'+item.desc}/>
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage(`familyIllnessHistory`)}
                  </Grid>

                {/* Age Illness */}
                { values.familyIllnessHistory === 'Yes' && 
                <>
                <Grid item container>
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
                    <RegularTextField
                      label={'Quote.Health.FamilyIllnessHistory.WhatAge'}
                      name="ageIllness"
                      value={values.ageIllness}
                      placeholder="Age"
                      type="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {validMessage('ageIllness')}
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>   
                    <RegularTextField
                      label={'Quote.Health.FamilyIllnessHistory.WhatName'}
                      name="nameIllness"
                      value={values.nameIllness}
                      placeholder="Name of Illness"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    { validMessage('nameIllness')}
                  </Grid>
                </Grid>
                </>
                }
              </>
            }
            {/* When selected Disability */}
            { values.insuranceKind === 'Disability' &&
              <>
              {/* Employement */}
                  <Grid item xs={12} className={classes.inputPaddingTitle}> 
                      <div>
                        <span className={classes.grayLine}></span>
                      </div>
                      <Text tid={'Quote.Health.Employment'}/>
                  </Grid>

                {/* Annual Income */}
                  <Grid item xs={12} lg={4}>   
                    <RegularTextField
                        label={'Quote.Health.AnnualIncome'}
                        name="annualIncome"
                        value={values.annualIncome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputProps={{
                          inputComponent: CustomNumberFormat,
                        }}
                      />
                    {validMessage('annualIncome')}
                  </Grid>

                {/* Occupation */}
                {/* <Grid item xs={12} sm={4}>
                <Text tid={`Quote.Health.EmploymentInfo.${'Occupation'}`}/> 
                </Grid> */}
                  <Grid item xs={12} lg={4}>   
                    <RegularTextField
                      label={'Quote.Health.Occupation'}
                      name="occupation"
                      value={values.occupation}
                      placeholder="Occupation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {validMessage('occupation')}
                  </Grid>

                {/* Role at Work */}
                {/* <Grid item xs={12} sm={4}>
                <Text tid={`Quote.Health.EmploymentInfo.${'RoleAtWork'}`}/>
                </Grid> */}
                  <Grid item xs={12} lg={4}>   
                    <RegularTextField
                      label={'Quote.Health.RoleAtWork'}
                      name="roleAtWork"
                      value={values.roleAtWork}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {validMessage('roleAtWork')}
                  </Grid>
              </>
            }
            {/* When selected Personal health Insurance */}
            { values.insuranceKind === 'Personal' &&
              <>

                {/* Family info */}
                <Grid item xs={12} className={classes.inputPaddingTitle}> 
                    <div>
                      <span className={classes.grayLine}></span>
                    </div>
                    <Text tid={'Quote.Health.FamilyInformation'}/>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Text tid={'Quote.Health.InsuredNumber'}/>
                </Grid>

                <Grid item xs={8} lg={2}>
                  <SelectTextField
                    name="insuredNumber"
                    // label="The number of family members"
                    value = {values.insuredNumber}
                    onChange={(e)=>{
                      setFieldValue('insuredNumber',e.currentTarget.value)
                      setFieldValue('insuredPersons' ,addInsuredInfo(e.currentTarget.value, values.insuredPersons))}
                    }
                    onBlur={handleBlur}
                  >
                  <option value="" hidden></option>
                  <option value={0}>None</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  </SelectTextField>
                  {validMessage('insuredNumber')}
                </Grid>

                {/* Family Member info */}
                <Grid item xs={12} sm={12}>
                    <FieldArray
                      name="insuredPersons"
                      render={({ form }) => (
                        <div>
                        {values.insuredPersons && values.insuredPersons.length > 1
                          ? values.insuredPersons.map((insuredPerson, index) => (
                            index === 0
                              ? null
                              : 
                              <div key={index}>
                                <Grid  container spacing={1}style={{marginTop: '2vh'}}>
                                <Grid item xs={12} className={classes.inputPaddingTitle}> 
                                  <div>
                                    <span className={classes.grayLine}></span>
                                  </div>
                                  <Text tid={'Quote.Family'}/> {`${index}`}
                                </Grid> 
                                {/* first name */}
                                <Grid item xs={12} sm={6} md={6} lg={4}>   
                                  <RegularTextField
                                    label={'Quote.FirstName'}
                                    name={`insuredPersons.${index}.firstName`}
                                    value={insuredPerson.firstName}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                    }}              
                                    onBlur={handleBlur}
                                  /> 
                                  {validMessage(`insuredPersons.${index}.firstName`) }
                                </Grid>
                                {/* Last name */}
                                <Grid item xs={12} sm={6} md={6} lg={4}>   
                                  <RegularTextField
                                    label={'Quote.LastName'}
                                    name={`insuredPersons.${index}.lastName`}
                                    value={insuredPerson.lastName}
                                    // onChange={handleChange}
                                    onChange={(e) => {
                                      setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                    }}              
                                    onBlur={handleBlur}
                                  />
                                  {validMessage(`insuredPersons.${index}.lastName`)}
                                </Grid>
                              {/* Birth Date */}
                              <Grid item xs={12} sm={6} md={6} lg={4}>
                              <Typography style={{marginLeft: 6, marginBottom: 6, marginTop: 12 }}><Text tid={'Quote.BirthDate'}/></Typography>
                                <KeyboardDatePickerField
                                    name={`insuredPersons.${index}.birthDate`}
                                    style={{ width: '100%' }}
                                    maxDate={new Date()}
                                    onChange={(e) => {
                                      values.insuredPersons[index].birthDate = e
                                      setFieldValue(`insuredPersons.${index}.birthDate`, e)                         
                                    }}
                                    onBlur={handleBlur}
                                />
                                {validMessage(`insuredPersons.${index}.birthDate`) }
                                
                              </Grid>
                              {/* Gender */}                   
                              <Grid item xs={12} sm={6} md={6} lg={2} className={classes.textFieldWrapper}>
                                <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Gender'}/></Typography>
                                  <ToggleButtonGroup
                                      className={classes.toggleButtonGroup}
                                      name={`insuredPersons.${index}.gender`}
                                      value={values.insuredPersons[index].gender}
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
                                {validMessage(`insuredPersons.${index}.gender`) }
                              </Grid>
            
                              {/* Health */}
                                <Grid item xs={12} lg={10}>
                                  <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.HealthStatus'}/></Typography>              
                                  <ToggleButtonGroup
                                      className={classes.toggleButtonGroup}
                                      name={`insuredPersons.${index}.healthStatus`}
                                      value={values.insuredPersons[index].healthStatus}
                                      exclusive
                                      onChange={(e) => {
                                        setFieldValue(`insuredPersons.${index}.healthStatus`, e.currentTarget.value)
                                        setFieldValue(`insuredPersons.${index}.healthStatusDesc`, statusHealth.filter(p => p.code === e.currentTarget.value)[0].desc)   
                                      }}
                                      onBlur={() => setFieldTouched(`insuredPersons.${index}.healthStatus`)}
                                  >
                                    {statusHealth.map((item) => (
                                      <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                                        <Text tid={`Quote.${item.code}`}/>
                                      </ToggleButton>
                                    ))} 
                                  </ToggleButtonGroup>

                                  {validMessage(`insuredPersons.${index}.healthStatus`) }
                                </Grid>

                                {/* Smoking */}
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                  <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.SmokeStatus'}/></Typography>
                                  <ToggleButtonGroup
                                      className={classes.toggleButtonGroup}
                                      name={`insuredPersons.${index}.smokeStatus`}
                                      value={values.insuredPersons[index].smokeStatus}
                                      exclusive
                                      onChange={(e) => {
                                        setFieldValue(`insuredPersons.${index}.smokeStatus`, e.currentTarget.value)
                                      }}
                                      onBlur={() => setFieldTouched(`insuredPersons.${index}.smokeStatus`)}
                                  >
                                    {status.map((item) => (
                                      <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                                        <Text tid={`Button.${item.desc}`}/>
                                      </ToggleButton>
                                    ))} 
                                  </ToggleButtonGroup>
                                  {validMessage(`insuredPersons.${index}.smokeStatus`)}
                                </Grid>

                                {/* Relationship */}
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                  <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Relationship'}/></Typography>
                                  <ToggleButtonGroup
                                      className={classes.toggleButtonGroup}
                                      name={`insuredPersons.${index}.relationship`}
                                      value={values.insuredPersons[index].relationship}
                                      exclusive
                                      onChange={(e) => {
                                        setFieldValue(`insuredPersons.${index}.relationship`, e.currentTarget.value)
                                      }}
                                      onBlur={() => setFieldTouched(`insuredPersons.${index}.relationship`)}
                                  >
                                    {relationship.map((item) => (
                                      <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                                        <Text tid={`Quote.${item.desc}`}/>
                                      </ToggleButton>
                                    ))} 
                                  </ToggleButtonGroup>
                                  {validMessage(`insuredPersons.${index}.relationship`) }
                                </Grid>

                              </Grid>                          

                              </div>
                              ))
                          : null}

                          <br />
                        </div>

                        )}
                    />
                </Grid>

              </>
            }
          </Grid>
        </Grid>

        <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                // type='submit'
                // variant='contained'
                color="secondary" 
                className={classes.back_button}
                // onClick={() => prevStep()}
                onClick={() => {
                  window.scrollTo(0, 0)
                  props.updateHealthFormData(values); 
                  props.history.push(pathDirection(props.location.pathname, values).prevStep)
                }}
              >
                <Text tid={'Button.Previous'}/>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
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
  healthFormData: PropTypes.object.isRequired,
};

export default InformationForm;