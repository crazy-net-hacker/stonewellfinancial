import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
import { Formik, Form, ErrorMessage, Field } from 'formik'
// Redux
// import {  useSelector, useDispatch } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getPlanDocument } from "../../../../redux/actions/insurancePlans";
// import { postRefundRequest } from "../../../../redux/actions/refundAction";
// core components
import {
  Dialog, DialogContent, 
  Typography, Grid
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import { MdClose } from 'react-icons/md'
import { IconButton, Checkbox } from "@material-ui/core";
// import Alert from '@material-ui/lab/Alert';
// import Autocomplete from "@material-ui/lab/Autocomplete";

// components
import { Text } from "../../../../components/common/LanguageProvider";
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'

//icons
// import GetAppIcon from '@material-ui/icons/GetApp'

//style
import formStyle from "../../../../assets/jss/styles/formStyle";
// import { ContactlessOutlined } from "@material-ui/icons";

const useStyles = makeStyles(formStyle)

const AddFamilyModal = (props) => {
  // const { refundId, isSubmited, company, plan, type, open, handleClose } = props;
  const { isSubmited, addFamily, open, handleClose } = props;

  const classes = useStyles()

  // console.log('refundData',refundData)

  
  //Mobile design
  // const [width, setWidth] = useState(window.innerWidth);
  // function handleWindowSizeChange() {
  //   setWidth(window.innerWidth);
  // }
  // useEffect(() => {
  //   window.addEventListener('resize', handleWindowSizeChange);
  //   return () => {
  //       window.removeEventListener('resize', handleWindowSizeChange);
  //   }
  // }, []);
  // let isMobile = (width < 768);

  const validationSchema = Yup.object({
    // questionType: Validation.validRequiredField(),
    firstName: Validation.validRequiredField(),
    lastName: Validation.validRequiredField(),
    birthDate: Validation.validRequiredDateField(),
    age: Validation.validRequiredNumberField(),
    gender: Validation.validRequiredField(),
    emailAdd: Validation.validEmail(),
    phoneNum: Validation.validPhoneNumber(),
    statusCanada: Validation.validRequiredField(),
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


  const initialData = {
    firstName: addFamily.firstname,
    lastName: addFamily.lastname,
    email: addFamily.email,
    phone: addFamily.phone
  }

  // console.log(addFamily[0].firstname)

  const dispatch = useDispatch();
  // const documents = useSelector(state => state.insurancePlanReducer.documents)

  // useEffect
  useEffect(() => {
      dispatch(getPlanDocument())
  }, [dispatch]);

  // const result = useSelector(state => state.refundReducer.result)

  // const [notice, setNotice] = useState('')

  // const [link, setLink] = useState('')



  const handleSubmit = async (values) => {
  
    const formData = Object.keys(values).reduce((formData, key) => {
      formData.append(key, values[key])
      return formData
    }, new FormData())

    formData.delete('refundForm')
    formData.delete('requiredFile')

    formData.append('RefundRequested', values.refundForm)
    formData.append('RefundRequested', values.requiredFile)

    // // for (let value of formData.entries()) {
    // //   console.log(value)
    // // }

    // dispatch(postRefundRequest(formData))
    // // check result
    // refundId(result.refund_id)
    isSubmited(true)
    
  }



  return (
    <div>
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
            {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
            Add Family
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
        <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ values, handleChange, handleBlur, setFieldValue, setFieldTouched, errors, resetForm }) => (
            <Form>
          <Grid container>
            <Grid item container style={{ margin:'2vh 0' }}>
              <Typography variant="subtitle1" color="textPrimary" style={{ marginRight:'2vh' }}>
                {/* <Text tid={'Dashboard.MyInsurancePlan'}/> */}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary"></Typography>
            </Grid>        

            <Grid item xs={12} sm={6}>
              <RegularTextField
                name='lastName'
                label='Last Name'
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                // error={errors.lastName}
              />
              {validMessage('lastName')}
              </Grid>

              <Grid item xs={12} sm={6}>
              <RegularTextField
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {validMessage('firstName')}
            </Grid>

            <Grid item xs={12} sm={6}>
              <RegularTextField
                name="birthDate"
                label="Date of Birth"
                type="date"
                value={values.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {validMessage('birthDate')}
            </Grid>

            <Grid item xs={12} sm={6}>
              <SelectTextField
                name="gender"
                label="Gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option hidden>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectTextField>
              {validMessage('gender')}
            </Grid>

           

            <Grid item xs={12} sm={12}>
              <SelectTextField
                name="statusCanada"
                label="Status in Canada"
                value={values.statusCanada}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option hidden>Select status</option>
                <option value="iStudent">International Student</option>
                <option value="visitor">Visitor</option>
                <option value="foreignWorker">Foreign Worker</option>
                <option value="tempResident">Temporary Resident</option>
                <option value="permResident">Permanent Resident</option>
                <option value="citizen">Canadian Citizen</option>
              </SelectTextField>
              {validMessage('statusCanada')}
            </Grid>

            <Grid item xs={12} sm={12} style={{ padding: 20 }}>
              <label>
                <Field type="checkbox" name="provHealthInsurance" as={Checkbox}/>
                {'Covered by Provincial Health Insurance'}
              </label>
            </Grid>
                
          </Grid>

                

                

          <div className={classes.textEnd}>
              <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  className={classes.button}
                  >
                  Save
              </Button>
          </div>
          </Form>
          )}
          </Formik>
        </DialogContent>
       
      </Dialog>

    </div>
  );
  
}

export default AddFamilyModal;