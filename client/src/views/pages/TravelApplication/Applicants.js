import React, { useState, useEffect, useRef, useContext } from 'react'
//core components
import { Link } from 'react-router-dom'
import { Grid, IconButton, MenuItem, Typography, Box } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
// import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Alert, AlertTitle } from '@material-ui/lab';

//common components
import { Text } from '../../../components/common/LanguageProvider'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
import { RegularTextFieldSmall, SelectTextFieldSmall, SelectMenuTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import CustomButton from '../../../components/common/CustomButtons/Button'
import { CalculateAgeBaseEffectiveDate, CalculateAgeDays } from '../../../controllers/CalculateValue'
import { LanguageContext } from '../../../components/common/LanguageProvider';
import { CalculateTripDays, CalculateTripEndDate } from '../../../controllers/CalculateValue'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
import { dateFormat } from '../../../controllers/dataFormat'
import Button from '../../../components/common/CustomButtons/Button'
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
//icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import User from '../../../assets/imgs/icons/user.svg'
// import MuiButton from '@material-ui/core/Button';


//setup form style
const useStyles = makeStyles(formStyle)

// Relationship to Primary Applicant  or Beneficiary relationship
const relationship = [
{ code: 'Estate', name: 'Estate', origin: false, groupType:['I'] },
{ code: 'Spouse', name: 'Spouse', origin: true, groupType:['F', 'I']  },
{ code: 'Child', name: 'Child', origin: true, groupType:['F', 'I'] },
{ code: 'Parent', name: 'Parent', origin: true, groupType:['I'] },
{ code: 'Siblings', name: 'Siblings', origin: true, groupType:['I'] },
{ code: 'Companion', name: 'Companion', origin: true, groupType:['I'] },
{ code: 'Guardian', name: 'Guardian', origin: true, groupType:['I'] },
]

// travel Type SS,SC means eligilbeStuent field is true
const travelType = [
    { code: 'SS', name: 'Study',insuredType:['STUDENT'], applicationCompany:['Allianz', 'Tugo']},
    { code: 'SF', name: 'StudentsFamily',insuredType:['STUDENT'], applicationCompany:['Allianz', 'Tugo']} ,
    { code: 'WW', name: 'Working',insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS']},
    { code: 'TL', name: 'TravelingLeisure', insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS']},
    { code: 'SV', name: 'SuperVisa', insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS']},
    { code: 'PW', name: 'PGWP', insuredType:['STUDENT'], applicationCompany:['Allianz']},
    { code: 'RH', name: 'ReturningHome', insuredType:['VISITOR'], applicationCompany:['Allianz', 'Tugo', 'GMS']},
    { code: 'VC', name: 'Vacation', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'BT', name: 'BusinessTrip', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'SA', name: 'StudyAbroad', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'CV', name: 'CruiseVacation', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'SB', name: 'SnowBird', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'RT', name: 'RoadTrip', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'GT', name: 'GolfTrip', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
    { code: 'OT', name: 'Other', insuredType:['CANADIAN'], applicationCompany:['Allianz', 'Tugo', 'BlueCross']},
  ]

export const Applicants = ({ 
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    errors,
    validMessage,
 }) => {

    //set to form style
    const classes = useStyles()

    const [index, setIndex] = useState(0)
    const [alterOpen, setAlterOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

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
    
    let isMobile = (width < 769);

    const scrollRef = useRef(null);
    const scrollToElement = () => scrollRef.current.scrollIntoView();

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    // add insured person
    function addinsuredPerson(insuredPersonNumber, insuredPersons){
        const applied = insuredPersonNumber - insuredPersons.length;
        if (applied <= 0)
        {
            for (var i = 0; i < (applied * -1); i++) {
                insuredPersons.pop()
            }
        }
        else{
            for (var j = 0; j < applied; j++) {
                insuredPersons.push({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    birthDate: null,
                    age: 0,
                    relationship: '',
                    beneficiaryName:'',
                    beneficiaryRelationship: '',
                    attendSchoolName:'',
                    sameDate: true,
                    tripStartDate: insuredPersons[0].tripStartDate,
                    tripEndDate: insuredPersons[0].tripEndDate,
                    tripPeriod: insuredPersons[0].tripPeriod,
                    arrivalDate: insuredPersons[0].arrivalDate,
                    graduatedDate: null,
                    yearDateAfterGraduated: null,
                    // travelType: insuredPersons[0].travelType,
                    travelType: '',
                    tripType: insuredPersons[0].tripType,
                    destCountry: insuredPersons[0].destCountry,
                    tripDepartureDate: null,
                    tripOtherCoverageDays: 0,
                    multiTripDays: insuredPersons[0].multiTripDays,
                    preExistCond: false,
                    coverCond: false,
                    maternity: false,
                    mentalIllness: false,
                    eligilbeIns: insuredPersons[0].eligilbeIns,
                    physicalCard: false,
                    insurancePlans: [],
                    selectedPlan: [],
                    selectedMedQuesAnswer: [],
                    optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
                    optionalAddOnPlans: [],
                    renewalInsurance: false,
                })
            }
        }
        return insuredPersons;
    }


    const companion = (values) => {
    
        return (
            <>
            {/* insuredPerson Information */}
            <Grid item container ref={scrollRef}>
            
                <Grid item xs={12}>
                    <div className={classes.companionSection}>
                        {errorMsg && index?
                            <Grid item container xs={12} justify="center">
                                <Grid item xs={12} style={{ marginBottom: '1.5vh' }}>     
                                    <Alert
                                        severity='error'
                                        onClose={() => setErrorMsg('')}
                                    >
                                        {errorMsg}
                                    </Alert>
                                </Grid>
                            </Grid>
                        :null}

                        {/* start of fully expanded companion form list */}
                        {values.insuredPersons && values.insuredPersons.length > 0
                            && values.insuredPersons.map((insuredPerson, pIndex) => (
                                <div key={pIndex}>
                                    {personInfo(pIndex)}
                                    <br />
                                </div>
                        ))}

                    </div>
                </Grid>

                <div style={{ display: 'none' }}>
                    <CustomButton
                        id = 'isInsuredPersonVaild'
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            errors&&!!errors.insuredPersons&&
                            errors.insuredPersons.every((err, i) => {
                                if (err){setIndex(i); 
                                            scrollToElement();
                                            return false}
                                return true;
                            })
                            setAlterOpen(true);
                        }}
                    >
                        Check InsuredPerson Vaild
                    </CustomButton>
                </div>

            </Grid>
            </>
        );
    }

    const personInfo = (index) => {
        return (
            <>
                {/* <Grid container ref={scrollRef}  style={{ border:'1px solid #ddd' }}> */}
                <Grid container style={{ border:'1px solid #ddd' }}>
                    <Grid item xs={12}>
                        <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: 'left', color:'#2a2f71', marginBottom: isMobile ? '2vh' : '0', padding:'1vh', background:'#ECEEF6' }}>
                            
                            {/* <Text tid={'Quote.Family'}/> {index} */}
                            {index===0 
                                ? 
                                    <span className={classes.sectionSubTitle}>
                                            <img
                                                src={User}
                                                alt="Companion icon"
                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                            />
                                            {/* {`Primary`} */}
                                            {/* <Text tid={'Quote.Primary'}/> */}
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `}
                                    </span>
                                : 
                                    <span className={classes.sectionSubTitle}>
                                        <img
                                            src={User}
                                            alt="Companion icon"
                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                        />
                                            {/* <Text tid={'Quote.Family'}/> {`${index}`} */}
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `}
                                    </span>
                            }
                            

                            {/* delete button */}
                            {index!==0 && 
                                <IconButton style={{ float: 'right' }} size='small' disableFocusRipple={true} disableRipple={true} 
                                    onClick={(e) => {
                                        if (!e) e = window.event;
                                        e.cancelBubble = true;
                                        if (e.stopPropagation) e.stopPropagation();

                                        if (values.insuredPersons.length > 1) {
                                                setIndex(index - 1)
                                                setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[index]))
                                                setFieldValue('insuredNumber', values.insuredNumber - 1)
                                                setErrorMsg('')
                                        }
                                    }}>
                                    <HighlightOffIcon />
                                </IconButton>
                            }
                    
                        </div>
                    </Grid>

                    <Grid item xs={12} >
                        {errors && !!errors.insuredPersons && alterOpen &&
                            !!errors.insuredPersons[index] &&
                            
                                <Grid item container xs={12} justify="center">
                                    <Grid item xs={12} style={{ marginTop: isMobile ? '-1vh':'1vh', marginBottom: isMobile ? '1vh' : '0' }}>                                                    
                                        <Alert
                                            severity='error'
                                            onClose={() => setAlterOpen(false)}
                                        >
                                            <Text tid={'Quote.Applicants'}/> {` ${index+1} `} : 
                                            <Text tid={'Quote.Error.CompleteInformation'}/>
                                        </Alert>

                                    </Grid>
                                </Grid>
                        }
                    </Grid>

                    <Grid container className={classes.row_input}>
                        <Grid item container spacing={2}>

                            <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.FirstName'}
                                        name={`insuredPersons.${index}.firstName`}
                                        value={values.insuredPersons[index].firstName}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`insuredPersons.${index}.firstName`)}
                                </Grid>

                                <Grid item xs={12} sm={4} md={4}>
                                    <RegularTextFieldSmall
                                        label= {'Quote.LastName'}
                                        name={`insuredPersons.${index}.lastName`}
                                        value={values.insuredPersons[index].lastName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    {validMessage(`insuredPersons.${index}.lastName`)}
                                </Grid>

                                <Grid item xs={12} sm={3} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.Gender'}/></label>
                                    <ToggleButtonGroup
                                        className={classes.toggleButtonGroup}
                                        name={`insuredPersons.${index}.gender`}
                                        value={values.insuredPersons[index].gender}
                                        exclusive
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.gender`, e.currentTarget.value)
                                        }}
                                    >
                                        <ToggleButton value="Male" className={classes.toggleButton}>
                                            <Text tid={'Quote.Male'}/>
                                        </ToggleButton>
                                        <ToggleButton value="Female" className={classes.toggleButton}>
                                            <Text tid={'Quote.Female'}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    {validMessage(`insuredPersons.${index}.gender`)}
                                </Grid>

                                <Grid item xs={12} sm={4} md={4}>
                                    <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}><Text tid={'Quote.BirthDate'}/></label>
                                
                                    <KeyboardDatePickerField 
                                        name={`insuredPersons.${index}.birthDate`}
                                        value={values.insuredPersons[index].birthDate}
                                        maxDate={new Date()}
                                        onChange={(e) => {
                                            values.insuredPersons[index].birthDate = e
                                            setFieldValue(`insuredPersons.${index}.birthDate`, e)
                                            // setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e))
                                            setFieldValue(`insuredPersons.${index}.age`, 
                                                values.insuredPersons[index].tripStartDate 
                                                    ? CalculateAgeBaseEffectiveDate(e, values.insuredPersons[index].tripStartDate )
                                                    : 0
                                            )
                                            setFieldValue(`insuredPersons.${index}.ageDays`, 
                                                values.insuredPersons[index].tripStartDate 
                                                    ? CalculateAgeDays(e, values.insuredPersons[index].tripStartDate )
                                                    : 0
                                            )
                                            values.insuredPersons[index].selectedPlan = {}
                                            setFieldValue(`insuredPersons.${index}.selectedPlan`,{})
                                        }}
                                        onBlur={handleBlur}
                                        style={{ width:'100%', margin:'4px 0 4px 0' }}
                                    />
                                    {validMessage(`insuredPersons.${index}.birthDate`)}
                                </Grid>

                                <Grid item xs={12} sm={2} md={4}>
                                    <RegularTextFieldSmall
                                        name={`insuredPersons.${index}.age`}
                                        label= {'Quote.Age'}
                                        type='text'
                                        value={values.insuredPersons[index].age}
                                        disabled
                                    />
                                    <div style={{ display: 'none' }}>
                                        {values.insuredPersons[index].ageDays} days old
                                    </div>
                                </Grid>

                                {/* relationship */}
                                {index > 0 
                                ?(
                                    <Grid item xs={12} sm={4} md={4}>
                                        <SelectMenuTextFieldSmall
                                            // label={'Relationship to Primary'}
                                            label = {currentLanguage !== 'ko'
                                                        ?(`${values.insuredPersons[index].firstName} is ${values.insuredPersons[0].firstName}'s`)
                                                        :(`${values.insuredPersons[index].firstName} 님은 ${values.insuredPersons[0].firstName} 님의`)
                                                    }
                                            value={values.insuredPersons[index].relationship}
                                            name={`insuredPersons.${index}.relationship`}
                                            // disabled={index === 0 ? true : false}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            >
                                            {relationship
                                                .filter(f=>f.origin===true && f.groupType.find(f=>f===values.insuredGroupType.charAt(0)))
                                                .map((item) => (
                                                    <MenuItem key={item.code} value={item.code}>
                                                    <Text tid={`Quote.${item.name}`}/>
                                            </MenuItem>
                                            ))}
                                        </SelectMenuTextFieldSmall>
                                        {validMessage(`insuredPersons.${index}.relationship`)}
                                    </Grid>
                                )
                                :
                                    <Grid item xs={12} sm={4} md={4}></Grid>
                                }

                                <Grid item xs={12} sm={5} md={4}>
                                    <RegularTextFieldSmall
                                        name={`insuredPersons.${index}.beneficiaryName`}
                                        label={'Quote.BeneficiaryName'}
                                        tooltipTitle={'Tooltip.Beneficiary'}
                                        value={values.insuredPersons[index].beneficiaryName}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFieldValue(`insuredPersons.${index}.beneficiaryName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                        }}
                                        onBlur={handleBlur}
                                    />                                    
                                    {validMessage(`insuredPersons.${index}.beneficiaryName`)}
                                </Grid>
                        
                                <Grid item xs={12} sm={5} md={4}>
                                    <SelectMenuTextFieldSmall
                                        label= {currentLanguage !== 'ko'
                                        ?(`Beneficiary is ${values.insuredPersons[index].firstName}'s`)
                                        :(`수혜자는 ${values.insuredPersons[index].firstName} 님의`)} 
                                        name={`insuredPersons.${index}.beneficiaryRelationship`}
                                        value={values.insuredPersons[index].beneficiaryRelationship}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {relationship.map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                                <Text tid={`Quote.${item.name}`}/>
                                            </MenuItem>
                                        ))}
                                        {/* {beneficiaryRelationships.map((value) => (
                                            <option key={value.key} value={value.value}>{value.label}</option>
                                        ))} */}
                                    </SelectMenuTextFieldSmall>
                                    {validMessage(`insuredPersons.${index}.beneficiaryRelationship`)}
                                </Grid>
                                
                                {/* Travel Purpose */}
                                <Grid item container xs={12} sm={6} md={4}  className={classes.row_input}>
                                    <div style={{ display: 'none' }}>
                                        {/* 'Primary insured */}
                                        {index === 0 && values.insuredPersons[index].travelType === 'SV' && values.tripPeriod !== 365 
                                            ? values.insuredPersons[index].travelType = '': null }
                                    </div>
                                    <SelectMenuTextFieldSmall
                                        label= {'Quote.TravelPurpose'}
                                        value={values.insuredPersons[index].travelType}
                                        name={`insuredPersons.${index}.travelType`}
                                        onChange={(e)=>{
                                            handleChange(e)
                                            setFieldValue(`insuredPersons.${index}.graduatedDate`, null)  
                                            setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`, null) 
                                            // rest when selected super visa
                                            if (e.target.value === 'SV'){
                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, 365) 
                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, CalculateTripEndDate(values.insuredPersons[index].tripStartDate, 365 )) 
                                                // set sameDate
                                                if (index !== 0 && values.tripPeriod !== 365){
                                                    setFieldValue(`insuredPersons.${index}.sameDate`, false) 
                                                } 
                                                // set header trip period
                                                if (values.insuredPersons[index].relationship === 'Primary'){
                                                    setFieldValue(`tripPeriod`, 365) 
                                                    setFieldValue(`tripEndDate`, CalculateTripEndDate(values.tripStartDate, 365 )) 
                                                }
                                            }
                                        }}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value={""}><Text tid={'Quote.SelectTravelPurpose'}/></MenuItem>
                                            {travelType.map((t)=> ({code: t.code, name: t.name, company: t.applicationCompany, includedType: t.insuredType.filter(f => f === values.insuranceType).length}))
                                                .filter( i => i.includedType > 0 && i.company.find(f=>f===values.application.applicationCompany))
                                                .map((item) => (
                                                    <MenuItem key={item.code} value={item.code}>
                                                        <Text tid={`Quote.${item.name}`}/>
                                                    </MenuItem>
                                            ))}
                                    </SelectMenuTextFieldSmall>
                                    {validMessage(`insuredPersons.${index}.travelType`)}

                                </Grid>

                                {/* If PGWP Student */}
                                <Grid item xs={12} sm={4} md={4} lg={4} >
                                    {values.tripDirection === 'InBound' && 
                                        values.insuredPersons[index].travelType === 'PW' && 
                                        <>
                                        <label className={classes.inputLabel} style={{ paddingBottom:'6px' }}><Text tid={'Quote.WhenDidYouGraduate'}/></label> 
                                        <KeyboardDatePickerField
                                            name={`insuredPersons.${index}.graduatedDate`}
                                            value={values.insuredPersons[index].graduatedDate}
                                            style={{ width: '100%' }}
                                            maxDate={new Date()}
                                            minDate={new Date(new Date().setDate(new Date().getDate() - (365 - 1)))}
                                            onChange={(e) => {
                                                values.insuredPersons[index].graduatedDate = e
                                                values.insuredPersons[index].yearDateAfterGraduated = CalculateTripEndDate(e, 365)
                                                setFieldValue(`insuredPersons.${index}.graduatedDate`, e)                                
                                                setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`, CalculateTripEndDate(e, 365))   
                                            }}
                                        />
                                        {validMessage(`insuredPersons.${index}.graduatedDate`)}
                                    </> 
                                    }
                            
                                </Grid>
                                {/* PW */}
                                {values.insuredPersons[index].travelType === 'PW' && 
                                    values.insuredPersons[index].graduatedDate  && (
                            
                                    <Grid container spacing={1} justify="center">
                                        <Grid item container xs={12} sm={12} md={12} className={classes.textFieldWrapper}>
                                            <Box style={{ background:'#f9f9f9', marginTop:'3vh', width:'100%'}}>
                                                {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated) > 0 ?
                                                    <>
                                                    {(values.insuredPersons[index].yearDateAfterGraduated < values.insuredPersons[index].tripEndDate) && (
                                                        <>
                                                        <Typography variant="h5" style={{margin:'2vh'}}>
                                                            {currentLanguage === 'ko' 
                                                                ? (<div>
                                                                    {values.insuredPersons[index].firstName}님은  {dateFormat(values.insuredPersons[index].tripStartDate)} 부터 {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)} 까지 총 {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)}일 동안의 유학생 보험을 가입 하실 수 있습니다.
                                                                    <br/>
                                                                    <strong>보험 만료일이 {dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))} 로 변경되어야 가입이 가능합니다. 변경 하시겠습니까?</strong>
                                                                    </div>) 
                                                                : (<div>
                                                                    You can purchase international student insurance for a total
                                                                    of {CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)} days from {dateFormat(values.insuredPersons[index].tripStartDate)} to {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)}. 
                                                                    <br/>
                                                                    <strong> Expiry data as {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)} will be changed for apply. Would you like to continue?</strong>
                                                                    </div>)
                                                            }
                                                        </Typography>
                                                        <Grid container spacing={1} justify="center">
                                                            <Grid item xs={6} sm={6} md={3} lg={3}>
                                                                <Button
                                                                    color="dark" 
                                                                    className={classes.next_button}
                                                                    style={{ marginBottom:'3vh'}}
                                                                    onClick={()=>{
                                                                        if(index === 0){
                                                                            values.tripEndDate = values.insuredPersons[index].yearDateAfterGraduated
                                                                            values.tripPeriod = CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated)
                                                                        }
                                                                        setFieldValue(`insuredPersons.${index}.tripEndDate`, values.insuredPersons[index].yearDateAfterGraduated )
                                                                        setFieldValue(`insuredPersons.${index}.tripPeriod`,CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated))
                                                                        for (const i in values.insuredPersons) { 
                                                                                if (index === 0 && values.insuredPersons[i].sameDate === true){
                                                                                    setFieldValue(`insuredPersons.${i}.tripEndDate`, values.insuredPersons[index].yearDateAfterGraduated )
                                                                                    setFieldValue(`insuredPersons.${i}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated))
                                                                                }
                                                                            } 
                                                                    }}
                                                                >
                                                                    <Text tid={'Button.Yes'}/>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                </>
                                                    )}    
                                                    </>
                                                    :
                                                    <>
                                                        <Typography variant="h5" style={{margin:'2vh'}}>
                                                            <Text tid={'TravelApplication.NotEligibleStudent'}/>
                                                        </Typography>
                                                        <Link to="/travel-insurance/quote/trip-info" target='_blank' style={{ textDecoration: 'none', margin:'0 10px 20px 10px', display:'inline-block' }}>
                                                            <Button variant="outlined" color='primary'>
                                                                <Text tid={`Get a quote`} />
                                                            </Button>
                                                        </Link>
                                                    </>
                                                }
                                            </Box>


                                        </Grid>
                                    </Grid>
                                )}

                                {values.tripDirection === 'InBound' &&
                                    (index>0 || 
                                        (index=== 0 && 
                                            (values.insuredPersons[0].travelType === 'SV' || 
                                                (values.insuredPersons[0].travelType === 'PW' &&  CalculateTripDays(values.insuredPersons[index].tripStartDate,values.insuredPersons[index].yearDateAfterGraduated) > 0)) )) 
                                    
                                    &&
                                    // values.insuredPersons[index].travelType !== 'PW' && 
                                    (
                                    <>
                                        {/* samedate */}
                                        {index>0 &&
                                            <Grid item container xs={12} style={{ marginBottom: isMobile ? '15px' : '0', marginTop:isMobile ? '0': '2vh' }}>
                                                
                                                <Grid item xs={12} sm={12} md={10} lg={4} >
                                                    <span className={classes.inputLabel} style={{ marginBottom: '7px', paddingTop:'0', fontSize:'14px', fontWeight:'600'}}>
                                                        {currentLanguage !== 'ko'
                                                            ?(`Is travel date same as ${values.insuredPersons[0].firstName}'s?`)
                                                            :(`여행 기간이 ${values.insuredPersons[0].firstName} 와 동일 한가요?`)
                                                        }
                                                    </span>
                                                    <ToggleButtonGroup
                                                        className={classes.toggleButtonGroup}
                                                        name={`insuredPersons.${index}.sameDate`}
                                                        value={values.insuredPersons[index].sameDate}
                                                        exclusive
                                                        onChange={(e) => {
                                                            const val = e.currentTarget.value === 'true' ? true : false
                                                            values.insuredPersons[index].sameDate = val
                                                            setFieldValue(`insuredPersons.${index}.sameDate`, val)
                                                            values.insuredPersons[index].tripStartDate = values.tripStartDate
                                                            values.insuredPersons[index].tripEndDate = values.tripEndDate
                                                            values.insuredPersons[index].tripPeriod = values.tripPeriod
                                                            setFieldTouched(`insuredPersons.${index}.tripStartDate`)
                                                            setFieldTouched(`insuredPersons.${index}.tripEndDate`)
                                                            setFieldTouched(`insuredPersons.${index}.tripPeriod`)
                                                        }}
                                                    >
                                                        <ToggleButton value={true} className={classes.toggleButton}>
                                                            <Text tid={'Button.Yes'}/>
                                                        </ToggleButton>
                                                        <ToggleButton value={false} className={classes.toggleButton}>
                                                        <Text tid={'Button.No'}/>
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>
                                                    {validMessage(`insuredPersons.${index}.sameDate`)}
                                                </Grid>
                                            </Grid>
                                        }

                                        {/* this is conditional based on if all info is the same or not*/}
                                        {(values.insuredPersons[index].sameDate === true ||
                                            values.insuredPersons[index].sameDate === false) && (
                                            <>
                                                <Grid item container className={classes.row_input} spacing={2}>

                                                    <Grid item xs={12} md={4} >
                                                        <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                                                        <KeyboardDatePickerField
                                                            name={`insuredPersons.${index}.tripStartDate`}
                                                            value={values.insuredPersons[index].tripStartDate}
                                                            disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                            minDate={new Date()}
                                                            fullWidth
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripStartDate`, e)
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(e, values.insuredPersons[index].tripEndDate))
                                                            }}
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripStartDate`)}
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <label className={classes.inputLabel}><Text tid={'Quote.TripEndDate'}/></label>
                                                        <KeyboardDatePickerField
                                                            name={`insuredPersons.${index}.tripEndDate`}
                                                            value={values.insuredPersons[index].tripEndDate}
                                                            minDate={new Date()}
                                                            disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                            fullWidth
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, e)
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate, e,))
                                                            }}
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripEndDate`)}
                                                    </Grid>

                                                    <Grid item xs={12} md={4} >
                                                        <RegularTextField
                                                            label= {'Quote.CoverageDays'}
                                                            name={`insuredPersons.${index}.tripPeriod`}
                                                            value={values.insuredPersons[index].tripPeriod ? values.insuredPersons[index].tripPeriod : ''}
                                                            disabled={values.insuredPersons[index].sameDate === true
                                                                ? true
                                                                : (values.insuredPersons[index].tripStartDate ? false : true)}
                                                            onChange={(e) => {
                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, e.currentTarget.value)
                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`,
                                                                    CalculateTripEndDate(values.insuredPersons[index].tripStartDate, e.currentTarget.value
                                                                    ))
                                                            }}
                                                            onBlur={handleBlur}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                                            }}
                                                            // fullWidth
                                                        />
                                                        {validMessage(`insuredPersons.${index}.tripPeriod`)}
                                                    </Grid>
                                                </Grid>
                                            </>
                                            )}
                                    </>
                                )}

                        </Grid>


                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            <Grid container spacing={2} style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-120px' : '0' }}>
                <Grid item container xs={12}>
                    <Grid item xs={12} sm={12} md={12} style={{ marginBottom:'2vh' }}>
                        {/* <span className={classes.spanTitle}><Text tid={'Applicants'}/></span> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} >
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Grid item container>
                                    {/* Number of insuredPersons */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <SelectTextFieldSmall
                                            label={'Number of applicants'}
                                            name='insuredNumber'
                                            disabled = {values.tripStartDate && values.tripPeriod > 0 ? false : true}
                                            value={values.insuredNumber}
                                            onChange={(e) => {
                                                values.insuredNumber = e.currentTarget.value
                                                setFieldTouched('insuredNumber')
                                                setFieldValue('insuredNumber', e.currentTarget.value)
                                                setFieldValue('insuredPersons', addinsuredPerson(e.currentTarget.value, values.insuredPersons))                                        
                                            }}
                                            onBlur={handleBlur}
                                        >
                                            {/* <option value='' hidden>Select</option> */}
                                            {[1,2,3,4,5,6]
                                                // .filter(f=>f > (values.insuredGroupType === 'Family'? 2:0))
                                                .map((item) => (
                                                        <option key={item} value={item} 
                                                                // disabled = {item < (values.insuredGroupType === 'Family'? 2:0)?true:false}
                                                                >
                                                            {item}
                                                        </option>
                                            ))}
                                        </SelectTextFieldSmall>
                                        {validMessage('insuredNumber')}
                                    </Grid>
                                    {/* Applicant Eligibilty Confirmation  */}
                                    <Grid item container xs={12} sm={12} md={12} spacing={1} justify="center">
                                        <Grid item xs={12} style={{ margin:'2vh 0' }}>
                                            <Alert severity="success">
                                                <AlertTitle><Text tid={'TravelApplication.Eligiblity'}/></AlertTitle>
                                                <ul>
                                                    <li><Text tid={'TravelApplication.TerminalIllness'}/></li>
                                                    <li><Text tid={'TravelApplication.Cancer'}/></li>
                                                    <li><Text tid={'TravelApplication.CancerTreatment'}/></li>
                                                </ul>
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{ marginTop: isMobile ? '2vh' : '0' }}>
                                        <label style={{ display:'block'}} className={classes.inputLabel_manualForm}><Text tid={'Application.Applicant.Eligible'}/></label>
                                        <ToggleButtonGroup
                                            className={classes.toggleButtonGroup}
                                            name="eligilbeAgrement"
                                            value={values.eligilbeAgrement}
                                            exclusive
                                            style={{ width: isMobile ? '100%': '50%' }}
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`eligilbeAgrement`, val)
                                            }}
                                            >
                                                <ToggleButton 
                                                    disabled = {(values.tripStartDate && values.tripPeriod > 0 &&
                                                                (values.insuredGroupType === 'Individual'? values.insuredNumber > 0: values.insuredNumber > 2))
                                                                    ? false : true}
                                                    value={true} 
                                                    className={classes.toggleButton}
                                                >
                                                    <Text tid={'Button.Yes'}/>
                                                </ToggleButton>
                                                <ToggleButton 
                                                    disabled = {(values.tripStartDate && values.tripPeriod > 0 &&
                                                                (values.insuredGroupType === 'Individual'? values.insuredNumber > 0: values.insuredNumber > 2))
                                                                    ? false : true}
                                                    value={false} 
                                                    className={classes.toggleButton}
                                                >
                                                    <Text tid={'Button.No'}/>
                                                </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage('eligilbeAgrement')}
                                    {/* </FormControl> */}
                                    </Grid>
                                    {values.eligilbeAgrement===false&&
                                        <Alert severity='error' style={{ marginTop: '2vh' }}>
                                            <Text tid={'Quote.Error.NoEligibilityAgreement'}/>
                                        </Alert>
                                    }
                                </Grid>
                            </Grid>

                            <Grid item xs>
                                {((values.insuredGroupType === 'Individual'? values.insuredNumber > 0: values.insuredNumber > 2 ) &&
                                    values.eligilbeAgrement === true)
                                    ? companion(values) : null}
                            </Grid>

                        </Grid>
                    </Grid>            
                </Grid>

            </Grid>


        </>
    )
}


export default Applicants
