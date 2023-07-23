import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation'
// core components
import { Grid, Typography, MenuItem, TextField } from '@material-ui/core';
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import MuiPhoneInput from 'material-ui-phone-number';
import Tooltip from '@material-ui/core/Tooltip';
import InputMask from 'react-input-mask';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// common components
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import Button from '../../../components/common/CustomButtons/Button';
import { RegularTextField, SelectMenuTextField } from '../../../components/common/CustomTextFields/TextField'
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
import { dateFormat } from '../../../controllers/dataFormat'
// functionalities
import { branchAddress } from '../../../functionalities/Codes';
//icon
import HelpIcon from '@mui/icons-material/Help';
//style
import formStyle from '../../../assets/jss/styles/formStyle';


const useStyles = makeStyles(formStyle)

// Relationship to Primary Applicant
const relationship = [
  { code: 'Estate', name: 'Estate' },
  { code: 'Spouse', name: 'Spouse' }, 
  { code: 'Child', name: 'Child' },  
  { code: 'Parent', name: 'Parent' },
  { code: 'Guardian', name: 'Guardian' }, 
]

const source = [
  { code: 'Google Search', name: 'GoogleSearch'},
  { code: 'Newspaper', name: 'Newspaper'},
  { code: 'Facebook', name: 'Facebook'},
  { code: 'Instagram', name: 'Instagram'},
  { code: 'WebBanner', name: 'WebBanner'},
  { code: 'NaverSearch', name: 'NaverSearch'},
  { code: 'NaverBlog', name: 'NaverBlog'},
  { code: 'NaverCafe', name: 'NaverCafe'},
  { code: 'Referral', name: 'Referral'},
  { code: 'Vendor', name: 'Vendor'},
  { code: 'Other', name: 'Other'},
]


  // validationSchema
  const validationSchema = Yup.object({
    insuredPersons: Yup.array().of(
                      Yup.object().shape({
                        // firstName: Validation.validRequiredField(),
                        // lastName: Validation.validRequiredField(),
                        beneficiaryName: Validation.validRequiredField(),
                        beneficiaryRelationship: Validation.validRequiredField(),
                      })
                    ),          
    phoneInCanada: Validation.validRequiredField().nullable(),
    contactPhone: Validation.validPhoneNumber(),
    contactEmail: Validation.validEmail(),
    maillingInCanada: Validation.validRequiredField().nullable(),
    mailStreetName: Validation.validRequiredField(),
    mailCity: Validation.validRequiredField(),
    mailProvince: Validation.validRequiredField(),
    mailPostalCode: Validation.validPostalCode(),
    sourceChnnel: Validation.validRequiredField(),
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

const ContactInformation = (props) => {
    const { formData, provinces } = props;

    const classes = useStyles();
    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    const [direction, setDirection] = useState('back');

    let height = '0px'

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
    
    let isMobile = (width <= 767);
  
    return (
      <>
        <StepHeader height={height} activeStep={3} data={formData} />
      
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={values => {
            window.scrollTo(0, 0)
            // console.log(values)
            // setFormData(values);
            // direction === 'back' ? prevStep() : nextStep();
            props.updateFormData(values);
            direction === 'back' 
              ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
              : props.history.push(pathDirection(props.location.pathname, values).nextStep);

          }}
        >
          {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, setTouched}) => (
  
          <Form className={classes.formWrapper}>
          
            <Typography variant="h5" gutterBottom className={classes.title_question}>
                {/* Application */}
                <Text tid={'Quote.Application'}/>
                <span className={classes.title_question_sub2}>
                  {/* The information you fill out will be used only for insurance application. */}
                  <Text tid={'Quote.Application.Notice'}/>
                </span>
            </Typography> 

            <Grid container justify="center">

              {values.tripDirection === 'InBound' &&
                <Grid item container xs={12} sm={12} md={12} lg={8} xl={7}  justify="center">
                  <Alert severity='warning'>   
                    <AlertTitle><Text tid={'Vendor.Step1.CoverageAgreementTitle'}/></AlertTitle>
                    <ul>
                        <li><Text tid={'Quote.CoverageAgreement.List.NoIntention'}/></li>
                        <li><Text tid={'Quote.CoverageAgreement.List.VisaPurpose'}/></li>
                    </ul>
                  </Alert>
                </Grid>  
              }

              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1}>

                  <Grid item container xs={12} spacing={1} style={{marginTop:'5vh'}}>
                      <Grid item xs={12} md={9}>
                          <span className={classes.spanTitle}>
                            <Text tid={'Quote.TravelerInsured'}/>
                          </span>
                      </Grid>
                  </Grid>

                  <Grid item container xs={12} style={{marginTop:'2vh'}}>
                    
                    {values.insuredPersons && values.insuredPersons.length > 0
                        ? values.insuredPersons.map((insuredPerson, index) => (
                            // <div key={index}>
                              <Grid item container key={index} xs={12}  spacing={2} style={{margin:'5px 0'}}>
                                <Grid item xs={12} sm={6} md={6} lg={3}>
                                    <div style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px'}}>
                                      <Text tid={'Quote.Traveler'}/> {index+1}
                                    </div>
                                    {values.insuredPersons[index].lastName}, {values.insuredPersons[index].firstName} ({values.insuredPersons[index].gender})
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={3}>
                                    <div style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px'}}>
                                      <Text tid={'Quote.BirthDate'}/>
                                    </div>
                                    {dateFormat(values.insuredPersons[index].birthDate)} ({values.insuredPersons[index].age} yrs old)
                                </Grid>

                                {/* Beneficiary Name */}
                                <Grid item xs={12} sm={6} md={6} lg={3}>
                        
                                    <div style={{fontWeight:300,color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                                      <Text tid={'Quote.BeneficiaryName'}/>
                                      <Tooltip title='A beneficiary is a name that accidental death benefits payable as a result of your accidental death will be payable to your named beneficiary or to your Estate' placement="right-end" color="primary" enterTouchDelay={0}>
                                      <HelpIcon/>
                                    </Tooltip>
                                    </div>
                              
                                    <RegularTextField
                                        // label = "Beneficiary Name"
                                        name={`insuredPersons.${index}.beneficiaryName`}
                                        value={values.insuredPersons[index].beneficiaryName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`insuredPersons.${index}.beneficiaryName`)}
                                </Grid>

                                {/* Beneficiary Relationship */}
                                <Grid item xs={12} sm={6} md={6} lg={3}>  
                                
                                    <div style={{fontWeight:300,color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                                          {currentLanguage !== 'ko'
                                              ?(`Beneficiary is ${values.insuredPersons[index].firstName}'s`)
                                              :(`수혜자는 ${values.insuredPersons[index].firstName} 님의`)
                                          }
                                    </div>
                                  
                                    <SelectMenuTextField
                                        name={`insuredPersons.${index}.beneficiaryRelationship`}
                                        value={values.insuredPersons[index].beneficiaryRelationship}
                                        // label="Relationship to Beneficiary"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                      {relationship.map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                            <Text tid={`Quote.${item.name}`}/>
                                        </MenuItem>
                                      ))}
                                    </SelectMenuTextField>
                                    {validMessage(`insuredPersons.${index}.beneficiaryRelationship`)}
                                </Grid>
                              </Grid>
                            // </div>
                        ))
                        : null}
                  </Grid>
              </Grid>  


              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1}>

                  <Grid item container xs={12} spacing={1} style={{marginTop:'5vh'}}>
                      <Grid item xs={12} md={9}>
                          <span className={classes.spanTitle}>
                            <Text tid={'Quote.ContactInformation'}/>
                          </span>
                      </Grid>
                  </Grid>

                  <Grid item container xs={12} style={{marginTop:'2vh'}}>
                  
                    <Grid item container xs={12} sm={6} md={6} lg={4} spacing={1} style={{marginTop:'2vh'}}>
                        
                        <Grid item xs={12} style={{ marginLeft:'2px'}} >
                            <Typography variant="h5" >
                              <Text tid={'Quote.havePhoneInCanada'}/>
                            </Typography>
                        </Grid>

                        {/* Do you have phone number in Canada? */}
                        <Grid item xs={12} style={{ marginLeft:'2px' }} >
                          <ToggleButtonGroup
                              name ={`phoneInCanada`}
                              value={values.phoneInCanada}
                              exclusive
                              onChange={(e) => {
                                  const val = e.currentTarget.value === 'true' ? true : false
                                  setFieldValue(`phoneInCanada`, val)
                                  // console.log(values)
                                  if(e.currentTarget.value === 'false'){
                                    const officeAddress = branchAddress(values.tripDirection, values.destProvince, values.destProvinceName, values.originProvince, values.originProvinceName, {})
                                    values.contactPhone = officeAddress.phone
                                    setFieldValue('contactPhone',officeAddress.phone)
                                  }else{
                                    values.contactPhone = ''
                                    setFieldValue('contactPhone','')
                                  }
                              }}
                              onBlur={() => setTouched({ 'phoneInCanada': true })}
                              style={{ width: !isMobile ? '15vw' : '50vw' }}
                          >
                              <ToggleButton value={true} className={classes.toggleButton}>
                                <Text tid={'Button.Yes'}/>
                              </ToggleButton>
                              <ToggleButton value={false} className={classes.toggleButton}>
                                <Text tid={'Button.No'}/>
                              </ToggleButton>
                          </ToggleButtonGroup>
                          {validMessage(`phoneInCanada`)}
                        </Grid>

                    </Grid>

                    {/* phone */}
                    {values.phoneInCanada === true && (
                      <>
                      <Grid item container xs={12} sm={6} md={6} lg={4} >
                        
                        <span style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px', marginTop:'20px'}}>
                          <Text tid={'Quote.Phone'}/>
                        </span>
                    
                        <Field
                              id = "phone"
                              name="contactPhone"
                              variant="outlined"
                              className={classes.textField}
                              value={values.contactPhone}
                              type="tel"
                              as={MuiPhoneInput}
                              defaultCountry={'ca'}
                              onlyCountries={['ca']}
                              disableAreaCodes={true}
                              countryCodeEditable={false}
                              onChange={(value) => setFieldValue('contactPhone', value)}
                              // label="Phone Number"
                              />
                        { validMessage('contactPhone') }

                      </Grid>
                      </>
                    )}

                    <Grid item container xs={12} sm={6} md={6} lg={4} style={{ marginTop:'20px' }}>
                      {/* <Text tid={`Quote.${'Email'}`}/> */}
                        <Grid item xs={12} >
                          <span style={{fontWeight:300,color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                            <Text tid={'Quote.Email'}/>
                          </span>
                        </Grid>
                        <RegularTextField
                          name={`contactEmail`}
                          type="text"
                          className={classes.textField}
                          value={values.contactEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          // label="Email"
                        />
                        { validMessage('contactEmail') }
                  </Grid>

                  </Grid>
                 

                  
              </Grid>  


              {/* Mailing Address */}
              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} style={{marginTop:'5vh'}}>
                  <Grid item xs={12} md={9}>
                      <span className={classes.spanTitle}>
                        <Text tid={'Quote.MailingAddress'}/>
                      </span>
                  </Grid>
              </Grid>

              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} style={{marginTop:'2vh'}}>
                  <Grid item xs={12} md={12} style={{ marginLeft:'2px'}} >
                      <Typography variant="h5" >
                        <Text tid={'Quote.HaveMailingAddressInCanada'}/>
                      </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ marginLeft:'2px' }} >
                      <ToggleButtonGroup
                          name ={`maillingInCanada`}
                          value={values.maillingInCanada}
                          exclusive
                          onChange={(e) => {
                              const val = e.currentTarget.value === 'true' ? true : false
                              setFieldValue(`maillingInCanada`, val)
                              
                              if(e.currentTarget.value === 'false'){
                                const officeAddress = branchAddress(values.tripDirection, values.destProvince, values.destProvinceName, values.originProvince, values.originProvinceName, {})
                                // values.mailStreetName = officeAddress.street
                                // values.mailUnitApartmentNo = officeAddress.suiteNo
                                // values.mailCity = officeAddress.city
                                // values.mailProvince = officeAddress.mailProvince
                                // values.mailPostalCode = officeAddress.postalCode
                                setFieldValue('mailStreetName',officeAddress.street)
                                setFieldValue('mailUnitApartmentNo',officeAddress.suiteNo)
                                setFieldValue('mailCity',officeAddress.city)
                                setFieldValue('mailProvince',officeAddress.province)
                                setFieldValue('mailPostalCode', officeAddress.postalCode)
                              }else{
                                setFieldValue('mailStreetName','')
                                setFieldValue('mailUnitApartmentNo','')
                                setFieldValue('mailCity','')
                                setFieldValue('mailPostalCode','')
                                setFieldValue('mailProvince','')
                                setFieldValue('mailPostalCode','')
                              }
                          }}
                          onBlur={() => setTouched({ 'maillingInCanada': true })}
                          style={{ width: !isMobile ? '15vw' : '50vw' }}
                      >
                          <ToggleButton value={true} className={classes.toggleButton}>
                            <Text tid={'Button.Yes'}/>
                          </ToggleButton>
                          <ToggleButton value={false} className={classes.toggleButton}>
                            <Text tid={'Button.No'}/>
                          </ToggleButton>
                      </ToggleButtonGroup>
                      {validMessage(`maillingInCanada`)}
                  </Grid>
              </Grid>
              
              {values.maillingInCanada === true && (
                <>
                <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} style={{marginTop:'2vh'}}>
                    <Grid item xs={12} sm={5} md={5}>      
                      <RegularTextField
                          name={`mailStreetName`}
                          type="text"
                          value={values.mailStreetName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={'Quote.Street'}
                        />
                      {validMessage(`mailStreetName`)}
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>  
                      <RegularTextField
                            name={`mailUnitApartmentNo`}
                            type="text"
                            value={values.mailUnitApartmentNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={'Quote.UnitNumber'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4} md={4}>   
                      <RegularTextField
                          name={`mailCity`}
                          type="text"
                          value={values.mailCity}
                          onChange={(e)=> setFieldValue(`mailCity`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                          onBlur={handleBlur}
                          label= {'Quote.City'}
                        />
                      {validMessage(`mailCity`)}
                    </Grid>
                </Grid>

                <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} >
                    <Grid item xs={12} sm={5} md={5}>  
                        <Autocomplete
                          name="mailProvince"
                          options={provinces.filter(i => i.country_code === 'CA')}
                          value={values.mailProvince ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.mailProvince) : null}
                          getOptionLabel={(option) => option.province_name}
                          //getOptionLabel={(option) => option.province_name} //to display full province names
                          // getOptionDisabled={(option) => option.province_code === values.originProvince}
                          size="small"
                          renderInput={(params) => 
                              <RegularTextField {...params}
                                label= {'Quote.Province'}
                              />
                          }
                          onChange={(e, selectedVal) => {
                              values.mailProvince = selectedVal ? selectedVal.province_name : ''
                              setFieldValue('mailProvince', selectedVal ? selectedVal.province_name : '');
                          }}
                      />
                      {validMessage(`mailProvince`)}
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>    
                      <label className={classes.inputLabel}><Text tid={'Quote.PostalCode'}/></label>
                      <InputMask
                          name={`mailPostalCode`}
                          mask= {"a9a 9a9" }
                          value={values.mailPostalCode}
                          onChange={(e)=>setFieldValue(`mailPostalCode`,e.target.value.toUpperCase())}
                          onBlur={handleBlur}                    
                          >
                          {() => (
                          <TextField
                              type="text"
                              name="mailPostalCode"
                              variant="outlined"
                              size="small" 
                              style={{ width: !isMobile ? '100%' : '102%' }}
                          />
                          )}
                      </InputMask>
                      {validMessage(`mailPostalCode`)}
                    </Grid>

                    <Grid item xs={12} sm={4} md={4}>
                      <RegularTextField
                          name={`mailCountry`}
                          type="text"
                          value={values.mailCountry==='CA'?'Canada':values.mailCountry}
                          label={'Quote.Country'}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                    </Grid>
                </Grid>
              </>)}

              {/* Source */}
              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} style={{marginTop:'6vh'}}>  
                <Grid item xs={12}>  
                    <span className={classes.spanTitle}>
                        <Text tid={'TravelApplication.Source'}/>
                    </span>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Grid item xs={12} md={12} style={{ marginLeft:'5px', marginTop:'1vh'}} >
                      <Typography variant="h5" >
                        <Text tid={'TravelApplication.SourceTitle'}/>
                      </Typography>
                    </Grid>
                    <SelectMenuTextField
                        // label={'TravelApplication.SourceTitle'}
                        value={values.sourceChnnel}
                        name={`sourceChnnel`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        >
                        {source.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                              <Text tid={`TravelApplication.${item.name}`}/>
                            </MenuItem>
                        ))}
                    </SelectMenuTextField>
                    {validMessage(`sourceChnnel`)}
                </Grid>
              </Grid>


              {/* Note  */}
              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} style={{marginTop:'5vh'}}>

                  <Grid item xs={12}>
                      <span className={classes.spanTitle}>
                      <Text tid={'TravelApplication.NoteTitle'}/>
                      </span>
                  </Grid>

                  <Grid item xs={12}  style={{marginTop:'1vh'}} >
                      <TextField
                          name="note"
                          label={<Text tid={'TravelApplication.Note'}/>}
                          value={values.note}
                          multiline
                          variant="filled"
                          rows={4}
                          fullWidth
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                  </Grid>

              </Grid>  


            </Grid>
            
            <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center"  spacing={1}>
              <Grid item xs={6} sm={6} md={3} lg={3}>
                {/* <Button color="secondary" className={classes.back_button} onClick={() => {setFormData(values); prevStep()}}> */}
                <Button color="secondary" className={classes.back_button} 
                  // onClick={() => setDirection('back')}
                  onClick={() => {
                    props.updateFormData(values); 
                    props.history.push(pathDirection(props.location.pathname, values).prevStep)
                  }}
                >
                  <Text tid={'Button.Previous'}/>
                </Button>
              </Grid>
            
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button type='submit' color="dark" className={classes.next_button} onClick={() => setDirection('forward')}>
                  {/* <Text tid={'Button.ProceedPayment'}/> */}
                  <Text tid={'Button.Next'}/>
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
ContactInformation.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default ContactInformation;