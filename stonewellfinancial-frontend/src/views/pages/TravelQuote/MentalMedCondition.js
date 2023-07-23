import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// style
import formStyle from '../../../assets/jss/styles/formStyle';
// core components
import { Grid, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Formik, Form } from 'formik';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { Alert, AlertTitle } from '@material-ui/lab';
import { Text } from '../../../components/common/LanguageProvider';
//
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';

//Style
const useStyles = makeStyles(formStyle)

// export default () => {
const MentalMedCondition = (props) => {
    const { formData } = props;

    const classes = useStyles();
    const [direction, setDirection] = useState('back');

    let height = document.getElementById('header') ? document.getElementById('header').clientHeight : 0

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
    
    let isMobile = (width <= 767);
  
    return (
        <>
        <StepHeader height={height} activeStep={1} data={formData} />

        <Formik
            initialValues={formData}
            // validationSchema={validationSchema}
            onSubmit={values => {
                window.scrollTo(0, 0)
                props.updateFormData(values);
                direction === 'back' 
                    ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    : props.history.push(pathDirection(props.location.pathname, values).nextStep);            
            }}
        >
        {({ values, handleChange, setFieldValue }) => (

            <Form className={classes.formWrapper}>
                <Grid container spacing={2} justify="center">
                
                    <Grid item container justify="center" className={classes.input_box}>
                        <Grid item xs={12} sm={10} md={10} lg={8} xl={6} style={{ marginBottom:'5vh' }}>
                            <Typography variant="h5" gutterBottom className={classes.title_question}>
                                <span className={classes.title_question_sub}> <Text tid={'Quote.LetsFindBestPlan'}/></span>
                                    <Text tid={'Quote.MentalityConditionQuestion'}/>
                            </Typography>
                            <Alert severity="info">
                                <AlertTitle><Text tid={'Quote.WhyNeedsMentalBenefits'}/></AlertTitle>
                                <Text tid={'Quote.ReasonOfNeedMentalBenefits'}/>
                            </Alert>
                        </Grid>

                        {values.insuredPersons && values.insuredPersons.length > 0 && (
                            values.insuredPersons.map((insuredPerson, i) => (
                                <Grid container justify="center" spacing={3} key={i} style={{ marginBottom:'0' }}>
                                    <Grid item xs={6} md={6}>
                                        <Typography variant="h5" className={classes.name_label}>
                                            {insuredPerson.lastName + ', ' + insuredPerson.firstName}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={6}>
                                        <ToggleButtonGroup
                                            value={insuredPerson.mentalIllness}
                                            exclusive
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                insuredPerson.mentalIllness = val
                                                setFieldValue(`insuredPersons.${i}.mentalIllness`, val)
                                            }}
                                            style={{ width: !isMobile ? '15vw' : '30vw' }}
                                        >
                                            <ToggleButton value={true} className={classes.toggleButton}>
                                                <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false} className={classes.toggleButton}>
                                                <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {/* {validMessage(`insuredPersons.${index}.mentalIllness`)} */}
                                    </Grid>
                                </Grid>
                            ))
                        )}
                    </Grid>

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
            </Form>

        )}

        </Formik>


        </>

    );

};

// ProtoTypes
MentalMedCondition.propTypes = {
  formData: PropTypes.object.isRequired
};

export default MentalMedCondition;