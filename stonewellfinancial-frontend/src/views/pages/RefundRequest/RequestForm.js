import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import * as Validation from '../../Validation'
//redux
import {  useSelector, useDispatch } from 'react-redux';
import { getPlanDocument } from '../../../redux/actions/insurancePlans';
// core components 
import {
  Divider, Grid, Typography,
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField } from '../../../components/common/CustomTextFields/TextField';
import { SelectTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
import { Text } from '../../../components/common/LanguageProvider'
// icons
import GetAppIcon from '@material-ui/icons/GetApp'
// style
import formStyle from '../../../assets/jss/styles/formStyle';

const useStyles = makeStyles(formStyle)

const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  birthDate: null,
  insuranceCompany: '',
  insuranceType: '',
  policyNum: '',  
  //effectiveDate: null,
  refundFormFiles: null,
  reason: '',
  proofFiles: null, 
  sourceFrom: 'P'
}

const validationSchema = yup.object({
  firstName: Validation.validRequiredField(),
  lastName: Validation.validRequiredField(),
  email: Validation.validEmail(),
  birthDate: Validation.validRequiredDateField().nullable(),
  insuranceCompany: Validation.validRequiredField(),
  insuranceType: Validation.validRequiredField(),
  policyNum: Validation.validRequiredField(),
  //   effectiveDate: Validation.validRequiredDateField().nullable(),
  refundFormFiles: Validation.validRequiredChooseFile().nullable(),
  reason: Validation.validRequiredField().nullable(),
  proofFiles: Validation.validRequiredChooseFile().nullable(),
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


export default function RequestForm(props) {
  const { refundFormData, isSubmited} = props

  const classes = useStyles()
  const dispatch = useDispatch();
  const documents = useSelector(state => state.insurancePlanReducer.documents)

  const refundReasons = [
    {type: 'NOTCANADIAN', value: 'Return to Origin', desc: Text({tid:'Quote.Refund.Reason.ReturnToOrigin.Label'})},
    {type: 'NOTCANADIAN', value: 'GHIP', desc: Text({tid:'Quote.Refund.Reason.GHIP.Label'})},
    // {type: 'NOTCANADIAN', value: 'Others', desc:'Others'},
    {type: 'CANADIAN', value: 'Early Return', desc: Text({tid:'Quote.Refund.Reason.EarlyReturn.Label'})},
    {type: 'CANADIAN', value: 'Not Depart', desc: Text({tid:'Quote.Refund.Reason.NotDepart.Label'})}
    // {type: 'CANADIAN', value: 'Others', desc:'Others'}
]

  // useEffect
  useEffect(() => {
      dispatch(getPlanDocument())
  }, [dispatch]);
  
  const [notice, setNotice] = useState('')

  const [link, setLink] = useState('')
  const setDownloadForm = (company, type) => {

    const refundformList = documents.filter(f=>f.document_type === 'Refund')
    let docs = company && type 
                ? refundformList.filter(f=> (f.company_name=== company && f.insured_type === type.toUpperCase()))
                : []

    if (docs.length > 0){ 
        let url = docs.map(i=>i.documents.filter(f=> f.language==='EN').map(i=>i)[0].document_url)  
        setNotice('')
        setLink(process.env.REACT_APP_S3_URL+ url)
    }else{
        setNotice('We are preparing this Form. Please contact us.')
        setLink('')
    }
  }

  const handleSubmit = async (values) => {

    var reg = /(?:\.([^.]+))?$/;
    var today = new Date().toISOString().substring(2, 10).replace(/-/g, '')
    
    const formData = Object.keys(values).reduce((formData, key) => {
        formData.append(key, values[key])
        return formData
    }, new FormData())

    formData.delete('refundFormFiles')
    formData.append('UploadFiles', values.refundFormFiles, `${values.policyNum}-Refund_Request_Form-${values.firstName}_${values.lastName}-${today}.${reg.exec(values.refundFormFiles.name)[1]}`)

    formData.delete('proofFiles')
    formData.append('UploadFiles', values.proofFiles, `${values.policyNum}-Proof-${values.firstName}_${values.lastName}.${reg.exec(values.proofFiles.name)[1]}`)

    // for (let value of formData.entries()) {
    //   console.log(value)
    // }

    refundFormData(formData)
    isSubmited(true)
    
  }

  return (
    <div>

        <Typography variant="h2" align="center" className={classes.formTitle}>
        <Text tid={`Quote.${'Refund.Label'}`} />
        </Typography>

        <Grid item xs={12} style={{ marginBottom:'3vh' }}>
            <Alert severity="success">
                <AlertTitle><Text tid={`Quote.${'Refund.Desc.Label'}`} /></AlertTitle>
                <ul>
                    <li><Text tid={`Quote.${'Refund.Desc.ListTwo'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.ListThree'}`} /></li>
                </ul>
                <AlertTitle><Text tid={`Quote.${'Refund.Desc.Label2'}`} /></AlertTitle>
                <ul>
                    <li><Text tid={`Quote.${'Refund.Desc.List2Two'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List2Three'}`} /></li>
                </ul>
            </Alert>
            <Alert severity="info" style={{ marginTop:'1vh'}}>
                <AlertTitle><Text tid={`Quote.${'Refund.Desc.Label3'}`} /></AlertTitle>
                <ul>
                    <li><Text tid={`Quote.${'Refund.Desc.List3One'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List3Two'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List3Three'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List3Four'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List3Five'}`} /></li>
                    <li><Text tid={`Quote.${'Refund.Desc.List3Six'}`} /></li>
                </ul>
                <p style={{ fontSize:'12px'}}>*<Text tid={`Quote.${'Refund.Desc.List3Seven'}`} /></p>
            </Alert>
        </Grid>
 
        <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
            <Form>
                {/* {console.log(errors)} */}
                <Typography variant="h4" gutterBottom>
                    <Text tid={`Quote.${'Refund.InsuredInfo.Label'}`} />
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                    <RegularTextField
                        label={'Quote.FirstName'}
                        name="firstName"
                        value={values.firstName}
                        // onChange={handleChange}
                        onChange={(e) => {
                            setFieldValue(`firstName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                        }}
                        onBlur={handleBlur}
                    />
                    {validMessage('firstName')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <RegularTextField
                        label={'Quote.LastName'}
                        name="lastName"
                        value={values.lastName}
                        // onChange={handleChange}
                        onChange={(e) => {
                            setFieldValue(`lastName`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1).toLowerCase())
                        }}
                        onBlur={handleBlur}
                    />
                    {validMessage('lastName')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <label className={classes.inputLabel}><Text tid={'Quote.BirthDate'}/></label>
                    <KeyboardDatePickerField
                        name="birthDate"
                        value={values.birthDate}
                        style={{ width: '100%' }}
                        maxDate={new Date()}
                        onChange={(e) => {
                        setFieldValue('birthDate', e)
                        }}
                        onBlur={handleBlur}
                    />
                    {validMessage('birthDate')}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <RegularTextField
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={'Quote.EmailAddress'}
                    />
                    { validMessage('email') }
                    </Grid>
                    

                    <Grid item xs={12}>
                        <Divider style={{ margin: '16px 0' }}/>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={`Quote.${'Refund.InsuranceInfo.Label'}`} />
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <SelectTextField
                            label={'Quote.InsuranceCompany'}
                            name="insuranceCompany"
                            value={values.insuranceCompany}
                            // onChange={handleChange}
                            onChange={(e) => {
                                handleChange(e)
                                setDownloadForm(e.currentTarget.value, values.insuranceType)
                            }}
                            onBlur={handleBlur}
                            >
                            <option value="" hidden>Select</option>
                            <option value={'Allianz'}>Allianz</option>
                            <option value={'Tugo'}>Tugo</option>
                            <option value={'GMS'}>GMS</option>
                            <option value={'BlueCross'}>Blue Cross</option>
                        </SelectTextField>
                        {validMessage('insuranceCompany')}
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <SelectTextField
                            label={'Quote.InsuranceType'}
                            name="insuranceType"
                            value={values.insuranceType}
                            // onChange={handleChange}
                            onChange={(e) => {
                                handleChange(e)
                                setDownloadForm(values.insuranceCompany, e.currentTarget.value)
                                setFieldValue('reason','')
                            }}
                            onBlur={handleBlur}
                            >
                            <option value="" hidden>Select</option>
                            <option value={'Student'}>Student</option>
                            <option value={'Visitor'}>Visitor</option>
                            <option value={'Canadian'}>Canadian</option>
                        </SelectTextField>
                        {validMessage('insuranceType')}
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <RegularTextField
                            label="Policy Number"
                            name="policyNum"
                            value={values.policyNum}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {validMessage('policyNum')}
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                        <label className={classes.inputLabel}>Prior to the effective  date</label>
                        <KeyboardDatePickerField
                            name="effectiveDate"
                            value={values.effectiveDate}
                            style={{ width: '100%' }}
                            onChange={(e) => {
                            setFieldValue('effectiveDate', e)
                            }}
                            onBlur={handleBlur}
                        />
                        {validMessage('effectiveDate')}
                    </Grid> */}

                </Grid>

                {values.insuranceCompany && values.insuranceType ?
                <> 
                <Divider style={{ margin: '16px 0' }}/>
                <Typography variant="h4" gutterBottom style={{ marginTop:'5vh' }}>
                    1. <Text tid="Quote.Refund.CompanyForm.Label" />
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled = {values.insuranceCompany && values.insuranceType ? false : true}
                            startIcon={<GetAppIcon />}
                            target="_blank"
                            href={link}
                        >
                            Refund Request Form
                        </Button>                                
                    </Grid>

                    {values.insuranceCompany && values.insuranceType && notice &&     
                        <Grid item xs={12}>
                            <Alert severity='warning'>
                                {notice}
                            </Alert>
                        </Grid>
                    }

                    <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom style={{ margin:'2vh 0' }}>
                        2. <Text tid="Quote.Refund.CompanyForm.Select.File" />
                    </Typography>
                    <input
                        type="file"
                        name="refundFormFiles"
                        onChange={(e) => {
                            setFieldValue('refundFormFiles',e.currentTarget.files[0])
                        }}
                        />
                        {validMessage('refundFormFiles')}
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant="h4" gutterBottom  style={{ margin:'4vh 0 2vh 0' }}>
                            {/* <Text tid="Quote.Refund.Reason.Label" /> */}
                            3. <Text tid="Quote.Refund.Reason.Label" />
                        </Typography>
                        {/* <label className={classes.inputLabel}>The reason</label> */}
                        <SelectTextFieldSmall
                            name="reason"
                            value={values.reason}
                            onChange={handleChange}
                        >
                        <option value={0} hidden></option>
                            {refundReasons.filter(f=>f.type===(values.insuranceType.toUpperCase()==='CANADIAN'?'CANADIAN':'NOTCANADIAN'))
                            .map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.desc}
                                            </option>
                            ))}
                        </SelectTextFieldSmall>
                        {validMessage('reason')}
                    </Grid>                

                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom style={{ margin:'2vh 0' }}>
                            4. <Text tid="Quote.Refund.Reason.File.Label" />
                        </Typography>
                        {values.reason === 'Return to Origin' ?
                            <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.ReturnTicket" /></Alert>
                        :null}
                        {values.reason === 'GHIP' ?
                            <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.GHIP" /></Alert>
                        :null}
                        {values.reason === 'Early Return' ?
                            <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.EarlyReturn" /></Alert>
                        :null}
                        {values.reason === 'Not Depart' ?
                            <Alert severity="info" style={{ marginBottom:'2vh' }}><Text tid="Quote.Refund.Reason.NotDepart" /></Alert>
                        :null}
                        <input
                            type="file"
                            name="proofFiles"
                            onChange={(e) => {
                                setFieldValue('proofFiles', e.currentTarget.files[0])
                            }}
                        />
                        {validMessage('proofFiles')}
                    </Grid>

                </Grid>
                </> 
                :null}
                
                <div className={classes.textEnd}>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled ={values.insuranceCompany && values.insuranceType?false:true}
                        className={classes.button}
                        >
                        Submit
                    </Button>
                </div>
            </Form>
        )}
        </Formik>
 
    </div>
  )
}
