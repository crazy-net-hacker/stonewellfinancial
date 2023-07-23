import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
// core components
import { Grid, makeStyles, Typography, Checkbox} from '@material-ui/core'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
//common components
import { Text } from '../../../../components/common/LanguageProvider';
import Button from '../../../../components/common/CustomButtons/Button'
import RenewalURLModal from './RenewalURLModal';
// icons
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)

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


const RenewApplicants = ({
    renewFormData, setRenewFormData, setFormData, originData, userRole, nextStep, handleClose
}) => {
  const classes = useStyles()

  const [renewableURL, setRenewableURL] = useState(false); 
  const [openRenewableURL, setOpenRenewableURL] = useState(false); 

  const [renewableData, setRenewableData] = useState([]); 

    // handleSubmit
  const handleSubmit = async (values) => {
    // (past) original data
    setRenewFormData(values)
    // (will be applied) repurchase data
    const repurchaseData =  Object.assign({}, values);
    repurchaseData.insuredPersons= [];
    repurchaseData.insuredPersons = values.insuredPersons.filter(person => person.renewalInsurance === true);
    //reset relationship if primary insured is not selected  
    if(repurchaseData.insuredPersons){
      if(!repurchaseData.insuredPersons[0].relationship || 
          repurchaseData.insuredPersons[0].relationship !== 'Primary' ||
          repurchaseData.insuredPersons.filter(f=>f.relationship === 'Primary').length>1){
        repurchaseData.insuredPersons.map((i,index)=>(i.relationship = (index===0?'Primary':'')))
      }
    };
    setFormData(repurchaseData)

    if (renewableURL===false){
      setRenewableData([])
      nextStep(values)
    }else{
      setOpenRenewableURL(true)  
      setRenewableData(repurchaseData)
    };

  }

  
  return (
    <>
      <div><Text tid={'Vendor.Repurchase.SelectApplicant'} /></div>
      <Formik
        initialValues={renewFormData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={classes.form} style={{ width:'100%' }}>
            <Grid container spacing={2}>

              <Grid item container>
                {values.insuredPersons.map((person, index)=> (
                  <React.Fragment key={index}>
                      <Grid item xs={12}>
                        <Checkbox
                            name={`insuredPersons.${index}.renewalInsurance`}
                            // checked={person.repurchase?true:false}
                            checked={person.renewalInsurance}
                            size="small"
                            icon={<CircleUnchecked />}
                            checkedIcon={<CircleCheckedFilled />}
                            onChange={ (e) => {
                              values.insuredPersons[index].renewalInsurance = e.target.checked
                              setFieldValue(`insuredPersons.${index}.renewalInsurance`,e.target.checked)
                              
                              const insured_num = values.insuredPersons.filter(f=>f.renewalInsurance===true).length
                              values.insuredNumber = insured_num
                              setFieldValue(`insuredNumber`,insured_num)

                            }}
                        />
                          <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh', display:'inline-block'}}>
                          {`${person.firstName} ${person.lastName} `}
                          </Typography>
                      </Grid>
                  </React.Fragment>
                ))}
                <div style={{ display: 'none' }}> 
                  {values.insuredNumber}
                </div>
                {validMessage(`insuredNumber`)}
              </Grid>

            </Grid>
            
            {/* Continue  Button */}
            <Grid container style={{ margin: '5vh 0 5vh 0' }} spacing={1}
                  className={classes.textEnd} >
              {/* Continue  Button */}
              <Grid item xs={4} sm={4} md={3} lg={3}>
                  <Button 
                      type='submit' 
                      color="dark" 
                      className={classes.next_button} 
                      onClick={()=>{setRenewableURL(false)}}
                  >
                      <Text tid={'Button.Next'} />
                  </Button>
              </Grid>

              {userRole==='ADM'&&
                <Grid item xs={4} sm={4} md={3} lg={3}>
                    <Button 
                        type='submit' 
                        color="secondary" 
                        className={classes.next_button} 
                        onClick={()=>{setRenewableURL(true)}}
                    >
                        Get Manual Form URL
                    </Button>
                </Grid>
              }
              <Grid item xs={4} sm={4} md={3} lg={3}>
                  <Button 
                      color="secondary" 
                      className={classes.next_button} 
                      onClick={()=>{handleClose(false)}}
                  >
                      Close
                  </Button>
              </Grid>
            </Grid>

          </Form>
        )}
      </Formik>

      {openRenewableURL === true &&
          <RenewalURLModal
              data={renewableData}
              originData={originData}
              open = {openRenewableURL}
              setOpen = {setOpenRenewableURL}
          /> 
        }
    </>

  )}

  RenewApplicants.propTypes = {
  renewFormData: PropTypes.object.isRequired,
  setRenewFormData: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  // prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
}
export default RenewApplicants
