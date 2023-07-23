import React from 'react';
import { Card, Grid, CardContent, makeStyles, TextField} from '@material-ui/core'
//custom component
import { Text } from '../../../../components/common/LanguageProvider'
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)


const SpecialNote = ({
  values,
  setFieldValue,
  validMessage,
  handleChange,
  handleBlur,
}) => {

  const classes = useStyles()

  return (
    <>
      <Grid container className={classes.CardBox}>
        <Grid item xs={12} className={classes.applicant}>
          <Text tid={'TravelApplication.NoteTitle'}/>
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container style={{ flexGrow: 1 }}>

                  {/* Language */}
                  {/* <Grid item xs={12} sm={12} md={6} lg={3} xl={3} style={{ marginBottom:'2vh'}}>

                  {/* Note */}
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                        name="note"
                        label={<Text tid={'TravelApplication.Note'}/>}
                        value={values.note}
                        multiline
                        variant="filled"
                        rows={4}
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                   </Grid>
              </Grid>
            </CardContent>
          </Card>
          
        </Grid> 

      </Grid>
    </>
  )
}

export default SpecialNote