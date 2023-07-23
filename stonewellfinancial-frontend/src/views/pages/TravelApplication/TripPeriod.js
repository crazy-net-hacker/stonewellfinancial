import React, { useEffect, useState } from 'react'
//core components
// import { Grid, RadioGroup, Radio, FormControl, FormControlLabel } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';

//common components
import { Text } from '../../../components/common/LanguageProvider';
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall' 
import { getUTCDate } from '../../../controllers/CalculateValue';

// import Button from '../../../components/common/CustomButtons/Button'
import KeyboardDatePickerField from '../../../components/common/CustomDatePickers'
import { CalculateTripEndDate, CalculateTripDays, 
          CalculateAgeBaseEffectiveDate, CalculateAgeDays  
        } from '../../../controllers/CalculateValue'
import InputAdornment from '@material-ui/core/InputAdornment';
import TooltipInfo from '../../../components/common/TooltipInfo';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'

//setup form style
const useStyles = makeStyles(formStyle)

const multiDaysOption = [
  {companyName: 'Allianz', daysOpt: 4},
  {companyName: 'Allianz', daysOpt: 8},
  {companyName: 'Allianz', daysOpt: 15},
  {companyName: 'Allianz', daysOpt: 35},
  // {companyName: 'Allianz', daysOpt: 60},
  // {companyName: 'Allianz', daysOpt: 125},
  {companyName: 'Tugo', daysOpt: 2},
  {companyName: 'Tugo', daysOpt: 5},
  {companyName: 'Tugo', daysOpt: 10},
  {companyName: 'Tugo', daysOpt: 15},
  {companyName: 'Tugo', daysOpt: 20},
  {companyName: 'Tugo', daysOpt: 35},
  {companyName: 'Tugo', daysOpt: 60},
  {companyName: 'BlueCross', daysOpt: 4},
  {companyName: 'BlueCross', daysOpt: 8},
  {companyName: 'BlueCross', daysOpt: 17},
  {companyName: 'BlueCross', daysOpt: 31},
  {companyName: 'BlueCross', daysOpt: 60},
  {companyName: 'BlueCross', daysOpt: 90},
  {companyName: 'BlueCross', daysOpt: 120},
  {companyName: 'BlueCross', daysOpt: 150},
  {companyName: 'BlueCross', daysOpt: 180},
]


export const TripPeriod = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validMessage,
    countries,
    provinces
}) => {
    // set form style
    const classes = useStyles();

    //Mobile responsive
    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }
    useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
    }, []);
    
    let isMobile = (width < 768);

    const minDate = getUTCDate();

    return (
        <div>
                <Grid container style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-50px' : '0' }}>

                    <Grid item xs={12} sm={12} md={12} style={{ marginBottom:'2vh' }}>
                        {/* <span className={classes.spanTitle}><Text tid={'Trip period'}/></span> */}
                    </Grid>
                    {/* <Grid item container xs={12} sm={12} md={10} spacing={2}> */}
                    <Grid item container xs={12} sm={12} md={12} spacing={2}>
                      <div style={{ display: 'none' }}>
                        {/* need to validate for related country fields */}
                        {values.insuranceType = values.application.applicationType}
                      </div>
                      {/* tirp period  */}
                      <Grid item container xs={12} sm={12} md={12} spacing={2}>
                          {/* Start Date */}
                          <Grid item xs={12} sm={4} md={4}>
                            <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripStartDate'}/></label>
                            <br />
                            {/* <KeyboardDatePickerField 
                              name="tripStartDate"
                              value={values.tripStartDate}
                              style={{ width: !isMobile ? '100%' : '105%' }}
                              minDate= {minDate}
                              onChange={(e) => {
                                values.tripStartDate = e
                                setFieldValue('tripStartDate', e)
                                setFieldValue(`tripPeriod`, CalculateTripDays(e,values.tripEndDate)) 
                                // set data all applicant
                                for (const i in values.insuredPersons) {
                                  if (values.insuredPersons[i].sameDate === true){
                                      values.insuredPersons[i].tripStartDate = e
                                      values.insuredPersons[i].tripPeriod = CalculateTripDays(e, values.insuredPersons[i].tripEndDate)
                                      values.insuredPersons[i].age = values.insuredPersons[i].birthDate ? CalculateAgeBaseEffectiveDate(values.insuredPersons[i].birthDate, e): 0;
                                      values.insuredPersons[i].ageDays = values.insuredPersons[i].birthDate ? CalculateAgeDays(values.insuredPersons[i].birthDate, e): 0;
                                      values.insuredPersons[i].selectedPlan = {}
                                      }
                                  if(values.application.applicationType === 'CANADIAN') {
                                    setFieldValue('tripArrivalDate', e)
                                    setFieldValue(`insuredPersons.${i}.arrivalDate`, e)
                                  }
                                }
                              }}
                            /> */}
                           <KeyboardDatePickerField 
                              name="tripStartDate"
                              value={values.tripStartDate}
                              style={{ width: !isMobile ? '100%' : '105%' }}
                              minDate={minDate}
                              onChange={(e) => {
                                const startDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());
                                
                                values.tripStartDate = startDate;
                                setFieldValue('tripStartDate', startDate);
                                setFieldValue(`tripPeriod`, CalculateTripDays(startDate, values.tripEndDate));

                                // Set data for all applicants
                                for (const i in values.insuredPersons) {
                                  if (values.insuredPersons[i].sameDate === true) {
                                    values.insuredPersons[i].tripStartDate = startDate;
                                    values.insuredPersons[i].tripPeriod = CalculateTripDays(startDate, values.insuredPersons[i].tripEndDate);
                                    values.insuredPersons[i].age = values.insuredPersons[i].birthDate ? CalculateAgeBaseEffectiveDate(values.insuredPersons[i].birthDate, startDate) : 0;
                                    values.insuredPersons[i].ageDays = values.insuredPersons[i].birthDate ? CalculateAgeDays(values.insuredPersons[i].birthDate, startDate) : 0;
                                    values.insuredPersons[i].selectedPlan = {};
                                  }
                                  if (values.application.applicationType === 'CANADIAN') {
                                    setFieldValue('tripArrivalDate', startDate);
                                    setFieldValue(`insuredPersons.${i}.arrivalDate`, startDate);
                                  }
                                }
                              }}
                            />


                            {validMessage(`tripStartDate`)}                    
                          </Grid>
                          {/* Expiry Date */}
                          <Grid item xs={12} sm={4} md={4}>
                              <label className={classes.inputLabel_manualForm}><Text tid={'Quote.TripEndDate'}/></label>
                              <br />
                              {/* <KeyboardDatePickerField 
                                  name="tripEndDate"
                                  value={values.tripEndDate}
                                  style={{ width: !isMobile ? '100%' : '105%' }}
                                  disabled={values.tripType === 'MULTI' ? true : false}
                                  minDate= {values.tripStartDate}
                                  onChange={(e) => { 
                                    values.tripEndDate = e
                                    setFieldValue('tripEndDate', e) 
                                    setFieldValue(`tripPeriod`, CalculateTripDays(values.tripStartDate, e))  
                                    // set data all applicant
                                    for (const i in values.insuredPersons) {
                                      if (values.insuredPersons[i].sameDate === true){ 
                                          values.insuredPersons[i].tripEndDate = e
                                          values.insuredPersons[i].tripPeriod = CalculateTripDays(values.insuredPersons[i].tripStartDate, e)
                                          values.insuredPersons[i].selectedPlan = {}
                                      }
                                    }
                                  }}
                                /> */}
                                <KeyboardDatePickerField 
                                  name="tripEndDate"
                                  value={values.tripEndDate}
                                  style={{ width: !isMobile ? '100%' : '105%' }}
                                  disabled={values.tripType === 'MULTI'}
                                  minDate={values.tripStartDate}
                                  onChange={(e) => { 
                                    const endDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());
                                    
                                    values.tripEndDate = endDate;
                                    setFieldValue('tripEndDate', endDate);
                                    setFieldValue(`tripPeriod`, CalculateTripDays(values.tripStartDate, endDate));

                                    // Set data for all applicants
                                    for (const i in values.insuredPersons) {
                                      if (values.insuredPersons[i].sameDate === true) {
                                        values.insuredPersons[i].tripEndDate = endDate;
                                        values.insuredPersons[i].tripPeriod = CalculateTripDays(values.insuredPersons[i].tripStartDate, endDate);
                                        values.insuredPersons[i].selectedPlan = {};
                                      }
                                    }
                                  }}
                                />
                              {validMessage(`tripEndDate`)}                    
                          </Grid>            
                          {/* Total Trip Duration */}
                          <Grid item xs={12} sm={4} md={4}>
                              <RegularTextFieldSmall
                                  name="tripPeriod"
                                  type="number"
                                  disabled={values.tripType === 'MULTI' ? true : values.tripStartDate ? false : true}
                                  style={{ width: !isMobile ? '100%' : '105%' }}
                                  value={values.tripPeriod ? values.tripPeriod : values.tripStartDate && values.tripEndDate ? CalculateTripDays(values.tripStartDate, values.tripEndDate) : ''}
                                  label= {'Quote.TripCoverageDays'}
                                  onChange={(e) => {
                                    handleChange(e)
                                    setFieldValue(`tripEndDate`, 
                                      CalculateTripEndDate(values.tripStartDate, e.currentTarget.value )
                                      )
                                    // set data all applicant
                                    for (const i in values.insuredPersons) { 
                                      if (values.insuredPersons[i].sameDate === true){
                                        values.insuredPersons[i].tripEndDate = CalculateTripEndDate(values.tripStartDate, e.currentTarget.value)
                                        values.insuredPersons[i].tripPeriod = e.currentTarget.value
                                        values.insuredPersons[i].selectedPlan = {}
                                      }
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  InputProps={{
                                    endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                  }}
                              />
                              {validMessage(`tripPeriod`)}                    
                          </Grid>
                      </Grid>
                      <Grid item container xs={12} sm={12} md={12} spacing={2}>

                      {/* need to input Arrival Date when applicationType = VISITOR */}
                      {/* {values.application.applicationType === 'VISITOR' && */}
                      {values.application.applicationType !== 'CANADIAN' &&
                        <>
                              {/* Arrival Date */}
                              <Grid item xs={12} sm={4} md={4}>
                                  <label className={classes.inputLabel_manualForm}>
                                    <Text tid={'Quote.TripArrivalDate'}/>
                                    <TooltipInfo info={<Text tid={'Tooltip.TripArrivalDate'}/>}/>
                                  </label>
                                  <br />
                                  <KeyboardDatePickerField 
                                    name="tripArrivalDate"
                                    value={values.tripArrivalDate}
                                    style={{ width: !isMobile ? '100%' : '105%' }}
                                    // minDate= {new Date()}
                                    onChange={(e) => {
                                      values.tripArrivalDate = e
                                      setFieldValue('tripArrivalDate', e)
                                      // set inDestination is true if tripArrivalDate before today 
                                      values.inDestination = e < new Date(new Date().setDate(new Date().getDate()-1))
                                      // set data all applicant
                                      for (const i in values.insuredPersons) { 
                                          values.insuredPersons[i].arrivalDate = e
                                      }
                                    }}
                                  />
                                  {validMessage(`tripArrivalDate`)}                    
                              </Grid>
                        </>
                      }

                      {/* travel to */}
                          {values.application.applicationType !== 'CANADIAN' 
                            ? (
                            <>
                              {/* destProvince */}
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                    name="destProvince"
                                    options={provinces.filter(i => i.country_code === values.destCountry)}
                                    value={values.destProvince ? provinces.find(c => c.country_code === values.destCountry && c.province_code === values.destProvince) : null}
                                    getOptionLabel={(option) => option.province_name}
                                    size="small"
                                    renderInput={(params) =>
                                        <RegularTextFieldSmall {...params}
                                          label={'TravelApplication.DestinationProvince'} 
                                          // label={'캐나다 내 거주 주'} 
                                        />
                                    }
                                    onChange={(e, selectedVal) => {
                                        values.destProvince = selectedVal ? selectedVal.province_code : ''
                                        values.destProvinceName = selectedVal ? selectedVal.province_name : ''
                                        setFieldValue('destProvince', selectedVal ? selectedVal.province_code : '');
                                        //reset mailing address if selected as no address in canada
                                        if(values.maillingInCanada === false){
                                            values.maillingInCanada = true;
                                            values.mailStreetName = ''
                                            values.mailUnitApartmentNo = ''
                                            values.mailCity = ''
                                            values.mailProvince = ''
                                            values.mailPostalCode = ''   
                                        }
                                    }}
                                />
                                {validMessage('destProvince')}
                              </Grid>
                              {/* originCountry */}
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                    name="originCountry"
                                    options={countries}
                                    value={values.originCountry ? countries.find(c => c.country_code === values.originCountry) : null}
                                    getOptionLabel={(option) => option.name}
                                    // getOptionDisabled={(option) => option.country_code === values.destCountry}
                                    size="small"
                                    renderInput={(params) =>
                                        <RegularTextFieldSmall {...params}
                                          // label={'Home country of residence'} 
                                          label={values.tripArrivalDate && values.tripArrivalDate < new Date() ?'Quote.YourHomeCountryBefore':'Quote.YourHomeCountry'} 
                                          tooltipTitle={'Tooltip.homeCountryOfResidence'}
                                        />
                                    }
                                    onChange={(e, selectedVal) => {
                                        values.originCountry = selectedVal ? selectedVal.country_code : ''
                                        values.originCountryName = selectedVal ? selectedVal.name : ''
                                        setFieldValue('originCountry', selectedVal ? selectedVal.country_code : '')
                                        setFieldValue('originProvince', '')
                                        setFieldValue('originProvinceName', '')
                                    }}
                                />
                                {validMessage('originCountry')}
                              </Grid>
                            </>
                            ):(
                            <>
                            {/* need to input Trip Type when applicationType = CANADIAN */}
                            {/* Trip Type */}
                            <Grid item xs={12} sm={4}>
                                  <SelectTextFieldSmall
                                      name={`tripType`}
                                      value={values.tripType}
                                      // disabled = {values.tripStartDate ? false : true}
                                      disabled = {values.tripStartDate && values.application.applicationCompany !== 'BlueCross' ? false : true}
                                      label={"TravelApplication.TravelType"}
                                      tooltipTitle={values.application.applicationCompany !== 'BlueCross' ? 'Tooltip.TripType' : 'Tooltip.TripType.BlueCross'}
                                      onChange={(e) => { 
                                        handleChange(e)
                                        // set tripPeriod as 365 when Multi
                                        if (e.currentTarget.value === 'MULTI'){
                                          // console.log('tripType',values.tripType)
                                            setFieldValue(`tripPeriod`, '365') 
                                            setFieldValue(`tripEndDate`,CalculateTripEndDate(values.tripStartDate, 365))   
                                        } 
                                        else 
                                        //set tripPeriod as 365 when !Multi
                                        { 
                                            setFieldValue(`tripEndDate`, null)
                                            setFieldValue(`tripPeriod`, '')
                                            setFieldValue(`multiTripDays`, '')
                                        }
                                        // set data all applicant
                                        for (const i in values.insuredPersons) { 
                                              setFieldValue(`insuredPersons.${i}.tripType`, e.currentTarget.value)
                                              setFieldValue(`insuredPersons.${i}.selectedPlan`,[])
                                              if (e.currentTarget.value === 'MULTI'){
                                                  setFieldValue(`insuredPersons.${i}.tripPeriod`, '365') 
                                                  setFieldValue(`insuredPersons.${i}.tripEndDate`,
                                                      CalculateTripEndDate(values.tripStartDate, 365)
                                                  ) 
                                              } else{
                                                  setFieldValue(`insuredPersons.${i}.tripEndDate`, null)
                                                  setFieldValue(`insuredPersons.${i}.tripPeriod`, '')
                                                  setFieldValue(`insuredPersons.${i}.multiTripDays`, '')
                                              }
                                        }
                                        // console.log('person',values.insuredPersons)
                                      }}
                                      onBlur={handleBlur}
                                      style={{ width: !isMobile ? '100%' : '105%' }}
                                      >
                                      <option value={0} hidden>
                                        {/* <Text tid={'Quote.Select'}/> */}
                                        Select
                                      </option>
                                      <option value="SINGLE">
                                        {/* <Text tid={'Quote.SingleTrip'}/> */}
                                        Single Trip
                                      </option>
                                      <option value="MULTI">
                                        {/* <Text tid={'Quote.MultiTrip'}/> */}
                                        Multi Trip
                                      </option>
                                  </SelectTextFieldSmall>
                                  {validMessage(`tripType`)}                    
                              </Grid>
                              {/* Multi Trip days*/}
                              {values.tripType === 'MULTI' && 
                                  <Grid item xs={12} sm={4} md={4}>
                                    <SelectTextFieldSmall
                                      name={`multiTripDays`}
                                      label={"TravelApplication.MultiDays"}
                                      value={values.multiTripDays ? values.multiTripDays : ''}
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        setFieldValue(`multiTripDays`, e.currentTarget.value)
                                        for (const i in values.insuredPersons) { 
                                            setFieldValue(`insuredPersons.${i}.multiTripDays`, e.currentTarget.value)
                                        }
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      <option value="" hidden></option>
                                      {multiDaysOption.filter(i => i.companyName === values.application.applicationCompany)
                                                      .map((item, index) => (
                                                          <option key={index} value={item.daysOpt}>
                                                            {item.daysOpt}
                                                          </option>
                                      ))}
                                    </SelectTextFieldSmall>
                                    {validMessage(`multiTripDays`)}                 
                                  </Grid>
                              } 
                              {/* origin province */}
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    name="originProvince"
                                    // options={values.application.applicationCompany !== 'BlueCross'
                                    //           ? provinces.filter(i => i.country_code === 'CA')
                                    //           : provinces.filter(i => i.country_code === 'CA' && (i.province_code === 'ON' || i.province_code === 'QC' || i.province_code === 'NB' || i.province_code === 'PE' || i.province_code === 'NL' || i.province_code === 'NS' ))}
                                    options = {values.application.applicationCompany === 'Allianz'
                                                ? provinces.filter(i => i.country_code === 'CA' && (i.province_code === 'ON' || i.province_code === 'QC'))
                                                : (values.application.applicationCompany !== 'BlueCross'
                                                    ? provinces.filter(i => i.country_code === 'CA')
                                                    : provinces.filter(i => i.country_code === 'CA' && (i.province_code === 'ON' || i.province_code === 'QC' || i.province_code === 'NB' || i.province_code === 'PE' || i.province_code === 'NL' || i.province_code === 'NS')))
                                              }
                                    value={values.originProvince ? provinces.find(c => c.country_code === values.originCountry && c.province_code === values.originProvince) : null}
                                    getOptionLabel={(option) => option.province_name}
                                    //getOptionLabel={(option) => option.province_name} //to display full province names
                                    //getOptionDisabled={(option) => option.province_code === values.destProvince}
                                    size="small"
                                    renderInput={(params) =>
                                        <RegularTextFieldSmall {...params}
                                          label={"TravelApplication.OriginProvince"} />
                                    }
                                    onChange={(e, selectedVal) => {
                                        // values.originCountry = 'CA'
                                        values.originProvince = selectedVal ? selectedVal.province_code : ''
                                        values.originProvinceName = selectedVal ? selectedVal.province_name : ''
                                        setFieldValue('originCountry', 'CA')
                                        setFieldValue('originCountryName', 'Canada')
                                        setFieldValue('originProvince', selectedVal ? selectedVal.province_code : '')
                                        //reset mailing address if selected as no address in canada
                                        if(values.maillingInCanada === false){
                                          values.maillingInCanada = true;
                                          values.mailStreetName = ''
                                          values.mailUnitApartmentNo = ''
                                          values.mailCity = ''
                                          values.mailProvince = ''
                                          values.mailPostalCode = ''   
                                        }
                                    }}
                                    // onBlur={() => setTouched({ 'originProvince': true })}
                                />
                                {validMessage('originProvince')}
                              </Grid>
                              {/* destCountry */}
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete               
                                    options={countries}
                                    value = {values.destCountry?countries.find(c=>c.country_code===values.destCountry):null}
                                    getOptionLabel={(option) => option.name}
                                    getOptionDisabled={(option) => option.country_code === 'CA'}
                                    size="small"
                                    renderInput={(params) => 
                                        <RegularTextFieldSmall {...params} 
                                          label={"TravelApplication.Destination"}
                                          name={`destCountry`} 
                                          onChange ={handleChange}
                                          onBlur={handleBlur}/>
                                    }
                                    onChange={(e, selectedVal)=>{
                                        values.destCountry = selectedVal? selectedVal.country_code: ''
                                        setFieldValue(`destCountry`, selectedVal?selectedVal.country_code:'')
                                        // set data all applicant
                                        for (const i in values.insuredPersons) { 
                                          setFieldValue(`insuredPersons.${i}.destCountry`, selectedVal?selectedVal.country_code:'')
                                          setFieldValue(`insuredPersons.${i}.selectedPlan`,[])
                                        }
                                      }}
                                      onBlur={() => setFieldTouched(`destCountry`)}
                                    style={{ width: !isMobile ? '100%' : '102%' }}
                                />
                                {validMessage('destCountry')}
                              </Grid>
                              {/* destProvince */}
                              {values.destCountry === 'US' 
                                ? <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        name="destProvince"
                                        options={provinces.filter(i => i.country_code === values.destCountry)}
                                        value={values.destProvince ? provinces.find(c => c.country_code === values.destCountry && c.province_code === values.destProvince) : null}
                                        getOptionLabel={(option) => values.destCountry === 'CA' ? option.province_code : option.province_name}
                                        size="small"
                                        renderInput={(params) =>
                                            <RegularTextFieldSmall {...params} 
                                                label={values.destCountry === 'CA' 
                                                  ? "TravelApplication.DestinationProvince"  
                                                  : "TravelApplication.DestinationState" } 
                                                  tooltipTitle={'Tooltip.destProvince'}
                                            />
                                        }
                                        onChange={(e, selectedVal) => {
                                            values.destProvince = selectedVal ? selectedVal.province_code : ''
                                            values.destProvinceName = selectedVal ? selectedVal.province_name : ''
                                            setFieldValue('destProvince', selectedVal ? selectedVal.province_code : '');
                                        }}
                                    />
                                    {validMessage('destProvince')}
                                </Grid>
                                :
                                <Grid item xs={12} sm={6} md={4}></Grid>
                              }
                              
                            </>
                            )
                          }
                      </Grid>

                    </Grid>

                    {/* Applicant Eligibilty Confirmation  */}
                    {/* <Grid item container style={{ marginTop:'2vh' }}>
                      { width > 768 ? (
                        <Grid item xs={12} sm={2}></Grid>
                      ) : null }
                        <Grid item xs={12} sm={8} md={6} style={{paddingLeft:'8px'}}>
                            <label className={classes.inputLabel_manualForm}>* Do you confirm all applicants are eligible to apply</label>
                        </Grid>
                        
                        <FormControl>
                            <RadioGroup
                                name="eligilbeAgrement"
                                style={{ flexDirection: 'initial' }}
                                value={values.eligilbeAgrement}
                                onChange={(e) => {
                                  const val = e.currentTarget.value === 'true' ? true : false
                                  setFieldValue(`eligilbeAgrement`, val)
                                }}
                                onBlur={handleBlur}
                                >
                                <FormControlLabel style={{ margin:'0 1vh' }} value= {true} control={<Radio />} label="Yes" />
                                <FormControlLabel style={{ margin:'0 1vh' }} value= {false} control={<Radio />} label="No" />
                            </RadioGroup>
                            {validMessage('eligilbeAgrement')}
                        </FormControl>
                        
                    </Grid> */}

                </Grid>
        </div>
    )
}

export default TripPeriod
