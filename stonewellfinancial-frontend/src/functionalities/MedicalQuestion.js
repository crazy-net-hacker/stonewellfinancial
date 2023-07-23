// verify medical question is answered or not
export const isMedicalQuestionAnswered = (age, insurance) => {
  
    return(
        insurance.medicalQuestion.chargeRate !== '0' && 
            ((age >= 60 && insurance.medicalQuestion.answered === true)
            ||((insurance.compnayName === 'BlueCross'||insurance.compnayName === 'GMS') && age >= 60)
            ||(age < 60))
        ? true 
        : false
    )
};


// verify medical question is answered or not
export const calculateSurchargeTugoMedicalQuestion = (insurance) => {

    const qa = insurance.medicalQuestion.quesAnswer
    const medicalInsuranceType = insurance.coverages[0].insured_type

    insurance.medicalQuestion.surcharge = 0
    let softCap = insurance.insuranceAmount * 5
    let highRiskDisease = 0
    // number of answered (hypertension (high blood pressure))
    let numAnsweredExceptHypertension = qa.filter(v=>v.question_code!=='TQT-TUP-2').map(v=>v.answer.filter(a=>(a.answer_value === true && parseFloat(a.add_surcharge) !== 0)).length).reduce(function(a, b) { return a + b; }, 0)

    for (const i in qa) { 
        for (const item in qa[i].answer){
            
            if(qa[i].answer[item].add_surcharge && qa[i].answer[item].answer_value === true){
            
                //   surchage of hypertension re-calcurate when questions (expect hypertension) are answered          
                if (medicalInsuranceType === 'CANADIAN' && (qa[i].answer[item].answer_code==='q3a2' || qa[i].answer[item].answer_code==='q3a3')){
                    
                    if (numAnsweredExceptHypertension > 0){
                        qa[i].answer[item].calculation_rate = qa[i].answer[item].answer_code==='q3a2'? 0.45 : 0.6
                    }else{
                        qa[i].answer[item].calculation_rate = qa[i].answer[item].answer_code==='q3a2'? 0 : 0.45
                    }
                    qa[i].answer[item].add_surcharge = qa[i].answer[item].calculation_rate * insurance.insuranceAmount
                }
                
                qa[i].answer[item].add_surcharge = (insurance.insuranceAmount * qa[i].answer[item].calculation_rate).toFixed(2)
                // sum
                insurance.medicalQuestion.surcharge += parseFloat(qa[i].answer[item].add_surcharge)
            
                //highRiskDisease
                if (qa[i].answer[item].calculation_rate >= 4){highRiskDisease += 1}
            }
        }
    }
    // softCap(5%) if no selected highRiskDisease
    // 고위험군에 해당하는 질병이 없으면 softCap(5%)만 적용
    if (highRiskDisease === 0){
        if (softCap < (insurance.medicalQuestion.surcharge + insurance.insuranceAmount)){
            insurance.medicalQuestion.surcharge = softCap-insurance.insuranceAmount
        }
    }

    // console.log('in medicalquestion', insurance.medicalQuestion.surcharge)

    return(
        insurance.medicalQuestion.surcharge
    )
};
