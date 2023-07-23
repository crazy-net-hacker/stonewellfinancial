import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Container, CssBaseline,
          Grid, Typography, TextField,
          // IconButton,
} from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'
import { Text } from '../../../../components/common/LanguageProvider' 
import SubmitResult from './SubmitResult'
// icon
import { GoFileSymlinkDirectory } from "react-icons/go";

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    padding: theme.spacing(1)
  },
  label: { 
    marginTop: theme.spacing(2),
    fontWeight:"700"
  },
  searchFileIcon: {
    color: blue[900],
    marginTop: theme.spacing(2),
    fontWeight:"1000"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3, 0, 2),
  },
}))

// formik
const validationSchema = Yup.object({
  app_status: Validation.validRequiredField(),
  insuredpersons: Yup.array().when("app_status", 
  { is: (value) => 
          value === 'Approved',
          then: Yup.array().of(
                  Yup.object().shape({
                      policyNo: Validation.validRequiredField().nullable(),
                      optionPlanPolicyNo: Yup.string().when(["compnayName","eligilbeIns","optionPlanPrice"], 
                        { is: (v_companyName, v_eligilbeIns, v_optionPlanPrice) => 
                                v_companyName === 'Allianz' && v_eligilbeIns === 'STUDENT' && v_optionPlanPrice > 0,
                          then: Validation.validRequiredField().nullable(),
                          otherwise: Yup.string().nullable()
                        }),
                      carewellPolicyNo: Yup.string().when("carewellServiceAmount", 
                        { is: (value) => 
                                value > 0,
                                then: Validation.validRequiredField().nullable(),
                                otherwise: Yup.string().nullable()
                        })
                  }))
  }),
  files: Yup.array().when("app_status", 
  { is: (value) => 
          value === 'Approved',
          then: Yup.array().of(
                  Yup.object().shape({
                    pdfFile: Yup.string().required('chooseFile').nullable(),
                  }))
  }),
  optionPlanFiles: Yup.array().when(["app_status","isOptionPlanPolicy"], 
  { is: (v_app_status, v_isOptionPlanPolicy) => 
          v_app_status === 'Approved' && v_isOptionPlanPolicy === true ,
    then: Yup.array().of(
            Yup.object().shape({
              pdfFile: Yup.string().required('chooseFile').nullable(),
            }))
  }),
  carewellFiles: Yup.array().when(["app_status","carewell_service_price"], 
  { is: (v_app_status, v_carewell_service_price) => 
          v_app_status === 'Approved' && v_carewell_service_price > 0,
    then: Yup.array().of(
            Yup.object().shape({
              pdfFile: Yup.string().required('chooseFile').nullable(),
          }))
  }),
  remark: Yup.string().when(["app_status","source_from"], 
  { is: (v_appStatus, v_sourceFrom) => 
        ((v_appStatus === 'Draft' &&  v_sourceFrom === 'V')|| v_appStatus === 'Void'),
    then : Validation.validRequiredField().nullable()
  }),
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


const ProcessUpdateModal = (props) => {
  // const { updateData, statusProcess, statusCodes, open, setOpen, onConfirm } = props
  const { updateData, statusCodes, user, open, setOpen, onConfirm } = props
  // console.log(props)
  // declaration
  const classes = useStyles()

  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')
  const [updateFormData, setUpdateFormData] = useState([])

  updateData[0].isOptionPlanPolicy = (updateData[0].insuredpersons.filter(f=> f.compnayName === 'Allianz'
                                                    && (f.eligilbeIns === 'STUDENT'||f.eligilbeIns ==='VISITOR') 
                                                    && f.optionPlanPrice >0).length) > 0 ? true: false
  
  const rowCount = 1 + (updateData[0].isOptionPlanPolicy===true?1:0) + (updateData[0].carewell_service_price>0?1:0);
  
  // formik - initialValues
  function initialValues(){
    const data = {
      ...updateData[0],
      files: [],
      optionPlanFiles: [],
      carewellFiles: [],
      remark: ''
    }
    return data
  }


  //
  function handleFiles(policyArray, files,  policyNo ){

    files = files.filter(f=> policyArray.indexOf(f.policyNo) !== -1 )

    if(policyNo && files.filter(f=> f.policyNo === policyNo).length === 0){
        files.push({
          policyNo: policyNo,
          pdfFile:''
        })
    }

    return(files)
  }

  // 
  const handleClose = () => {
    setOpen(false)
  }

  // 
  function handleUpdateResult(result){
    setSubmitted(false)
    setApplicationId()
    setUpdateFormData([])
    onConfirm(result)
    setOpen(false)
  }
  
  // handleSubmit
  const handleSubmit = async (values) => {
        // request update data to backend
        const formData = Object.keys(values).reduce((formData, key) => {
            formData.append(key, values[key])
            return formData
        }, new FormData())

        formData.delete('insuredpersons')
        formData.append('insuredpersons', JSON.stringify(values.insuredpersons))

        formData.delete('address')
        formData.append('address', JSON.stringify(values.address))

        formData.delete('payment')
        formData.append('payment', JSON.stringify(values.payment))

        formData.delete('files')
        values.files && values.files.forEach(file => {
          formData.append('UploadFiles', file.pdfFile, file.policyNo)
        });
        formData.delete('optionPlanFiles')
        values.optionPlanFiles && values.optionPlanFiles.forEach(file => {
          formData.append('UploadFiles', file.pdfFile, file.policyNo)
        });
        formData.delete('carewellFiles')
        values.carewellFiles && values.carewellFiles.forEach(file => {
          formData.append('UploadFiles', file.pdfFile, file.policyNo)
        });

        formData.append('userID', user)

        // for (let value of formData.entries()) {
        //     console.log(value)
        //   }

        setSubmitted(true)
        setUpdateFormData(formData)
        setApplicationId(values.application_id)
  }


  return (
    <>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        // onClose={handleClose}
        // maxWidth="md"
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Update Application - {updateData[0].application_id}
          </Typography>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            {`( ${updateData[0].vendor_name} )`}
          </Typography>
          {/* <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton> */}
        </MuiDialogTitle>

        <Container component="main" maxWidth="md">
          <CssBaseline />
          <div className={classes.paper}>

            <Formik
              initialValues={initialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                <Form className={classes.form}>
                  {/* {console.log('errors',errors)} */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* {updatedApplication.message} */}
                    </Grid>
                      <Grid item xs={3+(rowCount===2?1:0)}>
                          <Typography variant="subtitle1" component="div" className={classes.label}>
                            Process
                          </Typography>
                      </Grid>  
                      <Grid item xs={9-(rowCount===2?1:0)}>
                        <SelectTextField
                          name={`app_status`}
                          value={values.app_status}
                          // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                          onChange={(e) => {
                            handleChange(e)
                            if (e.currentTarget.value !== 'Approved'){
                              for (const i in values.insuredpersons) {
                                setFieldValue(`insuredpersons.${i}.policyNo`, '')
                              }
                            }
                          }}
                        >
                          <option value="" hidden>Select status </option>
                          {statusCodes.map((item) => (
                            <option key={item.code_name} value={item.code_name}
                            >
                              {item.code_desc}
                            </option>
                          ))}
                        </SelectTextField>
                        {validMessage('app_status') } 
                      </Grid>

                      {values.app_status ==='Approved'&&
                      <>
                        <Grid item xs={3+(rowCount===2?1:0)}>
                            <Typography variant="subtitle1" className={classes.label}>
                              Policy
                            </Typography>
                        </Grid>  
                        <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                            <Typography variant="subtitle1" className={classes.label}>
                              Main plan
                            </Typography>
                        </Grid> 
                        {values.isOptionPlanPolicy===true && 
                          <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                              <Typography variant="subtitle1" className={classes.label}>
                              Optional plan
                              </Typography>
                          </Grid>  
                        }
                        {values.carewell_service_price>0 && 
                          <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                              <Typography variant="subtitle1" className={classes.label}>
                              Carewell
                              </Typography>
                          </Grid>  
                        }
                        <Grid item container>
                          {values.insuredpersons.length > 0 && values.insuredpersons.map((person, index)=> (
                            <React.Fragment key={index}>
                              <Grid item xs={3+(rowCount===2?1:0)}>
                                <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh'}}>
                                  {`${person.firstName} ${person.lastName} `}
                                </Typography>
                              </Grid>  
                                <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                                    <RegularTextField
                                      name={`insuredpersons.${index}.policyNo`}
                                      defaultValue={values.insuredpersons[index].policyNo}
                                      // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                                      placeholder = 'Policy No.'
                                      onChange={handleChange}
                                      onBlur={()=>{
                                        const policyArray = []
                                        values.insuredpersons.map(i=>policyArray.push(i.policyNo))
                                        setFieldValue('files', handleFiles(policyArray, values.files, values.insuredpersons[index].policyNo))
                                      }}
                                    />
                                  {validMessage(`insuredpersons.${index}.policyNo`)}
                                </Grid>
                                {values.isOptionPlanPolicy===true &&
                                  <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                                    <RegularTextField
                                        name={`insuredpersons.${index}.optionPlanPolicyNo`}
                                        defaultValue={values.insuredpersons[index].optionPlanPolicyNo}
                                        // disabled = {((statusProcess === 'Pending' || statusProcess === 'Accepted')
                                        //               && (values.insuredpersons[index].compnayName === 'Allianz' && values.insuredpersons[index].eligilbeIns === 'STUDENT' && values.insuredpersons[index].optionPlanPrice > 0)
                                        //             )? false : true}
                                        disabled = {(values.insuredpersons[index].compnayName === 'Allianz' && values.insuredpersons[index].eligilbeIns === 'STUDENT' && values.insuredpersons[index].optionPlanPrice > 0)
                                                    ? false : true}
                                        placeholder = {(values.insuredpersons[index].compnayName === 'Allianz' && values.insuredpersons[index].eligilbeIns === 'STUDENT' && values.insuredpersons[index].optionPlanPrice > 0)?'Policy No.':'N/A'}
                                        onChange={handleChange}
                                        onBlur={()=>{
                                          const policyArray = []
                                          values.insuredpersons.map(i=>policyArray.push(i.optionPlanPolicyNo))
                                          setFieldValue('optionPlanFiles', handleFiles(policyArray, values.optionPlanFiles, values.insuredpersons[index].optionPlanPolicyNo))
                                        }}
                                      />
                                    {validMessage(`insuredpersons.${index}.optionPlanPolicyNo`)}
                                  </Grid>
                                }
                                {values.carewell_service_price>0 &&
                                  <Grid item xs={(9-(rowCount===2?1:0))/rowCount}>
                                    <RegularTextField
                                        name={`insuredpersons.${index}.carewellPolicyNo`}
                                        defaultValue={values.insuredpersons[index].carewellPolicyNo}
                                        // disabled = {((statusProcess === 'Pending' || statusProcess === 'Accepted')
                                        //                 && values.insuredpersons[index].carewellServiceAmount>0
                                        //             )? false : true}
                                        disabled = {(values.insuredpersons[index].carewellServiceAmount>0)
                                                      ? false : true}
                                        placeholder = {values.insuredpersons[index].carewellServiceAmount>0?'Policy No.':'N/A'}
                                        onChange={handleChange}
                                        onBlur={()=>{
                                          const policyArray = []
                                          values.insuredpersons.map(i=>policyArray.push(i.carewellPolicyNo))
                                          setFieldValue('carewellFiles', handleFiles(policyArray, values.carewellFiles, values.insuredpersons[index].carewellPolicyNo))
                                        }}
                                      />
                                    {validMessage(`insuredpersons.${index}.carewellPolicyNo`)}
                                  </Grid>
                                }
                            </React.Fragment>
                          ))}
                        </Grid>



                        {values.files.length > 0 &&(
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" className={classes.label}>
                              Upload PDF files
                            </Typography>
                            <FieldArray
                              name='files'
                              render={() => (
                                values.files.length > 0
                                  ? values.files.map((file, index) => (
                                    <div key={index}>
                                      <Grid item container>
                                        <Grid item xs={3+(rowCount===2?1:0)} >
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh'}}>
                                              {file.policyNo}
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={1}>
                                          <label htmlFor={`files.${index}.pdfFile`}>
                                              <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} />
                                          </label>  
                                          <input
                                            style={{display: 'none'}}
                                            id= {`files.${index}.pdfFile`}
                                            name={`files.${index}.pdfFile`}
                                            type="file"
                                            accept= {['application/pdf']}
                                            // accept= {['application/pdf','image/*']}
                                            onChange={(e) => {
                                              if(e.target.files.length === 0){
                                                // no target file
                                                setFieldValue(`files.${index}.pdfFile`, '')
                                              } else{
                                                // target file
                                                setFieldValue(`files.${index}.pdfFile`, e.target.files[0])
                                              }
                                            }}
                                            />
                                        </Grid>
                                        <Grid item xs={7-(rowCount===2?1:0)}>
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                            {values.files[index].pdfFile?values.files[index].pdfFile.name:''}
                                          </Typography>
                                          {validMessage(`files.${index}.pdfFile`)}
                                        </Grid>
                                        
                                      </Grid>
                                    </div>
                                    )) 
                                  : null
                              )}
                            />
                          </Grid>
                        )}

                        {values.optionPlanFiles.length > 0 &&(
                          <Grid item xs={12}>
                            <FieldArray
                              name='optionPlanFiles'
                              render={() => (
                                values.optionPlanFiles.length > 0
                                  ? values.optionPlanFiles.map((optionalFile, index) => (
                                    <div key={index}>
                                      <Grid item container>
                                        <Grid item xs={3+(rowCount===2?1:0)} >
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh'}}>
                                              {optionalFile.policyNo}
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={1}>
                                          <label htmlFor={`optionPlanFiles.${index}.pdfFile`}>
                                              <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} />
                                          </label>  
                                          <input
                                            style={{display: 'none'}}
                                            id= {`optionPlanFiles.${index}.pdfFile`}
                                            name={`optionPlanFiles.${index}.pdfFile`}
                                            type="file"
                                            accept= {['application/pdf']}
                                            // accept= {['application/pdf','image/*']}
                                            onChange={(e) => {
                                              if(e.target.files.length === 0){
                                                // no target file
                                                setFieldValue(`optionPlanFiles.${index}.pdfFile`, '')
                                              } else{
                                                // target file
                                                setFieldValue(`optionPlanFiles.${index}.pdfFile`, e.target.files[0])
                                              }
                                            }}
                                            />
                                        </Grid>
                                        <Grid item xs={7}>
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                            {values.optionPlanFiles[index].pdfFile?values.optionPlanFiles[index].pdfFile.name:''}
                                          </Typography>
                                          {validMessage(`optionPlanFiles.${index}.pdfFile`)}
                                        </Grid>
                                        
                                      </Grid>
                                    </div>
                                    )) 
                                  : null
                              )}
                            />
                          </Grid>
                        )}

                        {values.carewellFiles.length > 0 &&(
                          <Grid item xs={12}>
                            <FieldArray
                              name='carewellFiles'
                              render={() => (
                                values.carewellFiles.length > 0
                                  ? values.carewellFiles.map((carewellFile, index) => (
                                    <div key={index}>
                                      <Grid item container>
                                        <Grid item xs={3+(rowCount===2?1:0)} >
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh', paddingLeft:'1vh'}}>
                                              {carewellFile.policyNo}
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={1}>
                                          <label htmlFor={`carewellFiles.${index}.pdfFile`}>
                                              <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} />
                                          </label>  
                                          <input
                                            style={{display: 'none'}}
                                            id= {`carewellFiles.${index}.pdfFile`}
                                            name={`carewellFiles.${index}.pdfFile`}
                                            type="file"
                                            accept= {['application/pdf']}
                                            // accept= {['application/pdf','image/*']}
                                            onChange={(e) => {
                                              if(e.target.files.length === 0){
                                                // no target file
                                                setFieldValue(`carewellFiles.${index}.pdfFile`, '')
                                              } else{
                                                // target file
                                                setFieldValue(`carewellFiles.${index}.pdfFile`, e.target.files[0])
                                              }
                                            }}
                                            />
                                        </Grid>
                                        <Grid item xs={7-(rowCount===2?1:0)}>
                                          <Typography variant="subtitle1" style={{paddingTop:'2vh'}}>
                                            {values.carewellFiles[index].pdfFile?values.carewellFiles[index].pdfFile.name:''}
                                          </Typography>
                                          {validMessage(`carewellFiles.${index}.pdfFile`)}
                                        </Grid>
                                        
                                      </Grid>
                                    </div>
                                    )) 
                                  : null
                              )}
                            />
                          </Grid>
                        )}

                      </>
                      }

                      {((values.app_status ==='Draft'&& values.source_from ==='V') ||
                          values.app_status ==='Approved' ||
                          values.app_status ==='Void') &&
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" className={classes.label}>
                            Remark
                          </Typography>
                          <TextField
                            name="remark"
                            value={values.remark}
                            multiline
                            variant="filled"
                            rows={5}
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {validMessage('remark') } 
                        </Grid>
                      }


                  </Grid>
                  
                  {submitted === false &&
                    <div className={classes.submitArea}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '2vh' }}
                        className={classes.submit}
                        // disabled = {(statusProcess === 'Pending' || statusProcess === 'Accepted')? false : true}
                      >
                        Update
                        {/* <Text tid={'Button.Save'}/> */}
                      </Button>
                      <Button
                        color="secondary"
                        className={classes.submit}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                        {/* <Text tid={'Button.Close'}/> */}
                      </Button>
                    </div>
                  }

                </Form>
              )}
            </Formik>

            {submitted === true && applicationId &&
              <SubmitResult
                id={applicationId}
                updateFormData={updateFormData}
                result = {handleUpdateResult}
              />
            }

          </div>
        </Container>
      </Dialog>
    </>
  )
}

export default ProcessUpdateModal