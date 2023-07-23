import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
//components
import { Text } from '../../../../components/common/LanguageProvider'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
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
        }
      }
    }
  }
}

});

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: 'auto',
  },
  stepper: {
   
    // marginBottom: '30px',
    // borderBottom: '1px solid #eee',
  },
  
  
}))

const steps = [
  'NewApplication',
  'TravelInformation',
  'ProductSelection',
  'QuoteSummary',
]

export const StepHeaderDB = ({ activeStep }) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
    <div className={classes.root}>
      <div position="static">
        <Stepper
          activeStep={activeStep}
          className={classes.stepper}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Text tid={`Vendor.Step1.${label}`} />
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
    </ThemeProvider>
  )
}
