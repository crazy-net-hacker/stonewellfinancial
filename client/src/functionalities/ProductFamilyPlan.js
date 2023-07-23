export const isApplyFamilyRate = (values) => {

  let isFamilyRate = false;  
  isFamilyRate =  values.insuredPersons.filter(f=>f.eligilbeIns !== 'STUDENT' && 
                                            (f.relationship === 'Primary' || f.relationship === 'Spouse'  || f.relationship === 'Child') && 
                                            f.age < (f.relationship === 'Child'? 22 : 60)  &&
                                            f.tripStartDate.toISOString().slice(0,10) === values.insuredPersons[0].tripStartDate.toISOString().slice(0,10) &&
                                            f.tripEndDate.toISOString().slice(0,10) === values.insuredPersons[0].tripEndDate.toISOString().slice(0,10) 
                                            ).length === values.insuredPersons.length

  return( isFamilyRate )
}


export const familyPlan = (values) => {

  const familyGroupInfo = [
    {companyName : 'Allianz',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 1, outSort: 2},
    {companyName : 'Tugo',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 2, outSort: 3},
    {companyName : 'BlueCross',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 3, outSort: 1},
  ]

  
   //set totalPremium
    familyGroupInfo.map(i=>i.totalPremium = 0)                  
    values.insuredPersons.map(p=>p.insurancePlans
        .filter(f=>f.compnayName !== 'GMS')
        .map(ins=>(
            familyGroupInfo.filter(f=>f.companyName === ins.compnayName)[0].totalPremium += ins.insuranceAmount
        ))
      )

    // set familyPremium
    const birthDateArray = values.insuredPersons.map(i=>i.birthDate)

    let eldestBirthDate = new Date(Math.min(...birthDateArray))

    const eldest = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === eldestBirthDate.toISOString().slice(0,10))[0].insurancePlans

    eldest.forEach(e => {
      if (e.compnayName === 'Allianz' || e.compnayName === 'Tugo'){
        familyGroupInfo.filter(f=>f.companyName === e.compnayName)[0].familyPremium = e.insuranceAmount * 2 
      } else if (e.compnayName === 'BlueCross'){
        // get 2nd insured insurance & insurance amount
        const birthDate2ndArray = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) !== eldestBirthDate.toISOString().slice(0,10)).map(i=>i.birthDate)
        let birthDate2nd = new Date(Math.min(...birthDate2ndArray))

        const insuraceAmount2nd = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === birthDate2nd.toISOString().slice(0,10))[0]
                                            .insurancePlans.filter(f=>f.compnayName ==='BlueCross')[0].insuranceAmount

        familyGroupInfo.filter(f=>f.companyName === e.compnayName)[0].familyPremium = e.insuranceAmount  + insuraceAmount2nd
      }
      
    });

    // set family discount
    familyGroupInfo.map(i => i.discountPremium = i.totalPremium - i.familyPremium) 

  return ( 
    familyGroupInfo
  )
}


