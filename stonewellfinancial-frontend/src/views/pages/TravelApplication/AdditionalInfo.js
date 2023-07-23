// import React, { useEffect } from 'react'
import React, { useState, useEffect, useContext } from 'react'
//core components
import { Grid, TextField, MenuItem, Typography } from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InputMask from 'react-input-mask'
//common components
import { Text } from '../../../components/common/LanguageProvider';
import { RegularTextFieldSmall, SelectMenuTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import MuiPhoneInput from 'material-ui-phone-number';
import { LanguageContext } from "../../../components/common/LanguageProvider";
// functionalities
import { branchAddress } from '../../../functionalities/Codes';

//Formik
import { Field  } from 'formik'
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle);

const source = [
    { type: 'a', code: 'GoogleSearch', name: 'GoogleSearch'},
    { type: 'a', code: 'Newspaper', name: 'Newspaper'},
    { type: 'a', code: 'Facebook', name: 'Facebook'},
    { type: 'a', code: 'Instagram', name: 'Instagram'},
    { type: 'a', code: 'WebBanner', name: 'WebBanner'},
    { type: 'ko', code: 'NaverSearch', name: 'NaverSearch'},
    { type: 'ko', code: 'NaverBlog', name: 'NaverBlog'},
    { type: 'ko', code: 'NaverCafe', name: 'NaverCafe'},
    { type: 'a', code: 'Referral', name: 'Referral'},
    { type: 'a', code: 'Vendor', name: 'Vendor'},
    { type: 'a', code: 'Other', name: 'Other'},
    { type: 'h', code: 'WPBlog', name: 'WPBlog'},
    { type: 'h', code: 'Youtube', name: 'Youtube'},
    { type: 'h', code: 'Tictik', name: 'Tictik'},
    { type: 'h', code: 'GoogleAds', name: 'GoogleAds'},
]

export const AdditionalInfo = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    validMessage,
    provinces,
    sourceChnnel
}) => {
    const classes = useStyles()

    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
    }, []);
    
    let isMobile = (width < 768);

     //current language
     let currentLanguage = useContext(LanguageContext).userLanguage

    // from where parameter in url
    // console.log(sourceChnnel)

    return (
        <div>
            <Grid container justify='flex-start' style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-250px' : '0' }}>
            
                <Grid item container>
                    <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                            <span className={classes.spanTitle}>
                                <Text tid={'Quote.Contact'}/>
                            </span>
                    </Grid>
                    <Grid item container xs={12} sm={12} md={12} spacing={ !isMobile ? 2 : 1 }>
                        {/* Email */}
                        <Grid item xs={12} sm={6} md={6} lg={6}>
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

                        {/* Phone */}

                        {/* Do you have phone number in Canada? */}
                        <Grid item xs={12}  sm={6} md={6} lg={6} style={{ marginLeft:'2px' }} >
                            <Grid item xs={12} style={{ marginLeft:'2px', marginBottom:'10px'}} >
                                <Typography variant="h5" >
                                    <Text tid={'Quote.havePhoneInCanada'}/>
                                </Typography>
                            </Grid>
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
                                //   onBlur={() => setTouched({ 'phoneInCanada': true })}
                                style={{ width: '100%'}}
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

                        {/* phone field */}
                        {values.phoneInCanada === true && (
                            <Grid item xs={12} sm={6} md={6} lg={5}>
                                <div>
                                <label className={classes.inputLabel_manualForm}><Text tid={'Quote.Phone'}/></label>
                                </div>
                                <Field
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
                                {validMessage('contactPhone')}
                            </Grid>
                        )}
                    
                    </Grid>
                    
                </Grid>

                <Grid item container>                
                    <Grid item xs={12} sm={12} md={12} style={{ marginTop: '5vh', marginBottom:'3vh' }}>
                        <Grid item container spacing={2}>
                            {/* mailing in Canada  */}
                            <Grid item xs={12} sm={6} md={6} style={{ alignSelf:'center' }}>  
                                <span style={{fontSize:'16px', fontWeight:'600', marginLeft:'5px' }}>
                                    <Text tid={'Quote.HaveMailingAddressInCanada'}/> 
                                </span>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6} xl={6} style={{paddingRight:'14px'}}>
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

                                            // setFieldValue('mailStreetName',officeAddress.street)
                                            // setFieldValue('mailUnitApartmentNo',officeAddress.suiteNo)
                                            // setFieldValue('mailCity',officeAddress.city)
                                            // setFieldValue('mailProvince',officeAddress.province)
                                            // setFieldValue('mailPostalCode', officeAddress.postalCode)

                                            values.sameMailAddress = false
                                            values.billStreetName = ''
                                            values.billUnitApartmentNo = ''
                                            values.billCity = ''
                                            values.billProvince = ''
                                            values.billPostalCode = ''
                                            
                                        }else{
                                            values.mailStreetName = ''
                                            values.mailUnitApartmentNo = ''
                                            values.mailCity = ''
                                            values.mailProvince = ''
                                            values.mailPostalCode = ''
                                        }
                                        setFieldValue(`maillingInCanada`, val)
                                    }}
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
                            {values.maillingInCanada === true && (
                            <> 
                                <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                        <span className={classes.spanTitle}>
                                            <Text tid={'TravelApplication.AddressInCanada'}/>
                                        </span>
                                </Grid>
                                {/* Street */}
                                <Grid item xs={12} sm={5} md={5}>
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
                                <Grid item xs={5} sm={3} md={3}>
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
                                <Grid item xs={7} sm={4} md={4}>
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

                                {/* Province */}
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
                                            <RegularTextFieldSmall {...params}
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
                                {/* Postal Code */}
                                <Grid item xs={12} sm={3} md={3}>
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
                                {/* Country */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        name={`mailCountry`}
                                        type="text"
                                        value={values.mailCountry==='CA'?'Canada':values.mailCountry}
                                        label={'Quote.Country'}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        />
                                </Grid>
                            </>
                            )}

                        </Grid>
                    </Grid>
                </Grid>

                {/* Source */}
                {sourceChnnel === null ?
                <Grid item container>  
                    <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '5vh', marginBottom:'3vh' }}>  
                        <span className={classes.spanTitle}>
                            <Text tid={'TravelApplication.Source'}/>
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <SelectMenuTextFieldSmall
                            label={'TravelApplication.SourceTitle'}
                            // defaultValue={values.sourceChnnel?values.sourceChnnel:''}
                            value={values.sourceChnnel}
                            name={`sourceChnnel`}
                            // disabled={values.sourceChnnel? true : false}
                            onChange={(e) => {
                                values.sourceChnnel = e.target.value;
                                sourceChnnel =  e.target.value;
                                setFieldValue(values.sourceChnnel, e.target.value);
                                setFieldValue(sourceChnnel, e.target.value);
                                // console.log(values);
                            }}
                            onBlur={handleBlur}
                            >
                            {source.filter( item => currentLanguage === 'ko' ? item.type !== 'h' : item.type === 'a' )
                                    .map((item) => (
                                        <MenuItem key={item.code} value={item.code}>
                                            <Text tid={`TravelApplication.${item.name}`}/>
                                        </MenuItem>
                            ))}
                                
                        </SelectMenuTextFieldSmall>
                        {validMessage(`sourceChnnel`)}
                    </Grid>
                </Grid>
                :null}

                <Grid item container>  
                    {/* Note */}
                    <Grid  item xs={12} sm={12} md={12} style={{ marginTop: '6vh', marginBottom:'3vh' }}>  
                        <span className={classes.spanTitle}>
                            <Text tid={'TravelApplication.NoteTitle'}/>
                        </span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
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

        </div>
    )
}

export default AdditionalInfo
