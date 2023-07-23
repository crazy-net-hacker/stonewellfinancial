import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
// core components
import {
  Dialog, DialogContent, 
  Typography, IconButton, Checkbox, Grid,
  FormControlLabel
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'
//
import Button from '../CustomButtons/Button'
import { Text, LanguageContext } from "../LanguageProvider";
import { textLineBreak } from "../../../functionalities/TextFormat";
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


const MedQuestionAllianzForm = (props) => {
  // const { medQuestion, questionnaire, open, handleClose, medicalChargeRate  } = props;
  const { medQuestion, questionnaire, open, handleClose } = props;

  const classes = useStyles()

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage
  let stopPoint = 0


  const planMedQuest = medQuestion.map(i => i.planMedQuestion)
  const planMedQuestAnswer = ((planMedQuest.map(m => m.medicalQuestion)).map(a => a.quesAnswer)).map(ans => ans)


  const initialData = getInitialData()

  function getInitialData(){

    if (planMedQuestAnswer.map(i=>i.length) > 0)
    {
      const iniData = planMedQuestAnswer.map(i=>i)[0].map((a, index) => ({
        questionnaire_id : a.questionnaire_id,
        question_code : a.question_code,
        header_content_kr : a.header_content_kr,
        header_content_en : a.header_content_en,
        question_kr : a.question_kr,
        question_en : a.question_en,
        input_type : a.input_type,
        answer : a.answer,
        numRequiredAnswer: a.answer.length,
        answerResult: index === 0 && a.answer.filter(f=>f.answer_code === 'q1a1' && f.answer_value === true).length > 0 ?  'Yes': a.answerResult,
        answerFlag: a.answerFlag
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
        numRequiredAnswer: item.answer.length,
        answerResult : item.input_type==='SINGSEL'?'':0,
        answerFlag: 0
      }))

      return(iniData)
    }

  }


  // validationSchema
  const validationSchema = Yup.array().of(
    Yup.object().shape({
      // answerFlag: Yup.number().min(1, 'Required the answer!').required('Required the answer!'),
      answerFlag: Yup.number().when("input_type", 
      { is: (value) => 
              value === 'SINGSEL',
              then: Yup.number().min(1, 'Required the answer!').required('RequiredAnswer'),
              otherwise: Yup.number().min(Yup.ref("numRequiredAnswer"),'RequiredAnswer').required('Required the answer!')
      }),
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


  // handleSubmit
  const handleSubmit = async (values) => {
    // console.log(values)
  
    let chargeRate = ''
    // Decision charege rate by medical questions
    let answerQ1 = values[0].answerResult
    let answerQ2 = values[1].answerResult
    let answerQ3 = values[2].answerResult
    let answerQ4 = values[3].answerResult
    let answerQ5 = values[4].answerResult
    let answerQ6 = values[5].answerResult
    let answerQ7 = values[6].answerResult
    let answerQ8 = values[7].answerResult

    let surchargeRate = 0
    let discountRate = 0


    if(answerQ1 === 'No'){chargeRate = '0'}
    else 
    { if (answerQ3 > 0) {chargeRate = '4'}
      else 
      { if (answerQ4 > 2) {chargeRate = '6'}
        else if (answerQ4 === 2) {chargeRate = '5'}
        else if (answerQ4 === 1 && answerQ5 > 0 ) {chargeRate = '5'}
        else if (answerQ4 === 1 && answerQ5 === 0 ) {chargeRate = '4'}
        else if (answerQ4 === 0){
          
          if (answerQ5 > 1) {chargeRate = '5'}
                else if (answerQ5 === 1) {chargeRate = '3'}
                else if (answerQ5 === 0){ 
                      if (answerQ6 === 'Yes') {chargeRate = '3'}
                        else{ if (answerQ7 > 0) {chargeRate = '2'}
                              else {chargeRate = '1'}
                            }
                    } 
              }
            
      }
    }

    // calculate surcharge
    if (answerQ1 === 'Yes'){
        surchargeRate = parseFloat(answerQ2)
        discountRate = parseFloat(answerQ8)
    }

    // result of medical questions
    planMedQuest.map(m => m.medicalQuestion.chargeRate = chargeRate)
    planMedQuest.map(m => m.medicalQuestion.surcharge = surchargeRate)
    planMedQuest.map(m => m.medicalQuestion.discount = discountRate)
    planMedQuest.map(m => m.medicalQuestion.quesAnswer = values)
    planMedQuest.map(m => m.medicalQuestion.answered = true)
    
    // 
    if(medQuestion.map(i=>i.isSelectedPlan)[0] === 'Y'){
      document.getElementById("allianz_selectePlan_button").click()
    }

    handleClose(false)

  }


  //
  const qa = (q1AnswerResult, v, index, qNum, setFieldValue) => {
    return(
        <Grid  item container>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.questionTitle}>
              {/* {index + 1}. {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)} */}
              {qNum}. {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
            </Typography> 
          </Grid>

          <Grid item xs={12}  className={classes.answerBox}>
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
                              <Checkbox
                                name={`values.${index}.answer.${a_index}.answer_value`}
                                checked={a.answer_value?a.answer_value:false}
                                size="small"
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleCheckedFilled />}
                                onChange={ (e) => {
                                  for (const i in v.answer) { 
                                      setFieldValue(`${index}.answer.${i}.answer_value`, false)
                                    }

                                  setFieldValue(`${index}.answer.${a_index}.answer_value`,e.target.checked)                       
                                
                                  if (v.question_code === 'AQT-CMQ-2'){
                                    setFieldValue(`${index}.answerResult`,
                                        a.answer_code === 'q2a1' && e.target.checked === true 
                                        ? a.calculation_rate
                                        :0)  
                                  }else if (v.question_code === 'AQT-CMQ-6'){
                                          setFieldValue(`${index}.answerResult`,
                                          a.answer_code === 'q6a2'
                                            ?a.answer_code === 'q6a2' && e.target.checked === true ?'No':''
                                            :a.answer_code === 'q6a1' && e.target.checked === true ?'Yes':'' )      
                                  }else if (v.question_code === 'AQT-CMQ-8'){
                                    setFieldValue(`${index}.answerResult`,
                                        a.answer_code === 'q8a1' && e.target.checked === true 
                                        ? a.calculation_rate
                                        :0)  
                                  }
                                
                                }}
                              />
                              {textLineBreak(currentLanguage === 'ko' ? a.content_kr : a.content_en)}
                            </>
                          :
                            <>
                              {!v.answer[a_index].answeredYes?v.answer[a_index].answeredYes = false : null}
                              {!v.answer[a_index].answeredNo?v.answer[a_index].answeredNo = false : null}
                              
                              {textLineBreak(currentLanguage === 'ko' ? a.content_kr : a.content_en)}
                              <FormControlLabel
                                id={`${index}.answer.${a_index}.answeredYes`}
                                style={{ marginRight: '2vh'}}
                                control={
                                  <Checkbox 
                                    checked={a.answeredYes}
                                    icon={<CircleUnchecked />}
                                    checkedIcon={<CircleCheckedFilled />}
                                    onChange={ (e) => {  
                                      setFieldValue(`${index}.answer.${a_index}.answeredYes`,e.target.checked)
                                      if(e.target.checked === true){ 
                                        setFieldValue(`${index}.answer.${a_index}.answer_value`,true) 
                                        if (v.answer[a_index].answeredNo === true){
                                          document.getElementById(`${index}.answer.${a_index}.answeredNo`).click()
                                        } 
                                      }else{
                                        setFieldValue(`${index}.answer.${a_index}.answer_value`,false) 
                                      }
                                      // result of answer
                                      let numAnswer = e.target.checked === true ? v.answerResult + 1: v.answerResult -1
                                      setFieldValue(`${index}.answerResult`,numAnswer)
                                    }}
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
                                    onChange={ (e) => {
                                      setFieldValue(`${index}.answer.${a_index}.answeredNo`,e.target.checked)
                                      if(e.target.checked === true){ 
                                        setFieldValue(`${index}.answer.${a_index}.answer_value`,false) 
                                        if (v.answer[a_index].answeredYes === true){
                                          document.getElementById(`${index}.answer.${a_index}.answeredYes`).click()} 
                                      }
                                    }}
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

            <div style={{ display: 'none' }}> 
            {/* <div>  */}
              {/* {v.numRequiredAnswer} */}
              { q1AnswerResult === 'Yes' && (
                v.answerFlag =                              
                    (v.input_type === 'SINGSEL'
                      ? v.answer.filter(f=>f.answer_value === true).length
                      : v.answer.filter(f=>(f.answeredYes === true ||f.answeredNo === true )).length
                    )
              )}
              
              { v.answer.filter(f=>f.answer_value === true).length > 0 && (
                v.answerResult = 
                  v.input_type=== 'SINGSEL'
                    ? ((v.question_code === 'AQT-CMQ-2' || v.question_code === 'AQT-CMQ-8' )                           
                      ? v.answer.filter(f=>f.answer_value === true)[0].calculation_rate ? v.answer.filter(f=>f.answer_value === true)[0].calculation_rate:0
                      : v.answer.filter(f=>f.answer_value === true)?v.answer.filter(f=>f.answer_value === true)[0].content_en:'')
                    : v.answer.filter(f=>f.answer_value === true).length
              )}

              answered <Field name={`${index}.answerFlag`}/>
              result <Field name={`${index}.answerResult`}/>
            </div>        
            {validMessage(`${index}.answerFlag`)}

          </Grid>

        </Grid>
    )
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
            Allianz Medical Questionnaire
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
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, setFieldValue, setFieldTouched, errors }) => (
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
                                        onChange={ (e) => {
                                          for (const i in v.answer) { 
                                              setFieldValue(`${index}.answer.${i}.answer_value`, false)
                                            }
                                          setFieldValue(`${index}.answer.${a_index}.answer_value`,e.target.checked)                       
                                          
                                          setFieldValue(`${index}.answerResult`,
                                              a.answer_code === 'q1a2'
                                                ?a.answer_code === 'q1a2' && e.target.checked === true ?'No':''
                                                :a.answer_code === 'q1a1' && e.target.checked === true ?'Yes':'' ) 

                                          // When the anwer of question 1 === 'No', reset value
                                          // set answer for validation
                                          if (a.answer_code === 'q1a2' && e.target.checked === true){
                                              stopPoint = 0
                                          }

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
                        {validMessage(`${index}.answerFlag`)}
                      </Grid>
                      {}

                    </Grid>

                    </div>
                  ))}

                  {/* <div> Q1_answer {values[0].answerResult} ~ Q8_answer </div> */}
                  {values[0].answerResult === 'Yes' 
                    ? (
                      <div>
                        {values && values.map((v, index) => (
                          <div key = {index}>
                            
                            {/* Q2 ~ Q3  */}
                            {(v.question_code === 'AQT-CMQ-2' || v.question_code === 'AQT-CMQ-3') &&
                              qa(values[0].answerResult, v, index, v.question_code === 'AQT-CMQ-2'?2:3, setFieldValue)
                            }

                            {/* Q4 ~ Q8 : when Q3 all answer is no*/}
                            {(values[2].numRequiredAnswer === values[2].answerFlag &&
                              values[2].answerResult === 0) 
                              ? (
                                  <>
                                    {/* Q4 */}
                                    {v.question_code === 'AQT-CMQ-4' &&
                                      qa(values[0].answerResult, v, index, 4, setFieldValue)}

                                    {/* Q5  ~ Q7: 4번이 최소 한개만 yes 일 경우, Q8: 4번이 두개이상 yes*/}
                                    {(values[3].numRequiredAnswer === values[3].answerFlag && 
                                        values[3].answerResult <= 1 ) 
                                        ? (
                                            <>
                                              {/* Q5 */}
                                              {v.question_code === 'AQT-CMQ-5' &&
                                                qa(values[0].answerResult, v, index, 5, setFieldValue)}
                                              {/* Q6 ~ Q7 : 5번이 모두 no 일경우 */}
                                              {values[4].numRequiredAnswer === values[4].answerFlag && 
                                                values[3].answerResult === 0 && values[4].answerResult === 0
                                                ? (
                                                    <>
                                                      {/* Q6 */}
                                                      {v.question_code === 'AQT-CMQ-6' &&
                                                        qa(values[0].answerResult, v, index, 6, setFieldValue)}
                                                      {/* Q7 */}
                                                      {/* Q7 :  6번이 no 일경우 */}
                                                      {values[5].answerResult === 'No'  
                                                        ? (
                                                          <>
                                                            {v.question_code === 'AQT-CMQ-7' &&
                                                                qa(values[0].answerResult, v, index, 7, setFieldValue)}
                                                            <div style={{ display: 'none' }}> 
                                                              {stopPoint = 6}
                                                            </div>
                                                            {/* Q8 */}
                                                            {(values[6].numRequiredAnswer === values[6].answerFlag && 
                                                                  values[6].answerResult > 0 ) && 
                                                                    v.question_code === 'AQT-CMQ-8' &&
                                                                      qa(values[0].answerResult, v, index, 8, setFieldValue)
                                                            }
                                                            </>
                                                            )
                                                        : ( <>
                                                              <div style={{ display: 'none' }}> 
                                                                {stopPoint = 5}
                                                              </div>
                                                              {v.question_code === 'AQT-CMQ-8' &&
                                                                qa(values[0].answerResult, v, index, 7, setFieldValue)}
                                                            </>
                                                          )
                                                      }
                                                    </>
                                                  )
                                                :( <>
                                                      <div style={{ display: 'none' }}> 
                                                        {stopPoint = 4}
                                                      </div>
                                                      {values[4].numRequiredAnswer === values[4].answerFlag && 
                                                        v.question_code === 'AQT-CMQ-8' &&
                                                          qa(values[0].answerResult, v, index, 6, setFieldValue)}
                                                    </>
                                                  )
                                              }
                                            </>
                                          )
                                        :
                                          ( <>
                                              <div style={{ display: 'none' }}> 
                                                {stopPoint = 3}
                                              </div>
                                              {values[3].numRequiredAnswer === values[3].answerFlag &&
                                                v.question_code === 'AQT-CMQ-8' &&
                                                  qa(values[0].answerResult, v, index, 5, setFieldValue)}
                                            </>
                                          )
                                    }
                                    
                                  </>
                                )
                              : 
                                <div style={{ display: 'none' }}> 
                                  {stopPoint = 2}
                                </div>
                             
                            }

                          </div>
                        ))}

                      </div>
                      )
                    :null
                  }


                </div>


                <Grid item container style={{ margin: '5vh 0 5vh 0' }} justify="center" spacing={1}>
                    <Grid item xs={6} lg={3}>
                      <Button
                        color="secondary"
                        className={classes.back_button}
                        onClick={() => {handleClose(false)}}
                      >
                        Close
                      </Button>
                    </Grid>

                    <Grid item xs={6} lg={3}>
                      <Button
                        color="dark"
                        type="submit"
                        className={classes.next_button}
                        onClick={() => {
                          //set validaion value and reset value
                          values.forEach( (v,vIndex) => {
                            if(vIndex > stopPoint && vIndex < (values.length-1)){
                                if (v.input_type === 'SINGSEL'){
                                  v.answerFlag = 1
                                }else{
                                  v.answerFlag = v.numRequiredAnswer
                                }
                                v.answerResult = 0
                                v.answer.forEach(a =>{
                                    a.answer_value = false
                                    if(a.answeredYes){a.answeredYes = false}
                                    if(a.answeredNo){a.answeredNo = false}
                                })
                              }
                            
                            if(vIndex === (values.length-1) &&
                                ((stopPoint === 0 && values[0].answerResult) ||
                                  (stopPoint === 1 && values[1].answerResult) ||
                                  (stopPoint === 2 && values[2].answerResult > 0 ) ||
                                  (stopPoint === 6 && values[6].answerResult === 0) )
                              ){
                                  v.answerFlag = 1
                                  v.answerResult = 0
                                  v.answer.forEach(a =>{
                                      a.answer_value = false
                                      if(a.answeredYes){a.answeredYes = false}
                                      if(a.answeredNo){a.answeredNo = false}
                                  })
                              }

                          })
                          
                        }}
                      >
                        Submit
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

export default MedQuestionAllianzForm;