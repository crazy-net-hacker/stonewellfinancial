import React, { useEffect, useCallback } from 'react'
import { Field } from 'formik'
// core components
import { Card, Grid, CardContent, makeStyles, TextField, Typography} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup, Alert } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import MuiPhoneInput from 'material-ui-phone-number'
//common components
import { Text } from '../../../../components/common/LanguageProvider';
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
import TooltipInfo from '../../../../components/common/TooltipInfo';
import WindowDimension from '../../../../components/common/WindowDimension'
// functionalities
import { branchAddress } from '../../../../functionalities/Codes';

// icons
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)

const languages = [
  { code: 'en', name: 'English'},
  { code: 'fr', name: 'French'},
  { code: 'ko', name: 'Korean'},
  { code: 'ar', name: 'Arabic'},
  { code: 'yue', name: 'Cantonese'},
  { code: 'ch_s', name: 'Chinese(Simplified)'},
  { code: 'ch_t', name: 'Chinese(Traditional)'},
  { code: 'de', name: 'German'},
  { code: 'es', name: 'Spanish'},
  { code: 'fa', name: 'Persian'},
  { code: 'ja', name: 'Japanese'},
  { code: 'pt_br', name: 'Portuguese(Brazil)'},
  { code: 'vi', name: 'Vietnamese'},
  ]


const ContactInformation = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  validMessage,
  provinces,
  errorSection,
  alertOpen
}) => {
  const classes = useStyles()

  const { width } = WindowDimension();    
  let isMobile = (width < 768);
 
  // scrollIntoView if occuring validation error
  const showValidationMsg = useCallback(() => {
    if (errorSection === 'C' && document.getElementById("contact")){
      document.getElementById("contact").scrollIntoView();
    }
  }, [errorSection]);

  // useEffect
  useEffect(()=>{
    showValidationMsg()
  }, [showValidationMsg]);
    

  return (
    <>
      <Grid container className={classes.CardBox}>
        <Grid item xs={12} className={classes.applicant} id = "contact">
          {/* <Text tid={'Dashboard.ResidentialAddress'} /> */}
          <Text tid={'Dashboard.Contact'} />
        </Grid>
        <Card variant="outlined" style={{ width:'100%' }}>
          {errorSection === 'C' && alertOpen &&
            <Grid item xs={12} >
                <Alert severity='error' >
                    <Text tid={'Quote.Error.CompleteInformation'}/>
                </Alert>
            </Grid>
          }
          <CardContent>
            <Grid container style={{ flexGrow: 1 }}>
              <Grid item container xs={12} style={{ marginBottom:'20px' }}>
                <Grid item xs={12} container spacing={1} className={classes.RowMarginBottom}>
                  <Grid item xs={12}  className={classes.dashboardBox_title}>
                    <PhoneIcon style={{ marginRight:'5px', fontSize:'18px'}} />
                    <Text tid={'Vendor.Step1.ContactInfo'}/>
                  </Grid>
              
                        {/* Phone */}
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
                                  
                                  if(e.currentTarget.value === 'false'){
                                    const officeAddress = branchAddress(values.tripDirection, values.destProvince, values.destProvinceName, values.originProvince, values.originProvinceName, {})
                                    values.contactPhone = officeAddress.phone
                                    setFieldValue('contactPhone',officeAddress.phone)
                                  }else{
                                    values.contactPhone = ''
                                    setFieldValue('contactPhone','')
                                  }
                              }}
                              // onBlur={() => setTouched({ 'phoneInCanada': true })}
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

                  <Grid item xs={12} sm={5} md={3} lg={3}>
                    <div>
                    <label className={classes.inputLabel_manualForm}>
                      <Text tid={'Quote.Phone'}/>
                      <TooltipInfo info={<Text tid={'Vendor.Step1.phoneTooltip'}/>} placement="right-end" color="primary"></TooltipInfo>
                    </label>
                    </div>
                    <Field
                        id = "phone"
                        name="contactPhone"
                        variant="outlined"
                        style={{ width: !isMobile ? '100%' : '102%' }}
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
                    {validMessage('contactPhone')}
                  </Grid>
                  
                  {/* Email */}
                  <Grid item xs={12} sm={5} md={5} lg={5}>
                    <RegularTextFieldSmall
                        name="contactEmail"
                        type="text"
                        label={'Quote.Email'}
                        tooltipTitle={'Tooltip.Email'}
                        style={{ width: !isMobile ? '100%' : '102%' }}
                        value={values.contactEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {validMessage('contactEmail')}
                  </Grid>

                  {/*  */}
                  <Grid item xs={12} sm={5} md={3} lg={3}>
                    <SelectTextFieldSmall
                      label= {'Vendor.Language'} 
                      name={`preferLanguage`}
                      value={values.preferLanguage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" hidden>Select</option>
                      {languages.map((item) => (
                          <option key={item.code} value={item.code}>
                              {item.name}
                          </option>
                      ))}
                    </SelectTextFieldSmall>
                  </Grid>

                </Grid>

                <Grid item xs={12} container className={classes.RowMarginDivider}>
                  <Grid item xs={12} className={classes.dashboardBox_title}>
                    
                    <HomeIcon style={{ marginRight:'5px', fontSize:'18px'}} />
                    <Text tid={'Vendor.Step1.PrimaryAddress'} />
                  </Grid>

                  {/* mailing in Canada  */}
                  <Grid item container xs={12}>
                    <Grid item xs={12} style={{paddingRight:'14px', alignSelf: 'end'}}>
                      <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                        <Text tid={'Quote.HaveMailingAddressInCanada'}/>
                        <TooltipInfo info={<Text tid={'Vendor.Step1.AddressInCanadaTooltip'}/>} placement="right-end" color="primary"></TooltipInfo>
                      </label>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} style={{paddingRight:'14px', alignSelf: 'end'}}>
                      <ToggleButtonGroup
                          name ={`maillingInCanada`}
                          value={values.maillingInCanada}
                          exclusive
                          style={{ width:'100%' }}
                          onChange={(e) => {
                              const val = e.currentTarget.value === 'true' ? true : false
                              if(val === false){
                                  const officeAddress = branchAddress(values.tripDirection, values.destProvince, values.destProvinceName, values.originProvince, values.originProvinceName, values.vendorAddress)
                                  values.mailStreetName = officeAddress.street
                                  values.mailUnitApartmentNo = officeAddress.suiteNo
                                  values.mailCity = officeAddress.city
                                  values.mailProvince = officeAddress.province
                                  values.mailPostalCode = officeAddress.postalCode
                                
                                  values.sameMailAddress = false
                                  // values.billStreetName = ''
                                  // values.billUnitApartmentNo = ''
                                  // values.billCity = ''
                                  // values.billProvince = ''
                                  // values.billPostalCode = ''
                              }else{
                                  values.mailStreetName = ''
                                  values.mailUnitApartmentNo = ''
                                  values.mailCity = ''
                                  values.mailProvince = null
                                  values.mailPostalCode = ''
                              }
                              setFieldValue(`maillingInCanada`, val)
                          }}
                      >
                          <ToggleButton value={true} className={classes.toggleButton} style={{ padding:'7px' }}>
                          <Text tid={'Button.Yes'}/>
                          </ToggleButton>
                          <ToggleButton value={false} className={classes.toggleButton} style={{ padding:'7px' }}>
                          <Text tid={'Button.No'}/>
                          </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>

                </Grid>
                
                {/* Primary Address */}
                {values.maillingInCanada &&
                <Grid container>
                  <Grid item container xs={12} spacing={1}>
                    
                    {/* Street Name */}
                    <Grid item xs={12} sm={8} md={4} lg={3}>
                      <RegularTextFieldSmall
                          name='mailStreetName'
                          label={'Quote.Street'}
                          style={{ width: !isMobile ? '100%' : '102%' }}
                          value={values.mailStreetName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                      {validMessage('mailStreetName')}
                    </Grid>

                    {/* Unit Number */}
                    <Grid item xs={12} sm={4} md={3} lg={1}>
                      <RegularTextFieldSmall
                          name='mailUnitApartmentNo'
                          label={'Quote.UnitNumber'}
                          style={{ width: !isMobile ? '100%' : '102%' }}
                          value={values.mailUnitApartmentNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <RegularTextFieldSmall
                          name='mailCity'
                          label={'Quote.City'}
                          style={{ width: !isMobile ? '100%' : '103%' }}
                          value={values.mailCity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                      />
                      {validMessage('mailCity')}
                    </Grid>

                    {/* Postal Code */}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <label className={classes.inputLabel_manualForm}><Text tid={'Quote.PostalCode'}/></label>
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
                      {validMessage('mailPostalCode')}
                    </Grid>

                    {/* Province */}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Autocomplete
                        name="mailProvince"
                        options={provinces.filter(i => i.country_code === 'CA')}
                        value={values.mailProvince && provinces.length>0 ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.mailProvince) : null}
                        getOptionLabel={(option) => option.province_name}
                        size="small"
                        renderInput={(params) => 
                            <RegularTextFieldSmall {...params}
                                label= {'Quote.Province'}
                            />
                        }
                        onChange={(e, selectedVal) => {
                            values.mailProvince = selectedVal ? selectedVal.province_name : ''
                            setFieldValue('mailProvince', selectedVal ? selectedVal.province_name : '');
                        }}
                      />
                      {validMessage('mailProvince')}
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <RegularTextFieldSmall
                        name={`mailCountry`}
                        type="text"
                        defaultValue={values.mailCountry==='CA'?'Canada':values.mailCountry}
                        label={'Quote.Country'}
                        InputProps={{
                            readOnly: true
                        }}
                      />
                      {validMessage('mailCountry')}
                    </Grid>

                  </Grid>
                </Grid>
                }

              </Grid>

            </Grid>           
          </CardContent>
        </Card>

      </Grid>
 
    </>
  )
}

export default ContactInformation
