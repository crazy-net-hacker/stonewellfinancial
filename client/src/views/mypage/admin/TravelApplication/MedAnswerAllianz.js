import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form 
import { Formik, Form, FieldArray } from 'formik'
// core components
import {
  Typography, Checkbox, Grid,
  FormControlLabel
} from '@material-ui/core'
//
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider'
//icon
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999999,
  },
  formTitle: { 
    fontSize: '24px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  formDescription: {
    fontSize:'14px', 
    fontWeight:'300',
    marginBottom:'2vh',
    marginTop:'2vh' 
  },
  RedBoldWording: {
    fontWeight:'500',
    color:'#fe001a',
    marginBottom:'1vh',
    fontSize:'20px'
  },
  answerBox: {
    // padding:'8px',
    // border:'1px solid #e2e2e3',
    // borderRadius:'4px',
    marginTop:'8px',
    marginLeft:'40px',
    marginBottom:'40px'
  },
  questionTitle: {
    fontSize:'18px',
    color:'#003781',
    fontWeight:'600',
    lineHeight:'1.6'
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
    // paddingLeft: theme.spacing(4)
    padding:'5px 0',
    borderBottom:'1px solid #eee',
    color:'#53565a',
    fontSize:'14px'
  },
  subList: {
    marginLeft:'2vh',
    marginTop:'2vh',
    fontSize:'17px'
  }
}))


const MedAnswerAllianz = (props) => {
  const { medAnswer  } = props;

  const classes = useStyles()

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  const initialData = getInitialData()
  

  function getInitialData(){

      const iniData = medAnswer.map(a => ({
        questionnaire_id : a.questionnaire_id,
        question_code : a.question_code,
        header_content_kr : a.header_content_kr,
        header_content_en : a.header_content_en,
        question_kr : a.content_kr,
        question_en : a.content_en,
        input_type : a.input_type,
        answer : a.answer,
        numRequiredAnswer: a.answer.length,
        answerResult: a.answerResult
      }))

        return(iniData)

  }

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
  


  return (
    <div>
        <div style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>

          <Typography variant="h2" className={classes.formTitle}>
            Allianz Medical Questionnaire
          </Typography>
        </div>

          <Formik
            initialValues={initialData}
          >
            {({ values }) => (
              <Form>
                <div>
                {/* {console.log(errors)} */}
                {values && values.filter(val => val.question_code === 'AQT-CMQ-1').map((v, index) => (
                  <div key = {index}>
                  <Grid  container>

                    <Grid item xs={12}>
                      <Typography className={classes.formDescription}>
                        <Text tid={`TravelInsurance.MedicalQ.Instruction`} />
                      </Typography> 
                      <Typography variant="h5" className={classes.RedBoldWording}>
                        <Text tid={`TravelInsurance.MedicalQ.NotCoveredIf`} />
                      </Typography> 
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h5"  style={{ marginBottom: '3vh', fontSize:'14px', color:'#666', lineHeight:'2', padding:'1vh', background:'#f5f9ff' }}>
                        {textLineBreak(currentLanguage === 'ko' ? v.header_content_kr : v.header_content_en)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h5" className={classes.questionTitle}>
                        1. {textLineBreak(currentLanguage === 'ko' ? v.question_kr :v.question_en)}
                      </Typography> 
                    </Grid>

                    <Grid item xs={12} className={classes.answerBox}>
                      <div style={{ display: 'none' }}>
                        {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                      </div> 
                      <FieldArray
                          name="answer"
                          render={({ form }) => (
                            <div>
                            {v.answer.map((a, a_index) => (
                              <div key = {a_index}>
                              <Grid  container>

                                <Grid item xs={12}>
                                  <Typography variant="h5" className={classes.nested}>
                                    <Checkbox
                                      name={`values.${index}.answer.${a_index}.answer_value`}
                                      checked={a.answer_value?a.answer_value:false}
                                      size="small"
                                      icon={<CircleUnchecked />}
                                      checkedIcon={<CircleCheckedFilled />}
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
                    </Grid>

                  </Grid>

                  </div>
                ))}

                <div>
                  {values && values.map((v, index) => (
                    <div key = {index}>
                      {v.question_code === 'AQT-CMQ-1' ? null
                      :
                        <Grid  item container>
                          <Grid item xs={12}>
                            <Typography variant="h5" className={classes.questionTitle}>
                              {index + 1}. {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                            </Typography> 
                          </Grid>

                          <Grid item xs={12}  className={classes.answerBox}>
                            {/* <div style={{ display: 'none' }}>
                              {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}  
                            </div>    */}
                            <FieldArray
                                name="answer"
                                render={({ form }) => (
                                  <div>
                                  {v.answer.map((a, a_index) => (
                                    <div key = {a_index}>
                                    <Grid  container>

                                      <Grid item xs={12}>
                                      <Typography variant="h5" className={classes.nested}>
                                        {v.input_type === 'SINGSEL'
                                          ?
                                            <>
                                              <div style={{ display: 'none' }}>
                                                {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answer_value === true).length)}
                                              </div>
                                              <Checkbox
                                                name={`values.${index}.answer.${a_index}.answer_value`}
                                                checked={a.answer_value?a.answer_value:false}
                                                size="small"
                                                icon={<CircleUnchecked />}
                                                checkedIcon={<CircleCheckedFilled />}
                                              />
                                              {textLineBreak(currentLanguage === 'ko' ? a.content_kr : a.content_en)}
                                            </>
                                          :
                                            <>
                                              <div style={{ display: 'none' }}>
                                                {values[index].answerFlag = values.filter(f=>f.question_code ===values[index].question_code).map(i=>i.answer.filter(f=>f.answeredYes=== true||f.answeredNo=== true).length)}
                                              </div>
                                              {textLineBreak(currentLanguage === 'ko' ? a.content_kr : a.content_en)}
                                              <FormControlLabel
                                                id={`${index}.answer.${a_index}.answeredYes`}
                                                style={{ marginRight: '2vh'}}
                                                control={
                                                  <Checkbox 
                                                    checked={a.answeredYes}
                                                    icon={<CircleUnchecked />}
                                                    checkedIcon={<CircleCheckedFilled />}
                                                  />
                                                }
                                                label={currentLanguage === 'ko' ? "네" : "Yes"}
                                              />
                                              <FormControlLabel
                                                id={`${index}.answer.${a_index}.answeredNo`}
                                                style={{ marginRight: '2vh'}}
                                                control={
                                                  <Checkbox
                                                    checked={a.answeredNo}
                                                    icon={<CircleUnchecked />}
                                                    checkedIcon={<CircleCheckedFilled />}
                                                  />
                                                }
                                                label={currentLanguage === 'ko' ? "아니오" : "No"}
                                              />

                                            </>
                                        }  
                                      </Typography> 
                                      
                                      </Grid>
                                    </Grid>
                                    </div>
                                  ))}

                                </div>
                                )}
                              />

                          </Grid>

                        </Grid>
                      }

                    </div>
                  ))}

                </div>

              </div>

                
              </Form>
            )}
          </Formik>
    </div>
  );
}

export default MedAnswerAllianz;