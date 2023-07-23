import React from 'react'
import { PropTypes } from 'prop-types'
// core components
import { Grid, makeStyles, Typography, Checkbox} from '@material-ui/core'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
//common components
import { Text } from '../../../../components/common/LanguageProvider';
import Button from '../../../../components/common/CustomButtons/Button'
import { dateFormat } from '../../../../controllers/dataFormat';
// icons
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)

const RefundApplicants = ({
    refundFormData, setRefundFormData, setFormData, nextStep
}) => {
  const classes = useStyles()

  // formik
  const validationSchema = Yup.object({
    insuredNumber: Validation.validRequiredNumberMin1Field(),
  })
    
  // ValidMessage
  function validMessage(fieldName){
      return(
          <ErrorMessage
          name= {fieldName}
          render={(msg) => 
          <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
              <Text tid={`Validation.${msg}`}></Text>
          </div>
          }
          />
      );
  }

  
    // handleSubmit
  const handleSubmit = async (values) => {
    // (past) original data
    setRefundFormData(values)
    // (will be requested) refund data
    const refundData =  Object.assign({}, values)
    refundData.insuredPersons= []
    refundData.insuredPersons = values.insuredPersons.filter(f => f.refundRequested===true)

    setFormData(refundData)

    nextStep(values)
  }


  return (
    <>
      <div><Text tid={'Vendor.Refund.SelectApplicant'} /></div>
      <Formik
        initialValues={refundFormData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className={classes.form} style={{ width:'100%' }}>
            <Grid container spacing={2}>

              <Grid item container>
                {values.insuredPersons.map((person, index)=> (
                  <React.Fragment key={index}>
                        <Grid item xs={12}>
                          <Checkbox
                              name={`insuredPersons.${index}.refundRequested`}
                              checked={person.refundRequested}
                              size="small"
                              icon={<CircleUnchecked />}
                              checkedIcon={<CircleCheckedFilled />}
                              onChange={ (e) => {
                                values.insuredPersons[index].refundRequested = e.target.checked
                                setFieldValue(`insuredPersons.${index}.refundRequested`,e.target.checked)

                                const insured_num = values.insuredPersons.filter(f=>f.refundRequested===true).length
                                values.insuredNumber = insured_num
                                setFieldValue(`insuredNumber`,insured_num)
                              }}
                          />
                            <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh', display:'inline-block'}}>
                            {`${person.firstName} ${person.lastName}`} ({dateFormat(new Date(person.birthDate))})
                            </Typography>
                        </Grid>
                  </React.Fragment>
                ))}
                {/* <div style={{ display: 'none' }}> 
                  {values.insuredNumber}
                </div> */}
                {validMessage(`insuredNumber`)}
              </Grid>
            </Grid>

            {/* Continue  Button */}
            <Grid container style={{ margin: '5vh 0 5vh 0' }} spacing={1}
                  className={classes.textEnd} >
              <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Button 
                      type='submit' 
                      color="dark" 
                      className={classes.next_button} 
                  >
                      <Text tid={'Button.Next'} />
                  </Button>
              </Grid>
            </Grid>

          </Form>
        )}
      </Formik>
    </>

  )}

  RefundApplicants.propTypes = {
  refundFormData: PropTypes.object.isRequired,
  setRefundFormData: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  // prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
}
export default RefundApplicants
