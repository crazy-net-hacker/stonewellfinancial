const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
// Travel Quote Form initial data
export function travelQuoteInit() {
  const data = {
      insuredType: '',
      insuredGroupType: 'Individual',
      originCountry: '',
      originCountryName: '',
      originProvince: '',
      originProvinceName: '',
      destCountry: '',
      destCountryName: '',
      destProvince: '',
      destProvinceName: '',
      tripDirection: '',
      inDestination: '',
      // lastArrived: null,
      tripStartDate: null,
      tripEndDate: null,
      tripPeriod: 0,
      tripType: 'SINGLE',
      multiTripDays: 0,
      tripArrivalDate: null, 
      eligilbeAgrement : null,
      insuredNumber: '',
      insuredPersons: [{
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: null,
        age: 0,
        ageDays: 0,
        relationship: 'Primary',
        beneficiaryName:'',
        beneficiaryRelationship: '',
        attendSchoolName:'',
        graduatedDate: null,
        yearDateAfterGraduated: null,
        sameDate: true,
        tripStartDate: null,
        tripEndDate: null,
        tripPeriod: 0,
        arrivalDate: null,
        travelType: '',
        tripType: 'SINGLE',
        tripDepartureDate: null, // for Top-up
        tripArrivalDate: null, // for Top-up
        tripTotalDays: 0,  // for Top-up        
        tripOtherCoverageDays: 0,  // for Top-up
        multiTripDays: 0,
        preExistCond: false,
        coverCond: false,
        maternity: false,
        mentalIllness: false,
        eligilbeIns: '',
        physicalCard: false,
        deliverDateInsuranceCard: null,
        insurancePlans: [],
        selectedPlan: [],
        selectedMedQuesAnswer: [],
        // optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
        optionalCarewellService: {},
        optionalAddOnPlans: [],
        renewalInsurance: false,
      }],
      eligilbeStuent: false,
      //family premium
      familyGroup: { 
          isSelected: false, 
          selectedCompnayName: '',
          totalPremium: 0,
          discountPremium: 0,
          familyPremium: 0
      },
      //contact
      contactName:'',
      phoneInCanada: true,
      contactPhone:'',
      contactEmail: '',
      // mailing address
      maillingInCanada: true,
      mailStreetName:  '',
      mailUnitApartmentNo:  '',
      mailCity:  '',
      mailProvince:  '',
      mailPostalCode:  '',
      mailCountry:  'CA',
      // payment information
      paymentByClient: false,
      paymentMethod: '',
      creditCardType: '',
      creditCardNumber: '',
      cardHolderName: '',
      cardcvv: '',
      cardExpired: '',
      senderName: '',
      // billing address
      sameMailAddress:false,
      billStreetName:  '',
      billUnitApartmentNo:  '',
      billCity:  '',
      billProvince:  '',
      billPostalCode:  '',
      billCountry:  '',
      //
      vendorID: '',
      sourceFrom: '',
      userID:'',
      renewal: false,
      // 
      applicationID: '',
      timeZone: timezone,
      note: '',
      sourceChnnel: '',
      preferLanguage: 'en',
      // preferLanguage: '',
      submitType: ''
    }

  return data
}

// Life Quote Form initial data
export function lifeQuoteInit() {
  const data = {
      productType: '',
      productTypeDesc: '',
      productKind: '',
      productKindDesc: '',
      selectedBenefitAmount: '',
      benefitAmount: '',
      firstName: '',
      lastName: '',
      birthDate: null,
      age: 0,
      smokeStatus: '',
      healthStatus: '',
      healthStatusDesc: '',
      phone: '',
      email: '',
      gender: '',
      contactMethod: '',
      personID : '',
      quoteID : '',
      quoteDate: '',
      timeZone: timezone  
  }
    return data
  }

// Health Quote Form initial data
export function healthQuoteInit() {
  const data = {
    insuranceKind: '',
    insuranceKindDesc: '',
    productType: '',
    productTypeDesc: '',
    productKind: '',
    productKindDesc: '',
    selectedBenefitAmount: '',
    benefitAmount: '',
    phone: '',
    email: '',
    contactMethod: '',
    // for Critical illness or Disability
    familyIllnessHistory: '',
    ageIllness: '',
    nameIllness: '', 
    // for selected Disability
    annualIncome: '',
    occupation: '',
    roleAtWork: '',
    insuredNumber: '',
    province: '',
    insuredPersons: [{
      relationship: 'Primary',
      firstName: '',
      lastName: '',
      birthDate: null,
      age: 0,
      gender: '',
      smokeStatus: '',
      healthStatus: '',
      healthStatusDesc: ''
    }],
    personID : '',
    quoteID : '',
    quoteDate: '',
    timeZone: timezone
  }
    return data
  }

// Group Quote Form initial data
export function groupQuoteInit() {
  const data = {
    healthPlan: '',
    dentalPlan: '',
    paramedical: '',
    prescriptionDrug: '',
    visionPlan: '',
    longTermDisability: '',
    shortTermDisability: '',
    criticalIllnessInsurance: '',
    groupRRSPandDPSP: '',
    groupTFSA: '',
    companyName: '',
    natureOfBusiness: '',
    contactPerson: '',
    businessYear: '',
    numberOfFullTime: '',
    numberOfcovered: '',
    reasonNotSame: '',
    phone: '',
    email: '',
    contactMethod: '',
    insuredNumber: '',
    insuredPersons: [],
    personID : '',
    quoteID : '',
    timeZone: timezone
  }
    return data
  }


