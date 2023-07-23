import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles'
// form & Validation
import { Formik, Form, FieldArray } from 'formik'
// core components
import { Typography, Checkbox, Grid} from '@material-ui/core'
//
import { LanguageContext } from '../../../../components/common/LanguageProvider'
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


const MedAnswerTugo = (props) => {
  const { medAnswer,  } = props;

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
        answerFlag: a.answer.filter(f=>f.answer_value === true).length
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
        <div style={{ boxShadow:'2px 2px 10px #efefef', background:'#29978e'}}>
          <Typography variant="h2" className={classes.formTitle}>
            Tugo Medical Questionnaire
          </Typography>
        </div>
        
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
          >
            {({ values }) => (
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
                                      />
                                    :
                                      <Checkbox
                                        name={`values.${index}.answer.${a_index}.answer_value`}
                                        checked={a.answer_value?a.answer_value:false}
                                        size="small"
                                        icon={<CircleUnchecked />}
                                        checkedIcon={<CircleCheckedFilled />}
                                      />
                                  }    
                                  {currentLanguage === 'ko' ? a.content_kr : a.content_en }
                                  </Typography>
                                </Grid>

                                <div style={{ display: 'none' }} >
                                  {`${a.calculation_rate}   ${a.add_surcharge ? ' $' + a.add_surcharge : ''}`}
                                </div>

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
              </div>

              </Form>
            )}
          </Formik>


    </div>
  
  );
}

export default MedAnswerTugo;