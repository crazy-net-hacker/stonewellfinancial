import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
//components
import { Text } from '../../../components/common/LanguageProvider'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { theme } from '../../../assets/jss/theme'

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
    padding: '2vh 15vh',
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
      fontSize:'11px'
  },
  },
  
  
}))

const StepHeader = ({ location: { pathname }, height, activeStep }) => {
  const classes = useStyles()

  const isProductSelectionStep = pathname === '/group-benefits/quote/product-selection'; 
  const isPesonalInfoStep = pathname === '/group-benefits/quote/personal-info';
  const isReviewStep = pathname === '/group-benefits/quote/review'; 

  const steps = ['ProdSelection', 'AppInfomation', 'Review'];

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
                      {/* <Text tid={`Quote.Step.${label}`}/> */}
                      {label === 'ProdSelection' &&
                        <>
                        <br/>
                        <div className="steps">
                          <div className={`${isProductSelectionStep ? 'step active' : 'step'}`}>
                            <div>
                              {isPesonalInfoStep || isReviewStep 
                                ? (
                                <Link to="/group-benefits/quote/product-selection"><Text tid={`Quote.Step.${label}`}/></Link>
                              ) : (
                                <Text tid={`Quote.Step.${label}`}/>
                              )}
                            </div>
                          </div>

                        </div>
                      </>
                      }
                      {label === 'AppInfomation' &&
                        <>
                        <br/>
                        <div className="steps">
                          <div className={`${isPesonalInfoStep ? 'step active' : 'step'}`}>
                            <div>
                              {isReviewStep 
                                ? (
                                <Link to="/group-benefits/quote/personal-info"><Text tid={`Quote.Step.${label}`}/></Link>
                              ) : (
                                <Text tid={`Quote.Step.${label}`}/>
                              )}
                            </div>
                          </div>

                        </div>
                      </>
                      }
                      {label === 'Review' &&
                        <>
                        <br/>
                        <div className="steps">
                          <div className={`${isReviewStep ? 'step active' : 'step'}`}>
                            <div>
                              <Text tid={`Quote.Step.${label}`}/>
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
