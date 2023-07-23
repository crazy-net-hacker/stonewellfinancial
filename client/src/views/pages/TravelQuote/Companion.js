import React, { useState, useEffect, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import { Grid, Typography, MenuItem } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MuiButton from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
// common components
import { Text } from '../../../components/common/LanguageProvider';
import { LanguageContext } from "../../../components/common/LanguageProvider";
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField, SelectMenuTextField } from '../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
// icon
import { IconButton } from '@material-ui/core';
// import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ClearIcon from '@mui/icons-material/Clear';
import User from '../../../assets/imgs/icons/user.svg'
//
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
// controllers
import { CalculateAge, CalculateTripDays, CalculateTripEndDate } from '../../../controllers/CalculateValue'
import OptimizedPlan from '../../../controllers/TravelQuote/Optimizedplan'
import AddOnPlan from '../../../controllers/TravelQuote/AddOnPlan'
// style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

// Relationship to Primary Applicant
const relationship = [
    { code: 'Spouse', name: 'Spouse' }, 
    { code: 'Child', name: 'Child' },  
    { code: 'Parent', name: 'Parent' },
    { code: 'Siblings', name: 'Siblings' },
    { code: 'Companion', name: 'Companion' },
    { code: 'Guardian', name: 'Guardian' },
]

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

//scroll
function scrollDown(x) {
    window.scrollTo(0, x);
}


const Companion = (props) => {
    const { formData, insurances } = props;
    
    const classes = useStyles();
    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage

    const [direction, setDirection] = useState('back');
    const [alterOpen, setAlterOpen] = useState(false)

    const current = new Date()

    // responsibility
    const [expandAll, setExpandAll] = useState(false)
    const [index, setIndex] = useState(1)

    const [width, setWidth] = useState(window.innerWidth);

    const [isActive, setActive] = useState("false");
    const handleToggle = () => {
        setActive(!isActive);
      };

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
    let isMobile = (width <= 768);

    const scrollRef = useRef(null);
    const scrollToElement = () => scrollRef.current.scrollIntoView();

    // Validation
    const validationSchema = Yup.object({
        insuredPersons: Yup.array().when("insuredNumber",
            {
                is: (value) =>
                    value > 0,
                then: Yup.array().of(
                    Yup.object().shape({
                        firstName: Validation.validRequiredField(),
                        lastName: Validation.validRequiredField(),
                        relationship: Validation.validRequiredField(),
                        birthDate: Validation.validRequiredBrithDateField(), //생년월일은 반드시 과거의 날짜 이어야 합니다
                        gender: Validation.validRequiredField(),
                        // beneficiaryName: Validation.validRequiredField(),
                        // beneficiaryRelationship: Validation.validRequiredField(),
                        travelType: Validation.validRequiredField(),
                        tripStartDate: Validation.validRequiredDateField()
                            .min(new Date(current.setDate(current.getDate() - 1)), 'Trip start date must be grater than today'), // 보험 시작일로 과거의 날짜를 넣을 수 없습니다.
                        tripEndDate: Validation.validRequiredDateField()
                            .min(Yup.ref("tripStartDate"), "Trip end date must be grater than start date date"), // 보험 종료일은 반드시 보험 시작일 이후의 날짜 이어야 합니다.
                        tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'Maximum days must be 365 !'), // 가장 길게 가입 할 수 있는 기간은 365일 입니다.
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

    // add Insured person(s) information
    function addInsuredInfo(insuredNumber, insuredPersons) {
        const insured = (parseInt(insuredNumber) + 1) - insuredPersons.length
        if (insured <= 0) {
            // remove insured information
            for (var ii = 0; ii < (insured * -1); ii++) {
                insuredPersons.pop()
            }
        }
        else {
            // add insured information
            for (var i = 0; i < insured; i++) {
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
                    tripType:  insuredPersons[0].tripType,
                    tripDepartureDate: insuredPersons[0].tripDepartureDate, // for Top-up
                    tripArrivalDate: insuredPersons[0].tripArrivalDate, // for Top-up
                    tripTotalDays: insuredPersons[0].tripTotalDays,  // for Top-up        
                    tripOtherCoverageDays: insuredPersons[0].tripOtherCoverageDays,  // for Top-up
                    multiTripDays: insuredPersons[0].multiTripDays,
                    preExistCond: false,
                    coverCond: false,
                    maternity: false,
                    mentalIllness: false,
                    eligilbeIns: '',
                    insurancePlans: [],
                    selectedPlan: [],
                    selectedMedQuesAnswer: [],
                    optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
                    optionalAddOnPlans: [],
                    renewalInsurance: false,
                })
            }
        }
        return insuredPersons
    }
    
    let height = '0px'
    return (
        <>
            <StepHeader height={height} activeStep={2} data={formData} />

            <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={values => {
                    OptimizedPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type === 'MED') })
                    AddOnPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type !== 'MED') })
                    window.scrollTo(0, 0)

                    props.updateFormData(values);
                    direction === 'back' 
                    ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    : props.history.push(pathDirection(props.location.pathname, values).nextStep);            

                }}
            >
                {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, errors, touched }) => (

                <Form className={classes.formWrapper}>
                    <Grid container spacing={0} justify='center'> 
                    
                            <Typography variant="h5" gutterBottom className={classes.title_question}>
                                <Text tid={'Quote.HowManyAreTravelingWithYou'}/>
                            </Typography>
                            <Grid item container justify='center'>
                                <Grid item xs={12} sm={4} md={4} lg={2}>
                                    <SelectTextField
                                        className={classes.input_box}
                                        name='insuredNumber'
                                        value={values.insuredNumber}
                                        onChange={(e) => {
                                            values.insuredNumber = e.currentTarget.value
                                            touched.insuredPersons = null
                                            setFieldValue('insuredNumber', e.currentTarget.value)
                                            setFieldValue('insuredPersons', addInsuredInfo(e.currentTarget.value, values.insuredPersons))
                                            scrollDown(700)
                                        }
                                        }
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </SelectTextField>
                                    {validMessage('insuredNumber')}
                                </Grid>
                            </Grid>


                            {values.insuredPersons.length > 1 && (
                                <>
                                    <Grid item container xs={12} sm={12} md={12} lg={8} xl={8} justify="center">
                                        <Grid item xs={12} ref={scrollRef}>
                                            <Typography variant="h5" gutterBottom className={classes.title_question}>
                                                <Text tid={'Quote.TellUsAboutYourFamily'}/>
                                                <span className={classes.title_question_sub2}><Text tid={'Quote.TellUsAboutYourFamily.Info'}/></span>
                                            </Typography>
                                        </Grid>

                                        {!isMobile && (
                                            <Grid item lg={2}>
                                                <div className={classes.stickyLeftMenuCompanion}>
                                                    {values.insuredPersons && values.insuredPersons.length > 0 &&
                                                        <ul className={classes.leftMenuUlCompanion}>
                                                            {values.insuredPersons.map((insuredPerson, i) => (
                                                                i === 0
                                                                    ? null
                                                                    :
                                                                    index === i && expandAll === false ?
                                                                        <li 
                                                                            className={errors&&errors.insuredPersons&&errors.insuredPersons[i]
                                                                                ?classes.leftMenuLi2Red
                                                                                :classes.leftMenuLiCompanion2 
                                                                            }
                                                                            style={{ background:isActive ? '#eee':'#fcfcfc' }}
                                                                            key={i}
                                                                            onClick={() => { handleToggle()
                                                                                                setIndex(i);  
                                                                                                return expandAll === true ? setExpandAll(false) : null; 
                                                                                            }}
                                                                        >
                                                                            <div style={{ fontWeight: '400', fontSize:'12px', color: alterOpen&&!!errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#666" }}>
                                                                                <Text tid={'Quote.Family'}/> {`${i}`}
                                                                                <span style={{ marginLeft:'1vh', fontWeight:'500', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#2a2f71"}}>
                                                                                        {/* {`${insuredPerson.relationship}`} */}
                                                                                        {insuredPerson.relationship ? <Text tid={`Quote.${insuredPerson.relationship}`}/> : null}
                                                                                </span>
                                                                                <div style={{ fontWeight: '400', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#1c1c1c", fontSize:'16px', position:'relative' }} > 
                                                                                    {`${insuredPerson.firstName} ${insuredPerson.lastName}`}
                                                                                
                                                                                    <IconButton style={{ float: 'right', position:'absolute', top:'-20px', right:'-5px' }} size='small' disableFocusRipple={true} disableRipple={true}
                                                                                        onClick={(e) => {
                                                                                            if (!e) e = window.event;
                                                                                            e.cancelBubble = true;
                                                                                            if (e.stopPropagation) e.stopPropagation();
                                                                                            if (values.insuredPersons.length > 1) {
                                                                                                if (index !== 1) {
                                                                                                    setIndex(index - 1)
                                                                                                }
                                                                                                setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[i]))
                                                                                                setFieldValue('insuredNumber', values.insuredNumber - 1)
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <ClearIcon sx={{ fontSize: 15 }}/>
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                        :
                                                                        <li 
                                                                            className={!!errors.insuredPersons&&errors.insuredPersons[i]
                                                                                ?classes.leftMenuLi2Red
                                                                                :classes.leftMenuLi2Green
                                                                            }
                                                                            // style={{ background:isActive ? '#eee':'#fcfcfc'}}
                                                                            key={i}
                                                                            onClick={() => { handleToggle()
                                                                                                setIndex(i); 
                                                                                                // window.scrollTo(0, 600); 
                                                                                                scrollToElement();
                                                                                                return expandAll === true ? setExpandAll(false) : null;
                                                                                                // handleToggle()        
                                                                                            }}
                                                                        >    
                                                                            <div style={{ fontWeight: '400', fontSize:'12px', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#666" }}>
                                                                                <Text tid={'Quote.Family'}/> {`${i}`} 
                                                                                {/* {errors&&errors.insuredPersons[i]?'Error':'No Error'} */}
                                                                                <span style={{ marginLeft:'1vh', fontWeight:'500', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#2a2f71"}}>
                                                                                    {/* {`${insuredPerson.relationship}`} */}
                                                                                    {insuredPerson.relationship ? <Text tid={`Quote.${insuredPerson.relationship}`}/> : null}
                                                                                </span>
                                                                                <div style={{ fontWeight: '400', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#1c1c1c", fontSize:'16px', position:'relative' }} > 
                                                                                    {`${insuredPerson.firstName} ${insuredPerson.lastName}`}
                                                                                    {/* <span style={{ marginLeft:'1vh', fontWeight:'400', color:'#1c1c1c', fontSize:'12px'}}>
                                                                                        ({`${insuredPerson.gender}`})
                                                                                     </span> */}
                                                                                    <IconButton style={{ float: 'right', position:'absolute', top:'-20px', right:'-5px' }} size='small' disableFocusRipple={true} disableRipple={true} onClick={(e) => {
                                                                                        // touched.insuredPersons[i] = null
                                                                                        if (!e) e = window.event;
                                                                                        e.cancelBubble = true;
                                                                                        if (e.stopPropagation) e.stopPropagation();

                                                                                        if (values.insuredPersons.length > 1) {
                                                                                            if (index !== 1) {
                                                                                                setIndex(index - 1)
                                                                                            }
                                                                                            setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[i]))
                                                                                            setFieldValue('insuredNumber', values.insuredNumber - 1)
                                                                                        }
                                                                                    }}>
                                                                                        <ClearIcon sx={{ fontSize: 15 }} />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                            ))}
                                                            {expandAll === true ?
                                                                <li className={classes.leftMenuLiCompanion2} onClick={() => setExpandAll(!expandAll)}>
                                                                    <div>
                                                                        <Text tid={'Quote.ExpandAll'}/>
                                                                    </div>
                                                                </li>
                                                                :
                                                                <li className={classes.leftMenuLiCompanion} onClick={() => setExpandAll(!expandAll)}>
                                                                    <div>
                                                                        <Text tid={'Quote.ExpandAll'}/>
                                                                    </div>
                                                                </li>
                                                            }
                                                        </ul>
                                                    }
                                                </div>
                                            </Grid>
                                        )}

                                        {/* start indexed companion info */}
                                        {!isMobile && !expandAll
                                            ? <>
                                                <Grid item xs={9} >
                                                    <div className={classes.companionSection} style={{ padding: '3vh' }}>
                                                        {index >= 1 && values.insuredPersons && values.insuredPersons.length > 1 && values.insuredPersons[index] && (
                                                            <div key={index}>
                                                                <Grid container>
                                                                    <Grid item xs={12}>
                                                                        <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: !isMobile ? 'left' : 'center', color:'#2a2f71', marginTop: !isMobile ? '0' : '5vh' }}>
                                                                            <img
                                                                                src={User}
                                                                                alt="Companion icon"
                                                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                            />
                                                                            <Text tid={'Quote.Family'}/> {index}
                                                                             {/* 가족 1 */}
                                                                        </div>
                                                                    </Grid>

                                                                    <Grid container className={classes.row_input}>
                                                                        <Grid item container spacing={2}>

                                                                            <Grid item xs={12} md={4}>
                                                                                <RegularTextField
                                                                                    label = {'Quote.FirstName'}
                                                                                    fullWidth
                                                                                    name={`insuredPersons.${index}.firstName`}
                                                                                    value={values.insuredPersons[index].firstName}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                                {validMessage(`insuredPersons.${index}.firstName`)}
                                                                            </Grid>

                                                                            <Grid item xs={12} md={4}>
                                                                                <RegularTextField
                                                                                    label = {'Quote.LastName'}
                                                                                    fullWidth
                                                                                    name={`insuredPersons.${index}.lastName`}
                                                                                    value={values.insuredPersons[index].lastName}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                                {validMessage(`insuredPersons.${index}.lastName`)}
                                                                            </Grid>

                                                                            <Grid item xs={12} md={4}>
                                                                                <SelectMenuTextField
                                                                                    label = {currentLanguage !== 'ko'
                                                                                                ?(`Family ${index} is ${values.insuredPersons[0].firstName}'s`)
                                                                                                :(`가족 ${index} 은 ${values.insuredPersons[0].firstName} 님의`)
                                                                                            }
                                                                                    value={values.insuredPersons[index].relationship}
                                                                                    name={`insuredPersons.${index}.relationship`}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    // fullWidth
                                                                                >
                                                                                    {relationship.map((item) => (
                                                                                        <MenuItem key={item.code} value={item.code}>
                                                                                            <Text tid={`Quote.${item.name}`}/>
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </SelectMenuTextField>
                                                                                {validMessage(`insuredPersons.${index}.relationship`)}
                                                                            </Grid>

                                                                        </Grid>

                                                                        <Grid item container spacing={1} className={classes.row_input}>
                                                                            <Grid item xs={12} sm={4} md={4}>
                                                                                <label className={classes.inputLabel}><Text tid={'Quote.BirthDate'}/></label>
                                                                                <KeyboardDatePickerField
                                                                                    name={`insuredPersons.${index}.birthDate`}
                                                                                    value={values.insuredPersons[index].birthDate}
                                                                                    maxDate={new Date()}
                                                                                    style={{ width: '100%' }}
                                                                                    onChange={(e) => {
                                                                                        values.insuredPersons[index].birthDate = e
                                                                                        setFieldValue(`insuredPersons.${index}.birthDate`, e)
                                                                                        setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e))
                                                                                    }}
                                                                                />
                                                                                {validMessage(`insuredPersons.${index}.birthDate`)}
                                                                            </Grid>

                                                                            <Grid item xs={12} sm={4} md={4} lg={3}>
                                                                                <RegularTextField
                                                                                    label = {'Quote.Age'}
                                                                                    name={`insuredPersons.${index}.age`}
                                                                                    value={values.insuredPersons[index].age}
                                                                                    disabled={true}
                                                                                    InputProps={{
                                                                                        endAdornment: <InputAdornment position="end">Years</InputAdornment>,
                                                                                    }}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs={12} sm={4} md={4}>
                                                                                <label className={classes.inputLabel}><Text tid={'Quote.Gender'}/></label>
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
                                                                                        <ToggleButton value="Male" className={classes.toggleButton}>
                                                                                            <Text tid={'Quote.Male'}/>
                                                                                        </ToggleButton>
                                                                                        <ToggleButton value="Female" className={classes.toggleButton}>
                                                                                            <Text tid={'Quote.Female'}/>
                                                                                        </ToggleButton>
                                                                                    </ToggleButtonGroup>
                                                                                    {validMessage(`insuredPersons.${index}.gender`)}
                                                                            </Grid>
                                                                        </Grid>

                                                            
                                                                        {/* Traveling as */}
                                                                        <Grid item container spacing={1}>
                                                                            {/* <Grid item xs={12} style={{ marginTop: '3vh' }}>
                                                                                <span className={classes.titleSmall_sub}>
                                                                                    {`Tell me about ${values.insuredPersons[index].firstName?values.insuredPersons[index].firstName:`family ${index}`}'s trip`}
                                                                                </span>
                                                                            </Grid> */}

                                                                            <Grid item container xs={6} sm={6} md={6}  className={classes.row_input} style={{ marginTop:'2vh' }}>
                                                                                <SelectMenuTextField
                                                                                    label= {'Quote.TravelPurpose'}
                                                                                    value={values.insuredPersons[index].travelType}
                                                                                    name={`insuredPersons.${index}.travelType`}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                >
                                                                                    <MenuItem value={""}><Text tid={'Quote.SelectTravelPurpose'}/></MenuItem>
                                                                                    {travelType.map((t)=> ({code: t.code, name: t.name, inSort: t.inSort, outSort: t.outSort, includedType: t.boundType.filter(f => f === values.tripDirection).length}))
                                                                                        .filter( i => i.includedType > 0)
                                                                                        .sort((a,b)=> values.tripDirection === 'InBound'? (a.inSort -  b.inSort): (a.outSort - b.outSort))
                                                                                        .map((item) => (
                                                                                                        <MenuItem key={item.code} value={item.code}>
                                                                                                        <Text tid={`Quote.${item.name}`}/>
                                                                                                        </MenuItem>
                                                                                    
                                                                                    ))}
                                                                                </SelectMenuTextField>
                                                                                {validMessage(`insuredPersons.${index}.travelType`)}
                                                                            </Grid>

                                                                        {values.tripDirection === 'InBound' && (
                                                                            <>
                                                                                {/* samedate */}
                                                                                <Grid item container xs={12} sm={6} md={6} lg={6} style={{ marginBottom: isMobile ? '15px' : '0', marginTop:isMobile ? '0': '2vh' }}>
                                                                                  
                                                                                    <Grid item xs={12} >
                                                                                        <span className={classes.inputLabel} style={{ marginBottom: '9px'}}>
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
                                                                                                setFieldValue(`insuredPersons.${index}.tripStartDate`, values.insuredPersons[0].tripStartDate)
                                                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, values.insuredPersons[0].tripEndDate)
                                                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, values.insuredPersons[0].tripPeriod)
                                                                                            }}
                                                                                            onBlur={() => setFieldTouched(`insuredPersons.${index}.sameDate`)}
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

                                                                                {/* this is conditional based on if all info is the same or not*/}
                                                                                {(values.insuredPersons[index].sameDate === true ||
                                                                                    values.insuredPersons[index].sameDate === false) && (
                                                                                    <>
                                                                                        <Grid item container className={classes.row_input} spacing={2}>

                                                                                            <Grid item xs={6} md={4} >
                                                                                                <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                                                                                                <KeyboardDatePickerField
                                                                                                    name={`insuredPersons.${index}.tripStartDate`}
                                                                                                    value={values.insuredPersons[index].tripStartDate}
                                                                                                    disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                                                                    minDate={new Date()}
                                                                                                    // fullWidth
                                                                                                    onChange={(e) => {
                                                                                                        setFieldValue(`insuredPersons.${index}.tripStartDate`, e)
                                                                                                        setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate, values.insuredPersons[index].tripEndDate))
                                                                                                    }}
                                                                                                />
                                                                                                {validMessage(`insuredPersons.${index}.tripStartDate`)}
                                                                                            </Grid>

                                                                                            <Grid item xs={6} md={4}>
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

                                                                                            <Grid item xs={6} md={3} >
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

                                                                    
                                                                    <Grid item container>
                                                                        <Grid item xs={6}>
                                                                            {values.insuredPersons[index - 2] && (
                                                                                <MuiButton
                                                                                        className={classes.button2}
                                                                                        // onClick={() => { setIndex(index + 1); window.scrollTo(0, 600); }}
                                                                                        onClick={() => { setIndex(index - 1); scrollToElement(); }}
                                                                                >
                                                                                        <span className={classes.btn_small}>
                                                                                            {currentLanguage !== 'ko'
                                                                                                ?(`< Go to Family ${index - 1}`)
                                                                                                :(`< 가족 ${index - 1} 정보 넣으러 가기`)
                                                                                            }
                                                                                        </span>
                                                                                </MuiButton>
                                                                            )}
                                                                        </Grid>

                                                                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                                                                            {values.insuredPersons[index + 1 ] && (//next companion button at the bottom
                                                                                <MuiButton
                                                                                    className={classes.button2}
                                                                                    onClick={() => { setIndex(index + 1); scrollToElement(); }}
                                                                                >
                                                                                    <span className={classes.btn_small}>
                                                                                        {currentLanguage !== 'ko'
                                                                                            ?(`Go to Family ${index + 1} >`)
                                                                                            :(`가족 ${index + 1} 정보 넣으러 가기 >`)
                                                                                        }
                                                                                    </span>
                                                                                </MuiButton>
                                                                            )}
                                                                        </Grid>
                                                                    </Grid>
                                                                        
                                                                </Grid>

                                                            </div>
                                                        )}
                                                        <br />
                                                    </div>
                                                </Grid>
                                             
                                            </>
                                            :
                                            <>
                                                {/* start of fully expanded companion form list */}
                                                <Grid item xs={!isMobile ? 9 : 12} style={{border: !isMobile ?'1px solid #efefef' : 'none'}}>
                                                    <div style={{padding: '3vh'}}>
                                                        {values.insuredPersons && values.insuredPersons.length > 0
                                                            ? values.insuredPersons.slice(1).map((insuredPerson, index) => (
                                                                <div key={index + 1}>
                                                                    <div style={{ display: 'none' }}>
                                                                        {index += 1}
                                                                    </div>
                                                                    <Grid container style={{marginBottom:'2vh'}}>
                                                                        <Grid item xs={12} style={{marginBottom: '2vh'}}>
                                                                            <Typography variant="h5" style={{ fontSize: '18px', fontWeight:'400', textAlign: !isMobile ? 'left' : 'center', color:'#2a2f71', marginTop: !isMobile ? '0' : '5vh' }}>
                                                                                <img
                                                                                    src={User}
                                                                                    alt="Companion icon"
                                                                                    style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                                />
                                                                                <Text tid={'Quote.Family'}/> {index}
                                                                                {/* {insuredPerson.firstName ? ': ' + insuredPerson.firstName : ''} */}
                                                                            </Typography>
                                                                        </Grid>

                                                                        <Grid item container spacing={1}>

                                                                            <Grid item xs={12} sm={4} md={6} lg={4}>
                                                                                <RegularTextField
                                                                                    label={'Quote.FirstName'}
                                                                                    name={`insuredPersons.${index}.firstName`}
                                                                                    value={insuredPerson.firstName}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`insuredPersons.${index}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                                {validMessage(`insuredPersons.${index}.firstName`)}
                                                                            </Grid>

                                                                            <Grid item xs={12} sm={4} md={6} lg={4}>
                                                                                <RegularTextField
                                                                                    label={'Quote.LastName'}
                                                                                    name={`insuredPersons.${index}.lastName`}
                                                                                    value={insuredPerson.lastName}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`insuredPersons.${index}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                                {validMessage(`insuredPersons.${index}.lastName`)}
                                                                            </Grid>

                                                                            <Grid item xs={12} sm={4} md={6} lg={4}>
                                                                                <SelectMenuTextField
                                                                                    label = {currentLanguage !== 'ko'
                                                                                                ?(`Family ${index} is ${values.insuredPersons[0].firstName}'s`)
                                                                                                :(`가족 ${index} 은 ${values.insuredPersons[0].firstName} 의`)
                                                                                            }
                                                                                    value={insuredPerson.relationship}
                                                                                    name={`insuredPersons.${index}.relationship`}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    // fullWidth
                                                                                >
                                                                                    {relationship.map((item) => (
                                                                                        <MenuItem key={item.code} value={item.code}>
                                                                                            <Text tid={`Quote.${item.name}`}/>
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </SelectMenuTextField>
                                                                                {validMessage(`insuredPersons.${index}.relationship`)}
                                                                            </Grid>
                                                                        </Grid>

                                                                        <Grid item xs={12} sm={4} md={6} lg={4}>
                                                                            <label className={classes.inputLabel}><Text tid={'Quote.BirthDate'}/></label>
                                                                            <KeyboardDatePickerField
                                                                                name={`insuredPersons.${index}.birthDate`}
                                                                                value={values.insuredPersons[index].birthDate}
                                                                                style={{ width: '100%' }}
                                                                                maxDate={new Date()}
                                                                                onChange={(e) => {
                                                                                    setFieldValue(`insuredPersons.${index}.birthDate`, e)
                                                                                    setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e))
                                                                                }}
                                                                            />
                                                                            {validMessage(`insuredPersons.${index}.birthDate`)}
                                                                        </Grid>

                                                                        <Grid item xs={12} sm={4} md={4}>
                                                                                <RegularTextField
                                                                                    label = {'Quote.Age'}
                                                                                    name={`insuredPersons.${index}.age`}
                                                                                    value={values.insuredPersons[index].age}
                                                                                    disabled={true}
                                                                                    InputProps={{
                                                                                        endAdornment: <InputAdornment position="end">Years</InputAdornment>,
                                                                                    }}
                                                                                />
                                                                            </Grid>

                                                                        {/* <Grid item xs={12} sm={4} md={6} lg={4} container className={classes.textFieldWrapper}> */}
                                                                        <Grid item xs={12} sm={4} md={6} lg={4}>
                                                                            <Grid item xs={12}>
                                                                                <label className={classes.inputLabel}><Text tid={'Quote.Gender'}/></label>
                                                                                <ToggleButtonGroup
                                                                                    className={classes.toggleButtonGroup}
                                                                                    value={insuredPerson.gender}
                                                                                    exclusive
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(`insuredPersons.${index}.gender`, e.currentTarget.value)
                                                                                    }}
                                                                                    onBlur={() => setFieldTouched(`insuredPersons.${index}.gender`)}
                                                                                >
                                                                                    <ToggleButton value="Male" className={classes.toggleButton}>
                                                                                        <Text  tid={'Quote.Male'}/>
                                                                                    </ToggleButton>
                                                                                    <ToggleButton value="Female" className={classes.toggleButton}>
                                                                                        <Text  tid={'Quote.Female'}/>
                                                                                    </ToggleButton>
                                                                                </ToggleButtonGroup>
                                                                                {validMessage(`insuredPersons.${index}.gender`)}
                                                                            </Grid>
                                                                        </Grid>

                                                                        {/* Traveling as */}
                                                                        <Grid item container xs={12} sm={6} md={6} lg={6} style={{ marginBottom: isMobile ? '15px' : '0' }}>
                                                                            {/* <Grid item xs={12} style={{ marginTop: !isMobile ? '5vh' : '6vh' }}>
                                                                                <div className={classes.titleSmall_sub}>
                                                                                    {`Tell me about ${values.insuredPersons[index].firstName?values.insuredPersons[index].firstName:`family ${index}`}'s trip`}
                                                                                </div>
                                                                            </Grid> */}
                                                                            <Grid item container xs={12} className={classes.row_input} >
                                                                                <SelectMenuTextField
                                                                                    label= {'Quote.TravelPurpose'}
                                                                                    value={values.insuredPersons[index].travelType}
                                                                                    name={`insuredPersons.${index}.travelType`}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    // fullWidth
                                                                                >
                                                                                    <MenuItem value={""}><Text tid={'Quote.SelectTravelPurpose'}/></MenuItem>
                                                                                    {travelType.map((t)=> ({code: t.code, name: t.name, inSort: t.inSort, outSort: t.outSort, includedType: t.boundType.filter(f => f === values.tripDirection).length}))
                                                                                        .filter( i => i.includedType > 0)
                                                                                        .sort((a,b)=> values.tripDirection === 'InBound'? (a.inSort -  b.inSort): (a.outSort - b.outSort))
                                                                                        .map((item) => (
                                                                                                        <MenuItem key={item.code} value={item.code}>
                                                                                                        <Text tid={`Quote.${item.name}`}/>
                                                                                                        </MenuItem>
                                                                                    
                                                                                    ))}
                                                                                </SelectMenuTextField>
                                                                                {validMessage(`insuredPersons.${index}.travelType`)}
                                                                            </Grid>
                                                                        </Grid>

                                                                        {values.tripDirection === 'InBound' && (
                                                                            <>
                                                                                {/* samedate */}
                                                                                <Grid item container xs={12} sm={6} md={6} lg={6} style={{ marginBottom: isMobile ? '15px' : '0', marginTop:isMobile ? '0': '2vh' }}>
                                                                                    <Grid item xs={12} >
                                                                                        <span className={classes.inputLabel} style={{ marginBottom: isMobile ? '8px' : '0'}}>
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
                                                                                                insuredPerson.sameDate = val
                                                                                                setFieldValue(`insuredPersons.${index}.sameDate`, val)
                                                                                                setFieldValue(`insuredPersons.${index}.tripStartDate`, values.insuredPersons[0].tripStartDate)
                                                                                                setFieldValue(`insuredPersons.${index}.tripEndDate`, values.insuredPersons[0].tripEndDate)
                                                                                                setFieldValue(`insuredPersons.${index}.tripPeriod`, values.insuredPersons[0].tripPeriod)
                                                                                            }}
                                                                                            onBlur={() => setFieldTouched(`insuredPersons.${index}.sameDate`)}
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


                                                                                {/* this is conditional based on if all info is the same or not*/}
                                                                                {(insuredPerson.sameDate === true ||
                                                                                    insuredPerson.sameDate === false) && (
                                                                                        <>
                                                                                            <Grid item container className={classes.row_input} spacing={1}>
                                                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                                                    <label className={classes.inputLabel}><Text tid={'Quote.TripStartDate'}/></label>
                                                                                                    <KeyboardDatePickerField
                                                                                                        name={`insuredPersons.${index}.tripStartDate`}
                                                                                                        value={values.insuredPersons[index].tripStartDate}
                                                                                                        disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                                                                        minDate={new Date()}
                                                                                                        // fullWidth
                                                                                                        onChange={(e) => {
                                                                                                            setFieldValue(`insuredPersons.${index}.tripStartDate`, e)
                                                                                                            setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate, values.insuredPersons[index].tripEndDate))
                                                                                                        }}
                                                                                                        style={{width:'100%'}}
                                                                                                    />
                                                                                                    {validMessage(`insuredPersons.${index}.tripStartDate`)}
                                                                                                </Grid>
                                                                                                
                                                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                                                    <label className={classes.inputLabel}><Text tid={'Quote.TripEndDate'}/></label>
                                                                                                    <KeyboardDatePickerField
                                                                                                        name={`insuredPersons.${index}.tripEndDate`}
                                                                                                        value={values.insuredPersons[index].tripEndDate}
                                                                                                        minDate={new Date()}
                                                                                                        disabled={values.insuredPersons[index].sameDate === true ? true : false}
                                                                                                        // fullWidth
                                                                                                        onChange={(e) => {
                                                                                                            setFieldValue(`insuredPersons.${index}.tripEndDate`, e)
                                                                                                            setFieldValue(`insuredPersons.${index}.tripPeriod`, CalculateTripDays(values.insuredPersons[index].tripStartDate, e,))
                                                                                                        }}
                                                                                                        style={{width:'100%'}}
                                                                                                    />
                                                                                                    {validMessage(`insuredPersons.${index}.tripEndDate`)}
                                                                                                </Grid>

                                                                                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                                                                                    <RegularTextField
                                                                                                        label= {'Quote.CoverageDays'}
                                                                                                        name={`insuredPersons.${index}.tripPeriod`}
                                                                                                        value={insuredPerson.tripPeriod ? insuredPerson.tripPeriod : ''}
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

                                                                </div>
                                                            ))
                                                            : null}
                                                        <br />

                                                    </div>
                                                </Grid>

                                            </>
                                        }
                                    </Grid>
                                    
                                    {errors && !!errors.insuredPersons && alterOpen &&
                                        !!errors.insuredPersons[index] &&
                                            <Grid item container xs={12} sm={12} md={12} lg={8} justify="center">
                                                <Grid item xs={11} style={{ marginTop:'1vh' }}>                                                    
                                                    <Alert
                                                        severity='error'
                                                        onClose={() => setAlterOpen(false)}
                                                    >
                                                        <Text tid={'Quote.Family'}/> {`  ${index}  `}
                                                        <Text tid={'Quote.Error.CompleteInformation'}/>
                                                    </Alert>

                                                </Grid>
                                            </Grid>
                                    }

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
                                onClick={() => {
                                                errors&&!!errors.insuredPersons&&
                                                errors.insuredPersons.every((err, i) => {
                                                    if (err){setIndex(i); 
                                                                // window.scrollTo(0, 600); 
                                                                scrollToElement();
                                                                return false}
                                                    // if (!err){setIndex(i+1)}
                                                    return true;
                                                })
                                                setAlterOpen(true);
                                                setDirection('forward');
                                }}
                            >
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
Companion.propTypes = {
    formData: PropTypes.object.isRequired
};

export default Companion;
