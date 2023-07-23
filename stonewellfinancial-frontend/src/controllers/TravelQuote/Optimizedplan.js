import {CalculateAgeBaseEffectiveDate} from '../CalculateValue'

export default function OptimizedPlan(props) {
  const {data, insurances } = props
    // source - 'O' Optimized 'M' Manualized
    // const source = data.sourceFrom === 'M' ?'Manualized':'Optimized'
  //  console.log(data)
  
    // 보험을 구입하는 대상이 부모 중 한명이 학생일 경우 가족모두 Allianz, Tugo 모두 제공.
    // 하지만, 학생이 자녀일 경우 student family 는 tugo 보험만 제공
    // 보험을 구업하는 대상이 1년이내의 졸업자일경우, 가족모두 Alliazn 보험 제공
    const isStudentIncluded =  data.insuredPersons.filter(p => p.travelType === "SS" || (p.travelType === "PW" && p.yearDateAfterGraduated >= p.tripEndDate)).length > 0 ? true : false
    const parentStudentIncluded =  data.insuredPersons.filter(p => (p.travelType === "SS" || (p.travelType === "PW" && p.yearDateAfterGraduated >= p.tripEndDate))
                                                            && (p.relationship ==='Primary' 
                                                                || p.relationship ==='Parent'
                                                                || p.relationship ==='Spouse') ).length > 0 ? true : false


    // check that insured can be eligilbe for Stuent insurace
    // 가족중에 학생이 있다면, 학생보험 가입가능
    // SS : attend full time school
    // SF : full time student’s family member
    // PW : PGWP worker - College or University graduated student in Canada (less than 1 year)
    const insuredEligibleStudent = data.insuredPersons.filter(p => p.travelType === "SS" 
                                                                ||  p.travelType === "SF" 
                                                                ||  (p.travelType === "PW" 
                                                                      && p.yearDateAfterGraduated >= p.tripEndDate)
                                                                )
    
    data.eligilbeStuent = insuredEligibleStudent.length > 0 ? true : false

    for (var i = 0; i < data.insuredPersons.length; i++) {

        // console.log('based on current date', CalculateAge(data.insuredPersons[i].birthDate))
        // console.log('based on effective date', CalculateAgeBaseEffectiveDate(data.insuredPersons[i].birthDate, data.insuredPersons[i].tripStartDate))
        
        // Calculate Age based on effective(trip start) date
        // data.insuredPersons[i].age = CalculateAge(data.insuredPersons[i].birthDate)
        // Re-Calculate Age based on effective(trip start) date
        data.insuredPersons[i].age = CalculateAgeBaseEffectiveDate(data.insuredPersons[i].birthDate, data.insuredPersons[i].tripStartDate)
        
        // Checking Eligibility
        // destCountry !== 'CA' => OutBound that means only provide canadian plans
        //
        // if (data.insuredPersons[i].covrProvHealth === true)
          // if (data.destCountry !== 'CA')
          //   {
          //     data.insuredPersons[i].eligilbeIns = 'CANADIAN'
          //   }

        if (data.destCountry !== 'CA' && data.insuredPersons[i].travelType !== 'SS') 
        {
          data.insuredPersons[i].eligilbeIns = 'CANADIAN';
        } else if (data.destCountry !== 'CA' && data.insuredPersons[i].travelType === 'SS') {
          // Handle the case when the destination country is not 'CA' and the travel type is 'SS'
          data.insuredPersons[i].eligilbeIns = 'STUDENT';
        }
        else
        {
            // 가족중에 학생이 있다면
            // 나이가 60세이하 일 경우
            // inbound
          if (data.eligilbeStuent === true && 
              data.insuredPersons[i].age < 60 && 
              // data.originCountry !== 'CA' && data.destCountry === 'CA'  && 
              data.insuredPersons[i].relationship !== 'Guardian')   
          {
            data.insuredPersons[i].eligilbeIns = 'STUDENT'
          }
          else{
            data.insuredPersons[i].eligilbeIns = 'VISITOR'     
          }
        
        }

        //set eligilbeIns from travel application
        if(data.insuranceType && data.insuranceType === 'STUDENT'){
          data.insuredPersons[i].eligilbeIns = data.insuranceType
        }

        // reset
        data.insuredPersons[i].selectedPlan = []
        

        const insuredEligilbeIns = data.insuredPersons[i].eligilbeIns
        // const insuredRelationship = data.insuredPersons[i].relationship
        // const insuredTravelType = data.insuredPersons[i].travelType
        const tripLength = data.insuredPersons[i].tripType==='MULTI'?data.insuredPersons[i].multiTripDays:data.insuredPersons[i].tripPeriod
        const inDestination = data.inDestination
        // BlueCrossPlan is abled to apply if originCountry is Cananda && provinces are 'ON' 'QC' 'NB' 'PE' 'NL' 'NS' && not in destination
        let eligilbeBlueCrossPlan = false
        if(data.originCountry === 'CA' && 
            (data.originProvince === 'ON' || data.originProvince === 'QC' || data.originProvince === 'NB' || data.originProvince === 'PE' || data.originProvince === 'NL' || data.originProvince === 'NS' ))
        {eligilbeBlueCrossPlan = true}

        // AllianzPlan is abled to apply if originCountry is Cananda && provinces are 'ON' 'QC'
          let eligilbeAllianzCANPlan = false
          if(data.originProvince === 'ON' || data.originProvince === 'QC')
          {eligilbeAllianzCANPlan = true}

       
        const insuredAge = data.insuredPersons[i].age
        const tripViaUSA = data.destCountry === 'US'? true : false ;
        
        const travelType = data.insuredPersons[i].travelType  // travelPurpose
        const tripType =  data.insuredPersons[i].tripType==='MULTI'?'MULTI':'SINGLE' ; //'MULTI'  //'MULTI'
        
        // sameTripPeriodWithSS for checking whether SSinsured trip period same or not 
        const tripStartDate = data.insuredPersons[i].tripStartDate
        const tripEndDate = data.insuredPersons[i].tripEndDate
        const sameTripPeriodWithSS = data.insuredPersons.filter(p => (p.travelType === "SS" || (p.travelType === "PW" && p.yearDateAfterGraduated >= p.tripEndDate))
                                        && p.tripStartDate.toISOString().slice(0,10) === tripStartDate.toISOString().slice(0,10)
                                        && p.tripEndDate.toISOString().slice(0,10) === tripEndDate.toISOString().slice(0,10)).length > 0 ? true : false

        let isAbleToGetAllianz = false

        // 학생 보험에 가입할 경우, 동반자가 학생 보험 가입일과 동일 경우, 알리안츠 보험도 구입할수 있는 여부 체크
        if (data.insuredPersons[i].eligilbeIns === 'STUDENT' && isStudentIncluded === true)
        {
          if  ((data.insuredPersons[i].relationship === 'Primary' && parentStudentIncluded === true && sameTripPeriodWithSS === true)
                  || (data.insuredPersons[i].relationship === 'Child' && parentStudentIncluded === true && sameTripPeriodWithSS === true)
                  || (data.insuredPersons[i].relationship === 'Spouse' && parentStudentIncluded === true && sameTripPeriodWithSS === true)
                  || (data.insuredPersons[i].relationship === 'Parent' && parentStudentIncluded === true && sameTripPeriodWithSS === true)
                  || data.insuredPersons[i].travelType === 'SS'
                  || (data.insuredPersons[i].travelType === 'PW' && data.insuredPersons[i].yearDateAfterGraduated >= data.insuredPersons[i].tripEndDate)
                  )
        { isAbleToGetAllianz = true}}

        let eligilbePlans = []
        // console.log(insuredRelationship)

        // set type of insurance that insured is eligilbe
        // set tripLength for Canadian Multi Trip
        // only provide Allianz's product if travel purpose is a graduated student in Canada (less than 1 year) without student family
        if (data.insuredPersons[i].eligilbeIns === 'STUDENT') 
        {
          // if (source === 'Optimized'){
            eligilbePlans = insurances.filter(ins => (ins.insured_type === insuredEligilbeIns && ins.plan_id !== 'PLOSMED001')
                                                          // && (isAbleToGetAllianz === true ?  ins.compnay_name !== '' :  ins.compnay_name !== 'Allianz')
                                                          && (isAbleToGetAllianz === true 
                                                              ?  ( data.insuredPersons.filter(f=> f.travelType ==='SS').length === 0 &&
                                                                    data.insuredPersons.filter(f => f.travelType === 'PW' && f.yearDateAfterGraduated >= f.tripEndDate).length>0
                                                                      ? ins.compnay_name === 'Allianz'
                                                                      : ins.compnay_name !== '' )
                                                              :  ins.compnay_name !== 'Allianz')
                                                          && (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
                                                          && (ins.age_min <= insuredAge && ins.age_max >= insuredAge) 
                                                          )
          // }else{
          //   eligilbePlans = insurances.filter(ins => (ins.insured_type === insuredEligilbeIns)
          //                                                 // && (isAbleToGetAllianz === true ?  ins.compnay_name !== '' :  ins.compnay_name !== 'Allianz')
          //                                                 && (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
          //                                                 && (ins.age_min <= insuredAge && ins.age_max >= insuredAge) 
          //                                                 )
          // }
        } 
        else if (data.insuredPersons[i].eligilbeIns === 'VISITOR') {
          // No provide GMS product if destProvince is QC
          eligilbePlans = insurances.filter(ins => (ins.insured_type === insuredEligilbeIns)
                                                        && (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
                                                        && (ins.age_min <= insuredAge && ins.age_max >= insuredAge) 
                                                        && (travelType === 'SV'
                                                            ? (parseInt(ins.price_code) >= 100000)
                                                            : (parseInt(ins.price_code) > 0))
                                                        && (data.destProvince === 'QC'
                                                            ? ins.compnay_name !== 'GMS'
                                                            : ins.compnay_name !== '')
                                                        )
        }

        // Canadian Student Plan
        else if (data.insuredPersons[i].eligilbeIns === 'CANADIAN' && data.insuredPersons[i].age < 41 && data.insuredPersons[i].travelType === 'SA') {
          eligilbePlans = insurances.filter(ins => (
            (ins.insured_type === insuredEligilbeIns || ins.plan_id === 'PLOSMED001') // Include 'PLOSMED001' plan for STUDENT group
            && (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
            && (ins.age_min <= insuredAge && ins.age_max >= insuredAge)
            && (tripType === 'SINGLE'
                ? (ins.trip_type === 'SINGLE' &&
                    (ins.compnay_name === 'BlueCross' || ins.compnay_name === 'Tugo'
                      ? (ins.trip_via_usa === true || ins.trip_via_usa === false)
                      : ins.trip_via_usa === tripViaUSA
                    )
                  )
                : (ins.trip_type === 'MULTI')
              )
            && (inDestination === true
                ? (ins.compnay_name === 'Allianz' && (eligilbeAllianzCANPlan === true))
                : ((ins.compnay_name === 'BlueCross' && (eligilbeBlueCrossPlan === true))
                    || ins.compnay_name !== 'BlueCross'
                  )
              )
            && (eligilbeAllianzCANPlan === false ? ins.compnay_name !== 'Allianz' : ins.compnay_name !== '')
            && (ins.compnay_name === 'Tugo' ? ins.plan_id === 'PLOSMED001' : ins.plan_id !== 'PLOSMED001')
          ))
          console.log(eligilbePlans)
        }

        // Canadian Plan
        else {
          eligilbePlans = insurances.filter(ins => (ins.insured_type === insuredEligilbeIns)
                                                        && (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
                                                        // && (ins.trip_type === 'SINGLE' || (ins.compnay_name === 'Allianz' && tripLength <= 125) || (ins.compnay_name === 'Tugo' && tripLength <= 60)
                                                        //     ? (ins.trip_length_min <= tripLength && ins.trip_length_max >= tripLength)
                                                        //     : (ins.compnay_name === 'Allianz'
                                                        //         ?(ins.trip_length_min <= 125 && ins.trip_length_max >= 125)
                                                        //         :(ins.trip_length_min <= 60 && ins.trip_length_max >= 60)
                                                        //         )
                                                        //     )
                                                        && (ins.age_min <= insuredAge && ins.age_max >= insuredAge)
                                                        // && (ins.trip_type === 'SINGLE'?ins.trip_via_usa === tripViaUSA : (ins.trip_via_usa === true || ins.trip_via_usa === false)) 
                                                        // && (ins.trip_type === 'SINGLE' && ins.trip_via_usa === tripViaUSA) 
                                                        // && (ins.trip_type === 'MULTI') 
                                                        && (tripType === 'SINGLE' 
                                                            // ? (ins.trip_type === 'SINGLE' && ins.trip_via_usa === tripViaUSA) 
                                                            ? (ins.trip_type === 'SINGLE' && 
                                                                (ins.compnay_name === 'BlueCross'
                                                                  ? (ins.trip_via_usa === true || ins.trip_via_usa === false)
                                                                  : ins.trip_via_usa === tripViaUSA
                                                                )
                                                              ) 
                                                            : (ins.trip_type === 'MULTI') 
                                                            )
                                                        // && (inDestination === true
                                                        //       ? ins.compnay_name === 'Allianz'
                                                        //       : ins.compnay_name !== '')
                                                        && (inDestination === true
                                                              ? (ins.compnay_name === 'Allianz' && (eligilbeAllianzCANPlan === true))
                                                              : ((ins.compnay_name === 'BlueCross' && (eligilbeBlueCrossPlan === true))
                                                                  ||ins.compnay_name !== 'BlueCross'))
                                                                  
                                                        && (eligilbeAllianzCANPlan === false
                                                              ? ins.compnay_name !== 'Allianz'
                                                              : ins.compnay_name !== '')

                                                        )      
          
        //  console.log(data.insuredPersons[i].travelType)

        }
          
        // set insurace plan  
        const listInsCompany = eligilbePlans.map( i => i.compnay_name);
        const uniqueListInsCompany = Array.from(new Set(listInsCompany));
        const insurancePlans = uniqueListInsCompany.map( c => { 
                    return  { compnayName:c, 
                              coverages:[],
                              selectedPlanName:'', 
                              selectedPlanNameKr:'', 
                              selectedCoverage:'',
                              // selectedDeductAmouont:0, 
                              calculatedDeductAmount: 0,
                              calculatedInsuranceAmount: 0,
                              medicalQuestion:{
                                quesAnswer: [],
                                surcharge: 0,
                                discount: 0,
                                chargeRate: '1',
                                confirmEligibility:'',
                                answered: false
                              },
                              isSelected: false,
                              // recommended :false
                              // selectedCarewellService: { packageName: '', packageAmount: 0}
                            };
                } ); 

        // can be select multi Trip Price for Candian traveller
        const multiTripPriceOver60 = 
                  insurances.filter(ins => (ins.insured_type === insuredEligilbeIns)
                                              && (ins.age_min <= insuredAge && ins.age_max >= insuredAge)
                                              && (ins.trip_type === 'MULTI') 
                                              ).map(i=> ({ compnay_name: i.compnay_name, 
                                                            period_code: i.period_code, 
                                                            trip_length_min: i.trip_length_min,
                                                            trip_length_max: i.trip_length_max,
                                                            value: i.value}))

        // get insurace plan by optimized insurance - original
        // eligilbePlans.forEach( d => { 
        //   // set coverages
        //   insurancePlans.find( g => g.compnayName === d.compnay_name).coverages.push(d); 

        //   // can be select multi Trip Price for Candian traveller
        //   if (insurancePlans.find( g => g.compnayName === d.compnay_name).coverages.find(c=>c.trip_type==='MULTI'))
        //   {
        //     // set multi_trip_rate in coverages          
        //     insurancePlans.find( g => g.compnayName === d.compnay_name)
        //                       .coverages.filter(c=>c.trip_type==='MULTI').map(i => (i.multi_trip_rate = 
        //                                   multiTripPriceOver60.filter(m => m.compnay_name===d.compnay_name) ))
        //   }

        //   // set selected Coverage
        //   if (insurancePlans.find( g => g.compnayName === d.compnay_name).selectedCoverage === ''){
        //         insurancePlans.find( g => g.compnayName === d.compnay_name).selectedCoverage = d.insured_type==='VISITOR' && travelType !== 'SV'? '50000' : d.price_code ;
        //       }
          
        //   // set deduct as default
        //   insurancePlans.find( g => g.compnayName === d.compnay_name).coverages
        //                 .map(coverage => 
        //                       coverage.deduct = coverage.type_deduct.length > 0 
        //                                           ? (coverage.type_deduct.filter(d => d.default === true)[0].discount) 
        //                                           : 0
        //   )
        // });

        eligilbePlans.forEach(d => {
          // Set coverages
          const company = insurancePlans.find(g => g.compnayName === d.compnay_name);
          company.coverages.push(d);
          // Check if multi trip type is available
          const multiTripCoverage = company.coverages.find(c => c.trip_type === 'MULTI');
          if (multiTripCoverage) {
            // Set multi_trip_rate in coverages
            const multiTripRates = multiTripPriceOver60.filter(m => m.compnayName === d.compnay_name);
            multiTripCoverage.multi_trip_rate = multiTripRates;
          }
        
          // Set selected coverage
          if (company.selectedCoverage === '') {
            const selectedCoverage = (d.insured_type === 'VISITOR' && travelType !== 'SV') ? '50000' : d.price_code;
            company.selectedCoverage = selectedCoverage;
          }
        
          // Set deduct as default
          company.coverages.forEach(coverage => {
            coverage.deduct = coverage.type_deduct.length > 0 ? coverage.type_deduct.find(d => d.default === true)?.discount : 0;
          });
        });
        
        
        data.insuredPersons[i].insurancePlans = insurancePlans;
        
        data.insuredPersons[i].optionalCarewellService = { packageName: 'Package', packageAmount: 0, isSelected: false }

        //family premium
        data.familyGroup = { 
          isSelected: '', 
          selectedCompnayName: '',
          totalPremium: 0,
          discountPremium: 0,
          familyPremium: 0
        }

      }

  return (
    data
  )
}