import React, { useState, useContext } from 'react';
// import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import { Grid, Typography, Box, 
    FormControlLabel, FormControl, RadioGroup, Radio, MenuItem
 } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectMenuTextField } from '../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
// controllers
import { CalculateAge, CalculateTripDays, CalculateTripEndDate, getUTCDate } from '../../../controllers/CalculateValue'
import { dateFormat } from '../../../controllers/dataFormat'
import OptimizedPlan from '../../../controllers/TravelQuote/Optimizedplan'
import AddOnPlan from '../../../controllers/TravelQuote/AddOnPlan'
// style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

// travel Type SS,SC means eligilbeStuent field is true
const travelType = [
    { code: 'SS', name: 'Study', boundType:['InBound'], inSort: 0, outSort: 0 },
    { code: 'SF', name: 'StudentsFamily', boundType:['InBound'], inSort: 0, outSort: 0 } ,
    { code: 'WW', name: 'Working', boundType:['InBound'], inSort: 0, outSort: 0 },
    { code: 'TL', name: 'TravelingLeisure', boundType:['InBound'], inSort: 0, outSort: 0 },
    { code: 'SV', name: 'SuperVisa', boundType:['InBound'], inSort: 0, outSort: 0 },
    { code: 'PW', name: 'PGWP', boundType:['InBound'], inSort: 0, outSort: 0},
    { code: 'RH', name: 'ReturningHome', boundType:['InBound'] , inSort: 0, outSort: 0},
    { code: 'VC', name: 'Vacation', boundType:['OutBound'] , inSort: 0, outSort: 1},
    { code: 'BT', name: 'BusinessTrip', boundType:['OutBound'] , inSort: 0, outSort: 2},
    { code: 'SA', name: 'StudyAbroad', boundType:['OutBound'] , inSort: 0, outSort: 3},
    { code: 'CV', name: 'CruiseVacation', boundType:['OutBound'] , inSort: 0, outSort: 4},
    { code: 'SB', name: 'SnowBird', boundType:['OutBound'] , inSort: 0, outSort: 5},
    { code: 'RT', name: 'RoadTrip', boundType:['OutBound'] , inSort: 0, outSort: 6},
    { code: 'GT', name: 'GolfTrip', boundType:['OutBound'] , inSort: 0, outSort: 7},
    { code: 'OT', name: 'Other', boundType:['OutBound'] , inSort: 0, outSort: 8},
  ]


// Validation
const validationSchema = Yup.object({
    insuredPersons: Yup.array().when("tripDirection", 
    { is: (value) => 
            value === 'InBound',
            then: Yup.array().of(
                    Yup.object().shape({
                        travelType: Yup.string().when("relationship", 
                        { is: (value) => 
                                value === 'Primary',
                                then: Validation.validRequiredField()
                        }),
                        graduatedDate: Yup.date().nullable().when("relationship",
                        { is: (value) => 
                                value === 'Primary',
                                then: Yup.date().nullable().when("travelType",
                                        { is: (value) => 
                                                value === 'PW',
                                                then: Validation.validRequiredDateField().nullable()
                                                        .max(new Date(new Date().setDate(new Date().getDate() )), 'GraduatedDateShouldBeLessThanToday')
                                                        .min(new Date(new Date().setDate(new Date().getDate() - 365)), 'GraduatedDateShouldBeWinthin1yearOfGraduation'),
                                        }),
                        }),
                        tripStartDate: Yup.date().nullable().when("relationship",
                        { is: (value) => 
                                value === 'Primary',
                                then: Validation.validRequiredDateField().nullable()
                                .min(new Date(new Date().setDate(new Date().getDate() - 1)), 'Start date must be grater than today')
                        }),
                        tripEndDate: Yup.date().nullable().when("relationship",
                        { is: (value) => 
                                value === 'Primary',
                                then: Validation.validRequiredDateField().nullable()
                                .min(Yup.ref("tripStartDate"), "Expiry date must be grater than effective date")
                        }),
                        tripPeriod: Yup.number().when("relationship", 
                        { is: (value) => 
                                value === 'Primary',
                                then: Validation.validRequiredNumberMin1Field().max(365, 'Maximun days must be 365 !')
                        }),
                    })),
            otherwise: Yup.array().of(
                Yup.object().shape({
                    travelType: Yup.string().when("relationship", 
                        { is: (value) => 
                                value === 'Primary',
                                then: Validation.validRequiredField()
                        }),
                    tripType: Yup.string().when("relationship", 
                    { is: (value) => 
                            value === 'Primary',
                            then: Validation.validRequiredField()
                    }),
                    // travelType : Validation.validRequiredField(),    
                    // tripType: Validation.validRequiredField(),                           
                }))
    }),
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

const TripPurposeForm = (props) => {
    const { formData, insurances } = props;

  const classes = useStyles();
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  const [direction, setDirection] = useState('back');

  let height = '0px'

// For Timezone as UTC
const minDate = getUTCDate();

  return (
    <>
    <StepHeader height={height} activeStep={1} data={formData} />

    <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={values => {
            // when travel purpose is Super Visa, does not have family member.
            if(values.insuredPersons[0].travelType === 'SV' && values.insuredPersons.length > 0){
                let insured = values.insuredPersons.length
                // delete if has insured family member 
                for (var ii = 1; ii < insured; ii++) {
                    values.insuredPersons.pop()
                }
                values.insuredNumber = 0
            }
            //copy if samedate with primary
            if (values.insuredPersons.length > 0){
                for (const i in values.insuredPersons) { 
                    if (i > 0 && values.insuredPersons[i].sameDate === true )
                    {
                        values.insuredPersons[i].tripType =  values.insuredPersons[0].tripType
                        values.insuredPersons[i].tripDepartureDate =  values.insuredPersons[0].tripDepartureDate
                        values.insuredPersons[i].tripArrivalDate =  values.insuredPersons[0].tripArrivalDate
                        values.insuredPersons[i].tripDays =  values.insuredPersons[0].tripOtherCoverageDays
                        values.insuredPersons[i].tripStartDate =  values.insuredPersons[0].tripStartDate
                        values.insuredPersons[i].tripEndDate =  values.insuredPersons[0].tripEndDate
                        values.insuredPersons[i].tripPeriod =  values.insuredPersons[0].tripPeriod
                        values.insuredPersons[i].multiTripDays =  values.insuredPersons[0].multiTripDays
                    }
                }
            }
            // if selected 'Applying Super Visa', it should be skipped companion page
            props.updateFormData(values);
            if (values.insuredPersons[0].travelType === 'SV'){
            OptimizedPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type === 'MED') })
            AddOnPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type !== 'MED') })
            }
            direction === 'back' 
                ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                : props.history.push(pathDirection(props.location.pathname, values).nextStep);
        }}
    >
    {({ values, handleChange, handleBlur, setFieldValue, errors }) => (

        <Form className={classes.formWrapper}>
            {/* {console.log(errors)} */}
            <Grid container justify="center">
            <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom className={classes.title_question}>
                        <Text tid={'Quote.TellUsAboutYourTrip'}/>
                    </Typography>
            </Grid>

            <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} justify="center">
                {values.tripDirection === 'InBound' && values.insuredPersons[0].birthDate && CalculateAge(values.insuredPersons[0].birthDate) < 3 && (
                    <Grid item xs={12}>
                        <Alert severity="warning"><Text tid={'Quote.Trip.Info.ApplicantUnderAge3'}/></Alert>
                    </Grid>
                )}
            </Grid>
            
            {values.tripDirection === 'InBound' && (
            <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} justify="center">
                <Grid item xs={12} style={{ marginBottom:'5vh' }}>
                    <Alert severity="success">
                        <AlertTitle><Text tid={'Quote.TravelPurpose'}/></AlertTitle>
                        <ul>
                            <li><Text tid={'Quote.TravelPurpose.Info.Study'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.StudentFamily'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.Working'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.Travel'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.SuperVisa'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.PGWP'}/></li>
                            <li><Text tid={'Quote.TravelPurpose.Info.ReturningHome'}/></li>
                        </ul>
                    </Alert>
                </Grid>
            </Grid>
            )}

            <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1} >
                <Grid item xs={12} sm={8} md={4} lg={4}>
                    <label style={{fontWeight:'300', paddingLeft:'6px', paddingTop:'12px', fontSize:'15px'}}>
                        {values.insuredPersons[0].firstName} <Text tid={'Quote.PossessiveCase'}/>
                    </label>
                    <SelectMenuTextField
                        label={'Quote.TravelPurpose'}
                        value={values.insuredPersons[0].travelType}
                        name={`insuredPersons.${0}.travelType`}
                        onChange={(e)=>{
                            // values.insuredPersons[0].travelType = e.target.value
                            handleChange(e)
                            setFieldValue(`insuredPersons.${0}.graduatedDate`, null)  
                            setFieldValue(`insuredPersons.${0}.yearDateAfterGraduated`, null)  
                            if(e.target.value === 'SV'){
                                // values.insuredPersons[0].tripPeriod = 365
                                setFieldValue(`insuredPersons.${0}.tripStartDate`, null)  
                                setFieldValue(`insuredPersons.${0}.tripEndDate`, null)  
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, 0)  
                            }
                        }}
                        onBlur={handleBlur}
                    >
                        {/* <MenuItem value={""}><Text tid={'Quote.SelectTravelPurpose'}/></MenuItem> */}
                        {travelType.map((t)=> ({code: t.code, name: t.name, inSort: t.inSort, outSort: t.outSort, includedType: t.boundType.filter(f => f === values.tripDirection).length}))
                            .filter( i => i.includedType > 0)
                            .sort((a,b)=> values.tripDirection === 'InBound'? (a.inSort -  b.inSort): (a.outSort - b.outSort))
                            .map((item) => (
                                            <MenuItem key={item.code} value={item.code}>
                                            <Text tid={`Quote.${item.name}`}/>
                                            </MenuItem>
                        
                        ))}
                    </SelectMenuTextField>
                    {validMessage(`insuredPersons.${0}.travelType`)}
                </Grid>
                
                <Grid item xs={12} sm={4} md={4} lg={4} >
                    {values.tripDirection === 'InBound' && 
                        values.insuredPersons[0].travelType === 'PW' && 
                        <>
                        <label className={classes.inputLabel} style={{ paddingBottom:'6px' }}><Text tid={'Quote.WhenDidYouGraduate'}/></label> 
                        <KeyboardDatePickerField
                            name={`insuredPersons.${0}.graduatedDate`}
                            value={values.insuredPersons[0].graduatedDate}
                            style={{ width: '100%' }}
                            maxDate={new Date()}
                            minDate={new Date(new Date().setDate(new Date().getDate() - (365 - 1)))}
                            onChange={(e) => {
                                values.insuredPersons[0].graduatedDate = e
                                setFieldValue(`insuredPersons.${0}.graduatedDate`, e)                                
                                setFieldValue(`insuredPersons.${0}.yearDateAfterGraduated`, CalculateTripEndDate(e, 365))                             
                            }}
                        />
                        {validMessage(`insuredPersons.${0}.graduatedDate`)}
                    </> 
                    }
            
                </Grid>

            </Grid>
            </Grid>


            {values.tripDirection === 'OutBound' && (
                <Grid container justify="center">
                    <Grid item container justify="center">
                        <Typography variant="h5" gutterBottom className={classes.title_question}>
                        <Text tid={'Quote.YouWantCoverageFor'}/>
                        </Typography>
                    </Grid>

                    {/* <Grid item xs={12} > */}
                        <Grid item container spacing={2} xs={12} sm={12} md={12} lg={8} xl={7}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Button
                                    color={values.insuredPersons[0].tripType === 'SINGLE' ? 'primary' : "secondary"}
                                    className={classes.button}
                                    style={{padding:'3vh', width:'100%', margin:'0', height:'25vh'}}
                                    onClick={() => {
                                        setFieldValue(`insuredPersons.${0}.tripDepartureDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripArrivalDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripDays`, 0)
                                        setFieldValue(`insuredPersons.${0}.tripOtherCoverageDays`, 0)
                                        setFieldValue(`insuredPersons.${0}.tripStartDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, 0)
                                        setFieldValue(`insuredPersons.${0}.multiTripDays`, 0)
                                        setFieldValue(`insuredPersons.${0}.tripType`, 'SINGLE')
                                    }}
                                    fullWidth
                                >
                                    <div>
                                        Single trip
                                        {/* Single trip */}
                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:values.insuredPersons[0].tripType === 'SINGLE' ?'#eee':'#666'}}>
                                            <Text tid={'Quote.SingleTrip.Info'}/>
                                        </Typography>
                                    </div>
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Button
                                    color={values.insuredPersons[0].tripType === 'MULTI' ? 'primary' : "secondary"}
                                    className={classes.button}
                                    style={{padding:'3vh', width:'100%', margin:'0', height:'25vh'}}
                                    onClick={() => {
                                        setFieldValue(`insuredPersons.${0}.tripDepartureDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripArrivalDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripDays`,0)
                                        setFieldValue(`insuredPersons.${0}.tripOtherCoverageDays`, 0)
                                        setFieldValue(`insuredPersons.${0}.tripStartDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, null)
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, 0)
                                        setFieldValue(`insuredPersons.${0}.multiTripDays`, 0)
                                        setFieldValue(`insuredPersons.${0}.tripType`, 'MULTI')
                                        for (const i in values.insuredPersons) { 
                                            if (i > 0 && values.insuredPersons[i].sameDate === true )
                                            {
                                                values.insuredPersons[i].tripType =  values.insuredPersons[0].tripType
                                            }
                                        }
                                    }}
                                    fullWidth
                                >
                                    <div>
                                        Multi trip
                                        {/* Multi trip */}
                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:values.insuredPersons[0].tripType === 'MULTI' ?'#eee':'#666'}}>
                                            <Text tid={'Quote.MultiTrip.Info'}/>
                                        </Typography>
                                    </div>
                                </Button>
                            </Grid>

                            {values.inDestination === false && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        color={values.insuredPersons[0].tripType === 'TOPUP' ? 'primary' : "secondary"}
                                        className={classes.button}
                                        style={{padding:'3vh', width:'100%', margin:'0', height:'25vh'}}
                                        onClick={() => {
                                            setFieldValue(`insuredPersons.${0}.tripDepartureDate`, null)
                                            setFieldValue(`insuredPersons.${0}.tripArrivalDate`, null)
                                            setFieldValue(`insuredPersons.${0}.tripDays`, '')
                                            setFieldValue(`insuredPersons.${0}.tripOtherCoverageDays`, '')
                                            setFieldValue(`insuredPersons.${0}.tripStartDate`, null)
                                            setFieldValue(`insuredPersons.${0}.tripEndDate`, null)
                                            setFieldValue(`insuredPersons.${0}.tripPeriod`, 0)
                                            setFieldValue(`insuredPersons.${0}.multiTripDays`, 0)
                                            setFieldValue(`insuredPersons.${0}.tripType`, 'TOPUP')
                                        }}
                                        fullWidth
                                    >
                                        <div>
                                        Top Up
                                        {/* Top Up */}
                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color:values.insuredPersons[0].tripType === 'TOPUP' ?'#eee':'#666'}}>
                                            <Text tid={'Quote.TopUp.Info'}/>
                                        </Typography>
                                    </div>
                                    </Button>
                                </Grid>
                              )}
                            {validMessage(`insuredPersons.${0}.tripType`)}
                        </Grid>
            
                </Grid>
            )}

            {values.tripDirection === 'InBound' && (
                <>
                <Grid container spacing={1} justify="center">
                  <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1}>
                    
                    <Grid item container xs={12} sm={4} md={4} lg={4} className={classes.textFieldWrapper}>
                        <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                        {/* <KeyboardDatePickerField
                            name={`insuredPersons.${0}.tripStartDate`}
                            value={values.insuredPersons[0].tripStartDate}
                            style={{ width: '100%' }}
                            minDate={minDate}
                            onChange={(e) => {
                                values.insuredPersons[0].tripStartDate = e
                                setFieldValue(`insuredPersons.${0}.tripStartDate`, e)
                                //
                                if(values.insuredPersons[0].travelType === 'SV'){
                                    values.insuredPersons[0].tripPeriod = 365
                                    values.insuredPersons[0].tripEndDate = CalculateTripEndDate(e, 365)
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`,365)
                                    setFieldValue(`insuredPersons.${0}.tripEndDate`,CalculateTripEndDate(e, 365))
                                }else{
                                    values.insuredPersons[0].tripPeriod = CalculateTripDays(e, values.insuredPersons[0].tripEndDate)
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(e, values.insuredPersons[0].tripEndDate))
                                }
                                //
                                for (const i in values.insuredPersons) { 
                                    if ( i > 0 && values.insuredPersons[i].sameDate === true )
                                    {
                                        values.insuredPersons[i].tripStartDate = values.insuredPersons[0].tripStartDate
                                        values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate
                                        values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod
                                    }
                                }
                                
                            }}
                        /> */}
                        <KeyboardDatePickerField
                            name={`insuredPersons.${0}.tripStartDate`}
                            value={values.insuredPersons[0].tripStartDate}
                            style={{ width: '100%' }}
                            minDate={minDate}
                            onChange={(e) => {
                                const tripStartDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                values.insuredPersons[0].tripStartDate = tripStartDate;
                                setFieldValue(`insuredPersons.${0}.tripStartDate`, tripStartDate);

                                if (values.insuredPersons[0].travelType === 'SV') {
                                values.insuredPersons[0].tripPeriod = 365;
                                values.insuredPersons[0].tripEndDate = CalculateTripEndDate(tripStartDate, 365);
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, 365);
                                setFieldValue(`insuredPersons.${0}.tripEndDate`, CalculateTripEndDate(tripStartDate, 365));
                                } else {
                                values.insuredPersons[0].tripPeriod = CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate);
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate));
                                }

                                for (const i in values.insuredPersons) {
                                if (i > 0 && values.insuredPersons[i].sameDate === true) {
                                    values.insuredPersons[i].tripStartDate = values.insuredPersons[0].tripStartDate;
                                    values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate;
                                    values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod;
                                }
                                }
                            }}
                        />

                        {validMessage(`insuredPersons.${0}.tripStartDate`)}
                    </Grid>

                    <Grid item container xs={12} sm={4} md={4} lg={4} className={classes.textFieldWrapper}>
                        <label className={classes.inputLabel}><Text tid={'Quote.TripEndDate'}/></label>
                        {/* <KeyboardDatePickerField
                            name={`insuredPersons.${0}.tripEndDate`}
                            value={values.insuredPersons[0].tripEndDate}
                            disabled={values.insuredPersons[0].travelType === 'SV' ? true : false}
                            style={{ width: '100%' }}
                            minDate={values.insuredPersons[0].tripStartDate}
                            onChange={(e) => {
                                values.insuredPersons[0].tripEndDate = e
                                setFieldValue(`insuredPersons.${0}.tripEndDate`, e)
                                values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, e)
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, e))
                                // values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, e)
                                for (const i in values.insuredPersons) { 
                                if (values.insuredPersons[i].sameDate === true )
                                {
                                    setFieldValue(`insuredPersons.${i}.tripEndDate`, e)
                                    setFieldValue(`insuredPersons.${i}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, e))
                                }
                            }
                            }}
                        /> */}
                        <KeyboardDatePickerField
                            name={`insuredPersons.${0}.tripEndDate`}
                            value={values.insuredPersons[0].tripEndDate}
                            disabled={values.insuredPersons[0].travelType === 'SV'}
                            style={{ width: '100%' }}
                            minDate={values.insuredPersons[0].tripStartDate}
                            onChange={(e) => {
                                const tripEndDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                values.insuredPersons[0].tripEndDate = tripEndDate;
                                setFieldValue(`insuredPersons.${0}.tripEndDate`, tripEndDate);

                                values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, tripEndDate);
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, tripEndDate));

                                // Update trip end date and period for all insured
                                for (const i in values.insuredPersons) {
                                if (values.insuredPersons[i].sameDate === true) {
                                    setFieldValue(`insuredPersons.${i}.tripEndDate`, tripEndDate);
                                    setFieldValue(`insuredPersons.${i}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, tripEndDate));
                                }
                                }
                            }}
                        />

                        {validMessage(`insuredPersons.${0}.tripEndDate`)}
                    </Grid>

                    <Grid item container xs={12} sm={4} md={4} lg={3} className={classes.textFieldWrapper}>
                        <RegularTextField
                            name={`insuredPersons.${0}.tripPeriod`}
                            type="number"
                            disabled={(!values.insuredPersons[0].tripStartDate || values.insuredPersons[0].travelType === 'SV' ) ? true : false}
                            value={values.insuredPersons[0].tripPeriod ? values.insuredPersons[0].tripPeriod : values.insuredPersons[0].tripStartDate && values.insuredPersons[0].tripEndDate ? CalculateTripDays(values.insuredPersons[0].tripStartDate, values.insuredPersons[0].tripEndDate) : ''}
                            style={{ width: '100%', margin: 0 }}
                            label= {'Quote.TripCoverageDays'} 
                            InputProps={{
                                endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                            }}
                            onChange={(e) => {
                                setFieldValue(`insuredPersons.${0}.tripPeriod`, e.currentTarget.value)
                                setFieldValue(`insuredPersons.${0}.tripEndDate`,
                                CalculateTripEndDate(values.insuredPersons[0].tripStartDate, e.currentTarget.value)
                                )
                                for (const i in values.insuredPersons) { 
                                if (values.insuredPersons[i].sameDate === true )
                                {
                                    setFieldValue(`insuredPersons.${i}.tripPeriod`, e.currentTarget.value)
                                    setFieldValue(`insuredPersons.${i}.tripEndDate`, 
                                    CalculateTripEndDate(values.insuredPersons[0].tripStartDate, e.currentTarget.value)
                                    )
                                }
                            }
                            }}
                            onBlur={handleBlur}
                        />
                        {validMessage(`insuredPersons.${0}.tripPeriod`)}
                    </Grid>
                  </Grid>
                </Grid>



                {values.insuredPersons[0].travelType === 'PW' 
                    && values.insuredPersons[0].graduatedDate  
                    && (values.insuredPersons[0].yearDateAfterGraduated < values.insuredPersons[0].tripEndDate )
                    && (
                    <Grid container spacing={1} justify="center">
                        <Grid item container xs={12} sm={12} md={12} lg={7} className={classes.textFieldWrapper}>
                            <Box style={{border:'1px solid #dce4ec', marginTop:'3vh'}}>
                                <Typography variant="h5" style={{margin:'2vh'}}>
                                    {currentLanguage === 'ko' 
                                        ? (<div>
                                            최근에 졸업한 학생은 유학생 보험에 가입 할 수 있습니다. 따라서 {values.insuredPersons[0].firstName}님은  {dateFormat(values.insuredPersons[0].tripStartDate)} 부터 {dateFormat(values.insuredPersons[0].yearDateAfterGraduated)} 까지 총 {CalculateTripDays(values.insuredPersons[0].tripStartDate,values.insuredPersons[0].yearDateAfterGraduated)}일 동안의 유학생 보험을 가입 하실 수 있습니다.
                                            <br/>
                                            유학생 보험은 보다 저렴한 보험료에 높은 보장혜택을 제공 합니다 *  
                                            </div>) 
                                        : (<div>
                                            You are recently graduated student, so you can purchase international student insurance for a total
                                            of {CalculateTripDays(values.insuredPersons[0].tripStartDate,values.insuredPersons[0].yearDateAfterGraduated)} days from {dateFormat(values.insuredPersons[0].tripStartDate)} to {dateFormat(values.insuredPersons[0].yearDateAfterGraduated)}. 
                                            <br/>
                                            International Student Insurance has provided high coverage at very low premium.
                                        </div>)
                                    }
                                </Typography>

                                <Typography variant="h5" style={{margin:'2vh'}}>
                                    <Text tid={'Quote.SelectInsuranceProduct'}/>
                                </Typography>

                                <FormControl component="fieldset" >
                                    <RadioGroup style={{flexDirection: 'initial', marginLeft:'2vh'}}
                                        aria-label="product"
                                        name="radio-buttons-group"
                                        onChange={(e)=> { 
                                            if (e.currentTarget.value === 'STUDENT'){
                                                setFieldValue(`insuredPersons.${0}.tripEndDate`,values.insuredPersons[0].yearDateAfterGraduated )
                                                setFieldValue(`insuredPersons.${0}.tripPeriod`,CalculateTripDays(values.insuredPersons[0].tripStartDate,values.insuredPersons[0].yearDateAfterGraduated))
                                                for (const i in values.insuredPersons) { 
                                                    if (values.insuredPersons[i].sameDate === true){
                                                        values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate
                                                        values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod
                                                    }
                                                } 
                                            }
                                        }}
                                    >
                                        <FormControlLabel 
                                            value="STUDENT" 
                                            control={<Radio />} 
                                            // labelPlacement="start"
                                            label={currentLanguage === 'ko' 
                                                    ? (`학생 - ${dateFormat(values.insuredPersons[0].tripStartDate)} ~ ${dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))} (총 보험기간: ${CalculateTripDays(values.insuredPersons[0].tripStartDate,values.insuredPersons[0].yearDateAfterGraduated)}일). 보험 만료일을 ${dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))} 로 변경 하고 싶습니다.`)
                                                    : (`Student - ${dateFormat(values.insuredPersons[0].tripStartDate)} ~ ${dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))}  (coverage days: ${CalculateTripDays(values.insuredPersons[0].tripStartDate,CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))}). I want to change the end date as ${dateFormat(CalculateTripEndDate(values.insuredPersons[0].graduatedDate, 365))}.`) 
                                            }
                                        />
                                        <FormControlLabel 
                                            value="VISITOR" 
                                            control={<Radio />} 
                                            // labelPlacement="start"
                                            label={currentLanguage === 'ko' 
                                                    ?(`방문자 - ${dateFormat(values.insuredPersons[0].tripStartDate)} ~ ${dateFormat(values.insuredPersons[0].tripEndDate)} (총 보험기간: ${values.insuredPersons[0].tripPeriod}일).`)
                                                    :(`Visitor - ${dateFormat(values.insuredPersons[0].tripStartDate)} ~ ${dateFormat(values.insuredPersons[0].tripEndDate)}  (coverage days: ${values.insuredPersons[0].tripPeriod}).`)
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            
                            </Box>


                        </Grid>
                    </Grid>
                )}

                </>
            )}



            <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button color="secondary" className={classes.back_button} 
                    onClick={() => {
                        props.updateFormData(values); 
                        props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    }}
                >
                    <Text tid={'Button.Previous'}/>
                </Button>
                </Grid>

                <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button type='submit' color="dark" className={classes.next_button} 
                    onClick={() => setDirection('forward')}
                >
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
TripPurposeForm.propTypes = {
  formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   prevStep: PropTypes.func.isRequired
};

export default TripPurposeForm;