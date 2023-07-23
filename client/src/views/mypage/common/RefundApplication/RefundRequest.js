import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
//redux
import { useSelector, useDispatch } from 'react-redux';
import { postRefundRequest } from '../../../../redux/actions/refundAction';
// form and validation
import { Formik, Form, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
import { Grid, Typography, makeStyles } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
// Common components
import Button from '../../../../components/common/CustomButtons/Button'
import { Text } from '../../../../components/common/LanguageProvider'
import { SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
// icons
import { GoFileSymlinkDirectory } from "react-icons/go";
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

// const current = new Date()
const refundReasons = [
  {type: 'NOTCANADIAN', value: 'Return to Origin', desc:'I have returned permanently to your home country.'},
  {type: 'NOTCANADIAN', value: 'GHIP', desc:'I become eligible and covered under a provincial or territorial government health care plan.'},
  {type: 'NOTCANADIAN', value: 'Others', desc:'Others'},
  {type: 'CANADIAN', value: 'Early Return', desc:'You return earlier from your trip'},
  {type: 'CANADIAN', value: 'Not Depart', desc:'You have not started your trip'},
  {type: 'CANADIAN', value: 'Others', desc:'Others'}
]
// valication Schema
const validationSchema = Yup.object(
  {
    refundFormFiles: Yup.array().of(
                      Yup.object().shape({
                        file: Yup.string().required('chooseFile').nullable(),
                      })),
    reason: Validation.validRequiredField(),
    proofFiles: Yup.array().of(
                      Yup.object().shape({
                        file: Yup.string().required('chooseFile').nullable(),
                      }))      
  }
)

// ValidMessage
function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => (
        <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}> 
          <Text tid={`Validation.${msg}`}></Text>
        </div>
      )}
    />
  )
}

const useStyles = makeStyles(vendorFormStyle)
const RefundRequest = (props) => {
  const { formData, setFormData, prevStep, handleClose, onConfirm} = props

  const classes = useStyles()
  const dispatch = useDispatch()
  const result = useSelector(state => state.refundReducer.result)
  const loading = useSelector(state => state.refundReducer.loading)
  const error = useSelector(state => state.refundReducer.error)


  const [direction, setDirection] = useState('back')

  const [submit, setSubmit] = useState(false);

  // group by insuranceCompany, policyNum for uploading refund request form files
  var obj = Object.create(null)
  formData.refundFormFiles = [];
  formData.insuredPersons.forEach(function (o) {
      var key = ['insuranceCompany', 'policyNum'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = { insuranceCompany: o.insuranceCompany, policyNum: o.policyNum, file: '' };
          formData.refundFormFiles.push(obj[key]);
      }
  });

    // group by insuranceCompany, policyNum for uploading refund request form files
    formData.proofFiles = [];
    formData.proofFiles = formData.insuredPersons.map(p=> { 
      return{
        firstName : p.firstName,
        lastName : p.lastName,
        policyNum: p.policyNum,
        file: ''
      }
    })


  const handleSubmit = async (values) => {
    // request update data to backend
    const formData = Object.keys(values).reduce((formData, key) => {
        formData.append(key, values[key])
        return formData
    }, new FormData())

    var reg = /(?:\.([^.]+))?$/;
    var today = new Date().toISOString().substring(2, 10).replace(/-/g, '')

    values.insuredPersons.map(i=> i.requiredFiles = [])

    formData.delete('refundFormFiles')
    values.refundFormFiles && values.refundFormFiles.forEach(fromFile => {
      formData.append('UploadFiles', fromFile.file, `${fromFile.policyNum}-Refund_Request_Form-${today}.${reg.exec(fromFile.file.name)[1]}`)
      values.insuredPersons.filter(f=>f.policyNum === fromFile.policyNum).map(i=> i.requiredFiles.push(`Refund/${fromFile.policyNum}-Refund_Request_Form-${today}.${reg.exec(fromFile.file.name)[1]}`))
    });

    formData.delete('proofFiles')
    values.proofFiles && values.proofFiles.forEach(proofFile => {
      formData.append('UploadFiles', proofFile.file, `${proofFile.policyNum}-Proof-${proofFile.firstName}_${proofFile.lastName}.${reg.exec(proofFile.file.name)[1]}`)
      values.insuredPersons.filter(f=>f.firstName === proofFile.firstName && f.lastName === proofFile.lastName).map(i=> i.requiredFiles.push(`Refund/${proofFile.policyNum}-Proof-${proofFile.firstName}_${proofFile.lastName}.${reg.exec(proofFile.file.name)[1]}`))
    });

    formData.delete('insuredPersons')
    formData.append('insuredPersons', JSON.stringify(values.insuredPersons))

    // for (let value of formData.entries()) {
    //   console.log(value)
    // }

    setSubmit(true)
    dispatch(postRefundRequest(formData))

  }


  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          direction === 'back' ? prevStep() : handleSubmit(values)
        }}
      >
        {({ values, handleChange, setFieldValue, setFieldTouched, errors }) => ( 
          <Form style={{ width:'100%' }}>
          {/* <Form > */}
            {/* {console.log('errors', errors)} */}

            {/* Upload Refund Request Form Files here */}
            {values.refundFormFiles.length > 0 &&(
              <Grid item xs={12} style={{margin:'2vh 0'}}>
                <Typography variant="h4" gutterBottom >
                    <Text tid="Quote.Refund.CompanyForm.Select.File" />
                </Typography>
                <FieldArray
                  name='refundFormFiles'
                  render={() => (
                    values.refundFormFiles.length > 0
                      ? values.refundFormFiles.sort((a,b)=> a.insuranceCompany - b.insuranceCompany).map((file, index) => (
                        <div key={index}>
                          <Grid item container style={{paddingTop:'2vh'}} >
                            <Grid item xs={5} >
                              <Typography variant="subtitle1" style={{paddingLeft:'1vh'}} >
                                {file.insuranceCompany}
                              </Typography>
                              <Typography variant="subtitle1" style={{paddingLeft:'1vh', fontSize:'12px'}} >
                                {file.policyNum}
                              </Typography>
                            </Grid>

                            <Grid item xs={1} style={{paddingTop:'2vh'}}>
                              <label htmlFor={`refundFormFiles.${index}.file`}>
                                  <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} />
                              </label>  
                              <input
                                style={{display: 'none'}}
                                id= {`refundFormFiles.${index}.file`}
                                name={`refundFormFiles.${index}.file`}
                                type="file"
                                // accept= {['application/pdf']}
                                onChange={(e) => {
                                  if(e.currentTarget.files.length === 0){
                                    // no target file
                                    setFieldValue(`refundFormFiles.${index}.file`, '')
                                  } else{
                                    // target file
                                    setFieldValue(`refundFormFiles.${index}.file`, e.currentTarget.files[0])
                                  }
                                }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                {values.refundFormFiles[index].file?values.refundFormFiles[index].file.name:''}
                              </Typography>
                              {validMessage(`refundFormFiles.${index}.file`)}
                            </Grid>
                            
                          </Grid>
                        </div>
                        )) 
                      : null
                  )}
                />
              </Grid>
            )}
            
            {/* Reason  */}
            <Grid item xs={12} sm={12} style={{ margin:'2vh 0', paddingTop:'4vh' }}>
                <Typography variant="h4" gutterBottom >
                    <Text tid="Quote.Refund.Reason.Label" />
                </Typography>
                <SelectTextFieldSmall
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                >
                  <option value={0} hidden></option>
                    {refundReasons.filter(f=>f.type===(values.insuranceType==='CANADIAN'?'CANADIAN':'NOTCANADIAN'))
                      .map((item) => (
                                      <option key={item.value} value={item.value}>
                                          {item.desc}
                                        </option>
                    ))}
                </SelectTextFieldSmall>
                {validMessage('reason')}
            </Grid>

            {/* Upload Proof File here */}
            <Grid item xs={12} >
              <Typography variant="h4" gutterBottom style={{ margin:'2vh 0', paddingTop:'2vh' }}>
                <Text tid="Quote.Refund.Reason.File.Label" />
              </Typography>
              {values.reason === 'Return to Origin' ?
                  <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.ReturnTicket" /></Alert>
              :null}
              {values.reason === 'GHIP' ?
                  <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.GHIP" /></Alert>
              :null}
            </Grid>

            {/* Upload Request Form here */}
            <Grid item xs={12}>
              <FieldArray
                name='files'
                render={() => (
                    <Grid item container>
                        {values.insuredPersons.map((person, index) => (
                          <Grid item container key={index} style={{paddingTop:'1vh'}}>
                              <Grid item xs={5}>
                                {/* <Typography variant="subtitle1" style={{ paddingLeft:'1vh'}}>
                                    {person.firstName} {person.lastName}
                                </Typography> */}
                                <Typography variant="subtitle1" style={{paddingLeft:'1vh'}}>
                                      {person.firstName} {person.lastName}
                                    </Typography>
                                    <Typography variant="subtitle1" style={{paddingLeft:'1vh', fontSize:'12px'}}>
                                      {person.insuranceCompany}
                                    </Typography>
                                    <Typography variant="subtitle1" style={{paddingLeft:'1vh', fontSize:'12px'}}>
                                      {person.planName} - {person.policyNum}
                                    </Typography>
                              </Grid>
                              <Grid item xs={1} style={{paddingTop:'1vh'}} >
                                <label htmlFor={`proofFiles.${index}.file`}>
                                    <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} />
                                </label>  
                                <input
                                  style={{display: 'none'}}
                                  id= {`proofFiles.${index}.file`}
                                  name={`proofFiles.${index}.file`}
                                  type="file"
                                  // accept= {['application/pdf']}
                                  onChange={(e) => {
                                    if (!values.reason){setFieldTouched(`reason`)}
                                    
                                    if(e.currentTarget.files.length === 0){
                                      // no target file
                                      setFieldValue(`proofFiles.${index}.file`, '')
                                    } else{
                                      // target file
                                      setFieldValue(`proofFiles.${index}.file`, e.currentTarget.files[0])
                                    }
                                  }}
                                  />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="subtitle1" style={{paddingTop:'1vh'}}>
                                  {values.proofFiles[index].file?values.proofFiles[index].file.name:''}
                                </Typography>
                                {validMessage(`proofFiles.${index}.file`)}
                              </Grid>
                          </Grid>
                        ))}

                    </Grid>
                )}
              />
            </Grid>

            {submit===true&& !error && !loading && result && result.status && (
              <Alert severity={result.status} style={{ marginTop: '2vh' }}>    
                <AlertTitle>{result.status}</AlertTitle>
                  {result.message}
              </Alert>
            )}

            {submit===true && result && result.status === 'success' &&
                <div className={classes.textEnd}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>{
                      onConfirm(result.status)
                      handleClose()
                    }}
                  >
                    Okay
                  </Button>
                </div>
            } 

            {/* Continue  Button */}
            {!(submit===true && result && result.status === 'success') && 
            <Grid item container style={{ margin: '5vh 0 5vh 0' }} spacing={1} className={classes.textEnd} >
                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        // type="submit" 
                        color="secondary" 
                        className={classes.back_button} 
                        onClick={() => { 
                          setFormData(values)
                          setDirection('back')
                          prevStep()
                        }}
                    >
                        <Text tid={'Button.Previous'}/>
                    </Button>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        type='submit' 
                        // disabled = {values.eligilbeAgrement===true?false:true}
                        color="dark" 
                        className={classes.next_button} 
                        onClick={() => {
                          setDirection('forward')
                        }}
                    >
                        <Text tid={'Button.Apply'} />
                    </Button>
                  </Grid>
              
            </Grid>
          }

          </Form>
            
        )}
      </Formik>

    </>
    
  )
}

// ProtoTypes
RefundRequest.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  // nextStep: PropTypes.func.isRequired,
}
export default RefundRequest
