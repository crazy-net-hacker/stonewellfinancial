import React, { useEffect, useContext, useState } from 'react'
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getClaimCase } from '../../../redux/actions/cliamCaseAction';
// core components 
import { Grid } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider'
import { amountFormat } from '../../../controllers/dataFormat'
import { LanguageContext } from "../../../components/common/LanguageProvider";
import { RegularTextField } from '../../../components/common/CustomTextFields/TextField'
//components
import BasicTabs from '../../../components/common/Tabs/basicTab'
import Accordion from '../../../components/common/Accordion'

// search matched words
const textLowerCase = (text) =>{
  return (text.toLowerCase().replace(/\s/g,'') )
}

export default function ClaimCase() {  
  
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  const dispatch = useDispatch();
  // claim case
  const cases = useSelector(state => state.cliamCaseReducer.cases)

  useEffect(() => {
    dispatch(getClaimCase())
  }, [dispatch]);

  const [searchText, setSearchText] = useState('');

  const answer = (data) => {
    return(
      <>
      {data.map((d, index)=> 
        <Grid item container xs={12} key={index}>
          <Grid item container style={{ margin:'1vh 0'}}>
              <h1 style={{ fontSize:'18px'}}>Case : {index+1} </h1>
          </Grid>
          <Grid item container>
              <ul>
                  <li><Text tid={'ClaimCase.Case.ClientAge'} /> : <b>{d.insured_age}</b></li>
                  <li><Text tid={'ClaimCase.Case.HospitalLocation'} /> : <b>{`${d.hosipitalCity}, ${d.hosipitalProvince}`}</b></li>
                  <li><Text tid={'ClaimCase.Case.PurchasedPolicy'} /> : <span style={{ color:'#8EC641', display:'inline-block', fontSize:'16px' }}><b>{d.insuredPlan}</b></span></li>
                  <li>
                      <Text tid={'ClaimCase.Case.MedicalExpenseTotal'} /> : <b>{amountFormat(d.treatmentCost,2)}</b>
                  </li>
              </ul>
          </Grid>
          <Grid item container>
              <p style={{ fontSize:'18px', color:'#8EC641', fontWeight:'600' }}><Text tid={'ClaimCase.Case.CoveredByCompany'} /> : {amountFormat(d.coveredAmount,2)} {`(${parseInt(((d.coveredAmount/(d.treatmentCost))*100))}%)`}</p>
          </Grid>
        </Grid>
        )}

    </>
    )
  }

  const groupCases = []

  if (cases.length>0){
    // group by caseType, sicknessCode
    var obj = Object.create(null)
    cases.forEach(function (o) {
        var key = ['caseType', 'sicknessCode'].map(function (k) { return o[k]; }).join('|');
        if (!obj[key]) {
            obj[key] = { caseType: o.caseType, 
                        sicknessCode: o.sicknessCode,
                        question: o.sickness.filter(f=>f.language === currentLanguage.toUpperCase()).length>0?o.sickness.filter(f=>f.language === currentLanguage.toUpperCase())[0].name:o.sicknessCode,
                        answer: answer(cases.filter(f=>f.caseType === o.caseType && f.sicknessCode === o.sicknessCode)),
                        isTranslated: true
                      };
            groupCases.push(obj[key]);
        }
    });
  }

  //tabs
  const tabs = [
    { 
      id: 0,
      label: <Text tid={'ClaimCase.CoveredCase.Title'} />,
      value : (
        <Grid item xs={12} style={{margin:'-2em'}}>
          {groupCases.filter(f=>f.caseType === 'C').length>0 &&
            <Accordion faqLists={groupCases.filter(f=>f.caseType === "C" && textLowerCase(f.question).includes(textLowerCase(searchText)))}/>
          }
        </Grid>
      )
    },
    {
      id: 2,
      label: <Text tid={'ClaimCase.DelayedCase.Title'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'-2em'}}>
            {groupCases.filter(f=>f.caseType === 'D').length>0 &&
              <Accordion faqLists={groupCases.filter(f=>f.caseType === "D" && searchText?(textLowerCase(f.question).includes(textLowerCase(searchText))):f.question !=='*')}/>
            }
        </Grid>
        </>
      )
    },
    {
      id: 3,
      label: <Text tid={'ClaimCase.RejectedCase.Title'} />,
      value : (
        <>
        <Grid item xs={12} style={{margin:'-2em'}}>
            {groupCases.filter(f=>f.caseType === 'R').length>0 &&
              <Accordion faqLists={groupCases.filter(f=>f.caseType === "R" && searchText?(textLowerCase(f.question).includes(textLowerCase(searchText))):f.question !=='*')}/>
            }
        </Grid>
        </>
      )
    }
  ]

  return (
    <>
        <Grid item container justify="center" spacing={0}>
            <Grid item container style={{ background:'#efefef', marginTop:'37px', height:'10vh', marginBottom:'2vh' }}>
                Title
            </Grid>
        
            <Grid item container justify="center" spacing={0}>

              <Grid item xs={6} sm={6} md={6} lg={6} container style={{ justifyContent:'end', margin:'0 5vh 0'}}>
                  <RegularTextField
                      id= 'Search'
                      placeholder="Search: Sickness or Injury"
                      onChange={(e) => {setSearchText(e.target.value)}}
                  />
              </Grid>

              <Grid item container xs={12} sm={12} md={10} lg={8} style={{ marginBottom:'5vh' }}>
                  <BasicTabs tabs={tabs}/>
              </Grid>
            </Grid>
        </Grid>
    </>
  )
}

