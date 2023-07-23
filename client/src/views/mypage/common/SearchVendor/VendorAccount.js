import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getVendorAccountByAccessCode, updateVendorAccount } from '../../../../redux/actions/vendorAccountAction';
import { getUsersByVendor } from '../../../../redux/actions/userAction';
import { getCountry } from '../../../../redux/actions/countries'
import { getProvince } from '../../../../redux/actions/countries';
// formik
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
//
import {
  Grid, Typography, IconButton, TextField, Box
} from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import MuiPhoneInput from 'material-ui-phone-number'
import { Autocomplete } from '@material-ui/lab';
// import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall';
import { RegularSwitch } from '../../../../components/common/CustomSwitch';
import { Text } from '../../../../components/common/LanguageProvider';
import LoadingSpinnerScreen from '../../../../components/common/loadingScreen';
//
import { dateFormat } from '../../../../controllers/dataFormat';
import VendorUserAuthModal from './VendorUserAuthModal';
// icons
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';


const useStyles = makeStyles(dashboardStyles)

const validationSchema = Yup.object().shape({
  vendor_name : Validation.validRequiredField(),
  lastname: Validation.validRequiredField().nullable(),
  firstname: Validation.validRequiredField().nullable(),
  phone: Validation.validPhoneNumber(),
  email : Validation.validEmail(),  
  street: Validation.validRequiredField().nullable(),
  city: Validation.validRequiredField().nullable(),
  province: Validation.validRequiredField().nullable(),
  postalcode: Yup.string().nullable().when("country",
    { is: (value) => 
            value === 'CA',
            then: Validation.validPostalCode().nullable(),
            otherwise: Validation.validRequiredField().nullable()
    }),
  country: Validation.validRequiredField().nullable()
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



const VendorAccount = (props) => {
  const { accessRole, accessCode, vendorID } = props

  const classes = useStyles();
  const dispatch = useDispatch();

  const vendor = useSelector(state => state.vendorAccountReducer.vendor)
  const loading = useSelector(state => state.vendorAccountReducer.loading)
  // const error = useSelector(state => state.vendorAccountReducer.error)
  const updateVendorResult = useSelector(state => state.vendorAccountReducer.result)
  const users = useSelector(state => state.userAccountReducer.users)
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)

  const vendorType = [
    {type: 'LanguageSchool', value: 'Language School'},
    {type: 'School', value: 'School'},
    {type: 'Agency', value: 'Agency'},
    {type: 'ImmigrationAgency', value: 'Immigration Agency'},
    {type: 'InsuranceBrokerageCompany', value: 'Insurance Brokerage Company'},
    {type: 'Other', value: 'Other'},
  ]

  // vendor account
  const [vendorEditMode, setVendorEditMode] = useState(false)
  const [adminEditMode, setAdminEditMode] = useState(false)
  const [updateTarget, setUpdateTarget] = useState('')

  // vendor user account
  const [addEditMode, setAddEditMode] = useState();  
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [addEditData, setAddEditData] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    dispatch(getVendorAccountByAccessCode(accessCode))
    dispatch(getUsersByVendor({vendor_id:vendorID}))
    dispatch(getCountry())
    dispatch(getProvince())
  }, [dispatch, accessCode, vendorID]);

  
  function addUser(vendorID){
    setAddEditMode('Add')
    const initialData = [
          { vendor_id: vendorID,
            firstName: '',
            lastName: '',
            email : '',
            isActive: true,
            vendorRole: '',
            activeDate: null,
            closeDate: null
          }]
    // console.log(initialData)
    setAddEditData(initialData)
    setAddEditOpen(true)
  };

  function editUser(userID){
      setAddEditMode('Edit')
      setAddEditData(userData.filter(u => u.user_id === userID))
      setAddEditOpen(true)
  };

  function handleConfirm(result){
    // console.log(result)
    if (result==='success'){dispatch(getUsersByVendor({vendor_id:vendorData[0].vendor_id}))}
  };

  const handleUpdateVendor = (values) => {
    values.updatedByVendor = accessRole==='VEN'?true:false;
    // console.log('update',values)
    // dispatch(updateVendorAccount({update_target: 'info', vendor_id:values.vendor_id, data: values}))
    dispatch(updateVendorAccount({update_target: updateTarget, vendor_id:values.vendor_id, data: values}))
    setVendorEditMode(false)
    setAdminEditMode(false)
    setUpdateTarget('')
    showResultMessage()
  }

  // show Updating (Vendor info) Result Message
  function showResultMessage() {
    // scrollToElement();
    setAlertOpen(true)
    setTimeout(() => {
        setAlertOpen(false)
        dispatch(getVendorAccountByAccessCode(accessCode))
    }, 5000);
  }

  // vendorData
  const vendorData = vendor && !loading ? vendor.map(row => {
    const dataRows = {
      ...row,
      firstname: row.firstname?row.firstname:'',
      lastname: row.lastname?row.lastname:'',
      phone: row.phone?row.phone:'',
      street: row.street?row.street:'',
      suite_no: row.suite_no?row.suite_no:'',
      city: row.city?row.city:'',
      province: row.province?row.province:'',
      postalcode: row.postalcode?row.postalcode:'',
      country: row.country?row.country:'',
      annual_clients: row.annual_clients?row.annual_clients:'',
      client_provinces: row.client_provinces?row.client_provinces:'',
      vendor_code: row.vendor_code?row.vendor_code:'',
      zoho_account_id: row.zoho_account_id?row.zoho_account_id:'',
      zoho_carewell_account_id: row.zoho_carewell_account_id?row.zoho_carewell_account_id:''
    };
    return dataRows;
  }) : [];

  // userData
  const userData = users && users.data ? users.data.map(row => {
    const dataRows = {
      ...row,
      activeDate: row.activeDate?dateFormat(new Date(row.activeDate+'T00:00:00')):null,
      closeDate: row.closeDate?dateFormat(new Date(row.closeDate+'T00:00:00')):null
    };
    return dataRows;
  }) : [];

  
  //
  const columns = getColumns()
  
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "user_id", label: "ID", 
          options: {filter: false, display: false},
        },
        {name: "firstName", label: 'First Name',
          options: {filter: false},
        },
        {name: "lastName", label: 'Last Name',
          options: {filter: false},
        },
        {name: "email", label: 'Email',
          options: {filter: false},
          // editable: 'never' 
        },
        {name: "isActive", label: 'Activated',
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              return( <RegularSwitch  
                        disabled
                        name="is_active"
                        checked={value} 
                      />
              )
            }   
          }
        },
        {name: "vendorRole", label: 'Role',
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, update, updateValue) => {
              return (value ==='A'?'Admin': 'Sfaff')
            }
          },
        },
        {name: "activeDate", label: 'Activated date',
          options: {filter: false},
        },
        {name: "closeDate", label: 'closed date',
          options: {filter: false},
          
        },
        {name: "createdAt", label: 'Created',
          options: {filter: false},

        },
        {name: "Edit",
          options: { filter: false, sort: false, empty: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="edit" variant="outlined" color="primary" 
                      disabled = {vendorData[0].is_active?false:true}
                      onClick={() => editUser(tableMeta.rowData[0])}
                      >
                    <EditIcon/>
                  </IconButton>
              );
            }
          }
        },
      ]
    return (columns)
  }

  const options = {
    filter: true,
    filterType: "checkbox", //"dropdown", //
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard", // stacked
    // showTitle: false,
    // search: false,
    rowStyle: {height: 30},
    viewColumns: false,
    download: false,
    print: false,   
    expandableRows: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 50], 
    
  };

  // Responsive
  // const [width, setWidth] = useState(window.innerWidth);

  // function handleWindowSizeChange() {
  //     setWidth(window.innerWidth);
  // }
  // let isMobile = (width <= 767);



    return (
      <>
        {loading
          ? <LoadingSpinnerScreen />
          :
          (<> 
            {vendorData.length > 0 &&
              <Grid container justify="center" >

                <Grid item xs={12} sm={12} md={11}>
                  <Grid container style={{ padding: '4vh 3vh', background:'#fff', margin:'2vh 0', borderRadius:'5px'}}>
                      <Formik
                          // initialValues={initialValues}
                          initialValues={vendorData[0]}
                          validationSchema={validationSchema}
                          onSubmit={(values) => {
                              // console.log(values)
                              handleUpdateVendor(values)
                          }} 
                      >
                          {({ values, handleChange, handleBlur, setFieldValue }) => (
                          <Form>
                              <Grid item container spacing={2}>
                                  <Grid item container>
                                    {updateVendorResult && updateVendorResult.status && alertOpen &&
                                      <Grid item xs={12} style={{ marginBottom: '2vh' }}>
                                        <Alert severity={updateVendorResult.status} onClose={() => setAlertOpen(false)}>    
                                          <AlertTitle>{updateVendorResult.status.charAt(0).toUpperCase() + updateVendorResult.status.slice(1)}</AlertTitle>
                                            {updateVendorResult.message}
                                        </Alert>
                                      </Grid>
                                    }  

                                    <Grid item xs={10}>
                                      <Typography variant="h4">
                                            <BusinessIcon/> <Text tid={`Partner.Register.CompanyInformation.Title`}/>
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={2} style={{textAlign: 'end'}}>
                                      {vendorEditMode === false
                                        ?
                                          <IconButton aria-label="edit" color="primary" 
                                            onClick={() => {setVendorEditMode(true)}}
                                            style={{ fontSize:'1rem', fontWeight:'600', borderRadius:'0', border:'0'}}
                                          >
                                            <EditIcon style={{ marginRight:'5px' }} /> <Text tid={'Quote.Edit'} />
                                          </IconButton>
                                        :
                                          <>
                                            <IconButton aria-label="save" color="primary" 
                                                onClick={() => {
                                                  setUpdateTarget('info')
                                                  document.getElementById('save_button').click()
                                                }}
                                                style={{ fontSize:'1rem', fontWeight:'600', borderRadius:'0', border:'0'}}
                                              >
                                                <SaveIcon style={{ marginRight:'5px' }} /> <Text tid={'TravelApplication.Save'} />
                                            </IconButton>
                                            <IconButton aria-label="cencel" color="primary" 
                                                onClick={() => {
                                                  values.vendor_name = vendorData[0].vendor_name
                                                  values.lastname = vendorData[0].lastname
                                                  values.firstname = vendorData[0].firstname
                                                  values.phone = vendorData[0].phone
                                                  values.email = vendorData[0].email
                                                  values.street = vendorData[0].street
                                                  values.suite_no = vendorData[0].suite_no
                                                  values.city = vendorData[0].city
                                                  values.province = vendorData[0].province
                                                  values.postalcode = vendorData[0].postalcode
                                                  values.country = vendorData[0].country
                                                  setFieldValue('vendor_name',vendorData[0].vendor_name)
                                                  setFieldValue('lastname',vendorData[0].lastname)
                                                  setFieldValue('firstname',vendorData[0].firstname)
                                                  setFieldValue('phone',vendorData[0].phone)
                                                  setFieldValue('email',vendorData[0].email)
                                                  setFieldValue('street',vendorData[0].street)
                                                  setFieldValue('suite_no',vendorData[0].suite_no)
                                                  setFieldValue('city',vendorData[0].city)
                                                  setFieldValue('province',vendorData[0].province)
                                                  setFieldValue('postalcode',vendorData[0].postalcode)
                                                  setFieldValue('country',vendorData[0].country)
                                                  setVendorEditMode(false)}
                                                }
                                              >
                                                <CancelIcon/>
                                            </IconButton>
                                          </>
                                      }
                                    </Grid>
                                      
                                    {/* vendor_name */}
                                    <Grid item xs={12} sm={12} md={12} lg={6} >
                                          <RegularTextFieldSmall
                                            name='vendor_name'
                                            type="text"
                                            readOnly={true}
                                            value={values.vendor_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Partner.Register.CompanyName"
                                            disabled={vendorEditMode?false:true}
                                          />
                                          {validMessage(`vendor_name`)}
                                    </Grid>
                                    {/* Vendor Type */}
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <SelectTextFieldSmall
                                            label={'Partner.Register.vendorType'}
                                            name="vendorType"
                                            value={values.vendorType}
                                            // onChange={handleChange}
                                            disabled={vendorEditMode?false:true}
                                            onChange={(e) => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            >
                                            <option value="" hidden>Select</option>
                                            {vendorType
                                                .map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.value}
                                                    </option>
                                            ))}
                                        </SelectTextFieldSmall>
                                        {validMessage('vendorType')}
                                    </Grid>
              
                                  </Grid>
                                  
                                  {/* Applicant Information */}
                                  <Grid item container >
                                      <Grid item xs={12} style={{ margin:'2vh 0' }}>
                                      <Typography variant="h4">
                                          <PersonIcon/> <Text tid={`Partner.Register.ApplicantInformation.Title`}/>
                                      </Typography>
                                      </Grid>

                                      {/* first name */}
                                      <Grid item xs={12} sm={6} md={6} lg={3}>
                                          <RegularTextFieldSmall
                                            name='firstname'
                                            type="text"
                                            value={values.firstname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Quote.FirstName"
                                            InputProps={{
                                              // readOnly: vendorEditMode?false:true
                                              disabled: vendorEditMode?false:true
                                            }}
                                          />
                                          {validMessage(`firstname`)}
                                      </Grid>

                                      {/* last name */}
                                      <Grid item xs={12} sm={6} md={6} lg={3}>
                                          <RegularTextFieldSmall
                                            name='lastname'
                                            type="text"
                                            value={values.lastname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Quote.LastName"
                                            InputProps={{
                                              // readOnly: vendorEditMode?false:true
                                              disabled: vendorEditMode?false:true
                                            }}
                                          />
                                          {validMessage(`lastname`)}
                                      </Grid>

                                      {/* email */}
                                      <Grid item xs={12} sm={6} md={6} lg={3}>
                                          <RegularTextFieldSmall
                                            name='email'
                                            type="text"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Quote.EmailAddress"
                                            InputProps={{
                                              // readOnly: vendorEditMode?false:true
                                              disabled: vendorEditMode?false:true
                                            }}
                                          />
                                          {validMessage(`email`)}
                                      </Grid>

                                      {/* phone */}
                                      <Grid item xs={12} sm={6} md={6} lg={3}>
                                          <Grid item xs={12}  style={{ marginBottom:'8px' }}>
                                              <span style={{ fontWeight: 600, marginLeft: 5, marginBottom: 0, fontSize:'14px'}}>
                                                <Text tid={'Quote.Phone'}/>
                                              </span>
                                          </Grid>
                                          <Field
                                              style={{ fontWeight:'700', width: '100%' }}
                                              name="phone"
                                              variant="outlined"
                                              value={values.phone}
                                              type="tel"
                                              as={MuiPhoneInput}
                                              defaultCountry={'ca'}
                                              onlyCountries={['ca', 'kr']}
                                              disableAreaCodes={true}
                                              countryCodeEditable={false}
                                              InputProps={{
                                                // readOnly: vendorEditMode?false:true
                                                disabled: vendorEditMode?false:true
                                              }}
                                              onChange={(value) => setFieldValue('phone', value)}
                                          />
                                          {validMessage('phone')}
                                      </Grid>
                                  </Grid>
                                  
                                  {/* Address */}
                                  <Grid item container>
                                      <Grid item xs={12} style={{ margin:'2vh 0' }}>
                                        <Typography variant="h4">
                                                <PlaceIcon/>
                                                <Text tid={'Quote.Address'}/>
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={5} md={5} lg={4}>      
                                        <RegularTextFieldSmall
                                            name={`street`}
                                            type="text"
                                            // readOnly={vendorEditMode?false:true}
                                            value={values.street}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder={'Street'}
                                            InputProps={{
                                              // readOnly: vendorEditMode?false:true
                                              disabled: vendorEditMode?false:true
                                            }}
                                          />
                                        {validMessage(`street`)}
                                      </Grid>

                                      <Grid item xs={12} sm={3} md={3} lg={4}>  
                                        <RegularTextFieldSmall
                                            name={`suite_no`}
                                            type="text"
                                            value={values.suite_no}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder={'UnitNumber'}
                                            InputProps={{
                                              // readOnly: vendorEditMode?false:true
                                              disabled: vendorEditMode?false:true
                                            }}
                                          />
                                      </Grid>

                                      <Grid item xs={12} sm={4} md={4} lg={4}>   
                                        <RegularTextFieldSmall
                                          name={`city`}
                                          type="text"
                                          value={values.city}
                                          onChange={(e)=> setFieldValue(`city`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                          onBlur={handleBlur}
                                          placeholder= {'City'}
                                          InputProps={{
                                            // readOnly: vendorEditMode?false:true
                                            disabled: vendorEditMode?false:true
                                          }}
                                        />
                                        {validMessage(`city`)}
                                      </Grid>
                                      <Grid item xs={12} sm={5} md={5} lg={4}> 

                                        {values.country === 'CA' && vendorEditMode
                                          ?   
                                            <Autocomplete
                                              name="province"
                                              options={provinces}
                                              value={provinces.find(c => c.province_name === values.province)}
                                              getOptionLabel={(option) => option.province_name}
                                              renderInput={(params) => 
                                                  <RegularTextFieldSmall {...params}
                                                    placeholder= "Province"
                                                    style={{ width:'97%' }}
                                                  />
                                              }
                                              onChange={(e, selectedVal) => {
                                                  values.province = selectedVal ? selectedVal.province_name : ''
                                                  setFieldValue('province', selectedVal ? selectedVal.province_name : '');
                                              }}
                                            />
                                          :
                                            <RegularTextFieldSmall
                                              name={`province`}
                                              type="text"
                                              value={values.province}
                                              onChange={(e)=> setFieldValue(`province`, e.currentTarget.value.charAt(0).toUpperCase() + e.currentTarget.value.slice(1))}
                                              onBlur={handleBlur}
                                              placeholder= {'Province'}
                                              InputProps={{
                                                // readOnly: vendorEditMode?false:true
                                                disabled: vendorEditMode?false:true
                                              }}
                                            />
                                        }
                                        {validMessage(`province`)}
                                      </Grid>

                                      <Grid item xs={12} sm={3} md={3} lg={4}>    
                                        {/* <label className={classes.inputLabel}><Text tid={'Quote.PostalCode'}/></label> */}
                                        {values.country === 'CA' 
                                          ?
                                            <InputMask
                                              name={`postalcode`}
                                              mask= {"a9a 9a9" }
                                              value={values.postalcode}
                                              onChange={(e)=>setFieldValue(`postalcode`,e.target.value.toUpperCase())}
                                              onBlur={handleBlur}                    
                                              >
                                              {() => (
                                                <TextField
                                                    style={{ marginTop:'8px', width:'100%' }}
                                                    type="text"
                                                    name="postalcode"
                                                    variant="outlined"
                                                    size="small" 
                                                    placeholder= {'postalCode'}
                                                    InputProps={{
                                                      // readOnly: vendorEditMode?false:true
                                                      disabled: vendorEditMode?false:true
                                                    }}
                                                />
                                              )}
                                            </InputMask>
                                          :
                                            <RegularTextFieldSmall
                                              name={`postalcode`}
                                              type="text"
                                              value={values.postalcode}
                                              onChange={(e)=>setFieldValue(`postalcode`,e.target.value)}
                                              onBlur={handleBlur}
                                              placeholder= {'postalcode'}
                                              disabled={vendorEditMode?false:true}
                                            />
                                        }
                                        {validMessage(`postalcode`)}
                                      </Grid>

                                      <Grid item xs={12} sm={4} md={4} lg={4}>
                                        {vendorEditMode
                                          ?   
                                            <Autocomplete
                                              name="country"
                                              options={countries}
                                              value={countries.find(c => c.country_code === values.country)}
                                              getOptionLabel={(option) => option.name}
                                              renderInput={(params) => 
                                                  <RegularTextFieldSmall {...params}
                                                    placeholder= "Country"
                                                    style={{ width:'97%' }}
                                                    disabled={vendorEditMode?false:true}
                                                  />
                                              }
                                              onChange={(e, selectedVal) => {
                                                  values.countryName = selectedVal ? selectedVal.name : '';
                                                  setFieldValue('country', selectedVal ? selectedVal.country_code : '');
                                                  setFieldValue('countryName', selectedVal ? selectedVal.name : '');
                                              }}
                                            />
                                          :
                                            <RegularTextFieldSmall
                                                name={`country`}
                                                type="text"
                                                readOnly={true}
                                                // value={values.country==='CA'?'Canada':values.country}
                                                value={values.countryname}
                                                placeholder={'Country'}
                                                InputProps={{
                                                    // readOnly : vendorEditMode?false:true
                                                    disabled: vendorEditMode?false:true
                                                }}
                                            />
                                          }
                                          {validMessage(`country`)}
                                      </Grid>

                                  </Grid>

                                  {/* only Admin can handle this section. vendor's users are not allow.*/}
                                  {accessRole === 'ADM' && 
                                    <Grid item container>
                                        <Grid item container>
                                          <Grid item xs={12} sm={4} md={4} lg={4}>
                                            <RegularTextFieldSmall
                                              disabled
                                              name='annual_clients'
                                              type="text"
                                              value={values.annual_clients}
                                              label="Partner.Register.ClientNumber.Label"
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={8} md={8} lg={8}>
                                            <RegularTextFieldSmall
                                              disabled
                                              name='client_provinces'
                                              type="text"
                                              value={values.client_provinces}
                                              label="Partner.Register.ClientProvince.Label"
                                            />
                                          </Grid>
                                          {/* 보험담당자 직원 수 */}
                                          <Grid item  xs={12} sm={4} md={4} lg={4} style={{ margin:'1vh 0'}}>
                                              <RegularTextFieldSmall
                                                  name='employeeNumber'
                                                  type="number"
                                                  value={values.employeeNumber}
                                                  disabled
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  label="Partner.Register.EmployeeNumber.Label"
                                                  />
                                              {validMessage(`employeeNumber`)}
                                          </Grid>
                                        </Grid>

                                        <Grid item xs={12}>

                                          <Box
                                            m={1} //margin
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            style={{border: "1px solid #2a2f71", marginTop:'3vh'}}
                                          >
                                            <Grid item container style={{margin:'1vh'}}>
                                              <Grid item xs={10} style={{marginTop:'1vh', marginBottom:'1vh'}}>
                                                <Typography variant="h4">
                                                      Only for admin
                                                </Typography>
                                              </Grid>

                                              <Grid item xs={2} style={{textAlign: 'end'}}>
                                                {adminEditMode === false
                                                  ?
                                                    <IconButton aria-label="edit" color="primary" 
                                                      onClick={() => {
                                                        setAdminEditMode(true)
                                                      }}
                                                    >
                                                      <EditIcon/>
                                                    </IconButton>
                                                  :
                                                    <>
                                                      <IconButton aria-label="save" color="primary" 
                                                          onClick={() => {
                                                            setUpdateTarget('status')
                                                            document.getElementById('save_button').click()
                                                          }}
                                                        >
                                                          <SaveIcon/>
                                                      </IconButton>
                                                      <IconButton aria-label="cencel" color="primary" 
                                                          onClick={() => {
                                                            values.is_active = vendorData[0].is_active
                                                            values.allow_email_client = vendorData[0].allow_email_client
                                                            values.vendor_code = vendorData[0].vendor_code
                                                            values.zoho_account_id = vendorData[0].zoho_account_id
                                                            values.zoho_carewell_account_id = vendorData[0].zoho_carewell_account_id
                                                            setFieldValue('is_active',vendorData[0].is_active)
                                                            setFieldValue('allow_email_client',vendorData[0].allow_email_client)
                                                            setFieldValue('vendor_code',vendorData[0].vendor_code)
                                                            setFieldValue('zoho_account_id',vendorData[0].zoho_account_id)
                                                            setFieldValue('zoho_carewell_account_id',vendorData[0].zoho_carewell_account_id)
                                                            setAdminEditMode(false)}
                                                          }
                                                        >
                                                          <CancelIcon/>
                                                      </IconButton>
                                                    </>
                                                }
                                              </Grid>

                                              <Grid item xs={12} sm={12} md={6} lg={4}>
                                                <Grid item container>
                                                  <Grid item xs={5}>
                                                    <Grid item xs={12}  style={{ marginBottom:'8px' }}>
                                                        <span style={{ fontWeight: 600, marginLeft: 5, marginBottom: 0, fontSize:'14px'}}>
                                                          <Text tid={'Activation'}/>
                                                        </span>
                                                    </Grid>
                                                    <RegularSwitch  
                                                      disabled= {adminEditMode?false:true}
                                                      name="is_active"
                                                      checked={values.is_active} 
                                                      onChange={handleChange} 
                                                    />
                                                  </Grid>
                                                  <Grid item xs={7}>
                                                    <Grid item xs={12}  style={{ marginBottom:'8px' }}>
                                                        <span style={{ fontWeight: 600, marginLeft: 5, marginBottom: 0, fontSize:'14px'}}>
                                                          {/* <Text tid={'Activation'}/> */}
                                                          Allow Email To Client
                                                        </span>
                                                    </Grid>
                                                    <RegularSwitch  
                                                      disabled= {adminEditMode?false:true}
                                                      name="allow_email_client"
                                                      checked={values.allow_email_client} 
                                                      onChange={handleChange} 
                                                    />
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                                                    
                                              <Grid item xs={12} sm={4} md={6} lg={4}>
                                                <RegularTextFieldSmall
                                                  disabled
                                                  name='access_code'
                                                  type="text"
                                                  value={values.access_code}
                                                  label="Access Code"
                                                />
                                              </Grid>

                                              <Grid item xs={12} sm={4} md={6} lg={4}>
                                              <RegularTextFieldSmall
                                                  name='rate'
                                                  type="number"
                                                  value={values.rate}
                                                  label={`Rate  ${values.rate?values.rate*100:0} %`}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  InputProps={{
                                                    readOnly: adminEditMode?false:true
                                                  }}
                                                />
                                              </Grid>

                                              <Grid item xs={12} sm={4} md={6} lg={4}>
                                                <RegularTextFieldSmall
                                                  name='vendor_code'
                                                  type="text"
                                                  value={values.vendor_code}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  label="Vendor Code"
                                                  InputProps={{
                                                    readOnly: adminEditMode?false:true
                                                  }}
                                                />
                                              </Grid>

                                              <Grid item xs={12} sm={4} md={6} lg={4}>
                                                  <RegularTextFieldSmall
                                                    name='zoho_account_id'
                                                    type="text"
                                                    value={values.zoho_account_id}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="Zoho Account ID"
                                                    InputProps={{
                                                      readOnly: adminEditMode?false:true
                                                    }}
                                                  />
                                              </Grid>
                                            
                                              <Grid item xs={12} sm={4} md={6} lg={4}>
                                                  <RegularTextFieldSmall
                                                    name='zoho_carewell_account_id'
                                                    type="text"
                                                    value={values.zoho_carewell_account_id}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label="zoho Carewell Account ID"
                                                    InputProps={{
                                                      readOnly: adminEditMode?false:true
                                                    }}
                                                  />
                                              </Grid>

                                            </Grid>
                                            
                                          </Box>
                                        </Grid>

                                    </Grid>
                                  }

                              </Grid>
                  
                              <Grid item xs={12} style={{ display: 'none', textAlign: 'end'}}>
                                <Button 
                                  id = 'save_button'
                                  type='submit' 
                                  color="dark" 
                                >
                                  Save
                                </Button>
                              </Grid>

                          </Form>
                          )}
                      </Formik>
                  </Grid>
                </Grid>

                {userData &&
                  <Grid item xs={12} sm={12} md={11} style={{ marginBottom:'5vh' }}>
                    <MUIDataTable
                      title= {
                        <div>
                          <Grid item container style={{ margin:'2vh 0' }}>
                            <Typography className={classes.tableTitle}>
                              <PeopleIcon/>
                              <Text tid={'Dashboard.UserAccount'} />
                            </Typography>
                            <Button
                              style={{ marginLeft:'2vh' }}
                              color="primary"
                              disabled = {vendorData[0].is_active?false:true} 
                              onClick={() => {
                                addUser(vendorData[0].vendor_id)
                              }}
                            >
                              <AddIcon/> 
                              <Text tid={'Dashboard.RegisterUser'} />
                            </Button>
                          </Grid>
                        </div>    
                        }
                      data={userData}
                      columns={columns}
                      options={options}
                    />
                    
                    { addEditData[0] &&
                          <VendorUserAuthModal
                            addEditMode = {addEditMode}
                            addEditData={addEditData}
                            open={addEditOpen}
                            setOpen={setAddEditOpen}
                            onConfirm={handleConfirm}
                          /> 
                    }

                  </Grid>
                }
              </Grid>
            }
          </>)
        }
      </>
    );

}

export default VendorAccount