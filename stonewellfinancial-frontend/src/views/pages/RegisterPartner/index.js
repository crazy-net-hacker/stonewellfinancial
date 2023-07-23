import React, { useState, useEffect, useContext } from 'react';
// mui
import { Grid, Typography, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import MuiPhoneInput from 'material-ui-phone-number'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InputMask from 'react-input-mask'
// formik
import { Formik, Form, ErrorMessage, Field } from 'formik'
// yup
import * as Yup from 'yup'
// common
import * as Validation from '../../Validation'
import MetaTags from '../../../components/common/MetaTags';
import { RegularTextField, SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import SubmitResult from './SubmitResult';

//icons
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
// import PeopleIcon from '@mui/icons-material/People';
import CommentIcon from '@mui/icons-material/Comment';

//style
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

const INITIAL_VALUES = {
    status: "requested",
    companyName: '',
    lastName : '',
    firstName : '',
    phone: '',
    email : '',
    estimatedClientNumber: '',
    clientProvince: [],
    street: '',
    suiteNo: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    officeInCanada: null,
    vendorJob: '',
    MailingInCanada: false,
    IsManager: null,
    employeeNumber: '',
    note: ''
}

const vendorType = [
    {type: 'LanguageSchool', value: 'Language School'},
    {type: 'School', value: 'School'},
    {type: 'Agency', value: 'Agency'},
    {type: 'ImmigrationAgency', value: 'Immigration Agency'},
    {type: 'InsuranceBrokerageCompany', value: 'Insurance Brokerage Company'},
    {type: 'Other', value: 'Other'},
  ]

const VALIDATION_SCHEMA = Yup.object().shape({
    companyName : Validation.validRequiredField(),
    lastName: Validation.validRequiredField(),
    firstName: Validation.validRequiredField(),
    phone: Validation.validPhoneNumber(),
    email : Validation.validEmail(),  
    estimatedClientNumber: Validation.validRequiredNumberField(),
    mostVisitProvince: Yup.array().min(1, 'FieldIsRequired'),
    officeInCanada: Validation.validRequiredField().nullable(),
    street: Validation.validRequiredField(),
    city: Validation.validRequiredField(),
    province: Validation.validRequiredField(),
    postalCode: Yup.string().when("officeInCanada", 
    { is: (value) => 
            value === true,
            then: Validation.validPostalCode(),
            otherwise: Validation.validRequiredField()
    }),
    country: Validation.validRequiredField(),
})

// ValidMessage
function validMessage(fieldName) {
    return (
        <ErrorMessage
        name={fieldName}
        render={(msg) => (
            <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
              <Text tid={`Validation.${msg}`}></Text>
            </div>
        )}
        />
    )
}

const RegisterPartner = (props) => {
    const { match, countries, provinces } = props;

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    const metaData = {
        title: 'Meta.RegisterPartner.Title',
        description: 'RegisterPartner.Description',
        canonical: match.url
    }
    
    const classes = useStyles()
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

    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState([]);

    // handleSubmit
    const handleSubmit = async (values) => {
        values.status = 'requested';

        // set clientProvince
        if (values.mostVisitProvince.length > 0){
            values.clientProvince =  '{' + values.mostVisitProvince.map((items) => items.province_name) + '}'
        }else{
            values.clientProvince = null
        }

        setFormData(values) 
        setSubmitted(true)
    }
    
    if (submitted === false) {

    return (
        <>
            <MetaTags data={metaData} />
            <QuoteBanner2 title={<Text tid={`Partner.Register.Title`}/>} subTitle={'Partner.Register.SubTitle'} links={[]}/>
            <Grid container justify="center">
                <Grid item container xs={12} sm={12} md={11} lg={6} xl={4}>
                    <main className={classes.form} style={{ marginBottom:'8vh', padding:'0 2vh', border: isMobile ? 'none': '1px solid #efefef', boxShadow: isMobile?'none':'5px 5px 20px #efefef' }}>

                    <Formik
                        initialValues={INITIAL_VALUES}
                        validationSchema={VALIDATION_SCHEMA}
                        onSubmit={values => {
                            handleSubmit(values) 
                        }}
                    >
                        {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                        <Form>
                            {/* {console.log('errors', errors)} */}
                            <Grid item container spacing={2} style={{ marginTop:'2vh' }}>

                                <Grid item container style={{ margin:'1.5vh 0'}}>
                                    <Typography variant="h4">
                                        <BusinessIcon/> <Text tid={`Partner.Register.CompanyInformation.Title`}/>
                                    </Typography>
                                </Grid>

                                <Grid item container spacing={2}>

                                    {/* company name */}
                                    <Grid item xs={12} sm={12}>
                                        <RegularTextField
                                            name='companyName'
                                            type="text"
                                            value={values.companyName}
                                            // onChange={handleChange}
                                            onChange={(e)=> setFieldValue(`companyName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                            onBlur={handleBlur}
                                            label="Partner.Register.CompanyName"
                                        />
                                        {validMessage(`companyName`)}
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <SelectTextField
                                            label={'Partner.Register.vendorType'}
                                            name="vendorType"
                                            value={values.vendorType}
                                            // onChange={handleChange}
                                            onChange={(e) => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            >
                                            <option value="" hidden>Select</option>
                                            {vendorType
                                                .map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.value}
                                                    </option>
                                            ))}
                                        </SelectTextField>
                                        {validMessage('vendorType')}
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Grid item xs={12}  style={{ marginBottom:'8px', marginTop:'12px' }}>
                                            <span style={{fontWeight:300,paddingBottom:'2px',color:'#1c1c1c',fontSize:'15px', paddingLeft:'5px'}}>
                                            <Text tid={'Quote.Phone'}/>
                                            </span>
                                        </Grid>
                                        <Field
                                            style={{ fontWeight:'700', width: '100%' }}
                                            name="phone"
                                            variant="outlined"
                                            value={values.phone}
                                            type="tel"
                                            as={MuiPhoneInput}
                                            // defaultCountry={values.officeInCanada===false?'kr':'ca'}
                                            defaultCountry='ca'
                                            onChange={(value) => setFieldValue('phone', value)}
                                        />
                                        {validMessage('phone')}
                                    </Grid>

                                    {/* Special Note */}
                                    {/* <Grid item container style={{ margin:'1.5vh 0'}}>
                                        <Typography variant="h4">
                                            <Text tid={`Partner.Register.vendorJob`}/>
                                        </Typography>
                                    </Grid> */}
                                    <Grid item xs={12} style={{ margin:'1.5vh 0'}}>
                                        <TextField
                                            name="vendorJob"
                                            label={<Text tid={'Partner.Register.vendorJob'}/>}
                                            value={values.vendorJob}
                                            multiline
                                            variant="filled"
                                            rows={4}
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    <Grid item container >
                                        {/* How many clients per year */}
                                        <Grid item xs={12} sm={12} md={12} lg={5}>
                                            <RegularTextField
                                                name='estimatedClientNumber'
                                                type="number"
                                                value={values.estimatedClientNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                label="Partner.Register.ClientNumber.Label"
                                                />
                                            {validMessage(`estimatedClientNumber`)}
                                        </Grid>

                                        {/* Most visit province in Canada */}
                                        <Grid item xs={12} sm={12} md={12} lg={7}>
                                            <Autocomplete
                                                multiple
                                                name="mostVisitProvince"
                                                options={provinces.filter(i => i.country_code === 'CA')}
                                                defaultValue={values.mostVisitProvince?provinces.filter(array => values.mostVisitProvince.some(filter => filter === array.value)):[]}
                                                getOptionLabel={(option) => option.province_name}
                                                getOptionSelected={(option, value) => option.province_name === value.province_name }
                                                size="small"
                                                renderInput={(params) => 
                                                    <RegularTextField {...params}
                                                        label= {'Partner.Register.mostVisitProvince'}
                                                    />
                                                }
                                                onChange={(e, newValue) => {
                                                    setFieldValue("mostVisitProvince",newValue)
                                                }}
                                            />
                                            {validMessage(`mostVisitProvince`)}
                                        </Grid>
                                    </Grid>

                                    {/* Office address */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" style={{ marginTop:'12px', fontSize:'15px' }}>
                                            <Text tid={'Partner.Register.OfficeLocation'}/>
                                        </Typography>
                                
                                        <ToggleButtonGroup
                                            name ={`officeInCanada`}
                                            value={values.officeInCanada}
                                            exclusive
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`officeInCanada`, val)
                                                values.officeInCanada = val
                                                if(val){
                                                    setFieldValue(`country`, 'CA')
                                                }else{
                                                    setFieldValue(`country`, '')
                                                }
                                            }}
                                            // onBlur={() => setTouched({ 'maillingInCanada': true })}
                                            style={{ width: !isMobile ? '15vw' : '50vw', marginTop:'5px' }}
                                        >
                                            <ToggleButton value={true} className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false} className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`officeInCanada`)}
                                    </Grid>

                                    {/* Mailing address in Canada? */}
                                    {values.officeInCanada === false ?
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" style={{ marginTop:'12px', fontSize:'15px' }}>
                                            <Text tid={'Partner.Register.MailingInCanada'}/>
                                        </Typography>
                                
                                        <ToggleButtonGroup
                                            name ={`MailingInCanada`}
                                            value={values.MailingInCanada}
                                            exclusive
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`MailingInCanada`, val)
                                                values.MailingInCanada = val
                                                
                                                if(val){
                                                    setFieldValue(`country`, 'CA')
                                                }else{
                                                    setFieldValue(`country`, '')
                                                }
                                                // console.log(values.MailingInCanada)
                                            }}
                                            // onBlur={() => setTouched({ 'maillingInCanada': true })}
                                            style={{ width: !isMobile ? '15vw' : '50vw', marginTop:'5px' }}
                                        >
                                            <ToggleButton value={true} className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false} className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`MailingInCanada`)}
                                    </Grid>
                                    :null}
                                </Grid>

                                {values.officeInCanada === true || values.MailingInCanada === true || values.MailingInCanada === false ? 
                                    <>
                                    <Grid item container xs={12} spacing={1}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>      
                                        <RegularTextField
                                            name={`street`}
                                            type="text"
                                            value={values.street}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label={'Quote.Street'}
                                            />
                                        {validMessage(`street`)}
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>  
                                        <RegularTextField
                                                name={`suiteNo`}
                                                type="text"
                                                value={values.suiteNo}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                label={values.MailingInCanada === false && currentLanguage === 'ko' ? 'Quote.UnitNumberKo' : 'Quote.UnitNumber'}
                                        />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>   
                                        <RegularTextField
                                            name={`city`}
                                            type="text"
                                            value={values.city}
                                            onChange={(e)=> setFieldValue(`city`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                            onBlur={handleBlur}
                                            label= {values.MailingInCanada === false && currentLanguage === 'ko' ? 'Quote.CityKo' : 'Quote.City'}
                                            />
                                        {validMessage(`city`)}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}> 
                                        {values.officeInCanada === true 
                                            ? 
                                            <Autocomplete
                                                name="province"
                                                options={provinces.filter(i => i.country_code === 'CA')}
                                                value={values.province ? provinces.find(c => c.country_code === 'CA' && c.province_name === values.province) : null}
                                                getOptionLabel={(option) => option.province_name}
                                                size="small"
                                                renderInput={(params) => 
                                                    <RegularTextField {...params}
                                                        label= {values.MailingInCanada === false && currentLanguage === 'ko' ? 'Quote.ProvinceKo' : 'Quote.Province'}
                                                    />
                                                }
                                                onChange={(e, selectedVal)=>{
                                                        values.province = selectedVal? selectedVal.province_name: ''
                                                        setFieldValue(`province`, selectedVal?selectedVal.province_name:'')
                                                }}
                                            />
                                            : 
                                            <RegularTextField
                                                name={`province`}
                                                type="text"
                                                value={values.province}
                                                onChange={(e)=> setFieldValue(`province`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                                onBlur={handleBlur}
                                                label= {values.MailingInCanada === false && currentLanguage === 'ko' ? 'Quote.ProvinceKo' : 'Quote.Province'}
                                            />
                                        }
                                        {validMessage(`province`)}
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>    
                                        <label className={classes.inputLabel}><Text tid={'Quote.PostalCode'}/></label>
                                        {values.officeInCanada
                                            ?
                                            <InputMask
                                                name={`postalCode`}
                                                mask= {"a9a 9a9" }
                                                value={values.postalCode}
                                                onChange={(e)=>setFieldValue(`postalCode`,e.target.value.toUpperCase())}
                                                onBlur={handleBlur}                    
                                                >
                                                {() => (
                                                <TextField
                                                    type="text"
                                                    name="postalCode"
                                                    variant="outlined"
                                                    size="small" 
                                                    style={{ width: !isMobile ? '100%' : '104%', marginTop:'9px' }}
                                                />
                                                )}
                                            </InputMask>
                                            :
                                            <RegularTextField
                                                name={`postalCode`}
                                                type="text"
                                                value={values.postalCode}
                                                onChange={(e)=>setFieldValue(`postalCode`,e.target.value)}
                                                onBlur={handleBlur}
                                            />
                                        }
                                        {validMessage(`postalCode`)}
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <Autocomplete 
                                                name={`country`} 
                                                disabled = {values.officeInCanada?true:false}       
                                                options={countries}
                                                value = {values.country?countries.find(c=>c.country_code===values.country):null}
                                                getOptionLabel={(option) => option.name}
                                                getOptionDisabled={(option) => option.country_code === (values.officeInCanada?'':'CA')}
                                                size="small"
                                                renderInput={(params) => 
                                                    <RegularTextField {...params} 
                                                        label= {'Quote.Country'}
                                                        style={{ marginTop:'15px'}}
                                                    />
                                                }
                                                onChange={(e, selectedVal)=>{
                                                // console.log(selectedVal? selectedVal.country_code: '')
                                                    values.country = selectedVal? selectedVal.country_code: ''
                                                    setFieldValue(`country`, selectedVal?selectedVal.country_code:'')
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </> : 
                                null
                                }


                                {/* Applicant Information */}
                                <Grid item container style={{ margin:'1.5vh 0'}}>
                                    <Typography variant="h4">
                                        <PersonIcon/> <Text tid={`Partner.Register.ApplicantInformation.Title`}/>
                                    </Typography>
                                </Grid>

                                <Grid item container >

                                    {/* first name */}
                                    <Grid item xs={12} md={6} lg={6}>
                                        <RegularTextField
                                            name='firstName'
                                            type="text"
                                            value={values.firstName}
                                            // onChange={handleChange}
                                            onChange={(e)=> setFieldValue(`firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                            onBlur={handleBlur}
                                            label="Quote.FirstName"
                                        />
                                        {validMessage(`firstName`)}
                                    </Grid>

                                    {/* last name */}
                                    <Grid item xs={12} md={6} lg={6}>
                                        <RegularTextField
                                            name='lastName'
                                            type="text"
                                            value={values.lastName}
                                            // onChange={handleChange}
                                            onChange={(e)=> setFieldValue(`lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                            onBlur={handleBlur}
                                            label="Quote.LastName"
                                        />
                                        {validMessage(`lastName`)}
                                    </Grid>

                                    {/* email */}
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RegularTextField
                                            name='email'
                                            type="text"
                                            value={values.email}
                                            onChange={(e)=> setFieldValue(`email`, e.currentTarget.value.toLowerCase())}
                                            // onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Quote.EmailAddress"
                                        />
                                        {validMessage(`email`)}
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <Typography variant="h5" style={{ marginTop:'12px', fontSize:'15px' }}>
                                            <Text tid={'Partner.Register.IsManager'}/>
                                        </Typography>
                                
                                        <ToggleButtonGroup
                                            name ={`Manager`}
                                            value={values.IsManager}
                                            exclusive
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`IsManager`, val)
                                                values.IsManager = val
                                            }}
                                            // onBlur={() => setTouched({ 'maillingInCanada': true })}
                                            style={{ width: !isMobile ? '15vw' : '50vw', marginTop:'5px' }}
                                        >
                                            <ToggleButton value={true} className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false} className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`IsManager`)}
                                </Grid>
                                {/* 보험담당자 직원 수 */}
                                <Grid item xs={12} md={6} lg={6} xl={6}>
                                    <RegularTextField
                                        name='employeeNumber'
                                        type="number"
                                        value={values.employeeNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Partner.Register.EmployeeNumber.Label"
                                        />
                                    {validMessage(`employeeNumber`)}
                                </Grid>

                                {/* Special Note */}
                                <Grid item container style={{ margin:'1.5vh 0'}}>
                                    <Typography variant="h4">
                                        <CommentIcon/> <Text tid={`TravelApplication.NoteTitle`}/>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
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

                            <Grid item container style={{ justifyContent:'end', margin:'4vh 0' }}>
                                <Button type='submit' color="dark" style={{ width: isMobile? '100%' : 'auto' }}>
                                    <Text tid={"Partner.Register.Button.Submit"}/>
                                </Button>
                            </Grid>

                        </Form>
                        )}
                    </Formik>
                </main>
            </Grid>
        </Grid>
    </>
    )
    } else {
        return( 
            <SubmitResult
                formData={formData}
            />   
        )
      
    }
}

export default RegisterPartner
