import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage} from 'formik'
import * as Yup from 'yup'
// core components
import {
  Dialog, DialogContent,  
  Typography, IconButton, Checkbox, Grid,
} from '@material-ui/core'
import Button from '../CustomButtons/Button'

import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'
//
import { Text, LanguageContext } from "../LanguageProvider";
//icon
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999999,
  },
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  button: {
    margin: 10,
    '&:hover': {
      color: '#fff',
    },
  },
  back_button: {
    width: '100%'
  },
  next_button: {
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
  },
  divider: {
    margin: '16px 0',
  },
  btnWrapper: {
    textAlign: 'center',
  },
  nested: {
    paddingLeft: theme.spacing(4)
}
}))


const MedEligibilityAllianzForm = (props) => {
  // const { medQuestion, questionnaire, open, handleClose, medicalChargeRate  } = props;
  const { medQuestion, questionnaire, open, handleClose } = props;

  const classes = useStyles()

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage


  const planMedQuest = medQuestion.map(i => i.planMedQuestion)
  const planMedQuestAnswer = ((planMedQuest.map(m => m.medicalQuestion)).map(a => a.quesAnswer)).map(ans => ans)
 
  const initialData = getInitialData()

  function getInitialData(){

    if (planMedQuestAnswer.map(i=>i.length) > 0)
    {
      const iniData = planMedQuestAnswer.map(i=>i)[0].map(a => ({
        questionnaire_id : a.questionnaire_id,
        question_code : a.question_code,
        header_content_kr : a.header_content_kr,
        header_content_en : a.header_content_en,
        question_kr : a.question_kr,
        question_en : a.question_en,
        input_type : a.input_type,
        answer : a.answer,
        answerResult: a.answerResult
      }))

        return(iniData)
    }
    else
    {
      const iniData = questionnaire.map(item => ({
        questionnaire_id : item.questionnaire_id,
        question_code : item.question_code,
        header_content_kr : item.header_content_kr,
        header_content_en : item.header_content_en,
        question_kr : item.question_kr,
        question_en : item.question_en,
        input_type : item.input_type,
        answer : item.answer,
        answerResult : ''
      }))

      return(iniData)
    }

  }


  // validationSchema
  const validationSchema = Yup.array().of(
  Yup.object().shape({
    answerFlag: Yup.number().min(1, 'RequiredAnswer').required('RequiredAnswer'),
  }))

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


  // text line break
  // text line break
  function textLineBreak(text){
    if (!text){
      return('');
    }else{
      return(
        text.split('\n')
            .map((item, idx) => {
              return (
                <React.Fragment key={idx}>
                  {item}
                  <br />
                </React.Fragment>
              )
            })
      );
    }
}

  // handleSubmit
  const handleSubmit = async (values) => {
    // console.log(values)

    let chargeRate = '1'
    if(values[0].answerResult === false){chargeRate = '0'}

    // result of medical questions
    planMedQuest.map(m => m.medicalQuestion.confirmEligibility = values[0].answerResult)
    planMedQuest.map(m => m.medicalQuestion.chargeRate = chargeRate)
    planMedQuest.map(m => m.medicalQuestion.quesAnswer = values)
    planMedQuest.map(m => m.medicalQuestion.answered = true)

    // 
    if(medQuestion.map(i=>i.isSelectedPlan)[0] === 'Y'){
      document.getElementById("allianz_selectePlan_button").click()
    }

    handleClose(false)

  }


  return (
    <div>
      <Dialog 
        style={{zIndex: 9999}}
        fullWidth={true}
        maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography variant="h2" className={classes.formTitle}>
            Allianz - Visitors to Canada Eligibility 
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
          {/* <DialogContentText> </DialogContentText> */}

          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, setFieldValue, setFieldTouched, errors }) => (
              <Form>
                <div>            
                {values && values.map((v, index) => (
                  <div key = {index}>
                  <Grid  container>
                    <Grid item xs={12}>
                      <Typography variant="h5" style={{ marginTop: '1vh', fontSize:'14px', color:'#666', lineHeight:'2', padding:'1vh', background:'#f5f9ff' }}>
                        {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                      </Typography> 
                    </Grid>

                    <Grid item xs={12} style={{marginTop: '3vh'}}>
                      <FieldArray
                          name="answer"
                          render={({ form }) => (
                            <div>
                            {v.answer.map((a, a_index) => (
                              <div key = {a_index}>
                              <Grid  container>

                                
                             
                                  <div style={{ display: 'none' }}>
                                    {values[0].answerFlag = values.filter(f=>f.question_code ===values[0].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                                  </div> 
                            
                                
                                <Grid item xs={10}>                
                                  <Typography variant="h5" className={classes.nested}>
                                  <Checkbox
                                    name={`values.${0}.answer.${a_index}.answer_value`}
                                    checked={a.answer_value?a.answer_value:false}
                                    icon={<CircleUnchecked />}
                                    checkedIcon={<CircleCheckedFilled />}
                                    size="small"
                                    onChange={ (e) => {
                                      for (const i in v.answer) { 
                                          setFieldValue(`${0}.answer.${i}.answer_value`, false)
                                      }
                                      setFieldValue(`${0}.answer.${a_index}.answer_value`,e.target.checked) 

                                      setFieldValue(`${0}.answerResult`,
                                                          a.answer_code === 'q1a1'
                                                            ?a.answer_code === 'q1a1' && e.target.checked === true ? true:''
                                                            :a.answer_code === 'q1a2' && e.target.checked === true ? false:'' )  
                                      
                                      setFieldTouched(`${0}.answerFlag`, v.answer.filter(f=>f.answer_value === true).length)  

                                      }
                                    }
                                  />     
                                  
                                    {currentLanguage === 'ko' ? a.content_kr : a.content_en}
                                  </Typography> 
                                </Grid>


                              </Grid>
                              </div>
                            ))}
                          </div>
                          )}
                        />
                        {validMessage(`${0}.answerFlag`)}

                    </Grid>
  
                  </Grid>

                  </div>
                ))}

              </div>

                {/* <div className={classes.btnWrapper}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {handleClose(false)}}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  className={classes.button}
                >
                  Confirm
                </Button>
                </div> */}
                <Grid item container style={{ margin: '5vh 0 5vh 0' }} justify="center" spacing={1}>
                    <Grid item xs={6} lg={3}>
                      <Button
                        color="secondary"
                        className={classes.back_button}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                        {/* 닫기 */}
                      </Button>
                    </Grid>

                    <Grid item xs={6} lg={3}>
                      <Button
                        color="dark"
                        type="submit"
                        className={classes.next_button}
                        // onClick={() => {handleClose(false)}}
                      >
                        Confirm
                        {/* 제출하기 */}
                      </Button>
                    </Grid>
                </Grid>
                
              </Form>
            )}
          </Formik>
        </DialogContent>

      </Dialog>
    </div>
  );
}

export default MedEligibilityAllianzForm;