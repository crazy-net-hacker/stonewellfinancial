import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, FieldArray, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
// core components
import {
  Dialog, DialogContent, 
  Typography, IconButton, Checkbox, Grid,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'
import Button from '../../../components/common/CustomButtons/Button'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
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
    fontSize:'16px', 
    fontWeight:'300',
    marginBottom:'2vh',
    marginTop:'2vh' 
  },
  RedBoldWording: {
    fontWeight:'600',
    color:'#e83d37',
    marginBottom:'1vh'
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
    color:'#29978e',
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
// validationSchema
const validationSchema = Yup.array().of(
  Yup.object().shape({
    answerFlag: Yup.number().min(1, 'RequiredAnswer').required('RequiredAnswer'),
  }))

//ValidMessage
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

const MedQuestionTugoForm = (props) => {
  // const { medQuestion, questionnaire, open, handleClose, medicalSurcharge } = props;
  const { medQuestion, questionnaire, open, handleClose } = props;
  const classes = useStyles()

  //insuranceType
  let medicalInsuranceType = medQuestion[0].eligilbeIns
  
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage
  const planMedQuest = medQuestion.map(i => i.planMedQuestion)
  
  //  insuranceAmount =  insuranceAmount -  surcharge
  const insuranceAmount = planMedQuest.map(i => i.calculatedInsuranceAmount)[0] - medQuestion.map(i => i.planMedQuestion.medicalQuestion.surcharge)[0]
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
        answerFlag: a.answer.filter(f=>f.answer_value === true).length
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
        answerFlag : 0
      }))
      return(iniData)
    }
  }
  const handleSubmit = async (values) => {
    let softCap = insuranceAmount * 5
    let surcharge = 0
    let highRiskDisease = 0
    // number of answered (hypertension (high blood pressure))
    let numAnsweredExceptHypertension = values.filter(v=>v.question_code!=='TQT-TUP-2').map(v=>v.answer.filter(a=>(a.answer_value === true && parseFloat(a.add_surcharge) !== 0)).length).reduce(function(a, b) { return a + b; }, 0)

    for (const i in values) { 
      for (const item in values[i].answer){
        
        if(values[i].answer[item].add_surcharge && values[i].answer[item].answer_value === true){
          
          // surchage of hypertension re-calcurate when questions (expect hypertension) are answered          
          if (medicalInsuranceType === 'CANADIAN' && (values[i].answer[item].answer_code==='q3a2' || values[i].answer[item].answer_code==='q3a3')){
            
            if (numAnsweredExceptHypertension > 0){
              values[i].answer[item].calculation_rate = values[i].answer[item].answer_code==='q3a2'? 0.45 : 0.6
            }else{
              values[i].answer[item].calculation_rate = values[i].answer[item].answer_code==='q3a2'? 0 : 0.45
            }
            values[i].answer[item].add_surcharge = values[i].answer[item].calculation_rate * insuranceAmount
          }
          // sum
          surcharge += parseFloat(values[i].answer[item].add_surcharge)
        
          //highRiskDisease
          if (values[i].answer[item].calculation_rate >= 4){highRiskDisease += 1}
        }
      }
    }
    // softCap(5%) if no selected highRiskDisease
    // 고위험군에 해당하는 질병이 없으면 softCap(5%)만 적용
    if (highRiskDisease === 0)
    {
      if (softCap < (surcharge + insuranceAmount)){
          surcharge = softCap-insuranceAmount
      }
    }
    // result of medical questions
    planMedQuest.map(m => m.medicalQuestion.surcharge = parseFloat(surcharge.toFixed(2)))
    planMedQuest.map(m => m.medicalQuestion.quesAnswer = values)
    planMedQuest.map(m => m.medicalQuestion.answered = true)
    
    // 
    if(medQuestion.map(i=>i.isSelectedPlan)[0] === 'Y'){
      document.getElementById("tugo_selectePlan_button").click()
    }
    handleClose(false)
    // medicalSurcharge(surcharge);
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
      <Dialog 
        style={{zIndex: 9999}}
        fullWidth={true}
        maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#29978e'}}>
          <Typography variant="h2" className={classes.formTitle}>
            Tugo Medical Questionnaire
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
          {/* <DialogContentText>{insuranceAmount}</DialogContentText> */}
          <div style={{ fontSize:'18px', padding:'2vh 0'}}>
          <p style={{ color:"#e83d37", fontWeight:'600'}}>
           ALL applicants 60 years of age and older MUST answer the following questions to determine the rate.
          </p>
          <p style={{ color:"#666", fontWeight:'300', fontSize:'16px'}}>
          It’s important to answer the Medical Questionnaire correctly. If you qualify for the insurance but you or a representative buying insurance on your behalf inaccurately answer any of the Rate Qualification Questions, a $15,000 USD deductible applies to any incident claimed, in addition to any other deductible you may have selected.
          At the time of a claim, if the answers are not complete or accurate, coverage won’t be provided until you correct your answers, and if applicable, you pay any additional premium that may be required.
          </p>
          </div>
          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={values => {
              handleSubmit(values)
            }}
          >
            {({ values, setFieldValue, setFieldTouched }) => (
              <Form>
                <div>
                {values && values.map((v, index) => (
                  <div key = {index}>
                  <Grid  container>
                    <Grid item xs={12}>
                      <Typography variant="h5" className={classes.questionTitle}>
                        {textLineBreak(currentLanguage === 'ko' ? v.header_content_kr : v.header_content_en)}
                      </Typography> 
                      {(currentLanguage === 'ko' ? v.question_kr : v.question_en) && 
                        <Typography variant="h5" className={classes.subList}>
                          {textLineBreak(currentLanguage === 'ko' ? v.question_kr : v.question_en)}
                        </Typography> 
                      }
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
                                  {v.input_type === 'SINGSEL'
                                    ?
                                      <Checkbox
                                        name={`values.${index}.answer.${a_index}.answer_value`}
                                        checked={a.answer_value?a.answer_value:false}
                                        size="small"
                                        icon={<CircleUnchecked />}
                                        checkedIcon={<CircleCheckedFilled />}
                                        onChange={ (e) => {
                                          for (const i in v.answer) { 
                                              setFieldValue(`${index}.answer.${i}.answer_value`, false)
                                              setFieldValue(`${index}.answer.${i}.add_surcharge`,null)
                                            }
                                          // console.log(e.target.checked)
                                          setFieldValue(`${index}.answer.${a_index}.answer_value`,e.target.checked) 
                                          e.target.checked
                                          ? setFieldValue(`${index}.answer.${a_index}.add_surcharge`, (a.calculation_rate * insuranceAmount).toFixed(2)) 
                                          : setFieldValue(`${index}.answer.${a_index}.add_surcharge`, null)                          
                                          setFieldTouched(`${index}.answerFlag`, v.answer.filter(f=>f.answer_value === true).length)  
                                        
                                          }
                                        }
                                      />
                                    :
                                      <Checkbox
                                        name={`values.${index}.answer.${a_index}.answer_value`}
                                        checked={a.answer_value?a.answer_value:false}
                                        size="small"
                                        icon={<CircleUnchecked />}
                                        checkedIcon={<CircleCheckedFilled />}
                                        onChange={ (e) => {
                                          // if select none, clear answers
                                          if (a.content_en === 'None'){ 
                                            for (const i in v.answer) { 
                                              setFieldValue(`${index}.answer.${i}.answer_value`, false)
                                              setFieldValue(`${index}.answer.${i}.add_surcharge`,null)
                                            }
                                          }else{
                                            for (const i in v.answer) { 
                                              if(v.answer[i].content_en === 'None') 
                                                {setFieldValue(`${index}.answer.${i}.answer_value`, false)
                                                setFieldValue(`${index}.answer.${i}.add_surcharge`,null)
                                              }
                                            }
                                          }
                                          setFieldValue(`${index}.answer.${a_index}.answer_value`,e.target.checked) 
                                          e.target.checked
                                          ? setFieldValue(`${index}.answer.${a_index}.add_surcharge`, (a.calculation_rate * insuranceAmount).toFixed(2)) 
                                          : setFieldValue(`${index}.answer.${a_index}.add_surcharge`, 0)                                        
                                          
                                          setFieldTouched(`${index}.answerFlag`, v.answer.filter(f=>f.answer_value === true).length)
                                          }
                                        }
                                      />
                                  }    
                                  {currentLanguage === 'ko' ? a.content_kr : a.content_en }
                                  </Typography>
                                </Grid>
                                <div style={{ display: 'none' }} >
                                {/* <div > */}
                                  {`${a.calculation_rate}   ${a.add_surcharge ? ' $' + a.add_surcharge : ''}`}
                                </div>
                              </Grid>
                              </div>
                            ))}
                          </div>
                          )}
                        />
                      <div style={{ display: 'none' }}>
                        <Field name={`${index}.answerFlag`}/>
                      </div>        
                      {validMessage(`${index}.answerFlag`)}
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
                  Submit
                </Button>
                </div>
                 */}
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
                        // onClick={() => {handleClose(false)}}
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
export default MedQuestionTugoForm;