import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation';
// core components
import { Grid, Typography,} from '@material-ui/core';
// common components
import MetaTags from '../../../components/common/MetaTags';
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

// 
const HealthPlan = [
  { code: 'Basic', desc: 'Basic' },
  { code: 'Standard', desc: 'Standard' },
  { code: 'Enhanced', desc: 'Enhanced' }
]
const DentalPlan = [
  { code: 'Basic', desc: 'Basic' },
  { code: 'Standard', desc: 'Standard' },
  { code: 'Enhanced', desc: 'Enhanced' }
]
const Paramedical = [
  { code: 'Basic', desc: 'Basic' },
  { code: 'Standard', desc: 'Standard' },
  { code: 'Enhanced', desc: 'Enhanced' }
]
const PrescriptionDrug = [
  { code: 'Basic', desc: 'Basic' },
  { code: 'Standard', desc: 'Standard' },
  { code: 'Enhanced', desc: 'Enhanced' }
]
const GlassAndEyeExam = [
  { code: 'Basic', desc: 'Basic' },
  { code: 'Standard', desc: 'Standard' },
  { code: 'Enhanced', desc: 'Enhanced' }
]

const AddOn = [
  { code: 'Yes', desc: 'Included' },
  { code: 'No', desc: 'Not included' },
]


const ProductForm = (props) => {
  const { match, groupFormData } = props;

  const metaData = {
    title: 'Meta.GroupBenefits.Quote.Title',
    description: 'Meta.GroupBenefits.Quote.Description',
    canonical: match.url
  }   

  const classes = useStyles();

  // validation
  let validationSchema = Yup.object({
    healthPlan: Validation.validRequiredField(),
    dentalPlan: Validation.validRequiredField(),
    paramedical: Validation.validRequiredField(),
    prescriptionDrug: Validation.validRequiredField(),
    visionPlan: Validation.validRequiredField(),
  })

  validationSchema = validationSchema.test('atLeastOne', null, (obj) => {
    if ((obj.longTermDisability === true) || (obj.shortTermDisability === true) || (obj.criticalIllnessInsurance === true) || (obj.groupRRSPandDPSP === true) || (obj.groupTFSA === true)) {
      return true
    }
    // return new Yup.ValidationError('Please select at least one', null, 'GroupTFSA')
    return new Yup.ValidationError('Please select at least one', null)
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

  return (
    <>
      <MetaTags data={metaData} />
      <QuoteBanner2 title={'Quote.GroupIns.Title'} subTitle={'Quote.GroupIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={1} />

      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.Group.CustomizeInsurance'}/>
      </Typography>

      
      <Formik
        initialValues={groupFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          // console.log(values)
          props.updateGroupFormData(values);
          props.history.push(pathDirection(props.location.pathname, values).nextStep);
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
          <Form className={classes.formWrapper}>
            <Grid container justify="center" spacing={2}>

              <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2}>
                <Grid item container  xs={12} sm={10} md={10}>
                  <Typography variant='h5' className={classes.inputPaddingTitle} >
                    {/* <Text tid={'Quote.PersonalInfomation'}/> */}
                    <div>
                      <span className={classes.grayLine}></span>
                    </div>
                    Main
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Group.HealthPlan'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="healthPlan"
                        value={values.healthPlan}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`healthPlan`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`healthPlan`)}
                    >
                      {HealthPlan.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage('healthPlan')}
                </Grid>


                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Group.DentalPlan'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="dentalPlan"
                        value={values.dentalPlan}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`dentalPlan`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`dentalPlan`)}
                    >
                      {DentalPlan.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage('dentalPlan')}
                </Grid>


                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Group.Paramedical'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="paramedical"
                        value={values.paramedical}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`paramedical`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`paramedical`)}
                    >
                      {Paramedical.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage('paramedical')}
                </Grid>


              </Grid>

              <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2}>

                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Group.PrescriptionDrug'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="prescriptionDrug"
                        value={values.prescriptionDrug}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`prescriptionDrug`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`prescriptionDrug`)}
                    >
                      {PrescriptionDrug.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage('prescriptionDrug')}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6, marginTop: 15 }}><Text tid={'Quote.Group.GlassEyeExam'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="visionPlan"
                        value={values.visionPlan}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`visionPlan`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`visionPlan`)}
                    >
                      {GlassAndEyeExam.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {validMessage('visionPlan')}
                </Grid>

              </Grid>

              <Grid item container  xs={12} sm={10} md={10} lg={8} style={{ marginTop:'3vh'}} spacing={2} >

                <Grid item container  xs={12} sm={10} md={10}>
                  <Typography variant='h5' className={classes.inputPaddingTitle} >
                    {/* <Text tid={'Quote.PersonalInfomation'}/> */}
                    <div>
                      <span className={classes.grayLine}></span>
                    </div>
                    Add On
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6}}><Text tid={'Quote.Group.LongTermDisability'}/></Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="longTermDisability"
                        value={values.longTermDisability}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`longTermDisability`, e.currentTarget.value)
                        }}
                        // onBlur={() => setFieldTouched(`longTermDisability`)}
                    >
                      {AddOn.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {/* {validMessage('longTermDisability')} */}
                </Grid>


                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6}}> 
                      <Text tid={'Quote.Group.ShortTermDisability'}/> 
                      </Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="shortTermDisability"
                        value={values.shortTermDisability}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`shortTermDisability`, e.currentTarget.value)
                          // console.log(values)
                        }}
                        // onBlur={() => setFieldTouched(`ShortTermDisability`)}
                    >
                      {AddOn.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {/* {validMessage('ShortTermDisability')} */}
                </Grid>


                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6}}>  <Text tid={'Quote.Group.CriticalIllnessInsurance'}/> </Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="criticalIllnessInsurance"
                        value={values.criticalIllnessInsurance}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`criticalIllnessInsurance`, e.currentTarget.value)
                        }}
                        // onBlur={() => setFieldTouched(`criticalIllnessInsurance`)}
                    >
                      {AddOn.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {/* {validMessage('criticalIllnessInsurance')} */}
                </Grid>

                
              </Grid>

              <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6}}>  <Text tid={'Quote.Group.GroupRRSPandDPSP'}/> </Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="groupRRSPandDPSP"
                        value={values.groupRRSPandDPSP}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`groupRRSPandDPSP`, e.currentTarget.value)
                        }}
                        // onBlur={() => setFieldTouched(`groupRRSPandDPSP`)}
                    >
                      {AddOn.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {/* {validMessage('GroupRRSPandDPSP')} */}
                </Grid>


                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <Typography style={{marginBottom: 4, marginLeft: 6}}> <Text tid={'Quote.Group.GroupTFSA'}/> </Typography>
                    
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        name="groupTFSA"
                        value={values.groupTFSA}
                        exclusive
                        onChange={(e) => {
                          setFieldValue(`groupTFSA`, e.currentTarget.value)
                        }}
                        onBlur={() => setFieldTouched(`groupTFSA`)}
                    >
                      {AddOn.map((item) => (
                        <ToggleButton key={item.code} value={item.code} className={classes.toggleButton}>
                          {item.desc}
                        </ToggleButton>
                      ))} 
                    </ToggleButtonGroup>
                    {/* {validMessage('groupTFSA')} */}
                </Grid>

              </Grid>
            </Grid>

            <Grid item container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
              <Grid item xs={6} sm={4}>
                {/* <div className={classes.textEnd}> */}
                  <Button
                    type='submit'
                    // variant='contained'
                    color="dark" 
                    className={classes.next_button}
                  >
                    <Text tid={'Button.Next'}/>
                  </Button>
                {/* </div> */}
              </Grid>

            </Grid>

          </Form>
        )}
      </Formik>

    </>
  );
};


// ProtoTypes
ProductForm.propTypes = {
  groupFormData: PropTypes.object.isRequired,
};

export default ProductForm;
