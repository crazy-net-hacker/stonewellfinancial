import React, { useContext, useRef } from 'react';
// import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// style
import formStyle from '../../../assets/jss/styles/formStyle';
// core components
import { Grid, Typography } from '@material-ui/core';
// import { IconButton } from '@material-ui/core';
import {
    Autocomplete,
    // Alert, ToggleButton
    Alert, AlertTitle 
} from '@material-ui/lab';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import {QuoteBanner2} from '../../../components/common/QuoteBanner2'
import { 
    RegularTextField//, SelectTextField 
} from '../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import * as Validation from '../../Validation';
//
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
// controllers
import { getUTCDate } from '../../../controllers/CalculateValue';

//Style
const useStyles = makeStyles(formStyle)

//scroll
// function scrollDown(x) {
// window.scrollTo(0, x);
// }


const TripInformationForm = (props) => {
    const { formData, countries, provinces } = props;    

    const classes = useStyles()

    //scroll function
    const scrollProvince = useRef(null);
    const scrollToProvince = () => scrollProvince.current.scrollIntoView();
    const scrollDestination = useRef(null);
    const scrollToDestination = () => scrollDestination.current.scrollIntoView();
    const scrollArrival = useRef(null);
    const scrollToArrival = () => scrollArrival.current.scrollIntoView();
    const scrollArrivalDate = useRef(null);
    const scrollToArrivalDate = () => scrollArrivalDate.current.scrollIntoView();

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    // validation
    const validationSchema = Yup.object({
        destCountry: Validation.validRequiredField(),
        destProvince: Yup.string().when("destCountry",{
            is: "CA",
            then: Validation.validRequiredField()
        }),
        inDestination: Yup.boolean().required('FieldIsRequired'),
        tripArrivalDate: Yup.date().when("inDestination", {
            is: (value) => value === true,
            then: Validation.validRequiredDateField()
                            .max(new Date(new Date().setDate(new Date().getDate())), 'ArrivedDateShouldBeLessThanToday'),
            otherwise: Validation.validRequiredDateField()
                            .min(new Date(new Date().setDate(new Date().getDate()-1)), 'ArrivedDateShouldBeAfterToday')
        }),
        originCountry: Validation.validRequiredField(),
        originProvince: Yup.string().when("destCountry",{
            is: (value) => value !== 'CA',
            then: Validation.validRequiredField()
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

    let height = '0px'

     // For Timezone as UTC
    const minDate = getUTCDate();

    return (
        <>
            <QuoteBanner2 title={'Quote.TravelIns.Title'} subTitle={'Quote.TravelIns.SubTitle'} links={[]} />
            <StepHeader height={height} activeStep={1} data={formData} />
            
            <Grid item container justify="center">
                <Grid item container xs={12} sm={12} md={10} lg={8}>
                    <Alert severity="info">
                                <AlertTitle><Text tid={'Quote.Notice.AlertTitle'}/></AlertTitle>
                                <Text tid={'Quote.Notice.AlertDescription'}/>
                    </Alert>
                </Grid>
            </Grid>

            <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={values => {
                    window.scrollTo(0, 0)
                    props.updateFormData(values);
                    props.history.push(pathDirection(props.location.pathname, values).nextStep)
                }}
            >
                {({ values, handleChange, handleBlur, setFieldValue, setTouched, errors}) => (
                    <Form className={classes.formWrapper}>
                        <Grid container spacing={0} justify='center'>
                            
                            <Grid item xs={12}>
                                <Typography variant="h5" className={classes.title_question}>
                                    <Text tid={'Quote.WhereAreYouTravel'}/>
                                </Typography>
                            </Grid>
                            <Grid item xs={10} sm={6} md={6} lg={4} xl={3} className={classes.input_box}>
                                <Autocomplete
                                    name="destCountry"
                                    options={countries}
                                    value={values.destCountry ? countries.find(c => c.country_code === values.destCountry) : null}
                                    getOptionLabel={(option) => option.name}
                                    size="small"
                                    fullWidth
                                    renderInput={(params) =>
                                        <RegularTextField {...params} style={{ margin: '0' }} />
                                    }
                                    onChange={(e, selectedVal) => {
                                        values.destCountry = selectedVal ? selectedVal.country_code : ''
                                        values.destCountryName = selectedVal ? selectedVal.name : ''
                                        values.tripDirection = selectedVal ? (selectedVal.country_code === 'CA' ? 'InBound' : 'OutBound') : null
                                        values.inDestination = ''
                                        setFieldValue('destCountry', selectedVal ? selectedVal.country_code : '')
                                        setFieldValue('destProvince', '');
                                        setFieldValue('destProvinceName', '');
                                        setFieldValue('originCountry', '')
                                        setFieldValue('originCountryName', '')
                                        setFieldValue('originProvince', '')
                                        setFieldValue('originProvinceName', '')
                                        setFieldValue('inDestination', '');
                                        setFieldValue('tripDirection', selectedVal ? (selectedVal.country_code === 'CA' ? 'InBound' : 'OutBound') : null);
                                        // setOpen(true)
                                        // scrollDown(500);
                                        scrollToProvince();
                                    }}
                                    onBlur={() => setTouched({ 'destCountry': true })}
                                />
                                {validMessage('destCountry')}
                            </Grid>
                            
                            {/* Empty grid for scrolling function */}
                            <Grid ref={scrollProvince}></Grid>

                            {(values.destCountry === 'CA' || values.destCountry === 'US') && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" className={classes.title_question} >
                                            <Text tid={'Quote.WhichProvince'}/>
                                            ({values.destCountry === 'CA' ? 'province' : 'state'})
                                            <Text tid={'Quote.AreYouTravelingTo'}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={6} lg={4} xl={3} className={classes.input_box}>
                                        <Autocomplete
                                            name="destProvince"
                                            options={provinces.filter(i => i.country_code === values.destCountry)}
                                            value={values.destProvince ? provinces.find(c => c.country_code === values.destCountry && c.province_code === values.destProvince) : null}
                                            // getOptionLabel={(option) => values.destCountry === 'CA' ? option.province_code : option.province_name}
                                            getOptionLabel={(option) => option.province_name}
                                            //getOptionLabel={(option) => option.province_name} //to display full province names
                                            // getOptionDisabled={(option) => option.province_code === values.originProvince}
                                            size="small"
                                            renderInput={(params) =>
                                                // <RegularTextField {...params} label={values.destCountry === 'CA' ? "Province" : "State"} />
                                                <RegularTextField {...params} />
                                            }
                                            onChange={(e, selectedVal) => {
                                                values.destProvince = selectedVal ? selectedVal.province_code : ''
                                                values.destProvinceName = selectedVal ? selectedVal.province_name : ''
                                                setFieldValue('destProvince', selectedVal ? selectedVal.province_code : '');
                                                //reset mailing address if selected as no address in canada
                                                if(values.maillingInCanada === false){
                                                    values.maillingInCanada = true;
                                                    values.mailStreetName = ''
                                                    values.mailUnitApartmentNo = ''
                                                    values.mailCity = ''
                                                    values.mailProvince = ''
                                                    values.mailPostalCode = ''   
                                                }
                                                // scrollDown(1000)
                                                scrollToDestination();
                                            }}
                                            onBlur={() => setTouched({ 'destProvince': true })}
                                        />
                                        {validMessage('destProvince')}
                                    </Grid>
                                </>
                            )}

                            {/* Empty grid for scrolling function */}
                            <Grid ref={scrollDestination}></Grid>

                            {((values.destCountry === 'CA' || values.destCountry === 'US') ? values.destProvince : values.destCountry) && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" gutterBottom className={classes.title_question}>
                                            {currentLanguage === 'ko' ? (values.destProvince ? values.destProvinceName + ', ' + values.destCountryName : values.destCountryName) : null}
                                            <Text tid={'Quote.AreYouIn'}/>
                                            {currentLanguage === 'en' ? (' ' + (values.destProvince ? values.destProvinceName + ', ' + values.destCountryName : values.destCountryName) + '?') : null}
                                        </Typography>
                                    </Grid>
                                    <Grid container justify='center' className={classes.input_box}>
                                        <Grid item >
                                            <Button color={values.inDestination === true ? 'primary' : "secondary"} size="md" className={classes.button}
                                                onClick={() => {
                                                    setFieldValue('tripArrivalDate', null)
                                                    setFieldValue('inDestination', true)
                                                    // scrollDown(1200)
                                                    scrollToArrival();
                                                }}
                                            >
                                                <Text tid={'Button.Yes'}/>
                                            </Button>
                                            <Button color={values.inDestination === false ? 'primary' : "secondary"} size="md" className={classes.button}
                                                onClick={() => {
                                                    setFieldValue('tripArrivalDate', null)
                                                    setFieldValue('inDestination', false)
                                                    // scrollDown(1200)
                                                    scrollToArrival();
                                                }}
                                            >
                                                <Text tid={'Button.No'}/>
                                            </Button>
                                            {validMessage('inDestination')}
                                        </Grid>
                                    </Grid>
                                </>
                            )}

                             {/* Empty grid for scrolling function */}
                            <Grid ref={scrollArrival}></Grid>

                            {(values.inDestination === true || values.inDestination === false) && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" gutterBottom className={classes.title_question}>
                                            {currentLanguage === 'ko' ? values.destCountryName : null}
                                            {values.inDestination === true
                                                ? <Text tid={'Quote.WhenDidYouArriveIn'}/>
                                                : <Text tid={'Quote.WhenWillYouArriveIn'}/>
                                            }
                                            {currentLanguage === 'en' ? (' ' + values.destCountryName + '?') : null}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid container justify='center' className={classes.input_box}>
                                        <Grid item xs={10} sm={6} md={6} lg={4} xl={3}>
                                            <KeyboardDatePickerField 
                                                name={`tripArrivalDate`}
                                                value={values.tripArrivalDate}
                                                // minDate= {values.inDestination === false?new Date():undefined}
                                                // maxDate={ values.inDestination === true?new Date():undefined}
                                                minDate= {values.inDestination === false?minDate:undefined}
                                                maxDate={ values.inDestination === true?minDate:undefined}
                                                style={{ width: '100%' }}
                                                onChange={(e) => {
                                                    values.tripArrivalDate = e
                                                    setFieldValue('tripArrivalDate', e)
                                                    scrollToArrivalDate();
                                                    // set data all applicant
                                                    for (const i in values.insuredPersons) { 
                                                        setFieldValue(`insuredPersons.${i}.arrivalDate`, e)
                                                    }
                                                }}
                                            />
                                            {validMessage('tripArrivalDate')}
                                        </Grid>
                                    </Grid>

                                </>
                                
                            )}

                        
                              {/* Empty grid for scrolling function */}
                            <Grid ref={scrollArrivalDate}></Grid> 

                            {/* {((values.inDestination === true && values.tripArrivalDate) || values.inDestination === false) && values.tripDirection === 'InBound' && ( */}
                            {(values.inDestination === true || values.inDestination === false) && values.tripArrivalDate && values.tripDirection === 'InBound' && (
                                <>
                                    <Grid item xs={12} >
                                        <Typography variant="h5" className={classes.title_question} >
                                            <Text tid={values.inDestination === true?'Quote.WhatIsYourHomeCountryBefore':'Quote.WhatIsYourHomeCountry'}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={6} lg={4} xl={3} className={classes.input_box}>
                                        <Autocomplete
                                            name="originCountry"
                                            options={countries}
                                            value={values.originCountry ? countries.find(c => c.country_code === values.originCountry) : null}
                                            getOptionLabel={(option) => option.name}
                                            getOptionDisabled={(option) => option.country_code === values.destCountry}
                                            size="small"
                                            renderInput={(params) =>
                                                <RegularTextField {...params} />
                                            }
                                            onChange={(e, selectedVal) => {
                                                values.originCountry = selectedVal ? selectedVal.country_code : ''
                                                values.originCountryName = selectedVal ? selectedVal.name : ''
                                                setFieldValue('originCountry', selectedVal ? selectedVal.country_code : '')
                                                setFieldValue('originProvince', '')
                                                setFieldValue('originProvinceName', '')
                                                // scrollDown(1200)

                                            }}
                                            onBlur={() => setTouched({ 'originCountry': true })}
                                        />
                                        {validMessage('originCountry')}
                                    </Grid>
                                </>
                            )}

                            {(values.inDestination === true || values.inDestination === false) && values.tripDirection === 'OutBound' && (
                                <>
                                    <Grid item xs={12} >
                                        <Typography variant="h5" className={classes.title_question} >
                                            <Text tid={'Quote.WhatIsYourHomeOfCanada'}/>
                                        </Typography>
                                    </Grid>
                                    <Grid item container justify='center' style={{ marginBottom:'4vh' }}>
                                        <Grid item xs={12} sm={12} md={10} lg={8} xl={6}>
                                            <Alert severity="info">
                                                <AlertTitle><Text tid={'Quote.GHIP'}/></AlertTitle>
                                                    
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={10} sm={6} md={6} lg={4} xl={3} className={classes.input_box}>
                                        <Autocomplete
                                            name="originProvince"
                                            options={provinces.filter(i => i.country_code === 'CA')}
                                            value={values.originProvince ? provinces.find(c => c.country_code === values.originCountry && c.province_code === values.originProvince) : null}
                                            getOptionLabel={(option) => option.province_name}
                                            //getOptionLabel={(option) => option.province_name} //to display full province names
                                            //getOptionDisabled={(option) => option.province_code === values.destProvince}
                                            size="small"
                                            renderInput={(params) =>
                                                <RegularTextField {...params} />
                                            }
                                            onChange={(e, selectedVal) => {
                                                // values.originCountry = 'CA'
                                                values.originProvince = selectedVal ? selectedVal.province_code : ''
                                                values.originProvinceName = selectedVal ? selectedVal.province_name : ''
                                                setFieldValue('originCountry', 'CA')
                                                setFieldValue('originCountryName', 'Canada')
                                                setFieldValue('originProvince', selectedVal ? selectedVal.province_code : '')
                                                // scrollDown(1200)
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
                                            onBlur={() => setTouched({ 'originProvince': true })}
                                        />
                                        {validMessage('originProvince')}
                                    </Grid>
                                    
                                </>
                            )}

                            <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <Button color="dark" size="md" className={classes.next_button} type='submit'>
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
TripInformationForm.propTypes = {
    formData: PropTypes.object.isRequired
};

export default TripInformationForm;