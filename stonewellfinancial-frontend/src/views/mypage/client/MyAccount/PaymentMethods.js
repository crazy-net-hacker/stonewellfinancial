import React, { useState } from 'react';

// form and validation

import { Formik } from 'formik'
// import * as Yup from 'yup'
// import * as Validation from '../../../Validation'


// core components
import { Card, CardContent } from '@material-ui/core'
import { Typography, Grid } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider'

// common components
import Button from '../../../../components/common/CustomButtons/Button'
// import { PaymentMethod } from './PaymentMethod'
import AddCreditCardModal from './AddCreditCardModal'
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'

// style
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// icons
import CreditCardIcon from '@mui/icons-material/CreditCard';

const useStyles = makeStyles(dashboardStyles)

export const PaymentMethods = (props) => {

  const classes =  useStyles();

  const [openEdit, setOpenEdit] = useState(false)

  //  Add Credit Card Modal
    const [addData, setAddData] = useState([]);
    const [openAddCreditCard, setOpenAddCreditCard] = useState(false)
    
    const handleAddData = () => {
      //  applications.filter(f => (f.insuredpersons.insuredPersonID === person.insuredPersonID))
      setAddData()
      // console.log()
      setOpenAddCreditCard(true)
    }

  const initialValues = {
    cardType: 'VISA',
    cardNum: '**** **** **** 7123',
    cardName: 'Samantha Jin',
    cardExpired: '12/27',
    cardCVC: '***'
  }

  const handleSubmit = (values) => {
    values.status = 'requested'
    console.log(values)
  }

  return (
    <div className={classes.root}>
      <Card variant='outlined'>
        <CardContent>
        <Formik
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
          {({ values, handleChange, handleBlur,  setFieldValue }) => (
          <Grid container spacing={2}>

          <Grid item container style={{ paddingBottom:'15px', alignSelf: 'center' }}>
            <Grid item xs={10} style={{ alignSelf: 'center' }}>
              <Typography className={classes.cardBoxTitle}>
                {/* <Text tid={'Vendor.StartApplication'} /> */}
                <CreditCardIcon/>
                <span style={{ marginLeft:'5px' }}>
                  <Text tid={'Dashboard.PaymentMethod'} />
                </span>
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign:'right' }}>
              <Button 
                color='primary' 
                size='md' 
                onClick={() => handleAddData()}
                >
                Add
              </Button>
            </Grid>
          </Grid>

          <Grid item container style={{ border:'1px solid #ddd', borderRadius:'5px', padding:'8px 24px'}}>
            <Grid item container xs={12} md={3}>
              <Grid item xs={12} style={{ fontWeight:'600'}}>
                <label className={classes.inputLabel} style={{ width:'100%' }}>{values.cardType}</label>
              </Grid>
              {openEdit === true ? 
                <Grid item xs={10}>
                  <RegularTextField
                    name='cardType'
                    label=''
                    value={values.cardNum}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // error={errors.lastName}
                  />
                  {/* {validMessage('firstName')} */}
                </Grid>
                
              : <Grid item xs={12} style={{ fontWeight:'600', marginBottom:'12px'}}> 
                 <span className={classes.inputValue} style={{ width:'100%' }}>{values.cardNum}</span>
                </Grid>
              }
            </Grid>
            <Grid item container xs={12} md={2}>
              <label className={classes.inputLabel} style={{ width:'100%' }}>Expiry Date</label>
              {openEdit === true ? 
                <Grid item xs={10}>
                  <RegularTextField
                    name='expiryDate'
                    label=''
                    value={values.cardExpired}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // error={errors.lastName}
                  />
                  {/* {validMessage('firstName')} */}
                </Grid>
              :  <Grid item xs={12} md={6} style={{ fontWeight:'600', marginBottom:'12px'}}>
                    <span className={classes.inputValue}>{values.cardExpired}</span>
                  </Grid>
              }
            </Grid>
            <Grid item container xs={12} md={1}>
              <Grid item xs={12} style={{ fontWeight:'600'}}>
                <label className={classes.inputLabel} style={{ width:'100%' }}>CVC</label>
              </Grid>
              {openEdit === true ? 
                <Grid item xs={10}>
                  <RegularTextField
                    name='cvc'
                    label=''
                    value={values.cardCVC}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // error={errors.lastName}
                  />
                  {/* {validMessage('firstName')} */}
                </Grid>
              :  <Grid item xs={12} style={{ fontWeight:'600', marginBottom:'12px'}}> 
                    <span className={classes.inputValue} style={{ width:'100%' }}>{values.cardCVC}</span>
                 </Grid>
              }
            </Grid>
            <Grid item container xs={12} md={3}>
              <Grid item xs={12} style={{ fontWeight:'600'}}>
                <label className={classes.inputLabel} style={{ width:'100%'}}>Card Holder</label>
              </Grid>
              {openEdit === true ? 
                <Grid item xs={12}>
                  <RegularTextField
                    name='cardHolder'
                    label=''
                    value={values.cardName}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // error={errors.lastName}
                  />
                  {/* {validMessage('firstName')} */}
                </Grid>
              :  <Grid item xs={12} style={{ fontWeight:'600', marginBottom:'12px'}}> 
                      <span className={classes.inputValue} style={{ width:'100%' }}>{values.cardName}</span>
                 </Grid>
              }
            </Grid>
                <Grid item container xs={12} md={3} style={{ justifyContent:'flex-end', alignSelf:'center' }}>
                  <Button color='primary' size="small" onClick={() => setOpenEdit(!openEdit)}>
                      {openEdit === true ? 'Save' : 'Edit'}
                  </Button>
                  <Button variant="text" size="small">
                      Delete
                  </Button>
                </Grid>
            </Grid>

            {openAddCreditCard === true &&
              <AddCreditCardModal
                addData={addData}
                // company={insurance.company}
                // plan={insurance.plan}
                // type={insurance.type}
                open={openAddCreditCard}
                handleClose={setOpenAddCreditCard}
              />
            }

            {/* <Grid item xs={12}>
              <PaymentMethod />
            </Grid> */}

          </Grid>
          )}
          </Formik>
         
        </CardContent>
      </Card>
    </div>
  )
}