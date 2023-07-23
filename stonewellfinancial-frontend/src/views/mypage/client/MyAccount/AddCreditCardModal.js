import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
import { Formik, Form } from 'formik'
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
import { IconButton } from "@material-ui/core";
// import Alert from '@material-ui/lab/Alert';
// import Autocomplete from "@material-ui/lab/Autocomplete";

// components
// import { Text } from "../../../../components/common/LanguageProvider";
import Button from '../../../../components/common/CustomButtons/Button'
import { RegularTextField } from '../../../../components/common/CustomTextFields/TextField'

//icons
// import GetAppIcon from '@material-ui/icons/GetApp'

//style
import formStyle from "../../../../assets/jss/styles/formStyle";
// import { ContactlessOutlined } from "@material-ui/icons";

const useStyles = makeStyles(formStyle)

const AddCreditCardModal = (props) => {
  // const { refundId, isSubmited, company, plan, type, open, handleClose } = props;
  const { isSubmited, open, handleClose } = props;

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
  // function validMessage(fieldName) {
  //     return (
  //         <ErrorMessage
  //             name={fieldName}
  //             render={(msg) => 
  //                 <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
  //                     <Text tid={`Validation.${msg}`}></Text>
  //                 </div>
  //             }
  //         />
  //     );
  // }


  const initialData = {
    // firstName: addData.firstname,
    // lastName: addData.lastname,
    // email: addData.email,
    // phone: addData.phone
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
            Add Credit Card
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

            <Grid item xs={12}>
                  <RegularTextField
                      name='cardHolder'
                      label='Card Holder'
                      value={values.cardHolder}
                  />
                </Grid>

                <Grid item xs={12}>
                  <RegularTextField
                      name='cardNum'
                      label='Card Number'
                      value={values.cardNum}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RegularTextField
                      name='expireDate'
                      label='Expire Date'
                      value={values.expireDate}
                      type='date'
                  />
                </Grid >

                <Grid item xs={12} md={6}>
                  <RegularTextField
                      name='CVC'
                      label='CVC'
                      value={values.cVC}
                  />
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

export default AddCreditCardModal;