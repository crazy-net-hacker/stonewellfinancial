export default function AddOnPlan(props) {
  const { data, insurances } = props

  //  console.log('AddOnPlan')
  // console.log(insurances)
  // console.log('optimized', data)

  // set insurace plan  
  const listInsCompany = insurances.map(i => i.compnay_name);
  const uniqueListInsCompany = Array.from(new Set(listInsCompany));
  const listPlanName = insurances.map(i => i.generic_name);
  const uniqueListPlanName = Array.from(new Set(listPlanName));

  let optionalPlans = uniqueListInsCompany.map(c => {
    return {
      compnayName: c,
      planTypes: uniqueListPlanName.map(c => {
        return {
          planName: c,
          planNameKr: '',
          planId: '',
          coverageType: '',
          coverages: [],
          selectedCoverage: '',
          calculatedAddOnAmount: 0,
          isSelected: false
        }
      }),
    };
  })

  //get add on plans  
  insurances.forEach(i => {
    //set coverages
    optionalPlans.find(g => g.compnayName === i.compnay_name).planTypes.find(g => g.planName === i.generic_name).coverages.push(i);
  });

  // console.log(addOnPlans)
  optionalPlans =//remove empy coverages arrays
    optionalPlans.map(c => {
      c.planTypes = c.planTypes.filter(a => a.coverages.length > 0)
      return c
    })

  var len1 = data.insuredPersons.length
  for (let i = 0; i < len1; i++) {
    optionalPlans = optionalPlans.map((company) => {
      company.planTypes = company.planTypes.map((plan) => {
        plan.coverages = plan.coverages.filter(coverage => coverage.insured_type === data.insuredPersons[i].eligilbeIns 
                                                            && (coverage.trip_length_min <= data.insuredPersons[i].tripPeriod && coverage.trip_length_max >= data.insuredPersons[i].tripPeriod)
                                                            && (coverage.age_min <= data.insuredPersons[i].age && coverage.age_max >= data.insuredPersons[i].age) 
                                                            && (coverage.coverage_type === 'CVD'
                                                                ? coverage.trip_via_usa === (data.destCountry === 'US'? true : false)
                                                                : coverage.trip_via_usa === false)
                                                            )
        plan.selectedCoverage = plan.coverages.length > 0 ? plan.coverages[0].price_code: null
        plan.coverageType =  plan.coverages.length > 0 ? plan.coverages[0].coverage_type: null
        plan.planId = plan.coverages.length > 0 ? plan.coverages[0].plan_id: null
        plan.planNameKr =  plan.coverages.length > 0 ? plan.coverages[0].generic_name_kr: ''
        return plan
      })
      return company
    })
    data.insuredPersons[i].optionalAddOnPlans = JSON.parse(JSON.stringify(optionalPlans))//deep copy array of objects by value to prevent copy by reference
  }

  return (
    data
  )
}

