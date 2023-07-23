import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
// form and validation
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
//
import { Grid, Typography, FormControlLabel, Checkbox } from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InputMask from 'react-input-mask'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button';
import { Text } from '../../../../components/common/LanguageProvider';
// import { RegularTextField, RegularTextFieldSmall } from '../../../../components/common/CustomTextFields/TextField';
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall';
// functionalities
import { amountFormat } from '../../../../controllers/dataFormat';
import { textLineBreak } from '../../../../functionalities/TextFormat'
import { branchAddress } from '../../../../functionalities/Codes';
//
import MuiPhoneInput from 'material-ui-phone-number'
// icons
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import GetAppIcon from '@material-ui/icons/GetApp'
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import { FaNotesMedical } from "react-icons/fa";
// import { GoFileSymlinkDirectory } from "react-icons/go";
import UploadFileIcon from '@mui/icons-material/UploadFile';
//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// const useStyles = makeStyles(dashboardStyles)
const useStyles = makeStyles((theme) => ({
  ...dashboardStyles,
  searchFileIcon: {
    color: blue[900],
    marginTop: theme.spacing(0),
    fontWeight:"600"
  },
}))

const provinces = [
      {province_code:'AB',	province_name: 'Alberta'},
      {province_code:'BC',	province_name: 'British Columbia'},
      {province_code:'MB',	province_name: 'Manitoba'},
      {province_code:'NB',	province_name: 'New Brunswick'},
      {province_code:'NL',	province_name: 'Newfoundland and Labrador'},
      {province_code:'NT',	province_name: 'Northwest Territories'},
      {province_code:'NS',	province_name: 'Nova Scotia'},
      {province_code:'NU',	province_name: 'Nunavut'},
      {province_code:'ON',	province_name: 'Ontario'},
      {province_code:'PE',	province_name: 'Prince Edward Island'},
      {province_code:'QC',	province_name: 'Quebec'},
      {province_code:'SK',	province_name: 'Saskatchewan'},
      {province_code:'YT',	province_name: 'Yukon Territory'},
]

//
const languages = [
  { code: 'en', name: 'English'},
  { code: 'fr', name: 'French'},
  { code: 'ko', name: 'Korean'},
  { code: 'ar', name: 'Arabic'},
  { code: 'yue', name: 'Cantonese'},
  { code: 'ch_s', name: 'Chinese(Simplified)'},
  { code: 'ch_t', name: 'Chinese(Traditional)'},
  { code: 'de', name: 'German'},
  { code: 'es', name: 'Spanish'},
  { code: 'fa', name: 'Persian'},
  { code: 'ja', name: 'Japanese'},
  { code: 'pt_br', name: 'Portuguese(Brazil)'},
  { code: 'vi', name: 'Vietnamese'},
  ]


// valication Schema
const validationSchema = Yup.object(
  {
    contactPhone: Yup.string().nullable().when("updateTarget", 
    { is: (value) => value === 'contact',
            then: Validation.validPhoneNumber()
    }),
    contactEmail: Yup.string().nullable().when("updateTarget", 
    { is: (value) => value === 'contact',
            then: Validation.validEmail()
    }),
    mailStreetName: Yup.string().when("updateTarget", 
    { is: (value) => value === 'address',
            then: Validation.validRequiredField()
    }),
    mailCity: Yup.string().when("updateTarget", 
    { is: (value) => value === 'address',
            then: Validation.validRequiredField()
    }),
    mailProvince: Yup.string().when("updateTarget", 
    { is: (value) => value === 'address',
            then: Validation.validRequiredField()
    }),
    mailPostalCode: Yup.string().when("updateTarget", 
    { is: (value) => value === 'address',
            then: Validation.validPostalCode()
    }),
    numOfReUploadedFiles: Yup.number().when("updateTarget", 
    { is: (value) => value === 'upload',
            then: Validation.validRequiredNumberField().min(1, 'choosePolicyToReUpload')
    }),  
    files: Yup.array().when("updateTarget", 
    { is: (value) => value === 'upload',
            then: Yup.array().of(
                    Yup.object().shape({
                      pdfFile: Yup.string().when("policySelected", 
                      { is: (value) => 
                              value === true,
                              then: Yup.string().required('chooseFile').nullable(),
                      })
                    }))
    })  
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

// 
export const ViewDetail = ({vendorID, clickedData, url, sourceFrom, selectedRow, getDocument, getFiles, updateContact, sendApprovedConfirmationEmail}) => {

  // Mailling adress
  const maillAddress = clickedData.address.filter(f=>f.useType==='Mailling')[0]

  const classes = useStyles();

  const [targetEditUploadMode, setTargetEditUploadMode] = useState('')
  const [directPaymentURL, setDirectPaymentURL] = useState('')

  const initialValues = {
    application_id : clickedData.application_id,
    applicationDate: clickedData.app_date,
    sourceFrom: clickedData.source_from,
    preferLanguage: clickedData.prefer_language,
    contactPersons : clickedData.insuredpersons[0]? clickedData.insuredpersons.map(i=>{return{firstName:i.firstName, lastName: i.lastName, birthdate: i.birthdate}}):[],
    phoneInCanada: clickedData&&clickedData.is_canada_phone===null ? '' : clickedData.is_canada_phone,
    contactPhone: clickedData?clickedData.phone:'',
    contactEmail: clickedData?clickedData.email:'',
    maillingInCanada: clickedData?clickedData.mailling_in:'',
    mailUnitApartmentNo: maillAddress?maillAddress.suiteNo:'',
    mailStreetName: maillAddress?maillAddress.street:'',
    mailCity: maillAddress?maillAddress.city:'',
    mailProvince: maillAddress?maillAddress.province:'',
    mailPostalCode: maillAddress?maillAddress.postalcode:'',
    numOfReUploadedFiles: 0,
    files: [],
    updateTarget: '',
  }
  // console.log(clickedData)
  //on edit/upload mode
  const editUploadModeButton = (values, setFieldValue) => {
    return(
      <Grid container style={{ marginTop: '2px' }} justify="flex-end" spacing={2} >
      <Grid item >
        <Button 
          color="secondary" 
          style={{ border:'0', background:'#fff' }}
          onClick={(e) => {
            setTargetEditUploadMode('')
            if(values.updateTarget==='language'){
              values.preferLanguage = clickedData.prefer_language
              setFieldValue(`preferLanguage`,clickedData.prefer_language)
            }else if(values.updateTarget==='contact'){
              values.phoneInCanada = clickedData.is_canada_phone
              values.contactPhone =  clickedData.phone
              values.contactEmail = clickedData.email
              setFieldValue(`phoneInCanada`,clickedData.is_canada_phone)
              setFieldValue(`contactEmail`,clickedData.email)
            }else if(values.updateTarget==='address'){
              values.mailUnitApartmentNo = maillAddress?maillAddress.suiteNo:''
              values.mailStreetName = maillAddress?maillAddress.street:''
              values.mailCity = maillAddress?maillAddress.city:''
              values.mailProvince = maillAddress?maillAddress.province:''
              values.mailPostalCode = maillAddress?maillAddress.postalcode:''
              setFieldValue(`mailPostalCode`,maillAddress?maillAddress.postalcode:'')
            } else if(values.updateTarget==='upload'){
              values.files = []
              setFieldValue('files',[])
            }
          }}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item >
        <Button 
          type='submit' 
          color="dark"
        >
          {values.updateTarget==='upload'?'Upload':'Save'}
        </Button>
      </Grid>
      
    </Grid>
    )
  }


  // viewPolicyButton
  const viewPolicyButton = (policyNo, selectedRow) => {
    return(
      <Grid item xs={12}>
        <span style={{ marginRight:'10px' }}><Text tid={'Vendor.Application.Declaration'} /></span>
        <IconButton aria-label="view" color="primary"
          style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
          onClick={(e) => {
            getDocument('view', 'Policy/'+policyNo+'.pdf', selectedRow)
          }}
          >
            <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}>
              <DescriptionIcon style={{ height:'18px' }} /> 
              <Text tid={'Vendor.Application.ViewDeclaration'} />
            </span>
        </IconButton>
        <IconButton aria-label="view" color="primary"
          style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
          onClick={() => {
            getDocument('download','Policy/'+policyNo+'.pdf', selectedRow)
          }}
          >
            <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid' }}>
              <GetAppIcon style={{ height:'18px' }}/> <Text tid={'Vendor.Application.DownloadDeclaration'} />
            </span>
        </IconButton>
      </Grid>
    )
  }
  

  return (
    <Grid container>
      <Grid item container xs={12} className={classes.sectionWrapper}  spacing={1}>
              
        <Grid item container xs={12} sm={12} md={12} lg={9}>
          {clickedData.insuredpersons.map(row => (
            <div key={row.insuredPersonID} style={{ marginBottom:'2vh'}}>                      

              <Grid item container spacing={1}>

                <Grid item container>
                  <Grid item container style={{ border:'1px solid #ddd', height:'fit-content' }}>
                    <Grid item container style={{ background:'#efefef', padding:'1vh', fontWeight:'700' }}>
                      <PersonIcon/> {row.lastName}, {row.firstName}
                    </Grid>
                    <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12} sm={12} md={4} lg={4}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.FullName'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.lastName}, {row.firstName}</span>
                        </Grid>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.Gender'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.gender}</span>
                        </Grid>
                      </Grid>

                      <Grid item container xs={12} sm={12} md={4} lg={4}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.BirthDate'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.birthdate}</span>
                        </Grid>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.Age'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.age}</span>
                        </Grid>
                      </Grid>

                      <Grid item container xs={12} sm={12} md={4} lg={4}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.Step.TripPurpose'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.travelType}</span>
                        </Grid>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={ row.tripArrivalDate < new Date()?'Quote.HomeCountryOfResidenceBefore':'Quote.HomeCountryOfResidence'}/></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{row.originCountry}</span>
                        </Grid>
                        {row.originCountryCode === 'CA' 
                          ?
                            <>
                              <Grid item xs={5}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.OriginProvince'} /></span>
                              </Grid>
                              <Grid item xs={7}>
                                <span style={{ fontWeight:'700' }}>{row.originProvince}</span>
                              </Grid>
                            </>
                          :null
                        }
                        {row.graduatedDate 
                          ?
                            <>
                              <Grid item xs={5}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.GraduatedDate'} /></span>
                              </Grid>
                              <Grid item xs={7}>
                                <span style={{ fontWeight:'700' }}>{row.graduatedDate}</span>
                              </Grid>
                            </>
                          :null
                        }
                      </Grid>
                      
                    </Grid>

                    {/* Insurance */}
                    <Grid item container style={{ border:'1px solid #ddd', margin:'1vh' }}>
                        <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                          <Grid item xs={12} sm={12} md={8}>
                            <ArticleIcon/> {`${row.compnayName} ${row.planName}`} 
                          </Grid>
                          {clickedData.renewal &&
                            <Grid item xs={12} sm={12} md={4} style={{ textAlign:'right' }}>
                              <span className={classes.inputValue} style={{ color:"#8cc63f", fontSize:'14px' }}>{row.renewalInsurance===true?'Repurchased':'New'}</span>
                            </Grid>
                          }
                        </Grid>
                        <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500', background:'#DAE3F3' }}>
                          {row.policyNo &&
                            <Grid item container style={{ marginBottom:'2vh' }}>
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ alignSelf:'center' }}>
                                <Grid item xs={5}>
                                  <span style={{ color:'#666' }}><Text tid={'Quote.PolicyNumber'} /></span>
                                </Grid>
                                <Grid item xs={7}>
                                  <span style={{ fontWeight:'700' }}>{row.policyNo}</span>
                                </Grid>
                              </Grid>
                          
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ alignSelf:'center' }}>
                                <Grid item xs={5}>
                                  <span style={{ color:'#666' }}><Text tid={'Vendor.Step1.ApplicationDate'} /></span>
                                </Grid>
                                <Grid item xs={7}>
                                  <span style={{ fontWeight:'700' }}>{clickedData.app_date}</span>
                                </Grid>
                              </Grid>
                              
                              {(sourceFrom !== 'ZCRM' || (sourceFrom === 'ZCRM' && clickedData.app_date>'2022-07-31')) &&
                                <Grid item container xs={12} sm={12} md={4} lg={4}>
                                    {viewPolicyButton(row.policyNo, selectedRow)}
                                </Grid>
                              }
                            </Grid>
                          }

                          <Grid item container>
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content'}}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Dashboard.ApplicationSummary.BenefitDetail'} /></span> 
                                </Grid>
                                <Grid item container>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'TravelApplication.Coverage'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{amountFormat(row.coverage, 0)}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.Deductible'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(row.deductible)),2)}</span>
                                  </Grid>
                                  {row.tripType === "MULTI" ?
                                  <>
                                    <Grid item xs={7}>
                                      <span style={{ color:'#666' }}><Text tid={'TravelApplication.MultiDays'} /></span>
                                    </Grid>
                                    <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{row.multiTripDays}</span>
                                    </Grid>
                                    </>
                                  :null}
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{amountFormat(row.insuranceAmount, 2)}</span>
                                  </Grid>
                                </Grid>
                                {/* Optional Plan */}
                                <Grid item container style={{ padding:'1vh 0' }}>
                                    {row.optionPlanPolicyNo &&
                                    <>
                                      <Grid item xs={7}>
                                      <span style={{ color:'#666' }}> Option <Text tid={'Quote.PolicyNumber'} /></span>
                                      </Grid>
                                      <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{row.optionPlanPolicyNo}</span>
                                      </Grid>
                                      {viewPolicyButton(row.optionPlanPolicyNo, selectedRow)}
                                    </>
                                    }  
                                </Grid>
                                
                                {sourceFrom !== 'ZCRM' && row.optionPlan.map((op, index)=>(
                                  <Grid item container key={index} style={{ marginBottom:'1vh' }}>

                                      <Grid item xs={7}>
                                        <span style={{ color:'#666' }}>{op.optionPlanName}</span>
                                      </Grid>
                                      <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{amountFormat(op.optionPlanCoverage, 0)}</span>
                                      </Grid>
                                      <Grid item xs={7}>
                                        <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                                      </Grid>
                                      <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(op.optionPlanPrice)),2)}</span>
                                      </Grid>
                                  </Grid>
                                ))}
                              </Grid>

                              {/* Insurance Period */}
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content'}}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Dashboard.ApplicationSummary.InsurancePeriod'} /></span> 
                                </Grid>
                                <Grid item container>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'TravelApplication.Destination'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.destCountry}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'TravelApplication.DestinationState'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.destProvince}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.TripArrivalDate'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.arrivalDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.TripStartDate'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.tripStartDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.TripEndDate'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.tripEndDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.CoverageDays'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.tripPeriod} <Text tid={'Quote.Days'}/></span>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {/* beneficiary */}
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content'}}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Quote.Beneficiary'} /></span> 
                                </Grid>
                                <Grid item container>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.BeneficiaryName'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.beneficiaryName}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.Relationship'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.beneficiaryRelationship}</span>
                                  </Grid>
                                </Grid>
                              </Grid>

                            {/* Carewell */}
                            <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content'}}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Vendor.Step4.CarewellSelection'} /></span> 
                                </Grid>
                              {row.carewellService
                                ?                                  
                                  <Grid item container>
                                    {row.carewellPolicyNo &&
                                      <>
                                      <Grid item xs={7}>
                                        <span style={{ color:'#666' }}> Carewell <Text tid={'Quote.PolicyNumber'} /></span>
                                      </Grid>
                                      <Grid item xs={5}>
                                        <span style={{ fontWeight:'700' }}>{row.carewellPolicyNo}</span>
                                      </Grid>
                                      {viewPolicyButton(row.carewellPolicyNo, selectedRow)}
                                      </>
                                    }
                                    <Grid item xs={7}>
                                      <span style={{ color:'#666' }}><Text tid={'Vendor.Step4.SelectedPlan'} /></span>
                                    </Grid>
                                    <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{row.carewellService}</span>
                                    </Grid>
                                    <Grid item xs={7}>
                                      <span style={{ color:'#666' }}><Text tid={'Vendor.Step4.Fee'} /></span>
                                    </Grid>
                                    <Grid item xs={5}>
                                      <span style={{ fontWeight:'700' }}>{amountFormat(row.carewellServiceAmount,2)}</span>
                                    </Grid>
                                  </Grid>
                                : <span><Text tid={'Vendor.Step3.NotSelected'}/></span>
                              }
                            </Grid>

                            {/* Medical Questions */}
                            {row.medicalAnswer && row.medicalAnswer.length > 0 &&(
                              <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content'}}>
                                  <Grid item container style={{ marginBottom:'1vh' }}>
                                    <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Quote.MedicalQuestionnaire.Check'} /></span> 
                                  </Grid>
                                  <Grid item container>  
                                    <Grid item xs={12}>
                                        <Button
                                          color={'primary'}
                                          onClick={() => 
                                            window.open(`${url}/med-questionnire?app_id=${clickedData.application_id}&insured_id=${row.insuredPersonID}&insurance=${row.compnayName}&type=${row.eligilbeIns}`, '_blank')
                                          }
                                        >
                                        <FaNotesMedical/>
                                      </Button>
                                    </Grid>
                                  </Grid>
                              </Grid>
                            )}

                            {/* Empty for design purpose */}
                            {/* {row.medicalAnswer.length < 0 ?
                              <Grid item container xs={12} sm={12} md={12} lg={12} style={{ height:'fit-content'}}>                                            
                              </Grid>
                              :
                              <Grid item container xs={12} sm={12} md={12} lg={12} style={{ height:'fit-content'}}>                                            
                              </Grid>
                            } */}

                            {/* Insurance Card issue */}
                            <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content' }}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Quote.WalletCard'} /></span> 
                                </Grid>
                                <Grid item container>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'Quote.PhysicalCard.Issue'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>
                                      { row.insuranceCardIssue === true ?
                                        <Text tid={'Button.Yes'} /> : <Text tid={'Button.No'} />}
                                    </span>
                                  </Grid>
                                  <Grid item xs={7}>
                                          <span style={{ color:'#666' }}><Text tid={'TravelApplication.PhysicalCardDate'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.insuranceCardDeliveryDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <span style={{ color:'#666' }}><Text tid={'TravelApplication.PhysicalCardFee'} /></span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.insuranceCardFee}</span>
                                  </Grid>
                                </Grid>
                            </Grid>

                            {/* <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content' }}>
                            </Grid> */}

                            {row.refundRequestDate && 
                            <Grid item container xs={12} sm={12} md={4} lg={4} style={{ height:'fit-content', color:'#FF3333'}}>
                                <Grid item container style={{ marginBottom:'1vh' }}>
                                  {/* <span style={{ fontWeight:'700', borderBottom:'1px solid' }}><Text tid={'Quote.'} /></span>  */}
                                  {row.refunded
                                    ? <span style={{ fontWeight:'700', borderBottom:'1px solid' }}> Refunded  ({row.refunded})</span>
                                    : <span style={{ fontWeight:'700', borderBottom:'1px solid' }}> Refund {'(Processing...)'}</span>
                                  }
                                </Grid>
                                <Grid item container>
                                  <Grid item xs={7}>
                                          {/* <span style={{ color:'#666' }}><Text tid={''} /></span> */}
                                          <span> Refund request date </span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.refundRequestDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                    {/* <span style={{ color:'#666' }}><Text tid={'Quote.'} /></span> */}
                                    <span> Refund reason </span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>
                                      {row.refundReason}
                                    </span>
                                  </Grid>
                                  <Grid item xs={7}>
                                          {/* <span style={{ color:'#666' }}><Text tid={''} /></span> */}
                                          <span> Refund date </span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.refundDate}</span>
                                  </Grid>
                                  <Grid item xs={7}>
                                          {/* <span style={{ color:'#666' }}><Text tid={''} /></span> */}
                                          <span> Refund amount </span>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <span style={{ fontWeight:'700' }}>{row.refundAmount?amountFormat(row.refundAmount,2):null}</span>
                                  </Grid>
                                </Grid>
                            </Grid>
                            }

                            <Grid item container style={{ padding:'5px', background:'#fff', marginTop:'2vh'}}>
                                <span style={{ color:'#666', marginRight:'5px' }}><Text tid={'Quote.TotalPaymentAmount'} /></span>
                                <span className={classes.inputValue} style={{ color:"#8cc63f" }}>{amountFormat(row.insuranceAmount+row.carewellServiceAmount+row.optionPlanPrice,2)}</span>
                            </Grid>  

                            
                          </Grid>

                        </Grid>
                    </Grid>

                  </Grid>
                </Grid>                         
                  
            </Grid>

            </div>
          
          ))}
        </Grid>

        <Grid item container xs={12} sm={12} md={12} lg={3} style={{ alignSelf:'baseline' }}>
            
            {/* Confirmation Email History only for Admin' user */}
            {vendorID === '*' &&
              <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', marginBottom:'5px' }}>
                  <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                    Confirmation Email History
                    {/* only can be sent by Admin's user */}
                    <IconButton aria-label="edit" variant="outlined" color="primary" 
                          style={{ borderRadius:'0', padding:'0', margin:'0px 5px'}} 
                          disabled = {clickedData.source_from==='Z' || clickedData.app_status!=='Approved'?true:false}
                          onClick={() => sendApprovedConfirmationEmail(clickedData.application_id, selectedRow)}
                        >
                          <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                            Send email
                          </span>
                    </IconButton>
                  </Grid>
                  <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      {clickedData.email_history.length>0&&
                        clickedData.email_history.filter(f=>f.contentType ==='ApprovedConfirmation')
                                                  .sort((a,b)=> new Date(b.emailedAt) - new Date(a.emailedAt))
                                                  .map((eh, ehIndex)=>
                          <Grid item container key ={ehIndex}>
                            <Grid item xs={4}>
                              <span style={{ fontWeight:'700' }}>{eh.emailedAt}</span>
                            </Grid>
                            <Grid item xs={8}>
                              <span style={{ fontWeight:'700' }}>{eh.emailedBy}</span>
                            </Grid>
                          </Grid>
                        )}
                  </Grid>
              </Grid>
            }
            {/* Policy Email History */}
            <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', marginBottom:'5px' }}>
                <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                  Policy Email History
                  {/* only can be sent by vendor's user */}
                  <IconButton aria-label="edit" variant="outlined" color="primary" 
                        style={{ borderRadius:'0', padding:'0', margin:'0px 5px'}} 
                        disabled = {clickedData.source_from==='Z' || clickedData.app_status!=='Approved'?true:false}
                        onClick={() => {
                          // console.log('clickedData',clickedData)
                          const policyList = [] 
                          clickedData.insuredpersons.map(i=> policyList.push(i.policyNo+'.pdf'))
                          clickedData.insuredpersons.filter(f=>f.optionPlanPolicyNo).map(i=> policyList.push(i.optionPlanPolicyNo+'.pdf'))
                          clickedData.insuredpersons.filter(f=>f.carewellPolicyNo).map(i=> policyList.push(i.carewellPolicyNo+'.pdf'))
                          const uniquePolicyList = Array.from(new Set(policyList))
                          getFiles('Policy', uniquePolicyList,  clickedData.email, clickedData.application_id, selectedRow, clickedData.vendor_email)
                        }}
                      >
                        <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                          Send email
                        </span>
                  </IconButton>
                </Grid>
                <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                    {clickedData.email_history.length>0&&
                      clickedData.email_history.filter(f=>f.contentType ==='Policy')
                                                .sort((a,b)=> new Date(b.emailedAt) - new Date(a.emailedAt))
                                                .map((eh, ehIndex)=>
                        <Grid item container key ={ehIndex}>
                          <Grid item xs={4}>
                            <span style={{ fontWeight:'700' }}>{eh.emailedAt}</span>
                          </Grid>
                          <Grid item xs={8}>
                            <span style={{ fontWeight:'700' }}>{eh.emailedBy}</span>
                          </Grid>
                        </Grid>
                      )}
                </Grid>
            </Grid>
            
            {/* update policy declaration / Contact info  */}
            <Grid item container>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => {
                  if (values.updateTarget==='upload'){
                    // request update data to backend
                    const formData = new FormData()
                    values.files && values.files.forEach(file => {
                      if(file.pdfFile){
                        formData.append('UploadFiles', file.pdfFile, file.policyNo)
                      }
                    });
                    // for (let value of formData.entries()) {
                    //   console.log(value)
                    // }
                    updateContact(values.updateTarget, formData, selectedRow)
                  }else{
                    updateContact(values.updateTarget, values, selectedRow)
                  }
                }}
                
              >
                {({ values, handleChange, handleBlur, setFieldValue, errors }) => (
                    <Form style={{ width:'100%' }}>
                      {/* {console.log(errors)} */}

                      {/* prefer language */}
                      <Grid item container style={{ border:'1px solid #ddd', margin:'1vh 0', height:'fit-content'}}>
                        <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                          Language 
                          {targetEditUploadMode !=='language'&&
                            <span style={{fontWeight:'700', marginLeft:'1vh', marginRight: '1vh', }}>{`${values.preferLanguage} `}</span>
                          }
                          {values.sourceFrom !== 'Z' && clickedData.insuredpersons[0] && !targetEditUploadMode && 
                              <IconButton aria-label="edit" variant="outlined" color="primary" 
                                style={{ borderRadius:'0', padding:'0', margin:'0px 5px' }} 
                                onClick={() => {
                                  setFieldValue(`updateTarget`,'language')
                                  setTargetEditUploadMode('language')
                                }}
                              >
                                <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                                  Edit
                                </span>
                              </IconButton>
                          }
                        </Grid>
                        {targetEditUploadMode ==='language' &&
                        <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                          <Grid item xs={12}>
                            <SelectTextFieldSmall
                              name={`preferLanguage`}
                              value={values.preferLanguage}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {languages.map((item) => (
                                  <option key={item.code} value={item.code}>
                                      {item.name}
                                  </option>
                              ))}
                            </SelectTextFieldSmall>
                          </Grid>
                          {targetEditUploadMode ==='language' &&
                            editUploadModeButton(values, setFieldValue)
                          }
                        </Grid>
                        }
                      </Grid>

                      {/* policy declaration only admin */}
                      {clickedData.insuredpersons[0] && clickedData.insuredpersons[0].policyNo && vendorID === '*' && 
                        clickedData.insuredpersons.filter(f=>f.tripEndDate > new Date().toISOString().split('T')).length>0 && 
                        <Grid item container style={{ border:'1px solid #ddd', margin:'1vh 0', height:'fit-content'  }}>
                          <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                            <Text tid={'Vendor.Application.Declaration'} />
                            {!targetEditUploadMode &&
                              <IconButton aria-label="edit" variant="outlined" color="primary" 
                                  style={{ borderRadius:'0', padding:'0', margin:'0px 5px' }} 
                                  onClick={() => {
                                    setFieldValue(`updateTarget`,'upload')
                                    setFieldValue(`numOfReUploadedFiles`,0)
                                    setTargetEditUploadMode('upload')
                                    const policyDeclaration = []
                                    for (const i in clickedData.insuredpersons) {
                                      policyDeclaration.push({policyNo : clickedData.insuredpersons[i].policyNo})
                                      if (clickedData.insuredpersons[i].optionPlanPolicyNo){
                                        policyDeclaration.push({policyNo: clickedData.insuredpersons[i].optionPlanPolicyNo})
                                      }
                                      if (clickedData.insuredpersons[i].carewellPolicyNo){
                                        policyDeclaration.push({policyNo: clickedData.insuredpersons[i].carewellPolicyNo})
                                      }
                                    }
                                      const docObj = Object.create(null);
                                        policyDeclaration.forEach(function (o) {
                                        var key = ['policyNo'].map(function (k) { return o[k]; }).join('|');
                                        if (!docObj[key]) {
                                          docObj[key] = {policyNo: o.policyNo};
                                          values.files.push({policyNo: o.policyNo, policySelected: false, pdfFile:''});
                                        }
                                      });
                                    }}
                                >
                                  <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                                    Re-upload
                                  </span>
                                </IconButton>
                            }
                          </Grid>
                          
                          {values.files.length > 0 &&
                            <Grid item xs={12} container style={{ padding:'1vh'}}>
                                <FieldArray
                                  name='files'
                                  render={() => (
                                      values.files.map((file, index) => (
                                        <React.Fragment key={index}>
                                          <Grid item container>
                                            <Grid item xs={5}>
                                              <FormControlLabel
                                                style={{justifyContent:"flex-start"}}
                                                control={<Checkbox
                                                            checked={file.policySelected}
                                                            name={`files.${index}.policySelected`}
                                                            size="small"
                                                            color="primary"
                                                            onChange={(e)=>{
                                                              const checked = e.target.checked;
                                                              const numOfReUploadedFiles = (checked === true ? values.numOfReUploadedFiles + 1: values.numOfReUploadedFiles -1)
                                                              setFieldValue(`numOfReUploadedFiles`, numOfReUploadedFiles)
                                                              setFieldValue(`files.${index}.policySelected`, checked)
                                                              if (checked===false){
                                                                setFieldValue(`files.${index}.pdfFile`, '')
                                                              }
                                                            }}
                                                          />
                                                } 
                                                label={file.policyNo}
                                              />
                                            </Grid>
                                            
                                            {file.policySelected===true &&(
                                              <>
                                                <Grid item xs={1}>
                                                  <label htmlFor={`files.${index}.pdfFile`}>
                                                      {/* <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon} /> */}
                                                      <UploadFileIcon size={35} className={classes.searchFileIcon} />
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
                                                <Grid item xs={6} style={{marginTop:'0.5vh'}}>
                                                  <Typography variant="subtitle1">
                                                    {values.files[index].pdfFile?values.files[index].pdfFile.name:''}
                                                  </Typography>
                                                  {validMessage(`files.${index}.pdfFile`)}
                                                </Grid>
                                              </>
                                            )}
                                            
                                          </Grid>
                                        </React.Fragment>
                                        )) 
                                  )}
                                />
                                {validMessage(`numOfReUploadedFiles`)}
                                {editUploadModeButton(values, setFieldValue)}
                            </Grid>
                          }                            
                        </Grid>
                      }

                      {/* Contact Info */}
                      <Grid item container style={{ border:'1px solid #ddd', margin:'1vh 0', height:'fit-content'}}>
                            <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                              <Text tid={'Quote.ContactInformation'} /> 
                              {(clickedData.app_status !== 'Cancelled' || clickedData.app_status !== 'Void') && 
                                clickedData.insuredpersons[0] && clickedData.insuredpersons.filter(f=>f.tripEndDate > new Date().toISOString().split('T')).length>0 && 
                                !targetEditUploadMode && 
                                  <IconButton aria-label="edit" variant="outlined" color="primary" 
                                    style={{ borderRadius:'0', padding:'0', margin:'0px 5px' }} 
                                    onClick={() => {
                                      setFieldValue(`updateTarget`,'contact')
                                      setTargetEditUploadMode('contact')
                                    }}
                                  >
                                    <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                                      Edit
                                    </span>
                                  </IconButton>
                              }
                            </Grid>
                            <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                              <Grid item container>
                                {targetEditUploadMode ==='contact'
                                  ?
                                    <>
                                    <Grid item xs={12} md={12} style={{ marginLeft:'2px'}} >
                                        <Typography variant="h5" >
                                          {/* <Text tid={'Quote.havePhoneInCanada'}/> */}
                                          Do you have a Canadian phone number?
                                        </Typography>
                                    </Grid>
                                      <Grid item xs={12} >
                                        <ToggleButtonGroup
                                            name ={`phoneInCanada`}
                                            value={values.phoneInCanada}
                                            exclusive
                                            style={{ width:'96%', margin:'5px' }}
                                            onChange={(e) => {
                                              const val = e.currentTarget.value === 'true'; // Convert string value to boolean
                                              values.phoneInCanada = val;
                                              setFieldValue(`phoneInCanada`, val);
                                              
                                                if(e.currentTarget.value === 'false'){
                                                  const officeAddress = branchAddress(clickedData.travel_direction_type, 
                                                    clickedData.insuredpersons[0].destProvince, 
                                                    clickedData.insuredpersons[0].destProvinceName, 
                                                    clickedData.insuredpersons[0].originProvince, 
                                                    clickedData.insuredpersons[0].originProvinceName, 
                                                    {})

                                                    // if no vendor phone number, show stonewell phone number
                                                    if(officeAddress.phone){
                                                      values.contactPhone =  officeAddress.phone
                                                      setFieldValue('contactPhone', officeAddress.phone)
                                                    }else{
                                                      values.contactPhone =  '1-833-645-3858'
                                                      setFieldValue('contactPhone', '1-833-645-3858')
                                                    }

                                                }else{
                                                  values.contactPhone = ''
                                                  setFieldValue('contactPhone','')
                                                }
                                                console.log(clickedData)
                                            }}
                                            // onBlur={() => setTouched({ 'phoneInCanada': true })}
                                        >
                                            <ToggleButton value={true}  style={{ padding:'5px 10px', width:'50%' }}>
                                              <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false}  style={{ padding:'5px 10px', width:'50%' }}>
                                              <Text tid={'Button.No'}/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        {validMessage(`phoneInCanada`)}
                                      </Grid>
                                      {/* {values.phoneInCanada === true && ( */}
                                        <Grid item xs={12}>
                                          <Field
                                              style={{ fontWeight:'700', width: '100%' }}
                                              name="contactPhone"
                                              variant="outlined"
                                              // InputProps={{
                                              //   readOnly: values.phoneInCanada?false:true,
                                              // }}
                                              value={values.contactPhone}
                                              type="tel"
                                              as={MuiPhoneInput}
                                              defaultCountry={'ca'}
                                              onlyCountries={['ca']}
                                              disableAreaCodes={true}
                                              countryCodeEditable={false}
                                              onChange={(value) => 
                                                setFieldValue('contactPhone', value)
                                              }
                                          />
                                          {validMessage('contactPhone')}
                                        </Grid>
                                      {/* )} */}
                                      <Grid item xs={12}>
                                        <RegularTextFieldSmall
                                            name="contactEmail"
                                            type="text"
                                           
                                            // label={'Quote.Email'}
                                            placeholder= "Email" 
                                            tooltipTitle={'Tooltip.Email'}
                                            size="small"
                                            value={values.contactEmail}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage('contactEmail')}
                                      </Grid>
                                    </>
                                :
                                  <>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{values.contactPhone}</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{values.contactEmail}</span>
                                    </Grid>
                                  </>
                                }
                              </Grid>
                              {targetEditUploadMode ==='contact' &&
                                editUploadModeButton(values, setFieldValue)
                              }
                            </Grid>
                      </Grid>
                      
                      {/* Address Info */}
                      {clickedData.address.length > 0 &&
                        <Grid item container style={{ border:'1px solid #ddd', margin:'1vh 0', height:'fit-content'  }}>
                            <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                              <Text tid={'TravelApplication.AddressInCanada'} />
                              {(clickedData.app_status !== 'Cancelled' || clickedData.app_status !== 'Void') && 
                                clickedData.insuredpersons[0] && clickedData.insuredpersons.filter(f=>f.tripEndDate > new Date().toISOString().split('T')).length>0 && 
                                !targetEditUploadMode && 
                                <IconButton aria-label="edit" variant="outlined" color="primary" 
                                  style={{ borderRadius:'0', padding:'0', margin:'0px 5px' }} 
                                  onClick={() => {
                                    setFieldValue(`updateTarget`,'address')
                                    // setAddressEditMode(true)
                                    setTargetEditUploadMode('address')
                                  }}
                                >
                                  <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                                    Edit
                                  </span>
                                </IconButton>
                              }
                            </Grid>
                            <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                              <Grid item container>
                              {targetEditUploadMode ==='address'
                                  ?
                                    <>
                                      <Grid item xs={12} style={{ marginLeft:'2px' }} >
                                        <Grid item xs={12} md={12} style={{ marginBottom:'5px'}} >
                                            <Typography variant="h4" >
                                              <Text tid={'Quote.HaveMailingAddressInCanada'}/>
                                            </Typography>
                                        </Grid>
                                        <ToggleButtonGroup
                                            name ={`maillingInCanada`}
                                            value={values.maillingInCanada}
                                            exclusive
                                            onChange={(e) => {
                                                const val = e.currentTarget.value === 'true' ? true : false
                                                setFieldValue(`maillingInCanada`, val)
                                                if(e.currentTarget.value === 'false'){
                                                  const officeAddress = branchAddress(clickedData.travel_direction_type, 
                                                                                      clickedData.insuredpersons[0].destProvince, 
                                                                                      clickedData.insuredpersons[0].destProvinceName, 
                                                                                      clickedData.insuredpersons[0].originProvince, 
                                                                                      clickedData.insuredpersons[0].originProvinceName, 
                                                                                      clickedData.vendor_address[0])
                                                  values.mailStreetName = officeAddress.street
                                                  values.mailUnitApartmentNo = officeAddress.suiteNo?officeAddress.suiteNo:''
                                                  values.mailCity = officeAddress.city
                                                  values.mailProvince = officeAddress.province
                                                  values.mailPostalCode = officeAddress.postalCode
                                                  setFieldValue('mailStreetName',officeAddress.street)
                                                  setFieldValue('mailUnitApartmentNo',officeAddress.suiteNo?officeAddress.suiteNo:'')
                                                  setFieldValue('mailCity',officeAddress.city)
                                                  setFieldValue('mailProvince',officeAddress.province)
                                                  setFieldValue('mailPostalCode', officeAddress.postalCode)
                                                }else{
                                                  values.mailStreetName = ''
                                                  values.mailUnitApartmentNo = ''
                                                  values.mailCity = ''
                                                  values.mailProvince = ''
                                                  values.mailPostalCode = ''
                                                  setFieldValue('mailStreetName','')
                                                  setFieldValue('mailUnitApartmentNo','')
                                                  setFieldValue('mailCity','')
                                                  setFieldValue('mailProvince','')
                                                  setFieldValue('mailPostalCode','')
                                                }
                                            }}
                                            style={{ width:'100%' }}
                                        >
                                            <ToggleButton value={true} className={classes.toggleButton} style={{ padding:'5px 10px', width:'50%' }}>
                                              <Text tid={'Button.Yes'}/>
                                            </ToggleButton>
                                            <ToggleButton value={false} className={classes.toggleButton} style={{ padding:'5px 10px', width:'50%' }}>
                                              <Text tid={'Button.No'}/>                                     
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                      </Grid>

                                      <Grid item xs={12}>      
                                        <RegularTextFieldSmall
                                            name={`mailStreetName`}
                                            type="text"
                                            InputProps={{
                                              readOnly: values.maillingInCanada?false:true,
                                            }}
                                            placeholder= "Street"  
                                            value={values.mailStreetName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // label={'Quote.Street'}
                                          />
                                        {validMessage(`mailStreetName`)}
                                      </Grid>

                                      {/* UnitNo column from Zoho do not manage */}
                                      {values.sourceFrom !== 'Z' &&    
                                        <Grid item xs={12}>  
                                          <RegularTextFieldSmall
                                              name={`mailUnitApartmentNo`}
                                              type="text"
                                              InputProps={{
                                                readOnly: values.maillingInCanada?false:true,
                                              }}                   
                                              placeholder= "Unit Number"                       
                                              value={values.mailUnitApartmentNo}
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              // label={'Quote.UnitNumber'}
                                          />
                                        </Grid>
                                      }

                                      <Grid item xs={12}>   
                                        <RegularTextFieldSmall
                                            name={`mailCity`}
                                            type="text"
                                            InputProps={{
                                              readOnly: values.maillingInCanada?false:true,
                                            }}   
                                            placeholder= "City"  
                                            value={values.mailCity}
                                            onChange={(e)=> setFieldValue(`mailCity`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                            onBlur={handleBlur}
                                            // label= {'Quote.City'}
                                          />
                                        {validMessage(`mailCity`)}
                                      </Grid>
                                      <Grid item xs={12}> 

                                      {values.maillingInCanada
                                        ? <>
                                            <Autocomplete
                                              name="mailProvince"
                                              options={provinces}
                                              value={values.mailProvince 
                                                      ? provinces.find(c => c.province_name === values.mailProvince)
                                                        ? provinces.find(c => c.province_name === values.mailProvince)
                                                        : provinces.find(c => c.province_code === values.mailProvince) 
                                                      : null}
                                              getOptionLabel={(option) => option.province_name}
                                              // size="small"
                                              renderInput={(params) => 
                                                  <RegularTextFieldSmall {...params}
                                                    placeholder= "Province"
                                                    style={{ width:'97%' }}
                                                  />
                                              }
                                              onChange={(e, selectedVal) => {
                                                  values.mailProvince = selectedVal ? selectedVal.province_name : ''
                                                  setFieldValue('mailProvince', selectedVal ? selectedVal.province_name : '');
                                              }}
                                            />
                                            {validMessage(`mailProvince`)}
                                          </>
                                        :
                                          <RegularTextFieldSmall
                                                name={`mailProvince`}
                                                type="text"
                                                placeholder= "Province"  
                                                InputProps={{readOnly: true}}   
                                                value={values.mailProvince}
                                              />
                                      }
                                      </Grid>

                                      <Grid item xs={12}>    
                                        {/* <label className={classes.inputLabel}><Text tid={'Quote.PostalCode'}/></label> */}
                                        <InputMask
                                            name={`mailPostalCode`}
                                            mask= {"a9a 9a9" }
                                            value={values.mailPostalCode}
                                            onChange={(e)=>setFieldValue(`mailPostalCode`,e.target.value.toUpperCase())}
                                            onBlur={handleBlur}                    
                                            >
                                              {() => (
                                                <RegularTextFieldSmall
                                                    type="text"
                                                    name="mailPostalCode"
                                                    placeholder= "Postal Code"
                                                    variant="outlined"
                                                    size="small" 
                                                    InputProps={{
                                                      readOnly: values.maillingInCanada?false:true,
                                                    }} 
                                                />
                                              )}
                                        </InputMask>
                                        {validMessage(`mailPostalCode`)}
                                      </Grid>
                                    </>
                                :
                                  <>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{maillAddress.street}</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{maillAddress.suiteNo}</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{maillAddress.city}</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{maillAddress.province}</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <span style={{ fontWeight:'700' }}>{maillAddress.postalcode}</span>
                                    </Grid>
                                  </>
                                }
                              </Grid>
                              {targetEditUploadMode ==='address' &&
                                editUploadModeButton(values, setFieldValue)
                              }
                            </Grid>
                        </Grid>
                      }

                    </Form>
                )}
              </Formik>
            </Grid>

            {/* Payment */}
            {clickedData.payment.length > 0 &&
              <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', marginBottom: '1vh' }}>
                    <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                      <Text tid={'Quote.PaymentInformation'} />
                      {!directPaymentURL && vendorID === '*' && clickedData.source_from !== 'Z' && 
                        clickedData.app_status === 'Pending' &&
                        clickedData.insuredpersons.filter(f=>f.tripEndDate > new Date().toISOString().split('T')).length>0 &&
                          <IconButton aria-label="edit" variant="outlined" color="primary" 
                            style={{ borderRadius:'0', padding:'0', margin:'0px 5px' }} 
                            onClick={() => {
                              clickedData.contact_name = clickedData.contact_name.replace(/\s/g, "_");
                              setDirectPaymentURL(`https://www.stonewellfinancial.com/travel-insurance/direct-payment?confirmationNo=${clickedData.confirmation_no}&contactName=${clickedData.contact_name}&paymentAmount=${clickedData.total_amount}`)
                            }}
                          >
                            <span style={{ fontSize:'10px', fontWeight:'700', padding:'5px 10px', border:'1px solid'  }}> 
                              Get Direct Payment URL
                            </span>
                          </IconButton>
                        }
                        {directPaymentURL &&  (
                          <>
                            <RegularTextFieldSmall
                                value= {directPaymentURL?directPaymentURL:''}
                                multiline
                                fullWidth
                                readOnly={true}
                              />
                            <Grid container style={{ marginTop: '2px' }} justify="flex-end" spacing={2}>
                              <Grid item >
                                <Button 
                                  color="secondary" 
                                  style={{ border:'0', background:'#fff' }}
                                  onClick={() => navigator.clipboard.writeText(directPaymentURL)}
                                >
                                  Copy
                                </Button>
                              </Grid>
                              <Grid item >
                                <Button 
                                  color="dark"
                                  onClick={() => setDirectPaymentURL('')}
                                >
                                  Close
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                      )}
                    </Grid>

                    <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      {clickedData.insured_group_type==='Family'&&
                        <Grid item container style={{ marginBottom: '1vh'}}>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.RegularPremium'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span>{amountFormat(clickedData.insurance_plan_price,2)}</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.FamilyDiscountAmount'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span  style={{color:'red'}}>- {amountFormat(clickedData.family_plan_discount,2)}</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={6} style={{ marginBottom: '1vh'}}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.FamilyPlanPremium'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span>{amountFormat(clickedData.family_plan_amount,2)}</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}>Add-on Plans</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span>{amountFormat(clickedData.option_plan_price,2)}</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}><Text tid={'CarewellServices'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span>{amountFormat(clickedData.carewell_service_price,2)}</span>
                            </Grid>
                          </Grid>
                      }
                      
                      <Grid item container>
                        <Grid item xs={12} sm={12} md={4} lg={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.PaymentAmount'} /></span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                          <span style={{ fontWeight:'700', color:"#8cc63f" }}>{amountFormat(clickedData.total_amount,2)}</span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.PaymentMethod'} /></span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                          <span style={{ fontWeight:'700' }}>{clickedData.payment[0].paymentMethod}</span>
                          {clickedData.payment[0].PaymentBy==='Client'?
                            <span style={{ display:'inline-block' }}>(<Text tid={'Vendr.DirectByClientPayment'} />)</span>
                          :null}
                        </Grid>

                        {clickedData.payment[0].paymentMethod === 'Creditcard' && clickedData.payment[0].creditCardNumber ?
                          <>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CardHolderName'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span style={{ fontWeight:'700' }}>{clickedData.payment[0].cardHolderName}</span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CreditCardNumber'} /></span>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={6}>
                              <span style={{ fontWeight:'700' }}>
                              {vendorID === '*' 
                                ? clickedData.payment[0].creditCardNumber 
                                : (clickedData.payment[0].creditCardNumber?'*'.repeat(clickedData.payment[0].creditCardNumber.length - 4) + clickedData.payment[0].creditCardNumber.substr(clickedData.payment[0].creditCardNumber.length-4,4):'')
                              }
                              </span>
                            </Grid>
                            {vendorID === '*' ? 
                              <>
                                <Grid item xs={12} sm={12} md={4} lg={6}>
                                  <span style={{ color:'#666' }}><Text tid={'Quote.CardExpiration'} /></span>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={6}>
                                  <span style={{ fontWeight:'700' }}>{clickedData.payment[0].cardExpired}</span>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={6}>
                                  <span style={{ color:'#666' }}><Text tid={'Quote.CardCVV'} /></span>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={6}>
                                  <span style={{ fontWeight:'700' }}>{clickedData.payment[0].cardcvv}</span>
                                </Grid>
                              </>
                            :null}
                          </>
                        :null}
                        
                      </Grid>
                    </Grid>
                </Grid>
            }

            {/* source Channel */}
            {clickedData.source_from !== 'V' &&
              <Grid item container style={{ fontSize:'12px', marginBottom: '1vh' , padding:'5px', background:'#efefef' }}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <span><Text tid={'Vendor.Application.SourceChannel'} /></span>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} style={{ fontWeight:'700' }}>
                  <span>{clickedData.source_chnnel}</span>
                </Grid>
              </Grid>
            }

            {/* Note */}
            {clickedData.note.length > 0 &&
              <Grid item container style={{ border:'1px solid #ddd', height:'fit-content' }}>
                    <Grid item container style={{ background:'#efefef', padding:'1vh' }}>
                      <Text tid={'TravelApplication.NoteTitle'} />
                    </Grid>
                    <Grid item container style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      {clickedData.note.sort((a,b)=> a.note_seq - b.note_seq).map(n=>(
                        <Grid item container key={n.note_seq} style={{marginBottom:'1vh'}}>
                            <Grid item xs={12}>
                              {`${n.noteDate} - ${n.status}`}  
                            </Grid>
                            <Grid item xs={12}>
                              {textLineBreak(n.note)}
                            </Grid>
                        </Grid>
                      ))}
                    </Grid>
              </Grid>
            }
            
        </Grid>

      </Grid>

    </Grid>

  );
}
