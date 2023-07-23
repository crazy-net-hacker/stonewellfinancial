import React, { useState } from 'react'

// form and validation
import { Formik, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Typography, Grid } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider'

// common components
import { RegularTextField, /*SelectTextField*/ } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'

// icons
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

// styles
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => <div style={{ color: 'red' }}>{msg}</div>}
    />
  )
}

const initialValues = {
  // questionType: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  status: 'requested',
}

const validationSchema = Yup.object({
  // questionType: Validation.validRequiredField(),
  currentPassword: Validation.validPasswordRequired(),
  newPassword: Validation.validPasswordRequired(),
  confirmPassword: Validation.confirmPassword(),
})

const handleSubmit = (values) => {
  values.status = 'requested'
  console.log(values)
}



export const Settings = (props) => {
  const classes = useStyles()
  
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
            handleSubmit(values)
          }}
          >
          {({ values, handleChange }) => 
            <Form>
              <Grid container>

              <Grid item container style={{ marginBottom:'15px', borderBottom:'1px solid #efefef', paddingBottom:'15px' }}>
                <Typography className={classes.cardBoxTitle}>
                  {/* <Text tid={'Vendor.StartApplication'} /> */}
                  <EnhancedEncryptionIcon/> <Text tid={'Dashboard.ChangePassword'} />
                </Typography>
              </Grid>

                <Grid item container>
                 
                  {openEdit === true ? 
                    <Grid item xs={12} sm={6}>
                      <RegularTextField
                        name='currentPassword'
                        label='Current Password'
                        value={values.currentPassword}
                        onChange={handleChange}
                      />
                      {validMessage('currentPassword')}
                    </Grid>
                  :   
                    <Grid item xs={6} lg={2} style={{ marginLeft:'8px' }}>
                      <label>Current Password</label>
                      <p className={classes.inputValue}>**********</p>
                    </Grid>
                  }
                </Grid>

                {openEdit === true ? 
                  <>
                    <Grid item container style={{ marginBottom:'30px' }}>
                      <Grid item xs={12} sm={6}>
                        <RegularTextField
                          name='newPassword'
                          label='New Password'
                          value={values.newPassword}
                          onChange={handleChange}
                        />
                        {validMessage('newPassword')}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <RegularTextField
                          name='confirmPassword'
                          label='Confirm Password'
                          value={values.confirmPassword}
                          onChange={handleChange}
                        />
                        {validMessage('confirmPassword')}
                      </Grid>
                    </Grid>
                  </>
                :null}

                <Grid item xs={12} style={{ textAlign:'right' }}>
                  <Button color="primary" size="md" type="submit" onClick={() => setOpenEdit(!openEdit)}>
                  {openEdit === true ? 'Save New Password' : 'Change Password'}
                  </Button>
                </Grid>

              </Grid>
            </Form>}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
