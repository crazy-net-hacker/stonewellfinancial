import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
// common customized components
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'

// const useStyles = makeStyles((theme) => ({
//   // root: {
//   // },
// }))

const Criteria = (props) => {
  const { dateType, criteriaData, setCriteriaData, onClick} = props
  
  // const classes = useStyles()

  const [enabled, setEnabled] = useState(true)

  const handleChange = (event) => {
   const name = event.target.name;
   setCriteriaData({
     ...criteriaData,
     [name]: event.target.value,
   });
  // validate()
  };

  const [errors, setErrors] = useState({
   fromDateError: '',
   toDateError: '',
  })

  // Check Validation
  function validate(){
    let errors = {};
    let isValid = true;

    if (!criteriaData.fromDate) {
      isValid = false;
      errors.fromDateError = "Please check selected date"
    }

    if (!criteriaData.toDate) {
      isValid = false;
      errors.toDateError = "Please check selected date"
    }

    if (criteriaData.fromDate > criteriaData.toDate){
      isValid = false;
      errors.toDateError = "To date must be grater than From date"
    }

    setErrors(errors);

    return isValid;
  }

  useEffect(() => {
    setEnabled(validate())// eslint-disable-next-line
  }, [criteriaData])


  return (

    <Box>
     <Grid container spacing={2} justify="center" alignItems="center" style={{ marginBottom:'3vh' }}>

            <Grid item xs={12} sm={4}>
                <label style={{ marginBottom:'-0.5rem', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>From</label>
                <RegularTextField
                  name = "fromDate"
                  value={criteriaData.fromDate}
                  type = {dateType&&dateType==='M'?"month":"date"}
                  // label={'From'}
                  onChange={handleChange}
                  fullWidth
                  helperText={errors.fromDateError}
                  error={!!errors.fromDateError}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <label style={{ marginBottom:'-0.5rem', fontSize:'14px', fontWeight:'600', marginLeft:'5px'}}>To</label>
                <RegularTextField
                  name = "toDate"
                  value={criteriaData.toDate}
                  // type = "date"
                  type = {dateType&&dateType==='M'?"month":"date"}
                  // label={'To'}
                  onChange={handleChange}
                  fullWidth
                  helperText={errors.toDateError}
                  error={!!errors.toDateError}
                />
            </Grid>

            <Grid item xs={12} sm={4} >
              <Button variant="contained" color="primary" 
                style={{marginTop:'3vh'}}
                onClick={() => {
                        if (enabled === true){
                            setCriteriaData(criteriaData)
                            onClick() }
                  }}
                >
                Search
              </Button>
            </Grid>

      </Grid>
   </Box>
  )
}

export default Criteria