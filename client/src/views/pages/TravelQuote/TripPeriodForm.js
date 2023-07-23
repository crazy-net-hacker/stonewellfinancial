import React, { useState, useContext } from 'react';
// import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import { Grid, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
import { Alert, AlertTitle } from '@material-ui/lab';
// common components
import { Text, LanguageContext } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import { getUTCDate } from '../../../controllers/CalculateValue';

// controllers
import { CalculateTripDays, CalculateTripEndDate } from '../../../controllers/CalculateValue'
import { dateFormat } from '../../../controllers/dataFormat'
// style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

// Validation
const validationSchema = Yup.object({
    insuredPersons: Yup.array().of(
        Yup.object().shape({
            tripStartDate: Validation.validRequiredDateField().nullable()
                        .min(new Date(new Date().setDate(new Date().getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
            tripEndDate: Validation.validRequiredDateField().nullable()
                        .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
            tripDepartureDate: Yup.date().nullable().when("tripType", 
            { is: (value) => 
                    value === 'TOPUP',
                    then: Validation.validRequiredDateField().nullable()
                                    .min(new Date(new Date().setDate(new Date().getDate() - 1)), 'DepartureDateShouldBeGreaterThanToday'),
            }),
            tripArrivalDate: Yup.date().nullable().when("tripType", 
            { is: (value) => 
                    value === 'TOPUP',
                    then: Validation.validRequiredDateField().nullable()
                                    .min(Yup.ref("tripDepartureDate"), "ArrivalDateShouldBeGreaterThanDepartureDate"),
            }),
            tripTotalDays: Yup.number().when("tripType", 
            { is: (value) => 
                    value === 'TOPUP',
                    then: Validation.validRequiredNumberMin1Field()
            }),
            tripOtherCoverageDays: Yup.number().when("tripType", 
            { is: (value) => 
                    value === 'TOPUP',
                    then: Validation.validRequiredNumberMin1Field()
                                    // .max(Yup.ref("tripTotalDays"), "Coverage period of your existing insurance should be less than Total Travel Period.")
                                    .lessThan(Yup.ref("tripTotalDays"), "CoveragePeriodExistinginsuranceShouldBeLessThanTripPeriod")
            }),
            multiTripDays: Yup.number().when("tripType", 
            { is: (value) => 
                    value === 'MULTI',
                    then: Validation.validRequiredNumberMin1Field()
                        .max(125, "MaximunMultiTripDayShouldBeLessThan125")
            }),
            tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365'),
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


const TripPeriodForm = (props) => {
    const { formData } = props;

    const classes = useStyles();

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    const [direction, setDirection] = useState('back');
    
    let height = '0px'

    // set multi trip days
    // const listMultiTripDays= insurances.filter(ins => (ins.trip_type === 'MULTI')).map(i=> i.trip_length_max + ' days  - ' + i.compnay_name);     
    // const uniqueListMultiTripDays = Array.from(new Set(listMultiTripDays));

    // For Timezone as UTC
    const minDate = getUTCDate();

    return (
        <>
        <StepHeader height={height} activeStep={1} data={formData} />

        <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={values => {
                window.scrollTo(0, 0)
                props.updateFormData(values);
                direction === 'back' 
                    ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    : props.history.push(pathDirection(props.location.pathname, values).nextStep);            }}
        >
        {({ values, handleChange, handleBlur, setFieldValue, errors }) => (

        <Form className={classes.formWrapper}>
            <Grid container justify='center'>      
                {/* {console.log(errors)} */}
                <Grid item container xs={12} justify='center'>
                    <Typography variant="h5" gutterBottom className={classes.title_question}>
                        <Text tid={'Quote.TellUsAboutYourTrip'}/> 
                    </Typography>
                </Grid>

                <Grid item container  xs={12} sm={12} md={12} lg={8} xl={7}>
                    {values.insuredPersons[0].tripType === 'TOPUP' && (
                        <Grid container style={{ alignItems: 'center' }}>
                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <label className={classes.inputLabel}><Text tid={'Quote.TripDepartureDate'}/></label>
                                {/* <KeyboardDatePickerField
                                    name={`insuredPersons.${0}.tripDepartureDate`}
                                    value={values.insuredPersons[0].tripDepartureDate}
                                    style={{ width: '100%' }}
                                    minDate={minDate}
                                    onChange={(e) => {
                                        values.insuredPersons[0].tripDepartureDate = e
                                        setFieldValue(`insuredPersons.${0}.tripDepartureDate`, e)
                                        values.insuredPersons[0].tripTotalDays = CalculateTripDays(e, values.insuredPersons[0].tripEndDate)
                                        setFieldValue(`insuredPersons.${0}.tripTotalDays`, CalculateTripDays(e, values.insuredPersons[0].tripEndDate))
                                        let tripStartDate = new Date(e)
                                        if (parseInt(values.insuredPersons[0].tripOtherCoverageDays) > 0){
                                            tripStartDate = new Date(tripStartDate.setDate(tripStartDate.getDate() + parseInt(values.insuredPersons[0].tripOtherCoverageDays)))
                                        }
                                        values.insuredPersons[0].tripStartDate = tripStartDate
                                        values.insuredPersons[0].tripPeriod = CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate)
                                        setFieldValue(`insuredPersons.${0}.tripStartDate`,tripStartDate)
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`,CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate))
                                        // set trip period info for all insured
                                        for (const i in values.insuredPersons) { 
                                            if (i > 0 && values.insuredPersons[i].sameDate === true ){
                                                values.insuredPersons[i].tripDepartureDate =  values.insuredPersons[0].tripDepartureDate
                                                values.insuredPersons[i].tripTotalDays =  values.insuredPersons[0].tripTotalDays
                                                values.insuredPersons[i].tripStartDate =  values.insuredPersons[0].tripStartDate
                                                values.insuredPersons[i].tripPeriod =  values.insuredPersons[0].tripPeriod
                                            }
                                        }
                                    }}
                                /> */}
                                <KeyboardDatePickerField
                                    name={`insuredPersons.${0}.tripDepartureDate`}
                                    value={values.insuredPersons[0].tripDepartureDate}
                                    style={{ width: '100%' }}
                                    minDate={minDate}
                                    onChange={(e) => {
                                        const tripDepartureDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                        values.insuredPersons[0].tripDepartureDate = tripDepartureDate;
                                        setFieldValue(`insuredPersons.${0}.tripDepartureDate`, tripDepartureDate);

                                        values.insuredPersons[0].tripTotalDays = CalculateTripDays(tripDepartureDate, values.insuredPersons[0].tripEndDate);
                                        setFieldValue(`insuredPersons.${0}.tripTotalDays`, CalculateTripDays(tripDepartureDate, values.insuredPersons[0].tripEndDate));

                                        let tripStartDate = new Date(e);
                                        if (parseInt(values.insuredPersons[0].tripOtherCoverageDays) > 0) {
                                        tripStartDate.setDate(tripStartDate.getDate() + parseInt(values.insuredPersons[0].tripOtherCoverageDays));
                                        }
                                        
                                        values.insuredPersons[0].tripStartDate = tripStartDate;
                                        values.insuredPersons[0].tripPeriod = CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate);
                                        setFieldValue(`insuredPersons.${0}.tripStartDate`, tripStartDate);
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(tripStartDate, values.insuredPersons[0].tripEndDate));

                                        // Set trip period info for all insured
                                        for (const i in values.insuredPersons) {
                                        if (i > 0 && values.insuredPersons[i].sameDate === true) {
                                            values.insuredPersons[i].tripDepartureDate = values.insuredPersons[0].tripDepartureDate;
                                            values.insuredPersons[i].tripTotalDays = values.insuredPersons[0].tripTotalDays;
                                            values.insuredPersons[i].tripStartDate = values.insuredPersons[0].tripStartDate;
                                            values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod;
                                        }
                                        }
                                    }}
                                />

                                {validMessage(`insuredPersons.${0}.tripDepartureDate`)}
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <label className={classes.inputLabel}><Text tid={'Quote.TripArrivalDate'}/></label>
                                {/* <KeyboardDatePickerField
                                    name={`insuredPersons.${0}.tripArrivalDate`}
                                    value={values.insuredPersons[0].tripArrivalDate}
                                    style={{ width: '100%' }}
                                    minDate={minDate}
                                    onChange={(e) => {
                                        values.insuredPersons[0].tripArrivalDate = e
                                        values.insuredPersons[0].tripEndDate = e
                                        values.insuredPersons[0].tripTotalDays =  CalculateTripDays(values.insuredPersons[0].tripDepartureDate, e)
                                        values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, e)
                                        setFieldValue(`insuredPersons.${0}.tripArrivalDate`, e)
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, e)
                                        setFieldValue(`insuredPersons.${0}.tripTotalDays`, CalculateTripDays(values.insuredPersons[0].tripDepartureDate, e))
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, e))
                                        // set trip period info for all insured
                                        for (const i in values.insuredPersons) { 
                                            if (i > 0 && values.insuredPersons[i].sameDate === true ){
                                                values.insuredPersons[i].tripArrivalDate = values.insuredPersons[0].tripArrivalDate
                                                values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate
                                                values.insuredPersons[i].tripTotalDays = values.insuredPersons[0].tripTotalDays
                                                values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod
                                            }
                                        }
                                    }}
                                /> */}
                                <KeyboardDatePickerField
                                    name={`insuredPersons.${0}.tripArrivalDate`}
                                    value={values.insuredPersons[0].tripArrivalDate}
                                    style={{ width: '100%' }}
                                    minDate={minDate}
                                    onChange={(e) => {
                                        const tripArrivalDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                        values.insuredPersons[0].tripArrivalDate = tripArrivalDate;
                                        values.insuredPersons[0].tripEndDate = tripArrivalDate;
                                        values.insuredPersons[0].tripTotalDays = CalculateTripDays(values.insuredPersons[0].tripDepartureDate, tripArrivalDate);
                                        values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, tripArrivalDate);

                                        setFieldValue(`insuredPersons.${0}.tripArrivalDate`, tripArrivalDate);
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, tripArrivalDate);
                                        setFieldValue(`insuredPersons.${0}.tripTotalDays`, CalculateTripDays(values.insuredPersons[0].tripDepartureDate, tripArrivalDate));
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, tripArrivalDate));

                                        // Set trip period info for all insured
                                        for (const i in values.insuredPersons) {
                                        if (i > 0 && values.insuredPersons[i].sameDate === true) {
                                            values.insuredPersons[i].tripArrivalDate = values.insuredPersons[0].tripArrivalDate;
                                            values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate;
                                            values.insuredPersons[i].tripTotalDays = values.insuredPersons[0].tripTotalDays;
                                            values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod;
                                        }
                                        }
                                    }}
                                />

                                {validMessage(`insuredPersons.${0}.tripArrivalDate`)}
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <RegularTextField
                                    label={'Quote.TripTotalDays'} 
                                    name={`insuredPersons.${0}.tripTotalDays`}
                                    type="number"
                                    value={values.insuredPersons[0].tripTotalDays ? values.insuredPersons[0].tripTotalDays : values.insuredPersons[0].tripDepartureDate && values.insuredPersons[0].tripArrivalDate ? CalculateTripDays(values.insuredPersons[0].tripDepartureDate, values.insuredPersons[0].tripArrivalDate) : ''}
                                    disabled={values.insuredPersons[0].tripDepartureDate ? false : true}
                                    onChange={(e) => {
                                        values.insuredPersons[0].tripTotalDays = e.currentTarget.value
                                        setFieldValue(`insuredPersons.${0}.tripTotalDays`, e.currentTarget.value)
                                        values.insuredPersons[0].tripArrivalDate =  CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value)
                                        values.insuredPersons[0].tripEndDate =  CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value)
                                        values.insuredPersons[0].tripPeriod =  CalculateTripDays(values.insuredPersons[0].tripStartDate, 
                                                                                                CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value)
                                                                                )
                                        setFieldValue(`insuredPersons.${0}.tripArrivalDate`, CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value))                                        
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value))                                        
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, 
                                                                                                            CalculateTripEndDate(values.insuredPersons[0].tripDepartureDate, e.currentTarget.value)
                                                                                            ))                                        
                                        // set trip period info for all insured
                                        for (const i in values.insuredPersons) { 
                                            if (i > 0 && values.insuredPersons[i].sameDate === true ){
                                                values.insuredPersons[i].tripTotalDays = values.insuredPersons[0].tripTotalDays
                                                values.insuredPersons[i].tripArrivalDate = values.insuredPersons[0].tripArrivalDate
                                                values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate
                                                values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod
                                            }
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                    }}
                                />
                                {validMessage(`insuredPersons.${0}.tripTotalDays`)}
                            </Grid>

                            <Grid item container justify="center">
                                <Grid item container justify="center">
                                    <Typography variant="h5" className={classes.title_question}>
                                        <Text tid={'Quote.TripOtherCoverageDays'}/>
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} sm={4} md={4} lg={4} >
                                    <RegularTextField
                                        // label={'Quote.OtherCoverageDays'} 
                                        name={`insuredPersons.${0}.tripOtherCoverageDays`}
                                        value={values.insuredPersons[0].tripOtherCoverageDays}
                                        disabled={values.insuredPersons[0].tripTotalDays > 0 ? false : true}
                                        onChange={(e) => {
                                            values.insuredPersons[0].tripOtherCoverageDays =  e.currentTarget.value
                                            setFieldValue(`insuredPersons.${0}.tripOtherCoverageDays`, e.currentTarget.value)
                                            values.insuredPersons[0].tripStartDate = values.insuredPersons[0].tripDepartureDate
                                            if (!e.currentTarget.value  || e.currentTarget.value === '0'){
                                                values.insuredPersons[0].tripStartDate = values.insuredPersons[0].tripDepartureDate
                                            } else{
                                                let result = new Date(values.insuredPersons[0].tripStartDate)
                                                result = new Date(result.setDate(result.getDate() + parseInt(e.currentTarget.value))) 
                                                values.insuredPersons[0].tripStartDate = new Date(result)
                                            }
                                            values.insuredPersons[0].tripPeriod= CalculateTripDays(values.insuredPersons[0].tripStartDate, values.insuredPersons[0].tripEndDate) 
                                            // set trip period info for all insured
                                            for (const i in values.insuredPersons) { 
                                                if (i > 0 && values.insuredPersons[i].sameDate === true ){
                                                    values.insuredPersons[i].tripOtherCoverageDays =  values.insuredPersons[0].tripOtherCoverageDays
                                                    values.insuredPersons[i].tripStartDate =  values.insuredPersons[0].tripStartDate
                                                    values.insuredPersons[i].tripPeriod =  values.insuredPersons[0].tripPeriod
                                                }
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                        }}
                                    />
                                    {validMessage(`insuredPersons.${0}.tripOtherCoverageDays`)}
                                </Grid>
                                <Grid item container justify="center">
                                            <Typography variant="h5" className={classes.title_question}>
                                                <Text tid={'Quote.TripPeriod.Instruction'}/>
                                            </Typography>
                                </Grid>
                                {values.insuredPersons[0].tripOtherCoverageDays > 0 && values.insuredPersons[0].tripPeriod > 0 && (
                                    <Alert severity="info" style={{ marginBottom:'3vh' }}>
                                        <AlertTitle><Text tid={'Quote.topUpOtherCoverage.Title'}/></AlertTitle>
                                        {currentLanguage === 'ko' 
                                            ? (<div>
                                                총 여행기간인 {values.insuredPersons[0].tripTotalDays}일 중 {values.insuredPersons[0].tripOtherCoverageDays} 일 
                                                ( {dateFormat(values.insuredPersons[0].tripDepartureDate)} - {dateFormat(values.insuredPersons[0].tripArrivalDate)} ) 은 소지하신 기존 보험으로 보장 받을수 있습니다. 
                                                <br/>
                                        
                                                보장되지 않는 {values.insuredPersons[0].tripPeriod} 일 
                                                ({dateFormat(values.insuredPersons[0].tripStartDate)} - {dateFormat(values.insuredPersons[0].tripEndDate)} ) 에 
                                                대해서만 추가로 보험에 가입 됩니다.
                                                </div>) 
                                            : (<div>
                                                {values.insuredPersons[0].tripOtherCoverageDays} out of  {values.insuredPersons[0].tripTotalDays} days of the total travel period ( {dateFormat(values.insuredPersons[0].tripDepartureDate)} - {dateFormat(values.insuredPersons[0].tripArrivalDate)} ) can be covered by your existing insurance.
                                                <br/>
                                                You only apply additional insurance for the  {values.insuredPersons[0].tripPeriod} days that are not covered ({dateFormat(values.insuredPersons[0].tripStartDate)} - {dateFormat(values.insuredPersons[0].tripEndDate)} ).
                                                </div>)
                                        }
                                    </Alert>
                                    )
                                }
                            </Grid>

                        </Grid> 
                    )}


                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                            {/* <KeyboardDatePickerField
                                name={`insuredPersons.${0}.tripStartDate`}
                                value={values.insuredPersons[0].tripStartDate}
                                style={{ width: '100%' }}
                                disabled={values.insuredPersons[0].tripType === 'TOPUP' ? true : false}
                                minDate={minDate}
                                onChange={(e) => {
                                    values.insuredPersons[0].tripStartDate = e
                                    setFieldValue(`insuredPersons.${0}.tripStartDate`, e)    
                                    // set tripPeriod as 365 when Multi
                                    if (values.insuredPersons[0].tripType === 'MULTI'){
                                        values.insuredPersons[0].tripPeriod = 365
                                        values.insuredPersons[0].tripEndDate = CalculateTripEndDate(e, 365)
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, 365) 
                                        setFieldValue(`insuredPersons.${0}.tripEndDate`, CalculateTripEndDate(e, 365))   
                                    }else 
                                    //set tripPeriod  when !Multi
                                    { 
                                        values.insuredPersons[0].tripPeriod = CalculateTripDays(e, values.insuredPersons[0].tripEndDate)
                                        setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(e, values.insuredPersons[0].tripEndDate))
                                    }
                                    // set data all applicant
                                    for (const i in values.insuredPersons) { 
                                    if (i > 0 && values.insuredPersons[i].sameDate === true )
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
                                disabled={values.insuredPersons[0].tripType === 'TOPUP'}
                                minDate={minDate}
                                onChange={(e) => {
                                    const startDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                    values.insuredPersons[0].tripStartDate = startDate;
                                    setFieldValue(`insuredPersons.${0}.tripStartDate`, startDate);

                                    if (values.insuredPersons[0].tripType === 'MULTI') {
                                    values.insuredPersons[0].tripPeriod = 365;
                                    values.insuredPersons[0].tripEndDate = CalculateTripEndDate(startDate, 365);
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, 365);
                                    setFieldValue(`insuredPersons.${0}.tripEndDate`, CalculateTripEndDate(startDate, 365));
                                    } else {
                                    values.insuredPersons[0].tripPeriod = CalculateTripDays(startDate, values.insuredPersons[0].tripEndDate);
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(startDate, values.insuredPersons[0].tripEndDate));
                                    }

                                    // Set data for all applicants
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

                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <label className={classes.inputLabel}><Text tid={'Quote.TripEndDate'}/></label>{/* 여행 종료 날짜 */}
                            {/* <KeyboardDatePickerField
                                name={`insuredPersons.${0}.tripEndDate`}
                                value={values.insuredPersons[0].tripEndDate}
                                style={{ width: '100%' }}
                                // disabled={values.insuredPersons[0].tripType === 'MULTI' ? true : false}
                                disabled={values.insuredPersons[0].tripType === 'TOPUP' || values.insuredPersons[0].tripType === 'MULTI' ? true : false}
                                minDate={values.insuredPersons[0].tripStartDate}
                                onChange={(e) => {
                                    values.insuredPersons[0].tripEndDate = e
                                    setFieldValue(`insuredPersons.${0}.tripEndDate`, e)
                                    values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, e)
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, e))
                                    for (const i in values.insuredPersons) { 
                                        if (i > 0 && values.insuredPersons[i].sameDate === true )
                                        {
                                            values.insuredPersons[i].tripEndDate =  values.insuredPersons[0].tripEndDate
                                            values.insuredPersons[i].tripPeriod =  values.insuredPersons[0].tripPeriod
                                        }
                                    }
                                }}
                            /> */}
                            <KeyboardDatePickerField
                                name={`insuredPersons.${0}.tripEndDate`}
                                value={values.insuredPersons[0].tripEndDate}
                                style={{ width: '100%' }}
                                disabled={values.insuredPersons[0].tripType === 'TOPUP' || values.insuredPersons[0].tripType === 'MULTI'}
                                minDate={values.insuredPersons[0].tripStartDate}
                                onChange={(e) => {
                                    const tripEndDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());

                                    values.insuredPersons[0].tripEndDate = tripEndDate;
                                    setFieldValue(`insuredPersons.${0}.tripEndDate`, tripEndDate);

                                    values.insuredPersons[0].tripPeriod = CalculateTripDays(values.insuredPersons[0].tripStartDate, tripEndDate);
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, CalculateTripDays(values.insuredPersons[0].tripStartDate, tripEndDate));

                                    // Set trip end date and period for all insured
                                    for (const i in values.insuredPersons) {
                                    if (i > 0 && values.insuredPersons[i].sameDate === true) {
                                        values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate;
                                        values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod;
                                    }
                                    }
                                }}
                            />

                            {validMessage(`insuredPersons.${0}.tripEndDate`)}
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} lg={4} >
                            <label className={classes.inputLabel}>
                            {values.insuredPersons[0].tripType !== 'TOPUP'
                                ? <Text tid={'Quote.TripCoverageDays'}/>
                                : <Text tid={'Quote.CoverageDays'}/>
                                }
                            </label>
                            <RegularTextField
                                // label= "Coverage Days"
                                name={`insuredPersons.${0}.tripPeriod`}
                                type="number"
                                // disabled={values.insuredPersons[0].tripStartDate ? false : true}
                                // disabled={values.insuredPersons[0].tripType === 'MULTI' ? true : values.insuredPersons[0].tripStartDate ? false : true}
                                disabled={values.insuredPersons[0].tripType === 'TOPUP' || values.insuredPersons[0].tripType === 'MULTI' ? true : values.insuredPersons[0].tripStartDate ? false : true}
                                value={values.insuredPersons[0].tripPeriod ? values.insuredPersons[0].tripPeriod : values.insuredPersons[0].tripStartDate && values.insuredPersons[0].tripEndDate ? CalculateTripDays(values.insuredPersons[0].tripStartDate, values.insuredPersons[0].tripEndDate) : ''}
                                style={{ width: '100%', margin: 0 }}
                                //label="Coverage Days"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Days</InputAdornment>, 
                                }}
                                onChange={(e) => {
                                    values.insuredPersons[0].tripPeriod = e.currentTarget.value 
                                    setFieldValue(`insuredPersons.${0}.tripPeriod`, e.currentTarget.value)
                                    values.insuredPersons[0].tripEndDate = CalculateTripEndDate(values.insuredPersons[0].tripStartDate, e.currentTarget.value)
                                    setFieldValue(`insuredPersons.${0}.tripEndDate`,
                                        CalculateTripEndDate(values.insuredPersons[0].tripStartDate, e.currentTarget.value)
                                    )
                                    for (const i in values.insuredPersons) { 
                                        if (i > 0 && values.insuredPersons[i].sameDate === true )
                                        {
                                            values.insuredPersons[i].tripPeriod = values.insuredPersons[0].tripPeriod
                                            values.insuredPersons[i].tripEndDate = values.insuredPersons[0].tripEndDate
                                        }
                                    }
                                }}
                                onBlur={handleBlur}
                            />
                            {validMessage(`insuredPersons.${0}.tripPeriod`)}
                        </Grid>
                    </Grid>

                    {values.insuredPersons[0].tripType === 'MULTI' && (
                        <Grid container style={{ alignItems: 'center' }}>

                            <Grid item xs={12} sm={4} md={4} lg={4} >
                                <RegularTextField
                                    label={'Quote.MultiTripDays'}
                                    name={`insuredPersons.${0}.multiTripDays`}
                                    value={values.insuredPersons[0].multiTripDays}
                                    onChange={(e) => {
                                        values.insuredPersons[0].multiTripDays = e.currentTarget.value
                                        setFieldValue(`insuredPersons.${0}.multiTripDays`, e.currentTarget.value)
                                        for (const i in values.insuredPersons) { 
                                            if (i>0 && values.insuredPersons[i].sameDate === true )
                                            {
                                                values.insuredPersons[i].multiTripDays = values.insuredPersons[0].multiTripDays
                                            // setFieldValue(`insuredPersons.${i}.multiTripDays`, e.currentTarget.value)
                                            }
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                    }}
                                />
                                {validMessage(`insuredPersons.${0}.multiTripDays`)}
                            </Grid>

                        </Grid>
                    )}
                </Grid>

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
                    <Button type='submit' color="dark" className={classes.next_button} onClick={() => setDirection('forward')}>
                        <Text tid={'Button.Next'}/>
                    </Button>
                    </Grid>
                </Grid>

            </Grid>
        </Form>

        )}

        </Formik>


        </>

    );

};

// ProtoTypes
TripPeriodForm.propTypes = {
  formData: PropTypes.object.isRequired
};

export default TripPeriodForm;