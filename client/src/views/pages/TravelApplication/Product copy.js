import React, { useState, useEffect, useRef } from 'react'
//core components
import { Grid, Typography,   
        Card, CardContent } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
//common components
import { Text } from '../../../components/common/LanguageProvider'
import CustomButton from '../../../components/common/CustomButtons/Button'
import { amountFormat } from '../../../controllers/dataFormat'
import { isMedicalQuestionAnswered } from '../../../functionalities/MedicalQuestion';
import TooltipInfo from '../../../components/common/TooltipInfo';
//
import ProductSelection from './ProductSelection'
import ProductSelFamily from './ProductSelFamily'
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
//icons
import Insurance from '../../../assets/imgs/icons/insurance.svg'
import Add from '../../../assets/imgs/icons/add.svg'
import Support from '../../../assets/imgs/icons/support.svg'

// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import User from '../../../assets/imgs/icons/user.svg'
import MuiButton from '@material-ui/core/Button';


//setup form style
const useStyles = makeStyles(formStyle)

export const Product = ({ 
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    validMessage,
    insurances,
    questions
 }) => {

    //set to form style
    const classes = useStyles()
    
    const [alterOpen, setAlterOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // responsibility
    const [expandAll, setExpandAll] = useState(false)
    const [index, setIndex] = useState(0)
    const [isActive, setActive] = useState("false");
    const handleToggle = () => {
        setActive(!isActive);
    };


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


    const companion = (values) => {    
        return (
            <>
            {/* insuredPerson Information */}
            <Grid item container  style={{ marginTop:'3vh'}}>
                {!isMobile && (
                    <Grid item xs={2}>
                        <div className={classes.stickyLeftMenuCompanion}>
                            {values.insuredPersons && values.insuredPersons.length > 0 &&
                                <ul className={classes.leftMenuUlCompanion}>
                                    {values.insuredPersons.map((insuredPerson, i) => (
                                        (index === i && expandAll === false) 
                                            ?
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
                                                    {i === 0 ? <Text tid={'Quote.Primary'}/> :<><Text tid={'Quote.Family'}/> {`${i}`}</>}
                                                    <div style={{ fontWeight: '400', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#1c1c1c", fontSize:'16px', position:'relative' }} > 
                                                        {`${insuredPerson.firstName} ${insuredPerson.lastName}`}
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
                                                                    // window.scrollTo(0, 470);
                                                                    scrollToElement();
                                                                    return expandAll === true ? setExpandAll(false) : null;
                                                                    // handleToggle()        
                                                                }}
                                            >    
                                                <div style={{ fontWeight: '400', fontSize:'12px', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#666" }}>
                                                    {i === 0 ? <Text tid={'Quote.Primary'}/>:<><Text tid={'Quote.Family'}/> {`${i}`}</>}
                                                    {/* <Text tid={'Quote.Family'}/> {`${i}`}  */}
                                                    {/* {errors&&errors.insuredPersons[i]?'Error':'No Error'} */}
                                                    <div style={{ fontWeight: '400', color: alterOpen&&errors&&errors.insuredPersons&&errors.insuredPersons[i] ? "#f44336" : "#1c1c1c", fontSize:'16px', position:'relative' }} > 
                                                        {`${insuredPerson.firstName} ${insuredPerson.lastName}`}
                                                    </div>
                                                </div>
                                            </li>
                                    ))}
                                    {expandAll === true 
                                        ?
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
                <Grid item xs={!isMobile ? 10: 12} >
                    <div className={classes.companionSection} style={{ padding: '2vh', border: isMobile ? 'none': '1px solid #efefef' }}>
                        {errorMsg?
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

                        {errors && !!errors.insuredPersons && alterOpen &&
                            !!errors.insuredPersons[index] &&
                            
                                <Grid item container xs={12} justify="center">
                                    <Grid item xs={11} style={{ marginBottom: '1.5vh' }}>                                                    
                                        <Alert
                                            severity='error'
                                            onClose={() => setAlterOpen(false)}
                                        >
                                            {index === 0 ? <Text tid={'Quote.Primary'}/> : <Text tid={'Quote.Family'}/> }
                                            {index === 0 ? `  ` : ` ${index}  `}
                                            <Text tid={'Quote.Error.CompleteInformation'}/>
                                        </Alert>

                                    </Grid>
                                </Grid>
                        }
                    
                        {!isMobile && !expandAll
                            ? <>
                            {/* start indexed companion info */}
                            {values.insuredPersons && values.insuredPersons[index] && (
                                <div key={index}>

                                    {personInfo(index)}
                                    <Grid item container style={{ marginTop: '3vh'}}>
                                        <Grid item xs={6}>
                                            {values.insuredPersons[index - 1] && (
                                                <MuiButton
                                                    className={classes.button2}
                                                    onClick={() => { setIndex(index - 1); 
                                                        scrollToElement();
                                                    }}
                                                >
                                                    <span className={classes.btn_small}>
                                                        {'<'} Go to { (index - 1) === 0 ? `Primary` :`Family ${index - 1}`} 
                                                    </span>
                                                </MuiButton>
                                            )}
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                                            {values.insuredPersons[index + 1] && (
                                                <MuiButton
                                                    className={classes.button2}
                                                    onClick={() => { setIndex(index + 1); 
                                                        scrollToElement();
                                                    }}
                                                >
                                                    <span className={classes.btn_small}>
                                                        Go to Family {index + 1} {'>'}
                                                    </span>
                                                </MuiButton>
                                            )}
                                        </Grid>

                                    </Grid>
                                </div>
                            )}
                            </>
                            :<>
                            {/* start of fully expanded companion form list */}
                            {values.insuredPersons && values.insuredPersons.length > 0
                                && values.insuredPersons.map((insuredPerson, pIndex) => (
                                    <div key={pIndex}>
                                        {personInfo(pIndex)}
                                        <br />
                                    </div>
                            ))}
                            </>
                        }
                    </div>
                </Grid>

                <div style={{ display: 'none' }}>

                    <CustomButton
                        id = 'isInsuredPersonPlanVaild'
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            // console.log('isInsuredPersonPlanVaild')
                            values.insuredPersons.every((person, i) => {
                                if (person.insurancePlans.length === 0 && !person.selectedPlan){
                                        setIndex(i); 
                                        // window.scrollTo(0, 470); 
                                        scrollToElement();
                                        if (values.insuredPersons.length === 1){
                                            setErrorMsg('We are sorry, you can not purchase due to no plan for you, please contact us.')
                                            setTimeout(() => {
                                                setErrorMsg('')
                                            }, 7000);   
                                        }
                                        else{
                                            setErrorMsg(`We are sorry, 
                                                ${person.firstName
                                                    ? person.firstName
                                                    : i ===0 ? 'Primary':`Family ${i}.`}
                                                can not purchase, please remove ${i===0? 'Primary':`Family ${i}`} for purchase or contact us.`)
                                            setTimeout(() => {
                                                setErrorMsg('')
                                            }, 7000);   
                                        } 
                                        return false}
                                return true;
                            })
                        }}
                    >
                        Check SelectedPlan Vaild
                    </CustomButton>

                    <CustomButton
                        id = 'isInsuredPersonMedicalVaild'
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                            // console.log('in isInsuredPersonMedicalVaild')
                            values.insuredPersons.every((person, i) => {
                                if (((person.selectedPlan && person.selectedPlan.length !== 0) 
                                        && (person.eligilbeIns === 'VISITOR' || person.eligilbeIns === 'CANADIAN') 
                                        && person.age > 59
                                        && (person.selectedPlan.compnayName === 'Allianz' || person.selectedPlan.compnayName === 'Tugo')) 
                                        // && person.selectedPlan.medicalQuestion.answered === false
                                        && (person.selectedPlan.medicalQuestion.answered === false ||
                                            (person.selectedPlan.medicalQuestion.answered === true && person.selectedPlan.medicalQuestion.chargeRate  === '0'))
                                        ){
                                            setIndex(i); 
                                            // window.scrollTo(0, 470); 
                                            scrollToElement();
                                            if(person.selectedPlan.medicalQuestion.answered === false){
                                                setErrorMsg(<Text tid={'Quote.Error.CompleteMedicalQuestionnare'}/>)   
                                            }
                                            else 
                                            {
                                                setErrorMsg(`We are sorry, 
                                                ${person.firstName
                                                    ? person.firstName
                                                    : i ===0 ? 'Primary':`Family ${i}.`}
                                                    is not eligible to purchase this plan, please remove ${i===0? 'Primary':`Family ${i}`} for purchase or contact us.`)
                                            }
                                            setTimeout(() => {
                                                            setErrorMsg('')
                                                        }, 7000);   
                                            return false}
                                    return true;
                            })
                        }}
                    >
                        Check MedicalQuestionnaire Vaild
                    </CustomButton>

                </div>

            </Grid>
            </>
        );
    }

    const personInfo = (index) => {
        return (
            <>
                <Grid container>
                    <Grid item xs={12} >
                        <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: 'left', color:'#2a2f71', marginBottom: isMobile ? '2vh' : '0' }}>
                            
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
                                            <Text tid={'Quote.Primary'}/>
                                    </span>
                                : 
                                    <span className={classes.sectionSubTitle}>
                                        <img
                                            src={User}
                                            alt="Companion icon"
                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                        />
                                            <Text tid={'Quote.Family'}/> {`${index}`}
                                    </span>
                            }
                            

                            {/* delete button */}
                            {/* {index!==0 && 
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
                            } */}
                    
                        </div>
                    </Grid>

                    <Grid container className={classes.row_input}>

                        {/* <div style={{ display: (values.insuredPersons[index].insurancePlans.length > 0)
                                                ?'none':''}}> */}
                            {values.tripStartDate && values.tripEndDate &&
                                values.tripPeriod > 0 && values.tripPeriod < 366 &&
                                values.insuredPersons[index].birthDate &&
                                (isNaN(values.tripStartDate - values.insuredPersons[index].birthDate)?true:false) === false && (
                                    <Grid item xs={12}>
                                        {/* <div className={classes.titleSmall_sub} style={{ fontSize: '18px', fontWeight:'400', textAlign: !isMobile ? 'left' : 'center', color:'#2a2f71', marginTop: !isMobile ? '0' : '5vh', marginBottom: '1vh' }}>                                    
                                            <span className={classes.sectionSubTitle}>
                                            <Text tid={`Quote.Product`}/>
                                            </span>
                                        </div> */}
                                        
                                        <ProductSelection
                                            personInfo={{ person : values.insuredPersons[index],
                                                            personIndex : index}}
                                            questions={questions}
                                            values={values}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            setFieldValue={setFieldValue}
                                            validMessage={validMessage}
                                        /> 
                                        
                                        {/* You selected */}
                                        {values.insuredPersons[index].selectedPlan && values.insuredPersons[index].selectedPlan.compnayName  && (
                                        <>
                                            <Grid item xs={12} sm={12} md={12}>
                                                <Card style={{ textAlign: 'left', background:'#f9f9f9', borderRadius:'0', boxShadow:'none' }}>
                                                    <CardContent className={classes.cardContentBox}>
                                                        
                                                        <Grid item xs={12} style={{textAlign: 'left', paddingBottom:'2vh' }}>
                                                            <Typography style={{fontWeight:600, fontSize:'18px', color:'#000000DE'}}>
                                                                {values.insuredPersons[index].firstName}
                                                                <Text tid={`Quote.${values.insuredPersons[index].firstName?`sCoverage`:`${index===0 ?`Primary`:`Family`}`}`}/>
                                                                {!values.insuredPersons[index].firstName && index !==0 && ` ${index}  `}
                                                            </Typography>
                                                        </Grid>
                                                        
                                                        <Grid item container>
                                                            <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                                <Typography className={classes.title2} color="secondary" gutterBottom>
                                                                <img
                                                                    src={Insurance}
                                                                    alt="Insurance icon"
                                                                    style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                />
                                                                {values.insuredPersons[index].selectedPlan.compnayName
                                                                    ? values.insuredPersons[index].selectedPlan.compnayName + ' ' + values.insuredPersons[index].selectedPlan.coverages[0].generic_name
                                                                    : null}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                                <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                {(values.insuredPersons[index].selectedPlan.insuranceAmount && 
                                                                    // values.insuredPersons[index].selectedPlan.medicalQuestion.chargeRate !== '0'
                                                                    isMedicalQuestionAnswered(values.insuredPersons[index].age, values.insuredPersons[index].selectedPlan) === true
                                                                    )
                                                                    ? amountFormat(values.insuredPersons[index].selectedPlan.insuranceAmount, 2)
                                                                    : null}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        {values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName)&&
                                                            values.insuredPersons[index].optionalAddOnPlans.find(plan => plan.compnayName === values.insuredPersons[index].selectedPlan.compnayName)
                                                                .planTypes.filter(plan => plan.isSelected === true).map((plan, idx) => (
                                                            <Grid item container key={idx}>
                                                                <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                    <img
                                                                    src={Add}
                                                                    alt="Add icon"
                                                                    style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                    />
                                                                        {plan.planName}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>

                                                                <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                    {amountFormat(plan.calculatedAddOnAmount)}
                                                                </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        ))}

                                                        {values.insuredPersons[index].physicalCard === true && (
                                                            <>
                                                            <Grid item container>
                                                                <Grid item xs={9}>
                                                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                    <img
                                                                        src={Add}
                                                                        alt="Add icon"
                                                                        style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                    />
                                                                        <Text tid={'TravelApplication.PhysicalCardFee'}/>
                                                                        <TooltipInfo info={<Text tid={'TravelApplication.PhysicalCardFee.Free'}/>}/>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                                        
                                                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                        {amountFormat(values.insuredPersons[index].physicalCardFee, 2)}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            </>
                                                        )}
                                                        
                                                        {(values.insuredPersons[index].optionalCarewellService.isSelected === true ? values.insuredPersons[index].optionalCarewellService.packageAmount:0) > 0 &&
                                                            <Grid item container>
                                                                <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                        <img
                                                                            src={Support}
                                                                            alt="Insurance icon"
                                                                            style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                        />
                                                                        <Text tid={'CarewellServices'}/>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                        {amountFormat(values.insuredPersons[index].optionalCarewellService.isSelected === true ? values.insuredPersons[index].optionalCarewellService.packageAmount:0, 2)}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                    
                                                        <Grid item container xs={12} style={{color:'#3f51b5', background:'#fff', padding:'1.5vh', marginTop:'2vh'}}>
                                                            <Grid item xs={12} sm={4}>
                                                                <span style={{fontWeight:400, fontSize:'14px', color:'#000000DE'}}>
                                                                <Text tid={'TravelApplication.YourTotal'}/> : 
                                                                </span>
                                                            </Grid>
                                                            <Grid item xs={12} sm={8} style={{ textAlign:'right', fontWeight:'600', fontSize:'18px' }}>
                                                                <span>
                                                                {(values.insuredPersons[index].selectedPlan.insuranceAmount && 
                                                                // values.insuredPersons[index].selectedPlan.medicalQuestion.chargeRate !== '0'
                                                                    isMedicalQuestionAnswered(values.insuredPersons[index].age, values.insuredPersons[index].selectedPlan) === true
                                                                    )
                                                                    ? amountFormat(values.insuredPersons[index].selectedPlan.calculatedInsuranceAmount, 2)
                                                                    : null}
                                                                </span>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>  
                                        </>)
                                        }
                                    
                                    </Grid>
                            )}
                        {/* </div> */}

                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            <Grid container spacing={2} ref={scrollRef} style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-180px' : '0' }}>
                <div style={{ display: (values.insuredGroupType === 'Family' && 
                                                values.insuredPersons[index].insurancePlans.length > 0)
                                                ?'none':''}}>
                    <Grid item container xs={12} style={{ marginBottom:'2vh' }}>
                        <Grid item xs={12} sm={12} md={12}>
                            {/* <span className={classes.spanTitle}><Text tid={'Quote.Product'}/></span> */}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Grid item xs container direction="column" spacing={2}>

                                <Grid item xs>
                                    {((values.insuredGroupType === 'Individual'? values.insuredNumber > 0: values.insuredNumber > 2 ) &&
                                        values.eligilbeAgrement === true)
                                        ? companion(values) : null}
                                </Grid>

                            </Grid>
                        </Grid>            
                    </Grid>
                </div>

                {/* Family Premium  */}
                {values.insuredGroupType === 'Family' &&
                    <Grid item container xs={12}>
                        <Grid item xs={12} sm={12} md={12} style={{ marginBottom:'2vh' }}>
                            {/* <span className={classes.spanTitle}>
                                <Text tid={'Quote.Product'}/>
                            </span> */}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} >
                            <Grid item xs container direction="column" spacing={2}>

                                <Grid item xs>
                                    {/* {values.insuredPersons.filter(i=>i.selectedPlan && i.selectedPlan.compnayName).length === values.insuredPersons.length &&  */}
                                        <ProductSelFamily
                                            values={values}
                                            setFieldValue={setFieldValue}
                                        /> 
                                    {/* } */}
                                </Grid>

                            </Grid>
                        </Grid>            
                    </Grid>
                }
            </Grid>


        </>
    )
}


export default Product
