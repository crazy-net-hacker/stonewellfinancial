import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// core components
import {
  Grid, Typography,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { Text } from '../../../components/common/LanguageProvider';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';

import StepHeader from './StepHeader';
import {pathDirection} from './Progress';

//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)


const Review = (props) => {
  const { groupFormData } = props; 

  const classes = useStyles();
  // 
  const productSelection = [
    { name: 'HealthPlan', value: groupFormData.healthPlan },
    { name: 'DentalPlan', value: groupFormData.dentalPlan },
    { name: 'Paramedical', value: groupFormData.paramedical },
    { name: 'PrescriptionDrug', value: groupFormData.prescriptionDrug },
    { name: 'GlassEyeExam', value: groupFormData.visionPlan },
  ]
  const productSelectionSub = [
    { name: 'LongTermDisability', value: groupFormData.longTermDisability },
    { name: 'ShortTermDisability', value: groupFormData.shortTermDisability },
    { name: 'CriticalIllnessInsurance', value: groupFormData.criticalIllnessInsurance },
    { name: 'GroupRRSPandDPSP', value: groupFormData.groupRRSPandDPSP },
    { name: 'GroupTFSA', value: groupFormData.groupTFSA },
  ]
  //
  const requesterInfo = [
    { name: 'CompanyName', transl: 'Group.', trvalue: groupFormData.companyName },
    { name: 'NatureOfBusiness', transl: 'Group.', value: groupFormData.natureOfBusiness },
    { name: 'ContactPerson', transl: 'Group.', value: groupFormData.contactPerson },
    { name: 'Phone', transl: '', value: groupFormData.phone },
    { name: 'Email', transl: '', value: groupFormData.email },
    { name: 'PreferContactMethod', transl: '', value: groupFormData.contactMethod },
  ]
  const requesterInfoSub = [
    { name: 'NumberOfFullTime', value: groupFormData.numberOfFullTime },
    { name: 'NumberOfcovered', value: groupFormData.numberOfcovered },
    { name: 'ReasonNotSame', value: groupFormData.reasonNotSame },
  ]

  function hasDuplicate(insuredPersons) {
    const uniqueValues = new Set(insuredPersons.map(insuredPerson => 
      `${insuredPerson.firstName} 
        ${insuredPerson.lastName} 
        ${insuredPerson.birthDate} 
        ${insuredPerson.gender} 
        ${insuredPerson.type} 
        ${insuredPerson.province}
        ${insuredPerson.covered}`
    ))
    if (uniqueValues.size < insuredPersons.length) return true
  }


  return (
    <>
      <QuoteBanner2 title={'Quote.GroupIns.Title'} subTitle={'Quote.GroupIns.SubTitle'} links={[]} />
      <StepHeader activeStep={3} />
      <div className={classes.formWrapper}>
        <Typography variant="h5" gutterBottom className={classes.title_question}>
          <Text tid={'Quote.ReviewYourApplication'}/>
        </Typography>
        
        <Grid container justify="center" >
            <Grid item container  xs={12} sm={10} md={10} lg={8}>
                <Typography variant='h5' className={classes.inputPaddingTitle} >
                  {/* <Text tid={'Quote.PersonalInfomation'}/> */}
                  <div>
                    <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.Group.CustomizedPlan'} />
                </Typography>
            </Grid>
            <Grid item container xs={12} sm={10} md={8} spacing={2} className={classes.gridMargin}>
              <>
                {productSelection.map((productSel) => (
                  <React.Fragment key={productSel.name}>
                    <Grid item xs={6} sm={6} md={4} lg={4}>
                      <Typography className={classes.userInputTitle}><Text tid={`Quote.Group.${productSel.name}`} /></Typography>
                      <Typography variant="subtitle1" className={classes.userInputValue}>{productSel.value}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </>
            </Grid>
            {/* Optional Product */}
            <Grid item container xs={12} sm={10} md={8} spacing={2} className={classes.gridMargin}>
                {productSelectionSub.map((productSel) => (
                <React.Fragment key={productSel.name}>
                  <Grid item xs={6} sm={6} md={4} lg={4}>
                    <Typography className={classes.userInputTitle} ><Text tid={`Quote.Group.${productSel.name}`} /></Typography>
                    <Typography variant="subtitle1" className={classes.userInputValue} >
                      {productSel.value ? productSel.value : 'No'}
                      {/* {productSel.value} */}
                      </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            {/* Company Information  */}
            <Grid item container  xs={12} sm={10} md={10} lg={8}>
                <Typography variant='h5' className={classes.inputPaddingTitle} >
                  {/* <Text tid={'Quote.PersonalInfomation'}/> */}
                  <div>
                    <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.Group.CompanyInformation'} />
                </Typography>
            </Grid>


            <Grid item container xs={12} sm={10} md={8} spacing={2} justify="center" className={classes.gridMargin}>
              
              {requesterInfo.map((requesterInfo) => (
                <React.Fragment key={requesterInfo.name}>
                  <Grid item xs={6} sm={6} md={4} lg={4} >
                    <Typography className={classes.userInputTitle}><Text tid={`Quote.${requesterInfo.transl}${requesterInfo.name}`} /></Typography>
                    <Typography variant="subtitle1" className={classes.userInputValue}>{requesterInfo.value}</Typography>
                  </Grid>
                </React.Fragment>
              ))}
            
            </Grid>
            
              
            <Grid item container  xs={12} sm={10} md={10} lg={8}>
              <Typography variant='h5' className={classes.inputPaddingTitle} >
                {/* <Text tid={'Quote.PersonalInfomation'}/> */}
                <div>
                  <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.Group.EmployeesInformation'}/>
              </Typography>
            </Grid>
              
            
            <Grid item container xs={12} sm={10} md={8} spacing={2} justify="center" className={classes.gridMargin}>
              {requesterInfoSub.map((requesterInfoSub) => (requesterInfoSub.value ?
                <React.Fragment key={requesterInfoSub.name}>
                  <Grid item xs={12}>
                    <Typography className={classes.userInputTitle}><Text tid={`Quote.Group.${requesterInfoSub.name}`} /></Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className={classes.userInputValue}>{requesterInfoSub.value}</Typography>
                  </Grid>
                  <br></br>
                </React.Fragment>
                : null
              ))}
            </Grid>

            <>
              <Grid item container xs={12} sm={10} md={8} >
                <Grid item xs={12}>
                  {hasDuplicate(groupFormData.insuredPersons) &&
                    <Alert severity="warning">Duplicate employees detected, please review employee information.</Alert>
                  }
                </Grid>
                <Grid item xs={12}>
                  <Table className={classes.tableStyle} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right"><Text tid={`Quote.${'FirstName'}`} /></TableCell>
                        <TableCell align="right"><Text tid={`Quote.${'LastName'}`} /></TableCell>
                        <TableCell align="right"><Text tid={`Quote.${'BirthDate'}`} /></TableCell>
                        <TableCell align="right"><Text tid={`Quote.${'Gender'}`} /></TableCell>
                        <TableCell align="right"><Text tid={`Quote.${'Province'}`} /></TableCell>
                        <TableCell align="right"><Text tid={`Quote.Group.${'PlanType'}`} /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody >
                      {groupFormData.insuredPersons.map((insuredPerson) => (
                        <TableRow style={{height: '5vh'}} key={insuredPerson.key}>
                          <TableCell align="right" className={classes.tableCell}>{insuredPerson.firstName}</TableCell>
                          <TableCell align="right" className={classes.tableCell}>{insuredPerson.lastName}</TableCell>
                          <TableCell align="right" className={classes.tableCell}>{insuredPerson.birthDate.toString().slice(4,15)}</TableCell>
                          <TableCell align="right" className={classes.tableCell}><Text tid={`Quote.${insuredPerson.gender}`}/></TableCell>
                          <TableCell align="right" className={classes.tableCell}>{insuredPerson.province}</TableCell>
                          <TableCell align="right" className={classes.tableCell}>{insuredPerson.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </>
        </Grid>

        <Grid item container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Button
                // type='submit'
                // variant='contained'
                color="secondary" 
                className={classes.back_button}
                onClick={() => 
                  props.history.push(pathDirection(props.location.pathname, groupFormData).prevStep)
                }
              >
                <Text tid={'Button.Previous'}/>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Button
                // variant='contained'
                color="dark" 
                className={classes.next_button}
                // onClick={() => nextStep()}
                onClick={() => 
                  props.history.push(pathDirection(props.location.pathname, groupFormData).nextStep)
                }
              >
                {/* <Text tid={'Button.Continue'}/> */}
                <Text tid={'Button.RequestQuote'}/>
              </Button>
            </Grid>
        </Grid>

      </div>
    </>
  );
};

Review.propTypes = {
  groupFormData: PropTypes.object.isRequired,
};

export default Review;