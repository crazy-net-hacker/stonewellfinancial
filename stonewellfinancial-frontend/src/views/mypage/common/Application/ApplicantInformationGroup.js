import React from 'react'
// import React, {useState} from 'react'
import { FieldArray } from 'formik'
import {
  Card,
  Grid,
  CardContent,
  makeStyles,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from '../../../../components/common/CustomButtons/ButtonDB'
// data picker
import KeyboardDatePickerField from '../../../../components/common/CustomDatePickers'
// Icon
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
// caculate 
import { CalculateAge } from '../../../../controllers/CalculateValue'


const useStyles = makeStyles(vendorFormStyle)

const ApplicantInformationGroup = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  validMessage,
  countries,
}) => {
  const classes = useStyles()

 
  function newInsuredPerson(insuredPersons) {
    insuredPersons.push({
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: null,
        age: 0,
        relationship: '',
        originCountry: '',
        originProvince: '',
        travelType: 'SS',
        attendSchoolName:'',
        sameDate: '',
        effectiveDate: '',
        expiryDate: '',
        coverageDays: '',
        arrivalDate: '',
        beneficiaryName:'',
        beneficiaryRelationship:'Estate',
        eligilbeIns: '',
        insurancePlans: [],
        selectedPlan: [],
        selectedMedQuesAnswer: [],
        selectedCarewellService: { packageName: '', packageAmount: 0 },
        optionalAddOnPlans: [],
    })
    return insuredPersons
}

  return (
    
    <div>
      {/* Applicant's Form */}
      <Grid container >
        {values.tripPeriodDays > 0 ? ( 

        <Card variant="outlined" className={classes.CardBox}>
          <CardContent>
            <Grid item container>
              <Grid item xs={12} className={classes.applicant}>
                <span>Group Detail</span>
              </Grid>

                          
              <Grid item container className={classes.group_info_container}>
              {/* Group Name */}
              <Grid item xs={12} md={1} className={classes.group_info_title}>
                <span>Group Name</span>
              </Grid>
              <Grid item xs={12} md={3} >
                <RegularTextFieldSmall
                  name="groupName"
                  type="text"
                  value={values.groupName}
                  onChange={(e) => {handleChange(e)}}
                  onBlur={handleBlur}
                  // label="Group Name"
                />
                {validMessage(`groupName`)}                           
              </Grid>

              {/* Empty Grid for Design */}
              <Grid item xs={1}></Grid>

              {/* Number of Applicants Button */}
              <Grid item xs={12} md={2} className={classes.group_info_title}>
                <div>Number of Applicants</div>
              </Grid>
              <Grid item xs={12} md={3} >            
                <ButtonGroup size="small" aria-label="small outlined button group" className={classes.btn_group}>
                    <Button 
                      className={classes.btn_sub}
                      onClick={()=> { 
                      setFieldValue('insuredPersons', newInsuredPerson(values.insuredPersons))
                      setFieldValue('insuredNumber',values.insuredPersons.length )
                      }}>+</Button>
                    {<Button disabled>{values.insuredNumber}</Button>}
                    {<Button 
                        className={classes.btn_sub}
                        onClick={(e) => {
                          if (!e) e = window.event;
                          e.cancelBubble = true;
                          if (e.stopPropagation) e.stopPropagation();

                          if (values.insuredPersons.length > 1) {
                            setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[1]))
                            setFieldValue('insuredNumber', values.insuredPersons.length - 1)
                        }}}>-</Button>}
                </ButtonGroup>
              </Grid>

            </Grid>

            <FieldArray
              name="insuredPersons"
              render={({ form }) => ( 
                <div>
                  {/* Applicant Title */}
                  <Grid item xs={12}
                        className={classes.applicant}
                    >
                      <span>Group Detail</span>
                  </Grid>
                        
                  <Grid container spacing={1}>

                    {values.insuredPersons.length > 0 ? ( 
                      <>
                      {/* Applicant Information table */}
                      <TableContainer >
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.cell_applicant_left}></TableCell>
                              <TableCell className={classes.cell_applicant_left}>Last Name</TableCell>
                              <TableCell className={classes.cell_applicant_left}>First Name</TableCell>
                              <TableCell className={classes.cell_applicant_left}>Date of Birth</TableCell>
                              <TableCell className={classes.cell_applicant_left}>Age</TableCell>
                              <TableCell className={classes.cell_applicant_left}>Gender</TableCell>
                              <TableCell className={classes.cell_applicant_left}>Country of origin</TableCell>
                              <TableCell className={classes.cell_applicant_left}>Beneficiary</TableCell>
                              <TableCell className={classes.cell_applicant_left}></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {values.insuredPersons && values.insuredPersons.length > 0
                              ? values.insuredPersons.map((insuredPerson, index) => (

                                <TableRow
                                  key={index}
                                >
                                  <TableCell>
                                    {index+1}
                                  </TableCell>
                                  {/* Last Name */}
                                  <TableCell component="th" scope="row">
                                    <RegularTextFieldSmall
                                      type="text"
                                      name={`insuredPersons.${index}.lastName`}
                                      value={insuredPerson.lastName}
                                      onChange={(e) => { 
                                        handleChange(e)
                                        // setFieldValue(`insuredPersons.${index}.beneficiaryName`, insuredPerson.lastName + '' + insuredPerson.firstName  )
                                      }}
                                      onBlur={handleBlur}
                                    />
                                      {validMessage(`insuredPersons.${index}.lastName`)}
                                  </TableCell>

                                  {/* First Name */}
                                  <TableCell>
                                    <RegularTextFieldSmall
                                      name={`insuredPersons.${index}.firstName`}
                                      type="text"
                                      value={insuredPerson.firstName}
                                      onChange={(e) => { 
                                        handleChange(e)
                                        // setFieldValue(`insuredPersons.${index}.beneficiaryName`, insuredPerson.lastName + '' + insuredPerson.firstName  )
                                      }}
                                      onBlur={handleBlur}
                                    />
                                      {validMessage(`insuredPersons.${index}.firstName` )}
                                  </TableCell>
                                  
                                  {/* Date of Birth */}
                                  <TableCell>
                                    <KeyboardDatePickerField 
                                        name={`insuredPersons.${index}.birthDate`}
                                        value={insuredPerson.birthDate}
                                        maxDate= {new Date()}
                                        onChange={(e) => { 
                                          // handleChange(e)
                                          setFieldValue(`insuredPersons.${index}.birthDate`, e) 
                                          setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e))   
                                        }}
                                      />
                                    {/* <RegularTextFieldSmall  
                                      variant="outlined"
                                      size="small"
                                      type="date"
                                      value={insuredPerson.birthDate}
                                      name={`insuredPersons.${index}.birthDate`}
                                      onChange={(e) => { 
                                        handleChange(e)
                                        setFieldValue(`insuredPersons.${index}.age`, CalculateAge(e.currentTarget.value) )
                                      }}
                                      onBlur={handleBlur}
                                    /> */}
                                      {validMessage(`insuredPersons.${index}.birthDate`)}
                                  </TableCell>

                                  {/* Age */}
                                  <TableCell>
                                    <RegularTextFieldSmall
                                      name={`insuredPersons.${index}.age`}
                                      type="text"
                                      style={{ width: '70px' }}
                                      value={insuredPerson.age}
                                      disabled
                                    />
                                  </TableCell>

                                  {/* Gender */}
                                  <TableCell>
                                    <SelectTextFieldSmall
                                      name={`insuredPersons.${index}.gender`}
                                      value={insuredPerson.gender}
                                      onChange={(e) => { handleChange(e)}}
                                      onBlur={handleBlur  }
                                    >
                                      <option value={0} hidden>
                                        Select
                                      </option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                                    </SelectTextFieldSmall>
                                      {validMessage(`insuredPersons.${index}.gender`)}
                                  </TableCell>
                                  
                                  {/* Country of origin */}
                                  <TableCell>
                                  <Autocomplete      
                                    options={countries}
                                    value = {insuredPerson.originCountry?countries.find(c=>c.country_code===insuredPerson.originCountry):null}
                                    getOptionLabel={(option) => option.name}
                                    getOptionDisabled={(option) => option.country_code === (values.tripDirection ==='InBound'? 'CA':null) }
                                    size="small"
                                    renderInput={(params) => 
                                        <RegularTextFieldSmall {...params}
                                          name={`insuredPersons.${index}.originCountry`} 
                                          onChange ={handleChange}
                                          onBlur={handleBlur}/>
                                      }
                                    onChange={(e, selectedVal)=>{
                                      insuredPerson.originCountry = selectedVal? selectedVal.country_code: ''
                                      insuredPerson.originCountryName = selectedVal? selectedVal.name: ''
                                      setFieldValue(`insuredPersons.${index}.originCountry`, selectedVal?selectedVal.country_code:'')
                                    }}
                                    // onBlur={handleBlur}
                                  />
                                    {validMessage( `insuredPersons.${index}.originCountry`) }
                                  </TableCell>
                                  
                                  {/* Beneficiary*/}
                                  <TableCell>
                                    <RegularTextFieldSmall
                                        name={`insuredPersons.${index}.beneficiaryRelationship`}
                                        type="text"
                                        style={{ width: '70px' }}
                                        value={insuredPerson.beneficiaryRelationship}
                                        disabled
                                      />
                                  </TableCell>

                                  
                                  <TableCell>
                                      {/* delete button */}
                                      {index!==0 ? 
                                      <IconButton size='small' disableFocusRipple={true} disableRipple={true} onClick={(e) => {
                                          if (!e) e = window.event;
                                          e.cancelBubble = true;
                                          if (e.stopPropagation) e.stopPropagation();

                                          if (values.insuredPersons.length > 1) {
                                            setFieldValue('insuredPersons', values.insuredPersons.filter(person => person !== values.insuredPersons[index]))
                                            setFieldValue('insuredNumber', values.insuredPersons.length - 1)
                                        }
                                      }}>
                                          <HighlightOffIcon />
                                      </IconButton>
                                    : null }
                                  </TableCell>
                                </TableRow>
                              
                              )):null}
                          </TableBody>
                        </Table>
                      </TableContainer>   
                      </>
                    ) : null}
                  </Grid>

                  <Grid item xs={12} style={{marginTop:'3vh'}}>
                    <Button 
                      color="secondary" 
                      size="md" 
                      onClick={() => { 
                      setFieldValue('insuredPersons', newInsuredPerson(values.insuredPersons)); 
                      setFieldValue('insuredNumber',values.insuredNumber )
                      }}>
                        <AddCircleOutlineIcon /> Add Applicant
                    </Button>
                  </Grid>                         

                </div>
                
            
              )}
            ></FieldArray>
          </Grid>

          </CardContent>
        </Card>
          
        ) : null }   


      
      </Grid>

    </div>

  )
}

// ProtoTypes
// ApplicantInformation.propTypes = {
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
// }
export default ApplicantInformationGroup
