import React  from 'react'
import { amountFormat } from '../controllers/dataFormat';
import { calculateSurchargeTugoMedicalQuestion } from './MedicalQuestion';

// for using family premium base on 
export const calculateInsuranceAmount = (values) => {
    return (
        <>
            {values.insuredPersons.map((person, pIndex)=>(
              <React.Fragment key={pIndex}>
                <br/>
                      {person.firstName}
                      {person.insurancePlans
                          // .filter(fp=>fp.compnayName !== 'GMS')
                          .map((insurance, insIndex) => (
                            <React.Fragment key={insIndex}>
                                  {insurance.compnayName}
                                  {insurance.selectedCoverage}
                                  {insurance.coverages
                                          .filter(f=>f.price_code=== insurance.selectedCoverage)
                                          .map((coverage, cIndex)=>(
                                            <React.Fragment key={cIndex}>
                                              {coverage.type_deduct.length > 0 ?
                                                <>
                                                {coverage.deduct 
                                                  ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value) 
                                                  : coverage.type_deduct&&
                                                    coverage.type_deduct.filter(d => d.default === true).map(i => i.value) 
                                                }
                                                {coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                  </>
                                                :null}
  
                                              <div style={{ display: 'none' }}>
                                                {
                                                  /* insuranceAmount at least 
                                                    Tugo : amount of 10 days for STUDENT */
                                                    person.tripPeriodDays 
                                                      = (person.tripPeriod <= 10 && 
                                                          insurance.compnayName === 'Tugo' && 
                                                          person.eligilbeIns === 'STUDENT' )
                                                          ? 10
                                                          : person.tripPeriod
                                                }
  
                                                
                                                {
                                                  /*  insuranceAmount */
                                                  insurance.insuranceAmount =
                                                  (coverage.calculate_rate === 'D'
                                                    ? (coverage.value * person.tripPeriodDays) 
                                                    : (coverage.value * 1))
                                                  // + (insurance.compnayName === 'Tugo' ? insurance.medicalQuestion.surcharge : 0)
                                                }

                                                {
                                                  /* add surcharge after recalculated if Tugo Medical question is answered and then chanaged coverage */
                                                    insurance.compnayName === 'Tugo' 
                                                      && insurance.medicalQuestion.surcharge > 0 
                                                      && insurance.medicalQuestion.answered === true
                                                      ? (person.eligilbeIns === 'VISITOR'
                                                          ? insurance.insuranceAmount += calculateSurchargeTugoMedicalQuestion(insurance)
                                                          : insurance.insuranceAmount += insurance.medicalQuestion.surcharge 
                                                        )
                                                      : null
                                                }
  
                                                {
                                                  /*  insuranceAmount - deduct amount */
                                                  insurance.insuranceAmount =
                                                  (coverage.calculate_rate === 'D'
                                                    ? insurance.insuranceAmount 
                                                        - (insurance.insuranceAmount * coverage.deduct) 
                                                        // - ((person.eligilbeIns === 'STUDENT' && parseInt(person.tripPeriod) === 365 && coverage.insured_type) ? coverage.discount : 0)
                                                    : insurance.insuranceAmount - (insurance.insuranceAmount * coverage.deduct))
                                                }
                                                
                                                {
                                                  /* insuranceAmount at least 
                                                    Allianz : $30 for STUDENT. $20 for VISITOR and CANADIAN  */
                                                  insurance.compnayName === 'Allianz' && insurance.insuranceAmount > 0
                                                    ? person.eligilbeIns === 'STUDENT' 
                                                      ? (insurance.insuranceAmount < 30 ? insurance.insuranceAmount = 30 :null)
                                                      : (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                    : null
                                                }
  
                                                {
                                                  /* insuranceAmount at least 
                                                    Tugo : $20 for VISITOR and CANADIAN  */
                                                    insurance.compnayName === 'Tugo' && insurance.insuranceAmount > 0 && person.eligilbeIns !== 'STUDENT' 
                                                      ? (insurance.insuranceAmount < 20 ? insurance.insuranceAmount = 20 :null)
                                                      : null
                                                }

                                                {
                                                  /* insuranceAmount at least 
                                                    BlueCross : $25 for CANADIAN  */
                                                    insurance.compnayName === 'BlueCross' && insurance.insuranceAmount > 0 && person.eligilbeIns !== 'STUDENT' 
                                                      ? (insurance.insuranceAmount < 25 ? insurance.insuranceAmount = 25 :null)
                                                      : null
                                                }
                                                
                                                {
                                                  (person.eligilbeIns === 'CANADIAN' && person.age > 60 && insurance.compnayName === 'Allianz' && 
                                                    (insurance.medicalQuestion.surcharge !== 0 || insurance.medicalQuestion.discount !== 0 )
                                                      ?
                                                      (<>
                                                          {/* surcharge rate */}
                                                          {insurance.insuranceAmount = (insurance.insuranceAmount + Math.ceil(insurance.insuranceAmount *  insurance.medicalQuestion.surcharge)) }
                                                          {/* discount rate */}
                                                          {insurance.insuranceAmount = insurance.insuranceAmount - Math.floor(insurance.insuranceAmount * insurance.medicalQuestion.discount)}
                                                      </>)
                                                      : null
                                                  )
                                                } 

                                                {
                                                  /* physicalCard fee */
                                                  person.physicalCard === true
                                                    ? person.physicalCardFee 
                                                        = (parseFloat(insurance.insuranceAmount) < 114 ? 7.99 :0)
                                                    : person.physicalCardFee = 0
                                                }
                                                
                                                {/* selectedDeduct */}
                                                {insurance.selectedDeduct = 
                                                    ((coverage.deduct || coverage.deduct === 0)   
                                                      ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value)[0]
                                                      : coverage.type_deduct&&
                                                        coverage.type_deduct.filter(d => d.default === true).map(i => i.value)[0] 
                                                    )
                                                }
                                                
                                                {
                                                   /* calculatedInsuranceAmount */
                                                  insurance.calculatedInsuranceAmount = insurance.insuranceAmount
                                                    + (person.optionalAddOnPlans
                                                              .find(plan => plan.compnayName === insurance.compnayName)
                                                        ? person.optionalAddOnPlans
                                                              .find(plan => plan.compnayName === insurance.compnayName).planTypes
                                                              .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                                        :0)
                                                    + person.physicalCardFee
                                                    + (person.optionalCarewellService.isSelected ? person.optionalCarewellService.packageAmount : 0)
                                                }
  
                                              </div>
                                              {amountFormat((coverage.value * person.tripPeriod),2) }
                                              {amountFormat((coverage.value * person.tripPeriod * coverage.deduct),2) }
                                              {amountFormat(insurance.insuranceAmount,2) }
                                              {amountFormat(insurance.calculatedInsuranceAmount,2) }
                                            </React.Fragment>
                                            
                                      ))}
                                      
  
                            </React.Fragment>
                      ))}    
  
              </React.Fragment>
  
            ))}
            </>
      )
};
