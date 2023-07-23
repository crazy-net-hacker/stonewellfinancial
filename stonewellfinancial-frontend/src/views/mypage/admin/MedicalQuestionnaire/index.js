import React, { useState, useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getMedicalQuestion } from '../../../../redux/actions/medicalQuestions';
//
import { Grid } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
// common customized components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall';
// import { LanguageContext } from "../../../../components/common/LanguageProvider";
import { textLineBreak } from '../../../../functionalities/TextFormat';


const questionnairs = [
  {questionnaire_id:'QTN00001', company_id: 'ICO00001', name:'Allianz-Canadian', calculation_type:'SURCHARGE' },
  {questionnaire_id:'QTN00005', company_id: 'ICO00001', name:'Allianz-Visitor', calculation_type:'SURCHARGE'},
  {questionnaire_id:'QTN00002', company_id: 'ICO00002', name:'Tugo-Canadian', calculation_type:'SURCHARGE'},
  {questionnaire_id:'QTN00003', company_id: 'ICO00002', name:'Tugo-Visitor', calculation_type:'SURCHARGE'},
]

const languages = [
  {code : 'en', name:'English'},
  // {code : 'fr', name: 'French'},
  {code : 'ko', name: 'Korean'},
  // {code : 'ar', name: 'Arabic'},
  // {code : 'yue', name: 'Cantonese'},
  // {code : 'ch_s', name: 'Chinese(Simplified)'},
  // {code : 'ch_t', name: 'Chinese(Traditional)'},
  // {code : 'de', name: 'German'},
  // {code : 'es', name: 'Spanish'},
  // {code : 'fa', name: 'Persian'},
  // {code : 'ja', name: 'Japanese'},
  // {code : 'pt_br', name: 'Portuguese(Brazil)'},
  // {code : 'vi', name: 'Vietnamese'}
]

export default function MedicalQuestionnaire({match}) {  
  //current language
  // let currentLanguage = useContext(LanguageContext).userLanguage

  // const classes = useStyles();
  const dispatch = useDispatch();
  const questions = useSelector(state => state.medicalQuestionReducer.questions)
  const loading = useSelector(state => state.medicalQuestionReducer.loading)

  const [questionnaireId, setQuestionnaireId] = useState('QTN00001')
  const [questionnaireLanguage, setQuestionnaireLanguage] = useState('ko')

  // useEffect
  useEffect(() => {
    dispatch(getMedicalQuestion())
  }, [dispatch]);


  const questionsData = questions.filter(f=>f.questionnaire_id===questionnaireId).map(row => {
    const updatedRow = {
      ...row,
      question: { header_content_kr: row.header_content_kr, header_content_en: row.header_content_en,
                  question_kr: row.question_kr, question_en: row.question_en },
      answers:row.answer[0]? row.answer.map((a=>{return{answer_code:a.answer_code, content_kr: a.content_kr, content_en: a.content_en, calculation_rate: a.calculation_rate}})) : [],
    };
    return updatedRow;
  });


  // Column definitions
  const columns = getColumns()
  function getColumns(){
    const columns=[
        {name: "name", label: "name", 
          options: {filter: false},
        },
        {name: "question", label: 'Question',
          options: {filter: false,
            setCellProps: () => ({ style: { maxWidth: '400px' }}),
            customBodyRender: (value) => {
              return (
                <>
                  {value.header_content_kr?textLineBreak(questionnaireLanguage==='ko'?value.header_content_kr:value.header_content_en):null}
                  {textLineBreak(questionnaireLanguage==='ko'?value.question_kr:value.question_en)}
                </>
              );
            }  
          }
        },
        {name: "input_type", label: 'Type',
          options: {filter: false}
        },
        {name: "answers", label: 'Answer',
          options: {filter: false, 
            customBodyRender: (value) => {
              return (
                <React.Fragment>
                {value.map((v, index)=>  
                  <Grid container key={index}>
                    <Grid item xs={10}>
                      {textLineBreak(questionnaireLanguage==='ko'?v.content_kr:v.content_en)} 
                    </Grid>
                    <Grid item xs={2}>
                      {v.calculation_rate} 
                    </Grid>
                  </Grid>
                )}
                </React.Fragment>
              );              
            },
          }
        },
      ]
    return (columns)
  }

  const options = {
    filter: false, // set data filter option
    selectableRows: 'none',  //'multiple',
    responsive: "standard",
    // rowStyle: {height: 30},
    search: false, // set search option
    pagination: false, //set pagination option
    viewColumns: false,
    download: false,
    print: true,   
  };
  
    
  return (
      <Grid container>
        <Grid item container style={{ marginTop:'-37px' }}>         
          {/* <QuoteBanner2 title={'Dashboard.SearchApplications'} subTitle={'Dashboard.SearchApplications.SubTitle'} links={[]}/> */}
          <QuoteBanner2 title={'건강 질문'} subTitle={''} links={[]}/>
        </Grid>  
        <Grid item container style={{ padding:'1vh 5vh 5vh'}}>
          {loading
            ? null
            : <MUIDataTable
                title= {
                  <div>
                    <Grid item container style={{ margin:'2vh 0' }}>
                        {/* <Typography className={classes.tableTitle}>
                          Medical Questionnaire
                        </Typography> */}
                        <Grid item xs={6}>
                      <SelectTextFieldSmall
                        label='Medical Questionnaire'
                        value={questionnaireId}
                        onChange={(e)=>{setQuestionnaireId(e.target.value)}}
                      >
                        {questionnairs.map((item) => (
                            <option key={item.questionnaire_id} value={item.questionnaire_id}>
                                {item.name}
                            </option>
                        ))}
                      </SelectTextFieldSmall>
                      </Grid>
                        <Grid item xs={4}>
                      <SelectTextFieldSmall
                        label='Language'
                        value={questionnaireLanguage}
                        onChange={(e)=>{setQuestionnaireLanguage(e.target.value)}}
                      >
                        {languages.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                      </SelectTextFieldSmall>
                      </Grid>
                    </Grid>
                  </div>    
                  }
                data={questionsData}
                columns={columns}
                options={options}
              />
          }            
        </Grid>
        
      </Grid>
  )

}