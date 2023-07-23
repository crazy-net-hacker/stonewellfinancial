import React, { useEffect, useCallback, useState, useContext }  from 'react'
import { FieldArray } from 'formik'
// core components
import { 
  Card, Grid, CardContent, makeStyles, 
  MenuItem, IconButton 
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup, Alert } from '@material-ui/lab'
import InputAdornment from '@material-ui/core/InputAdornment';
// Common components
import Button from '../../../../components/common/CustomButtons/ButtonDB'
import { RegularTextFieldSmall, SelectMenuTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
import { LanguageContext } from '../../../../components/common/LanguageProvider';
import { Text } from '../../../../components/common/LanguageProvider';
import TooltipInfo from '../../../../components/common/TooltipInfo';
import WindowDimension from '../../../../components/common/WindowDimension'
// data picker
import KeyboardDatePickerField from '../../../../components/common/CustomDatePickers'
//
import { dateFormat } from '../../../../controllers/dataFormat'
import { CalculateTripEndDate, CalculateTripDays, CalculateAgeBaseEffectiveDate, CalculateAgeDays } from '../../../../controllers/CalculateValue'
//
import SearchInsuredModal from '../SearchInsuredModal'

// icon
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import HelpIcon from '@mui/icons-material/Help';
import SearchIcon from '@mui/icons-material/Search';
// import { ImCircleUp, ImCircleDown } from "react-icons/im";

// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'


// Style
const useStyles = makeStyles(vendorFormStyle)



const relationship = [
  { code: 'Estate', name: 'Estate', origin: false, groupType:['I'] },
  { code: 'Spouse', name: 'Spouse', origin: true, groupType:['F', 'I']  },
  { code: 'Child', name: 'Child', origin: true, groupType:['F', 'I'] },
  { code: 'Parent', name: 'Parent', origin: true, groupType:['I'] },
  { code: 'Siblings', name: 'Siblings', origin: true, groupType:['I'] },
  { code: 'Guardian', name: 'Guardian', origin: true, groupType:['I'] },
  { code: 'Companion', name: 'Companion', origin: true, groupType:['I'] },
  ]

// travel Type SS,SC means eligilbeStuent field is true
const travelType = [
  { code: 'SS', name: 'Study',insuredType:['STUDENT'] },
  { code: 'SF', name: 'StudentsFamily',insuredType:['STUDENT'] } ,
  { code: 'WW', name: 'Working',insuredType:['VISITOR'] },
  { code: 'TL', name: 'TravelingLeisure', insuredType:['VISITOR'] },
  { code: 'SV', name: 'SuperVisa', insuredType:['VISITOR'] },
  { code: 'PW', name: 'PGWP', insuredType:['STUDENT','VISITOR']},
  { code: 'RH', name: 'ReturningHome', insuredType:['VISITOR'] },
  { code: 'VC', name: 'Vacation', insuredType:['CANADIAN'] },
  { code: 'BT', name: 'BusinessTrip', insuredType:['CANADIAN']},
  { code: 'SA', name: 'StudyAbroad', insuredType:['CANADIAN']},
  { code: 'CV', name: 'CruiseVacation', insuredType:['CANADIAN']},
  { code: 'SB', name: 'SnowBird', insuredType:['CANADIAN']},
  { code: 'RT', name: 'RoadTrip', insuredType:['CANADIAN']},
  { code: 'GT', name: 'GolfTrip', insuredType:['CANADIAN']},
  { code: 'OT', name: 'Other', insuredType:['CANADIAN']},
]


const ApplicantInformation = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  validMessage,
  countries,
  provinces,
  insured,
  errorSection,
  errorIndex,
  alertOpen
}) => {
  const classes = useStyles()

  // search insured person modal
  const [openSearchInsured, setOpenSearchInsured] = useState(false);
  const [targetPersonIndex, setTargetPersonIndex] = useState();

  const { width } = WindowDimension();
  let isMobile = (width < 768);

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // scrollIntoView if occuring validation error
  const showValidationMsg = useCallback(() => {
    if (errorSection === 'P' && errorIndex+1 > 0 && document.getElementById("person" + errorIndex)){
      document.getElementById("person" + errorIndex).scrollIntoView();
    }
  }, [errorSection, errorIndex]);

  // useEffect
  useEffect(()=>{
    showValidationMsg()
  }, [showValidationMsg]);
  

  //
  function newInsuredPerson(insuredPersons) {
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
      deliverDateInsuranceCard: null,
      insurancePlans: [],
      selectedPlan: [],
      selectedMedQuesAnswer: [],
      optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
      optionalAddOnPlans: [],
      renewalInsurance: false,
  })

    return insuredPersons
}


  return (
    <div>
      {/* Applicant's Form */}
      <Grid container style={{ marginTop:'2vh' }}>

        <Grid item container>
          <FieldArray
            name="insuredPersons"
            render={({ form }) => (
              <div>
                {values.insuredPersons && values.insuredPersons.length > 0
                  ? values.insuredPersons.map((insuredPerson, index) => (
                      <div key={index}  >
                      {/* Applicant Title */}
                      <Grid container>
                        <Grid id= {`person${index}`} item xs={12} className={classes.applicant}>
                          {index===0 ? 
                          <span><Text tid={'Dashboard.PrimaryApplicant'}/></span>
                          : <span><Text tid={'Dashboard.Companion'}/> {`${index+1}`}</span>
                          }
                          {/* delete button */}
                          {index!==0 
                            ? 
                              <IconButton 
                                style={{ float: 'right' }} 
                                size='small' 
                                disableFocusRipple={true} 
                                disableRipple={true} 
                                onClick={(e) => {
                                    if (!e) e = window.event;
                                    e.cancelBubble = true;
                                    if (e.stopPropagation) e.stopPropagation();

                                    if (values.insuredPersons.length > 1) {
                                      setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[index]))
                                      setFieldValue('insuredNumber', values.insuredPersons.length - 1)
                                  }
                                }}
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            : null }
                        </Grid>
                        {/* this function is not open yet: 순서 변경 기능 */}
                        {/* if open, write code more for relationship  */}       
                        {/* <Grid item xs={1} className={classes.applicantArrow} >
                            {index !== 0 &&
                              <IconButton 
                                disableFocusRipple={true} 
                                disableRipple={true} 
                                onClick={()=>{
                                  let targetPerson = values.insuredPersons.splice(index,index);
                                  values.insuredPersons.splice(index-1, 0, targetPerson[0]);
                                  setFieldValue('values.insuredPersons',insuredPerson)
                                }}
                              >
                                <ImCircleUp />
                              </IconButton>
                            }
                            {index !== (values.insuredPersons.length - 1) &&
                              <IconButton 
                                disableFocusRipple={true} 
                                disableRipple={true} 
                                onClick={()=>{
                                  let targetPerson = values.insuredPersons.splice(index,index);
                                  values.insuredPersons.splice(index+1, 0, targetPerson[0]);
                                  setFieldValue('values.insuredPersons',insuredPerson)
                                }}
                              >
                                <ImCircleDown />
                              </IconButton>
                            }
                        </Grid> */}
                      </Grid>
                      

                        <Card variant="outlined" className={classes.CardBox}>
                          {index === errorIndex && alertOpen &&
                            <Grid item xs={12} >
                                <Alert severity='error' >
                                    <Text tid={'Quote.Applicants'}/> {` ${errorIndex+1} :`}                                 
                                    <Text tid={'Quote.Error.CompleteInformation'}/>
                                </Alert>
                            </Grid>
                          }

                          <CardContent>
                            <Grid container spacing={1}>
                              {/* Personal Information Row Start here */}
                              <Grid item xs={12} className={classes.dashboardBox_title}>
                                <PersonIcon style={{ marginRight:'5px', fontSize:'18px'}} />
                                <Text tid={'Dashboard.PersonalInformation'}/>
                                {/* {values.vendorID && insured.length > 0 && */}
                                {values.vendorID && 
                                  <>
                                    <IconButton 
                                      size='small' 
                                      onClick={(e) => {
                                          setTargetPersonIndex(index)
                                          setOpenSearchInsured(true)
                                      }}
                                    >
                                      <SearchIcon />
                                    </IconButton>
                                    <SearchInsuredModal
                                      open={openSearchInsured}
                                      setOpen={setOpenSearchInsured}
                                      insured={insured} 
                                      person = {values.insuredPersons[targetPersonIndex]}   
                                    />
                                  </>
                                }
                              </Grid>

                              <Grid item xs={12} sm={6} md={3} lg={3}>

                                <RegularTextFieldSmall
                                      id='person'
                                      label= {'Quote.FirstName'}
                                      name={`insuredPersons.${index}.firstName`}
                                      value={values.insuredPersons[index].firstName}
                                      onChange={(e) => {
                                          setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                      }}
                                      onBlur={handleBlur}
                                  />
                                {validMessage(
                                  `insuredPersons.${index}.firstName`
                                )}
                              </Grid>

                                <Grid item xs={12} sm={6} md={3} lg={3}>
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

                                <Grid item xs={12} sm={5} md={3} lg={3}>
                                  <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px', marginBottom:'5px' }}><Text tid={'Quote.BirthDate'}/></label> 
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
                                  {validMessage(`insuredPersons.${index}.birthDate` )}
                                </Grid>

                                {/* Gender */}
                                <Grid item xs={12} sm={5} md={2} lg={2}>
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
                                      <ToggleButton value="Male" className={classes.toggleButton} style={{ padding:'7px' }}>
                                          <Text tid={'Quote.Male'}/>
                                      </ToggleButton>
                                      <ToggleButton value="Female" className={classes.toggleButton} style={{ padding:'7px' }}>
                                          <Text tid={'Quote.Female'}/>
                                      </ToggleButton>
                                  </ToggleButtonGroup>
                                  {validMessage(`insuredPersons.${index}.gender`)}
                                </Grid>
                                
                                {/* Relationship */}
                                {index !== 0 && values.insuredGroupType !=='Group' && 
                                <Grid item xs={12} sm={8} md={5} lg={3}>
                                  <SelectMenuTextFieldSmall
                                    // label={'Relationship to Primary'}
                                    label = {currentLanguage !== 'ko'
                                                ?(`${values.insuredPersons[index].firstName} is ${values.insuredPersons[0].firstName}'s`)
                                                :(`${values.insuredPersons[index].firstName} 는 ${values.insuredPersons[0].firstName} 님의`)
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
                                  {validMessage(
                                    `insuredPersons.${index}.relationship`
                                  )}
                                </Grid>
                                } 

                              </Grid>

                              <Grid  item xs={12} container spacing={1} className={classes.RowMarginBottom}>
                                <Grid item container xs={12} className={classes.RowMarginDivider} spacing={1}>
                                    <Grid item xs={12} className={classes.dashboardBox_title}>
                                              <FlightIcon style={{ marginRight:'5px', fontSize:'18px'}} />
                                              <Text tid={'Vendor.Step1.Insurance'}/>
                                    </Grid>

                                    <Grid item container xs={12}>
                                      {/* Traveling Purpose */}
                                      <Grid item xs={12} sm={8} md={4} lg={3}>
                                        <SelectMenuTextFieldSmall
                                          label= {'Quote.TravelPurpose'}
                                          value={insuredPerson.travelType}
                                          name={`insuredPersons.${index}.travelType`}
                                          onChange={(e)=>{
                                              handleChange(e)
                                              if (e.target.value !== 'PW'){
                                                setFieldValue(`insuredPersons.${index}.graduatedDate`,null)
                                                setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`,null)
                                              }                                                 
                                          }}
                                          onBlur={handleBlur}
                                        >
                                          {travelType.map((t)=> ({code: t.code, name: t.name, includedType: t.insuredType.filter(f => f === values.insuredType).length}))
                                              .filter( i => i.includedType > 0)
                                              .map((item) => (
                                                <MenuItem key={item.code} value={item.code}>
                                                <Text tid={`Quote.${item.name}`}/>
                                                </MenuItem>
                                            ))}
                                        </SelectMenuTextFieldSmall>
                                        {validMessage( `insuredPersons.${index}.travelType`)}
                                      </Grid>

                                      {/* Graduated Date for PGWP */}
                                      {values.tripDirection === 'InBound' && 
                                          values.insuredPersons[index].travelType === 'PW' && 
                                          <Grid item xs={12} sm={4} md={4} lg={3} >
                                            {/* <label className={classes.inputLabel} style={{ paddingBottom:'6px' }}><Text tid={'Quote.'}/></label>  */}
                                            <label className={classes.inputLabel} style={{ paddingBottom:'6px' }}>Graduation Date</label> 
                                            <KeyboardDatePickerField
                                                name={`insuredPersons.${index}.graduatedDate`}
                                                value={values.insuredPersons[index].graduatedDate}
                                                style={{ width: '100%' }}
                                                maxDate={new Date()}
                                                minDate={new Date(new Date().setDate(new Date().getDate() - (365 + 1)))}
                                                onChange={(e) => {
                                                    values.insuredPersons[index].graduatedDate = e
                                                    setFieldValue(`insuredPersons.${index}.graduatedDate`, e)
                                                    setFieldValue(`insuredPersons.${index}.yearDateAfterGraduated`, CalculateTripEndDate(e, 365))                             
                                                }}
                                            />
                                            {validMessage(`insuredPersons.${index}.graduatedDate`)}
                                          </Grid>
                                      }

                                      
                                    </Grid>

                                    {index===0 
                                      ? (
                                          <>
                                          {/* If primary */}
                                            {/* Start Date */}
                                            <Grid item xs={12} sm={4} md={3}>
                                              <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripStartDate'}/></label>
                                              <br />
                                              {/* <KeyboardDatePickerField 
                                                name="tripStartDate"
                                                value={values.tripStartDate}
                                                style={{ width: !isMobile ? '100%' : '105%' }}
                                                minDate= {new Date()}
                                                onChange={(e) => {
                                                  values.tripStartDate = e
                                                  setFieldValue('tripStartDate', e)
                                                  if (values.tripType === 'MULTI'){
                                                    values.tripPeriod = '365'
                                                    values.tripEndDate = CalculateTripEndDate(values.tripStartDate, 365)
                                                  }else{
                                                    values.tripPeriod = CalculateTripDays(e,values.tripEndDate)
                                                  }
                                                  // set data all applicant
                                                  for (const i in values.insuredPersons) {
                                                    if (values.insuredPersons[i].sameDate === true){
                                                        values.insuredPersons[i].tripStartDate = e
                                                        values.insuredPersons[i].tripEndDate = values.tripEndDate
                                                        values.insuredPersons[i].tripPeriod = CalculateTripDays(e, values.insuredPersons[i].tripEndDate)
                                                        values.insuredPersons[i].age = values.insuredPersons[i].birthDate ? CalculateAgeBaseEffectiveDate(values.insuredPersons[i].birthDate, e): 0;
                                                        values.insuredPersons[i].ageDays = values.insuredPersons[i].birthDate ? CalculateAgeDays(values.insuredPersons[i].birthDate, e): 0;
                                                        values.insuredPersons[i].selectedPlan = {}
                                                        if (values.insuredPersons[i].physicalCard){
                                                          values.insuredPersons[i].deliverDateInsuranceCard = e
                                                        }
                                                    }
                                                  }
                                                }}
                                              /> */}
                                              <KeyboardDatePickerField
                                                  name="tripStartDate"
                                                  value={values.tripStartDate}
                                                  style={{ width: !isMobile ? '100%' : '105%' }}
                                                  minDate={new Date()}
                                                  onChange={(e) => {
                                                    const tripStartDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                                    values.tripStartDate = tripStartDate;
                                                    setFieldValue('tripStartDate', tripStartDate);

                                                    if (values.tripType === 'MULTI') {
                                                      values.tripPeriod = '365';
                                                      values.tripEndDate = CalculateTripEndDate(tripStartDate, 365);
                                                    } else {
                                                      values.tripPeriod = CalculateTripDays(tripStartDate, values.tripEndDate);
                                                    }

                                                    // Set data for all applicants
                                                    for (const i in values.insuredPersons) {
                                                      if (values.insuredPersons[i].sameDate === true) {
                                                        values.insuredPersons[i].tripStartDate = tripStartDate;
                                                        values.insuredPersons[i].tripEndDate = values.tripEndDate;
                                                        values.insuredPersons[i].tripPeriod = CalculateTripDays(tripStartDate, values.insuredPersons[i].tripEndDate);
                                                        values.insuredPersons[i].age = values.insuredPersons[i].birthDate ? CalculateAgeBaseEffectiveDate(values.insuredPersons[i].birthDate, tripStartDate) : 0;
                                                        values.insuredPersons[i].ageDays = values.insuredPersons[i].birthDate ? CalculateAgeDays(values.insuredPersons[i].birthDate, tripStartDate) : 0;
                                                        values.insuredPersons[i].selectedPlan = {};

                                                        if (values.insuredPersons[i].physicalCard) {
                                                          values.insuredPersons[i].deliverDateInsuranceCard = tripStartDate;
                                                        }
                                                      }
                                                    }
                                                  }}
                                              />

                                              {validMessage('tripStartDate')}
                                            </Grid>

                                            {/* Expiry Date */}
                                            <Grid item xs={12} sm={4} md={3}>
                                              <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripEndDate'}/></label>
                                              <br />
                                              {/* <KeyboardDatePickerField 
                                                name="tripEndDate"
                                                value={values.tripEndDate}
                                                style={{ width: !isMobile ? '100%' : '105%' }}
                                                disabled={values.tripType === 'MULTI' ? true : false}
                                                minDate= {values.tripStartDate}
                                                maxDate={ values.insuredPersons[0].travelType === 'PW'? values.insuredPersons[0].yearDateAfterGraduated:undefined}
                                                onChange={(e) => { 
                                                  values.tripEndDate = e
                                                  setFieldValue('tripEndDate', e) 
                                                  setFieldValue(`tripPeriod`, CalculateTripDays(values.tripStartDate, e))  
                                                  // set data all applicant
                                                  for (const i in values.insuredPersons) {
                                                    if (values.insuredPersons[i].sameDate === true){ 
                                                        values.insuredPersons[i].tripEndDate = e
                                                        values.insuredPersons[i].tripPeriod = CalculateTripDays(values.insuredPersons[i].tripStartDate, e)
                                                        values.insuredPersons[i].selectedPlan = {}
                                                    }
                                                    
                                                  }
                                                }}
                                              /> */}
                                              <KeyboardDatePickerField
                                                name="tripEndDate"
                                                value={values.tripEndDate}
                                                style={{ width: !isMobile ? '100%' : '105%' }}
                                                disabled={values.tripType === 'MULTI'}
                                                minDate={values.tripStartDate}
                                                maxDate={values.insuredPersons[0].travelType === 'PW' ? values.insuredPersons[0].yearDateAfterGraduated : undefined}
                                                onChange={(e) => {
                                                  const tripEndDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                                  values.tripEndDate = tripEndDate;
                                                  setFieldValue('tripEndDate', tripEndDate);

                                                  setFieldValue(`tripPeriod`, CalculateTripDays(values.tripStartDate, tripEndDate));

                                                  // Set data for all applicants
                                                  for (const i in values.insuredPersons) {
                                                    if (values.insuredPersons[i].sameDate === true) {
                                                      values.insuredPersons[i].tripEndDate = tripEndDate;
                                                      values.insuredPersons[i].tripPeriod = CalculateTripDays(values.insuredPersons[i].tripStartDate, tripEndDate);
                                                      values.insuredPersons[i].selectedPlan = {};
                                                    }
                                                  }
                                                }}
                                              />

                                              
                                              {/* {validMessage('tripEndDate')} */}
                                              {validMessage(`insuredPersons.${0}.tripEndDate`)}
                                              {values.insuredPersons[0].travelType === 'PW' && values.insuredPersons[0].graduatedDate && 
                                                <label className={classes.inputLabel_manualForm} style={{fontStyle: 'italic'}}>
                                                  * {dateFormat(values.insuredPersons[0].yearDateAfterGraduated)} 까지 가입 가능
                                                </label>
                                              }
                                            </Grid>

                                            {/* Coverage Days */}
                                            <Grid item xs={12} sm={4} md={3}>
                                              <RegularTextFieldSmall
                                                name="tripPeriod"
                                                type="number"
                                                disabled={values.tripType === 'MULTI' ? true : values.tripStartDate ? false : true}
                                                style={{ width: !isMobile ? '100%' : '105%' }}
                                                value={values.tripPeriod ? values.tripPeriod : values.tripStartDate && values.tripEndDate ? CalculateTripDays(values.tripStartDate, values.tripEndDate) : ''}
                                                label= {'Quote.TripCoverageDays'}
                                                onChange={(e) => {
                                                  handleChange(e)
                                                  setFieldValue(`tripEndDate`, 
                                                    CalculateTripEndDate(values.tripStartDate, e.currentTarget.value )
                                                    )
                                                  // set data all applicant
                                                  for (const i in values.insuredPersons) { 
                                                    if (values.insuredPersons[i].sameDate === true){
                                                      values.insuredPersons[i].tripEndDate = CalculateTripEndDate(values.tripStartDate, e.currentTarget.value)
                                                      values.insuredPersons[i].tripPeriod = e.currentTarget.value
                                                      values.insuredPersons[i].selectedPlan = {}
                                                    }
                                                  }
                                                }}
                                                onBlur={handleBlur}
                                                InputProps={{
                                                  endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                                }}
                                                />
                                                {values.tripPeriod?validMessage(`insuredPersons.0.tripPeriod`):validMessage(`tripPeriod`)}
                                            </Grid>
                                            
                                            {/* Arrival Date */}
                                            <Grid item xs={12} sm={4} md={3}>
                                              <label className={classes.inputLabel_manualForm}>
                                                <Text tid={'Quote.TripArrivalDate'}/>
                                                <TooltipInfo info={<Text tid={'Vendor.Step1.arriveDateTooltip'}/>} placement="right-end" color="primary"></TooltipInfo>
                                              </label>
                                              <br />
                                              <KeyboardDatePickerField 
                                                name="tripArrivalDate"
                                                value={values.tripArrivalDate}
                                                style={{ width: !isMobile ? '100%' : '105%' }}
                                                // minDate= {new Date()}
                                                onChange={(e) => {
                                                  values.tripArrivalDate = e
                                                  setFieldValue('tripArrivalDate', e)
                                                  // set inDestination is true if tripArrivalDate before today 
                                                  values.inDestination = e < new Date(new Date().setDate(new Date().getDate()-1))
                                                  // set data all applicant
                                                  for (const i in values.insuredPersons) { 
                                                      values.insuredPersons[i].arrivalDate = e
                                                  }
                                                }}
                                              />
                                              {validMessage('tripArrivalDate')}
                                            </Grid>

                                            {/*  */}
                                            {values.insuredType === 'CANADIAN' && (
                                              <>
                                              {/* need to input Trip Type when applicationType = CANADIAN */}
                                                {/* Trip Type */}
                                                <Grid item xs={12} sm={4} md={3}>
                                                    <SelectTextFieldSmall
                                                        style={{ width: !isMobile ? '100%' : '105%' }}
                                                        type="number"
                                                        name={`tripType`}
                                                        value={values.tripType}
                                                        disabled = {values.tripStartDate ? false : true}
                                                        label={"TravelApplication.TravelType"}
                                                        onChange={(e) => { 
                                                          handleChange(e)
                                                          // set tripPeriod as 365 when Multi
                                                          if (e.currentTarget.value === 'MULTI'){
                                                            // console.log('tripType',values.tripType)
                                                              setFieldValue(`tripPeriod`, '365') 
                                                              setFieldValue(`tripEndDate`,
                                                                  CalculateTripEndDate(values.tripStartDate, 365)
                                                              )   
                                                          } 
                                                          else 
                                                          //set tripPeriod as 365 when !Multi
                                                          { 
                                                              setFieldValue(`tripEndDate`, null)
                                                              setFieldValue(`tripPeriod`, '')
                                                              setFieldValue(`multiTripDays`, '')
                                                          }
                                                          // set data all applicant
                                                          for (const i in values.insuredPersons) { 
                                                              values.insuredPersons[i].tripType = e.currentTarget.value
                                                              values.insuredPersons[i].selectedPlan = []
                                                                if (e.currentTarget.value === 'MULTI'){
                                                                    values.insuredPersons[i].tripPeriod = 365
                                                                    values.insuredPersons[i].tripEndDate = CalculateTripEndDate(values.tripStartDate, 365)
                                                                } else{
                                                                    values.insuredPersons[i].tripEndDate = null
                                                                    values.insuredPersons[i].tripPeriod = ''
                                                                    values.insuredPersons[i].multiTripDays = ''
                                                                }
                                                          }
                                                        }}
                                                        onBlur={handleBlur}
                                                        >
                                                        <option value={0} hidden>
                                                            Select
                                                        </option>
                                                        <option value="SINGLE">Single</option>
                                                        <option value="MULTI">Multi</option>
                                                    </SelectTextFieldSmall>
                                                    {validMessage(`tripType`)}                    
                                                </Grid>
                                                {/* Multi Trip days*/}
                                                {values.tripType === 'MULTI' && 
                                                  <>
                                                    <Grid item xs={12} sm={4} md={3}>
                                                        <RegularTextFieldSmall
                                                          // label="Multi Trip days"
                                                          label={"TravelApplication.MultiDays"}
                                                          name={`multiTripDays`}
                                                          type="number"
                                                          value={values.multiTripDays ? values.multiTripDays : ''}
                                                          onChange={(e) => {
                                                                setFieldValue(`multiTripDays`, e.currentTarget.value)
                                                                for (const i in values.insuredPersons) { 
                                                                    setFieldValue(`insuredPersons.${i}.multiTripDays`, e.currentTarget.value)
                                                                }
                                                            }}
                                                          onBlur={handleBlur}
                                                          InputProps={{
                                                              endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                                          }}
                                                      />
                                                      {validMessage(`multiTripDays`)}                 
                                                    </Grid>
                                                  </>
                                                } 
                                                {/* origin province */}
                                                <Grid item xs={12} sm={4} md={3}>
                                                  {/* {values.originCountry} */}
                                                  {/* {values.originProvince} */}
                                                  <Autocomplete
                                                      name={`originProvince`}
                                                      options={provinces.filter(i => i.country_code === 'CA')}
                                                      value={values.originProvince && provinces.length>0 ? provinces.find(c => c.country_code === values.originCountry && c.province_code === values.originProvince) : null}
                                                      getOptionLabel={(option) => option.province_name}
                                                      size="small"
                                                      renderInput={(params) =>
                                                          <RegularTextFieldSmall {...params}
                                                            label={"TravelApplication.OriginProvince"} />
                                                      }
                                                      onChange={(e, selectedVal) => {
                                                          values.originProvince = selectedVal ? selectedVal.province_code : ''
                                                          values.originProvinceName = selectedVal ? selectedVal.province_name : ''
                                                          setFieldValue('originCountry', 'CA')
                                                          setFieldValue('originCountryName', 'Canada')
                                                          setFieldValue('originProvince', selectedVal ? selectedVal.province_code : '')
                                                          if(values.maillingInCanada === false){
                                                            values.maillingInCanada = true;
                                                            values.mailStreetName = ''
                                                            values.mailUnitApartmentNo = ''
                                                            values.mailCity = ''
                                                            values.mailProvince = ''
                                                            values.mailPostalCode = ''   
                                                          }
                                                          
                                                      }}
                                                  />
                                                  {validMessage(`originProvince`)}
                                                </Grid>
                                                {/* destCountry */}
                                                <Grid item xs={12} sm={4} md={3}>
                                                  <Autocomplete               
                                                      options={countries}
                                                      value = {values.destCountry && countries.length>0 ?countries.find(c=>c.country_code===values.destCountry):null}
                                                      getOptionLabel={(option) => option.name}
                                                      getOptionDisabled={(option) => option.country_code === 'CA'}
                                                      size="small"
                                                      renderInput={(params) => 
                                                          <RegularTextFieldSmall {...params} 
                                                            label={"TravelApplication.Destination"}
                                                            name={`destCountry`} 
                                                            onChange ={handleChange}
                                                            onBlur={handleBlur}/>
                                                      }
                                                      onChange={(e, selectedVal)=>{
                                                          values.destCountry = selectedVal? selectedVal.country_code: ''
                                                          setFieldValue(`destCountry`, selectedVal?selectedVal.country_code:'')
                                                          // set data all applicant
                                                          for (const i in values.insuredPersons) { 
                                                            setFieldValue(`insuredPersons.${i}.destCountry`, selectedVal?selectedVal.country_code:'')
                                                            setFieldValue(`insuredPersons.${i}.selectedPlan`,[])
                                                          }
                                                        }}
                                                      style={{ width: !isMobile ? '100%' : '102%' }}
                                                  />
                                                  {validMessage(`destCountry`)}
                                                </Grid>
                                        
                                              </>
                                            )}

                                            {/* destProvince */}
                                            {(values.insuredType !== 'CANADIAN' || values.destCountry === 'US')
                                                ? 
                                                  <Grid item xs={12} sm={4} md={3}>
                                                      <Autocomplete
                                                          name="destProvince"
                                                          options={provinces.filter(i => i.country_code === values.destCountry)}
                                                          value={values.destProvince && provinces.length>0 ? provinces.find(c => c.country_code === values.destCountry && c.province_code === values.destProvince) : null}
                                                          // getOptionLabel={(option) => values.destCountry === 'CA' ? option.province_code : option.province_name}
                                                          getOptionLabel={(option) => option.province_name}
                                                          size="small"
                                                          renderInput={(params) =>
                                                              <RegularTextFieldSmall {...params} 
                                                                  label={values.destCountry === 'CA' 
                                                                    ? "TravelApplication.DestinationProvince"  
                                                                    : "TravelApplication.DestinationState" } />
                                                          }
                                                          onChange={(e, selectedVal) => {
                                                              values.destProvince = selectedVal ? selectedVal.province_code : ''
                                                              values.destProvinceName = selectedVal ? selectedVal.province_name : ''
                                                              setFieldValue('destProvince', selectedVal ? selectedVal.province_code : '');
                                                              for (const i in values.insuredPersons) { 
                                                                values.insuredPersons[i].destProvince = selectedVal?selectedVal.province_code:''
                                                              }
                                                              //reset mailing address if selected as no address in canada
                                                              if(values.maillingInCanada === false){
                                                                values.maillingInCanada = true;
                                                                values.mailStreetName = ''
                                                                values.mailUnitApartmentNo = ''
                                                                values.mailCity = ''
                                                                values.mailProvince = ''
                                                                values.mailPostalCode = ''   
                                                              }
                                                          }}
                                                      />
                                                      {validMessage('destProvince')}
                                                  </Grid>
                                                :
                                                  <Grid item xs={12} sm={4} md={3}></Grid>
                                              }
                                              {values.insuredType !== 'CANADIAN' &&
                                                <Grid item xs={12} sm={8} md={3} lg={3}>
                                                  <Autocomplete
                                                    name="originCountry"
                                                    options={countries}
                                                    value={values.originCountry ? countries.find(c => c.country_code === values.originCountry) : null}
                                                    getOptionLabel={(option) => option.name}
                                                    // getOptionDisabled={(option) => option.country_code === values.destCountry}
                                                    size="small"
                                                    renderInput={(params) =>
                                                        <RegularTextFieldSmall {...params}
                                                          // label={'Home Country of residence'}
                                                          label={values.tripArrivalDate && values.tripArrivalDate < new Date()?'Quote.HomeCountryOfResidenceBefore':'Quote.HomeCountryOfResidence'}
                                                        />
                                                    }
                                                    onChange={(e, selectedVal) => {
                                                        values.originCountry = selectedVal ? selectedVal.country_code : ''
                                                        values.originCountryName = selectedVal ? selectedVal.name : ''
                                                        setFieldValue('originCountry', selectedVal ? selectedVal.country_code : '')
                                                        setFieldValue('originProvince', '')
                                                        setFieldValue('originProvinceName', '')
                                                    }}
                                                  />
                                                  {validMessage('originCountry') }
                                                </Grid>
                                              }
                                          </>
                                        )
                                      : (
                                          <>
                                            {/* If not primary */}
                                            {/* not able to change trip date if CANADIAN Plan  */}
                                            {values.insuredType !== 'CANADIAN' && (
                                              <>
                                                {/* Insurance Period as same as Primary? */} 
                                                {/* <Grid item xs={12} sm={8} md={6} lg={3} style={{ alignSelf:'center' }}>
                                                  <span className={classes.inputLabel} style={{ marginBottom: '9px'}}>
                                                      {currentLanguage !== 'ko'
                                                          ?(`Is travel date same as ${values.insuredPersons[0].firstName}'s?`)
                                                          :(`여행 기간이 ${values.insuredPersons[0].firstName} 와 동일 한가요?`)
                                                      }
                                                  </span>
                                                </Grid> */}
                                                <Grid item xs={12} sm={4} md={6} lg={3}>
                                                  <span className={classes.inputLabel} style={{ marginBottom: '8px', display:'inline-block'}}>
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
                                                          setFieldValue(`insuredPersons.${index}.tripStartDate`, values.tripStartDate)
                                                          setFieldValue(`insuredPersons.${index}.tripEndDate`, values.tripEndDate)
                                                          setFieldValue(`insuredPersons.${index}.tripPeriod`, values.tripPeriod)
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
                                              </>
                                            )}
                                          
                                          </>
                                        )
                                    }
                                </Grid>

                                { index !== 0 && (values.insuredPersons[index].sameDate === true ||  values.insuredPersons[index].sameDate === false)  
                                  ? (
                                      <Grid item xs={12} container spacing={1} >

                                        {/* Start Date */}
                                        <Grid item xs={12} sm={4} md={3} lg={3}>
                                          <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripStartDate'}/></label>
                                          <br/>
                                          <KeyboardDatePickerField
                                              name={`insuredPersons.${index}.tripStartDate`}
                                              value={values.insuredPersons[index].tripStartDate}
                                              style={{ width: !isMobile ? '100%' : '105%' }}
                                              disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                              minDate={new Date()}
                                              // fullWidth
                                              onChange={(e) => {
                                                  setFieldValue(`insuredPersons.${index}.tripStartDate`, e)
                                                  setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(e, values.insuredPersons[index].tripEndDate))
                                                  if (values.insuredPersons[index].physicalCard){
                                                      setFieldValue(`insuredPersons.${index}.deliverDateInsuranceCard`, e)
                                                  }
                                              }}
                                          />
                                          {validMessage(`insuredPersons.${index}.tripStartDate`)}
                                        </Grid>

                                        {/* Expiry Date */}
                                        <Grid item xs={12} sm={4} md={3} lg={3}>
                                          <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripEndDate'}/></label>
                                          <br />
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
                                          {values.insuredPersons[index].travelType === 'PW' && values.insuredPersons[index].graduatedDate && 
                                            <label className={classes.inputLabel_manualForm} style={{fontStyle: 'italic'}}>
                                              * {dateFormat(values.insuredPersons[index].yearDateAfterGraduated)} 까지 가입 가능
                                            </label>
                                          }
                                        </Grid>

                                        {/* Coverage Days */}
                                        <Grid item xs={12} sm={4} md={2} lg={3}>
                                          <RegularTextFieldSmall
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

                                        {/* Arrival Date */}
                                        <Grid item xs={12} sm={4} md={3} lg={3}>
                                          <label className={classes.inputLabel_manualForm}>
                                            <Text tid={'Quote.TripArrivalDate'}/>
                                            <TooltipInfo info={<Text tid={'Vendor.Step1.arriveDateTooltip'}/>} placement="right-end" color="primary"></TooltipInfo>
                                          </label>
                                          <br />
                                          <KeyboardDatePickerField 
                                            name="tripArrivalDate"
                                            value={values.tripArrivalDate}
                                            style={{ width: !isMobile ? '100%' : '105%' }}
                                            disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                            // minDate= {new Date()}
                                            onChange={(e) => {
                                              values.tripArrivalDate = e
                                              setFieldValue('tripArrivalDate', e)
                                              // set inDestination is true if tripArrivalDate before today 
                                              values.inDestination = e < new Date(new Date().setDate(new Date().getDate()-1))
                                              // set data all applicant
                                              for (const i in values.insuredPersons) { 
                                                  values.insuredPersons[i].arrivalDate = e
                                              }
                                            }}
                                          />
                                          {validMessage('tripArrivalDate')}
                                        </Grid>                             
                                      </Grid>
                                    ) 
                                  : null
                                }

                                

                              <Grid container spacing={1} className={classes.RowMarginBottom}>
                                {/* {values.originCounstry} */}
                                {/* Country of Origin */}
                                {/* {values.insuredType !== 'CANADIAN' &&
                                  <Grid item xs={12} sm={8} md={3} lg={3}>
                                    <Autocomplete
                                      name="originCountry"
                                      options={countries}
                                      value={values.originCountry ? countries.find(c => c.country_code === values.originCountry) : null}
                                      getOptionLabel={(option) => option.name}
                                      getOptionDisabled={(option) => option.country_code === values.destCountry}
                                      size="small"
                                      renderInput={(params) =>
                                          <RegularTextFieldSmall {...params}
                                            // label={'Home Country of residence'}
                                            label={values.tripArrivalDate && values.tripArrivalDate < new Date()?'Quote.HomeCountryOfResidenceBefore':'Quote.HomeCountryOfResidence'}
                                          />
                                      }
                                      onChange={(e, selectedVal) => {
                                          values.originCountry = selectedVal ? selectedVal.country_code : ''
                                          values.originCountryName = selectedVal ? selectedVal.name : ''
                                          setFieldValue('originCountry', selectedVal ? selectedVal.country_code : '')
                                          setFieldValue('originProvince', '')
                                          setFieldValue('originProvinceName', '')
                                      }}
                                    />
                                    {validMessage('originCountry') }
                                  </Grid>
                                } */}

                                    {/* Beneficiary Name */}
                                    <Grid item xs={12} sm={6} md={3} lg={3}>
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

                                  {/* Beneficiary Relationship */}
                                  <Grid item xs={12} sm={4} md={3} lg={3}>                               
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
                                      </SelectMenuTextFieldSmall>
                                      {validMessage(`insuredPersons.${index}.beneficiaryRelationship`)}
                                  </Grid>


                              {/* Physical Card */}
                              {values.insuredPersons[index].tripStartDate ?
                                <Grid item container xs={12} className={classes.RowMarginDivider}>
                                      <Grid item xs={12} className={classes.dashboardBox_title}>
                                        <LocalShippingIcon style={{ marginRight:'5px', fontSize:'18px'}} />
                                        <Text tid={'Quote.WalletCard'} />
                                      </Grid>

                                        <Grid item xs={12} md={6} lg={3} style={{paddingRight:'14px', alignSelf: 'end'}}>
                                            <label style={{display:'block', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>
                                              <Text tid={'Quote.PhysicalCard'}/>
                                              <TooltipInfo info={<Text tid={'TravelApplication.PhysicalCardFee.Free'}/>} placement="right-end" color="primary"></TooltipInfo>
                                            </label>
                                            <ToggleButtonGroup
                                                name={`insuredPersons.${index}.physicalCard`}
                                                value={values.insuredPersons[index].physicalCard}
                                                exclusive
                                                style={{ width:'100%' }}
                                                onChange={(e) => {
                                                    const val = e.currentTarget.value === 'true' ? true : false
                                                    setFieldValue(`insuredPersons.${index}.physicalCard`, val)
                                                    if (val){
                                                      setFieldValue(`insuredPersons.${index}.deliverDateInsuranceCard`, values.insuredPersons[index].tripStartDate)
                                                    }else{
                                                      setFieldValue(`insuredPersons.${index}.deliverDateInsuranceCard`, null)
                                                    }
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
                                        
                                        {values.insuredPersons[index].physicalCard === true ?
                                          <Grid item container xs={12} md={3}>
                                              {/* Delivery Date */}
                                              <Grid item xs={12}>
                                                <label className={classes.inputLabel}>
                                                  <Text tid={'Vendor.Step1.DeliveryDate'} />
                                                </label>
                                                <KeyboardDatePickerField 
                                                  name={`insuredPersons.${index}.deliverDateInsuranceCard`}
                                                  value={values.insuredPersons[index].deliverDateInsuranceCard}
                                                  minDate={values.insuredPersons[index].tripStartDate}
                                                  // defaultValue={values.insuredPersons[index].tripStartDate}
                                                  onChange={(e) => {
                                                    setFieldValue(`insuredPersons.${index}.deliverDateInsuranceCard`, e)
                                                    for (const i in values.insuredPersons) {
                                                      if (values.insuredPersons[i].physicalCard === true){
                                                          values.insuredPersons[i].deliverDateInsuranceCard = e
                                                      }
                                                    }
                                                  }}
                                                />
                                              </Grid>
                                              {validMessage(`insuredPersons.${index}.deliverDateInsuranceCard`)}
                                          </Grid>
                                        :null}
                                        
                                </Grid>
                              :null}

                              </Grid>
                              </Grid>

                          </CardContent>
                        </Card>
 
                      </div>
                    ))
                  : null}
              </div>
            )}
          ></FieldArray>
        </Grid>
        
          <Grid item xs={12} style={{margin:'2vh 0'}}>
              <Button color="secondary" size="md" onClick={() => { 
                setFieldValue('insuredPersons', newInsuredPerson(values.insuredPersons)); 
                setFieldValue('insuredNumber',values.insuredPersons.length )
                }}>
                  <AddCircleOutlineIcon /> Add Companion
              </Button>
          </Grid>
      
      </Grid>

    </div>
  )
}

export default ApplicantInformation
