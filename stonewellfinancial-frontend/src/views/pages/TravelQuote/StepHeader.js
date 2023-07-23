import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
//components
import { Text } from '../../../components/common/LanguageProvider'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { theme } from '../../../assets/jss/theme'
import Button from '../../../components/common/CustomButtons/Button'
//icons
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const theme2 = createMuiTheme({
  overrides: {
  MuiStepConnector: {
    lineHorizontal: {
      borderTopWidth:'8px'
    },
   line: {
      borderColor:'#eee'
    },
    alternativeLabel: {
      top:'8px'
    }
  },
  MuiStepLabel: {
    label: {
      '&.MuiStepLabel': {
        active: {
          fontWeight:'600'
        },
      },
      [theme.breakpoints.down('sm')]: {
        fontSize:'11px'
      },
      
    }
  }
}

});

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    zIndex: 1200,
  },
  title: {
    margin: 'auto',
  },
  stepper: {
    padding: '4vh 15vh 2vh',
    // marginBottom: '50px',
    [theme.breakpoints.down('md')]: {
      padding:'2vh 1vh',
  },
    borderBottom: '1px solid #ddd',
    // boxShadow: '0 3px 15px #00000014',
    // marginBottom: '30px',
    // borderBottom: '1px solid #eee',
  },
  stepLabel: {
    [theme.breakpoints.down('md')]: {
      fontSize:'10px'
  },
  },
  
  
}))

const StepHeader = ({ location: { pathname }, height, activeStep, data }) => {
  const classes = useStyles()

  const isTripInfoStep = pathname === '/travel-insurance/quote/trip-info';
  const isPesonalInfoStep = pathname === '/travel-insurance/quote/personal-info';
  const isTripPurposeStep = pathname === '/travel-insurance/quote/trip-purpose';
  const isTripPeriodStep = pathname === '/travel-insurance/quote/trip-period';
  const isFamilyInfoStep = pathname === '/travel-insurance/quote/family-info';
  const isPreExistConditionStep = pathname === '/travel-insurance/quote/pre-existing-condition';
  const isMaternityCoverStep = pathname === '/travel-insurance/quote/maternity-coverage';
  const ismentalityCoverStep = pathname === '/travel-insurance/quote/mentality-coverage';
  const isProductSelectionStep = pathname === '/travel-insurance/quote/product-selection'; 
  const isSummaryStep = pathname === '/travel-insurance/quote/summary'; 
  const isApplicationStep = pathname === '/travel-insurance/quote/application'; 
  const isPaymentStep = pathname === '/travel-insurance/quote/payment'; 
  const isReviewStep = pathname === '/travel-insurance/quote/review'; 

  //
  const boundType = data.tripDirection
  const travelType = data.insuredPersons[0].travelType
  //only student plan is requested simple medical questions  eligilbeIns ==='STUDENT'
  const numEligilbeStudent = data.insuredPersons.filter(person => (person.eligilbeIns ==='STUDENT')).length
  const numPreExited = data.insuredPersons.filter(person => (person.age < 60)).length
  const numMaternity = data.insuredPersons.filter(person => (person.gender === 'female' && person.age > 19 && person.age < 51)).length
  
  // const steps = ['CheckEligibility', 'OptimizeInsurance','Application', 'Payment'];
  const steps = ['Eligibility', 'Optimization','Application', 'Payment'];
  // 가입자격확인하기, 맞춤형플랜찾기, 신청서작성하기, 결제하기  
  const [isOpen, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen(!isOpen);
  };

  //Responsive Design
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
  let isMobile = (width <= 768);


  return (
    <React.Fragment>

        <ThemeProvider theme={theme2}>
          <div className={classes.root} style={{top: height}}
          >
            <div position="static">
              <Stepper
                activeStep={activeStep}
                className={classes.stepper}
                alternativeLabel
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>
                      <Button style={{ padding:  isMobile ? 0 : '0.375rem 1.5rem' }} onClick={handleToggle}>
                        <Text tid={`Quote.Step.${label}`}/>
                        { !isMobile ? 
                           <>{!isOpen ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> } </>
                           : null }
                      </Button>
                      {label === 'Eligibility' &&
                        <>
                        <br/>
                        <div className="steps" style={{ textAlign:'left', display:isOpen?'inline-block':'none' }}>
                          <div className={`${isTripInfoStep ? 'step active' : 'step'}`}>
                            <div>
                              {isPesonalInfoStep || isTripPurposeStep || isTripPeriodStep || isFamilyInfoStep
                                || isPreExistConditionStep || isMaternityCoverStep || ismentalityCoverStep || isProductSelectionStep || isSummaryStep 
                                || isApplicationStep || isPaymentStep || isReviewStep
                                ? (
                                <Link to="/travel-insurance/quote/trip-info"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.TripDestination`}/></Link> //여행정보
                              ) : (
                                <>
                                  <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.TripDestination`}/>
                                </>
                                
                              )}
                            </div>
                          </div>

                          <div className={`${isPesonalInfoStep ? 'step active' : 'step'}`}>
                            <div>
                              {isTripPurposeStep || isTripPeriodStep || isFamilyInfoStep
                                || isPreExistConditionStep  || isMaternityCoverStep || ismentalityCoverStep || isProductSelectionStep || isSummaryStep 
                                || isApplicationStep || isPaymentStep || isReviewStep
                                ? (
                                <Link to="/travel-insurance/quote/personal-info"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.Applicant`}/></Link> //여행자정보
                              ) : (
                                <>
                                  <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.Applicant`}/>
                                </>
                              )}
                            </div>
                          </div>

                          <div className={`${isTripPurposeStep  ? 'step active' : 'step'}`}>
                            <div>
                              {isTripPeriodStep || isFamilyInfoStep
                                || isPreExistConditionStep || isMaternityCoverStep || ismentalityCoverStep || isProductSelectionStep || isSummaryStep  
                                || isApplicationStep || isPaymentStep || isReviewStep
                                ? (
                                  <>
                                    
                                    <Link to="/travel-insurance/quote/trip-purpose"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.TripPurpose`}/></Link>
                                    {/* 여행목적 */}
                                  </>
                              ) : (
                                <>
                                  <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.TripPurpose`}/>
                                </>
                              )}
                            </div>
                          </div>

                          {boundType === 'OutBound' &&
                            <div className={`${isTripPeriodStep  ? 'step active' : 'step'}`}>
                              <div>
                                { isFamilyInfoStep 
                                  || isPreExistConditionStep || isMaternityCoverStep || ismentalityCoverStep || isProductSelectionStep || isSummaryStep 
                                  || isApplicationStep || isPaymentStep || isReviewStep
                                  ? (
                                    <Link to="/travel-insurance/quote/trip-period"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.TripPeriod`}/></Link> //여행기간
                                  ) : (
                                    <>
                                      <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.TripPeriod`}/>
                                    </>
                                )}
                              </div>
                            </div>
                          }
                          {travelType !== 'SV' &&
                            <div className="steps">
                              <div className={`${isFamilyInfoStep  ? 'step active' : 'step'}`}>
                                <div>
                                  { isPreExistConditionStep || isMaternityCoverStep || ismentalityCoverStep || isProductSelectionStep || isSummaryStep  
                                    || isApplicationStep || isPaymentStep || isReviewStep
                                    ? (
                                      <Link to="/travel-insurance/quote/family-info"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.FamilyTraveller`}/></Link> //여행동반자정보
                                    ) : (
                                      <>
                                        <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.FamilyTraveller`}/>
                                      </>
                                  )}
                                </div>   
                              </div>
                            </div>
                          }
                        </div>
                      </>
                      }
                      {label === 'Optimization' &&
                        <>
                        <br/>

                        {boundType === 'InBound' && numEligilbeStudent > 0 && travelType !== 'SV' &&
                          <>
                            {numPreExited > 0 &&
                              <div className="steps" style={{ textAlign:'left', paddingLeft: isMobile ? '0' : '5rem', display:isOpen?'block':'none' }}>
                                <div className={`${isPreExistConditionStep  ? 'step active' : 'step'}`}>
                                  <div>
                                    { isMaternityCoverStep|| ismentalityCoverStep || isProductSelectionStep || isSummaryStep  
                                      || isApplicationStep || isPaymentStep || isReviewStep
                                      ? (
                                        <Link to="/travel-insurance/quote/pre-existing-condition"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.Pre-existingCondition`}/></Link> //기존지병보장
                                      ) : (
                                        <>
                                          <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.Pre-existingCondition`}/>
                                        </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            }
                            {numMaternity > 0 &&
                              <div className="steps" style={{ textAlign:'left', paddingLeft: isMobile ? '0' : '5rem', display:isOpen?'block':'none' }}>
                                <div className={`${isMaternityCoverStep  ? 'step active' : 'step'}`}>
                                  <div>
                                    { ismentalityCoverStep || isProductSelectionStep || isSummaryStep 
                                      || isApplicationStep || isPaymentStep || isReviewStep 
                                      ? (
                                        <Link to="/travel-insurance/quote/maternity-coverage"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.MaternityCoverage`}/></Link> //임신관련보장
                                      ) : (
                                        <>
                                         <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.MaternityCoverage`}/>
                                        </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            }

                            <div className="steps" style={{ textAlign:'left', paddingLeft: isMobile ? '0' : '5rem', display:isOpen?'block':'none' }}>
                              <div className={`${ismentalityCoverStep  ? 'step active' : 'step'}`}>
                                <div>
                                  { isProductSelectionStep || isSummaryStep  
                                    || isApplicationStep || isPaymentStep || isReviewStep
                                    ? (
                                      <Link to="/travel-insurance/quote/mentality-coverage"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.MentalityCoverage`}/></Link> //심리관련보장
                                    ) : (
                                      <>
                                         <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.MentalityCoverage`}/>
                                      </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        }

                        <div className="steps" style={{ textAlign:'left', paddingLeft: isMobile ? '0' : '5rem', display:isOpen?'block':'none' }}>
                          <div className={`${isProductSelectionStep  ? 'step active' : 'step'}`}>
                            <div>
                              { isSummaryStep 
                                || isApplicationStep || isPaymentStep || isReviewStep
                                ? (
                                  <Link to="/travel-insurance/quote/product-selection"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.ProductSelection`}/></Link> //보험상품 선택하기
                                ) : (
                                  <>
                                    <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.ProductSelection`}/>
                                  </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="steps" style={{ textAlign:'left', paddingLeft: isMobile ? '0' : '5rem', display:isOpen?'block':'none' }}>
                          <div className={`${isSummaryStep  ? 'step active' : 'step'}`}>
                            <div>
                              { isApplicationStep || isPaymentStep || isReviewStep 
                                ? (
                                  <Link to="/travel-insurance/quote/summary"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.SummaryofSelection`}/></Link> //견적 및 요약
                                ) : (
                                  <>
                                    <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.SummaryofSelection`}/>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>

                      </>
                      }
                      {label === 'Application' &&
                        <>
                        <br/>
                        <div className="steps" style={{ textAlign:'left', display:isOpen?'inline-block':'none' }}>
                          <div className={`${isApplicationStep ? 'step active' : 'step'}`}>
                            <div>
                              { isPaymentStep || isReviewStep
                                ? (
                                <Link to="/travel-insurance/quote/application"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.DetailApplication`}/></Link> //신청서 작성하기
                              ) : (
                                <>
                                  <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.DetailApplication`}/>
                                </>
                              )}
                            </div>
                          </div>

                        </div>
                      </>
                      }
                      {label === 'Payment' &&
                        <>
                        <br/>
                        <div className="steps" style={{ textAlign:'left', display:isOpen?'inline-block':'none' }}>
                          <div className={`${isPaymentStep ? 'step active' : 'step'}`}>
                            <div>
                              { isReviewStep
                                ? (
                                <Link to="/travel-insurance/quote/payment"><AddIcon sx={{ fontSize: 16 }} color="#007bff" /><Text tid={`Quote.Step.PaymentMethod`}/></Link> // 결제하기
                              ) : (
                                <>
                                  <RemoveIcon sx={{ fontSize: 16 }} /><Text tid={`Quote.Step.PaymentMethod`}/>
                                </>
                              )}
                            </div>
                          </div>

                          <div className={`${isReviewStep ? 'step active' : 'step'}`}>
                            <div>
                                <RemoveIcon sx={{ fontSize: 16 }} />
                                <Text tid={`Quote.Step.ReviewApplication`}/>
                                {/* 신청서 리뷰 */}
                            </div>
                          </div>

                        </div>
                      </>
                      }
                    </StepLabel>
                    
                  </Step>
                ))}
              </Stepper>
            </div>
          </div>
          </ThemeProvider>

          
    </React.Fragment>
  );
};

export default withRouter(StepHeader);
