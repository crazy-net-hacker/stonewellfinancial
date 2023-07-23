import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as Validation from '../../Validation';
// core components
import { Grid, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers';
import { Text } from '../../../components/common/LanguageProvider';
// controllers
import { CalculateAge } from '../../../controllers/CalculateValue'
// style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)


// Validation
const validationSchema = Yup.object({
    insuredPersons: Yup.array().of(
        Yup.object().shape({
            // lastName: Validation.validRequiredField(),
            lastName: Yup.string().when("relationship", 
            { is: (value) => 
                    value === 'Primary',
                    then: Validation.validRequiredField()
            }),
            // firstName: Validation.validRequiredField(),
            firstName: Yup.string().when("relationship", 
            { is: (value) => 
                    value === 'Primary',
                    then: Validation.validRequiredField()
            }),
            // gender: Validation.validRequiredField(),
            gender: Yup.string().when("relationship", 
            { is: (value) => 
                    value === 'Primary',
                    then: Validation.validRequiredField()
            }),            
            // birthDate: Validation.validRequiredDateField(),
            birthDate: Yup.date().nullable().when("relationship", 
            { is: (value) => 
                    value === 'Primary',
                    then: Validation.validRequiredBrithDateField() //생년월일은 과거의 날짜 이어야 합니다.
            }),
            // beneficiaryName: Yup.string().when("relationship",
            // { is: (value) => 
            //         value === 'Primary',
            //         then: Validation.validRequiredField()
            // }),
            // beneficiaryRelationship: Yup.string().when("relationship",
            // { is: (value) => 
            //         value === 'Primary',
            //         then: Validation.validRequiredField()
            // })
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


const PersonalInfoForm = (props) => {
    const { formData } = props;

    const classes = useStyles();
    const [direction, setDirection] = useState('back');

    let height = '0px'

    return (
        <>
        <StepHeader height={height} activeStep={1} data={formData} />
        
        <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={values => {
                window.scrollTo(0, 0)
                // for quote, not required about physicalCard Fee
                values.insuredPersons[0].physicalCard = false
                props.updateFormData(values);
                direction === 'back' 
                    ? props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    : props.history.push(pathDirection(props.location.pathname, values).nextStep);             }}
        >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, setTouched, errors }) => (

        <Form className={classes.formWrapper}>
            <Grid container spacing={0} justify='center'>        
            {/* {console.log(errors)} */}
                <Grid item container xs={12} sm={12} md={12} lg={8} xl={7}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom className={classes.title_question}>
                            <Text tid={'Quote.TellUsAboutYou'}/>
                        </Typography>
                    </Grid>

                    <Grid item container>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <RegularTextField
                                // label='First name'
                                label= {'Quote.FirstName'}
                                name={`insuredPersons.${0}.firstName`}
                                value={values.insuredPersons[0].firstName}
                                onChange={(e) => {
                                    setFieldValue(`insuredPersons.${0}.firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                }}
                                onBlur={handleBlur}
                            />
                            {validMessage(`insuredPersons.${0}.firstName`)}

                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <RegularTextField
                                label= {'Quote.LastName'}
                                name={`insuredPersons.${0}.lastName`}
                                value={values.insuredPersons[0].lastName}
                                onChange={(e) => {
                                    setFieldValue(`insuredPersons.${0}.lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                                }}
                                onBlur={handleBlur}
                            />
                            {validMessage(`insuredPersons.${0}.lastName`)}
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={4} >
                                <label className={classes.inputLabel}><Text tid={'Quote.Gender'}/></label>
                                <ToggleButtonGroup
                                    className={classes.toggleButtonGroup}
                                    name={`insuredPersons.${0}.gender`}
                                    value={values.insuredPersons[0].gender}
                                    exclusive
                                    onChange={(e) => {
                                        setFieldValue(`insuredPersons.${0}.gender`, e.currentTarget.value)
                                    }}
                                    onBlur={() => setFieldTouched(`insuredPersons.${0}.gender`)}
                                >
                                    <ToggleButton id='male' value="Male" className={classes.toggleButton}>
                                        <Text tid={'Quote.Male'}/>
                                    </ToggleButton>
                                    <ToggleButton id='female' value="Female" className={classes.toggleButton}>
                                        <Text tid={'Quote.Female'}/>
                                </ToggleButton>
                                </ToggleButtonGroup>
                                {validMessage(`insuredPersons.${0}.gender`)}
                        </Grid>
                    </Grid>

                    <Grid item container>
                        <Grid item xs={12} sm={6} md={6} lg={4} container className={classes.textFieldWrapper}>
                            <label className={classes.inputLabel}><Text tid={'Quote.BirthDate'}/></label>
                            <KeyboardDatePickerField
                                name={`insuredPersons.${0}.birthDate`}
                                value={values.insuredPersons[0].birthDate}
                                style={{ width: '100%' }}
                                maxDate={new Date()}
                                onChange={(e) => {
                                    values.insuredPersons[0].birthDate = e
                                    setFieldValue(`insuredPersons.${0}.birthDate`, e)
                                    setFieldValue(`insuredPersons.${0}.age`, CalculateAge(e))
                                }}
                                onBlur={handleBlur}
                            /> 
                            {validMessage(`insuredPersons.${0}.birthDate`)}
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} container className={classes.textFieldWrapper}>
                            <RegularTextField
                                label = {'Quote.Age'}
                                name={`age`}
                                value={values.insuredPersons[0].age}
                                disabled={true}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Years</InputAdornment>, // 10살
                                }}
                            />
                        </Grid>

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

            </Grid>
        </Form>

        )}

        </Formik>


        </>
    );

};

// ProtoTypes
PersonalInfoForm.propTypes = {
  formData: PropTypes.object.isRequired
};

export default PersonalInfoForm;