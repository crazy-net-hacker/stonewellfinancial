import { travelQuoteInit } from '../views/layouts/InitFormData'

// sorting based on relationship
const relationship_sort = [
    { code: 'Primary', sort: 1 },
    { code: 'Spouse', sort: 2 },
    { code: 'Child', sort: 3 },
    { code: 'Parent', sort: 4 },
    { code: 'Siblings', sort: 5 },
    { code: 'Guardian', sort: 6 },
    { code: 'Companion', sort: 7 }
    ]

const sortNumber = (relationship) => {

     const order = relationship_sort.filter(f=>f.code ===relationship)

    return order.length > 0 ? order[0].sort : 9
}


export const draftApplication = (draftApplication) => {

    // set formInitial
    const formData = travelQuoteInit()

    const draftFormData = draftApplication[0]
    
    const mailingAddress = draftFormData.address.find(f=>f.useType === 'Mailling')
    const billingAddress = draftFormData.address.find(f=>f.useType === 'Billing')

    // console.log(draftFormData.application_id)
    const smallestVale = []
    if (draftFormData.insuredpersons[0].tripType === 'MULTI'){
        draftFormData.insuredpersons.map(i=> smallestVale.push(i.multiTripDays));
        draftFormData.insuredpersons.forEach( d => { 
            d.multiTripDays = Math.min(...smallestVale) })
    }

    // set data from previous application
    formData.application = {
            applicationCompany: '',
            applicationType: draftFormData.insured_type
            }

    formData.insuredType = draftFormData.insured_type
    formData.tripDirection = draftFormData.travel_direction_type
    formData.originCountry = draftFormData.insuredpersons[0].originCountryCode
    formData.originCountryName = draftFormData.insuredpersons[0].originCountry
    formData.originProvince = draftFormData.insuredpersons[0].originProvince
    formData.destCountry = draftFormData.insuredpersons[0].destCountryCode
    formData.destCountryName = draftFormData.insuredpersons[0].destCountry
    formData.destProvince = draftFormData.insuredpersons[0].destProvince
    formData.tripStartDate= new Date(draftFormData.insuredpersons[0].tripStartDate+'T00:00:00')
    formData.tripEndDate= new Date(draftFormData.insuredpersons[0].tripEndDate+'T00:00:00')
    formData.tripPeriod= draftFormData.insuredpersons[0].tripPeriod
    formData.tripType= draftFormData.insuredpersons[0].tripType
    formData.multiTripDays = draftFormData.insuredpersons[0].multiTripDays?draftFormData.insuredpersons[0].multiTripDays:0
    formData.tripArrivalDate = draftFormData.insuredpersons[0].arrivalDate?new Date(draftFormData.insuredpersons[0].arrivalDate+'T00:00:00'):null
    formData.eligilbeAgrement = true
    formData.insuredNumber = draftFormData.insured_person_num
    formData.insuredGroupType = draftFormData.insured_group_type
    formData.insuredPersons = []
    draftFormData.insuredpersons.sort((a,b)=> (sortNumber(a.relationship)) - (sortNumber(b.relationship))).forEach(person => {
        formData.insuredPersons.push({
            firstName: person.firstName,
            lastName: person.lastName,
            gender: person.gender,
            birthDate: new Date(person.birthdate+'T00:00:00'),
            age: person.age,
            relationship: person.relationship,
            beneficiaryName: person.beneficiaryName,
            beneficiaryRelationship: person.beneficiaryRelationship,
            attendSchoolName:'',
            graduatedDate: person.graduatedDate,
            yearDateAfterGraduated: null,
            sameDate: (person.tripStartDate === draftFormData.insuredpersons[0].tripStartDate && person.tripEndDate === draftFormData.insuredpersons[0].tripEndDate)?true:false,
            tripStartDate: new Date(person.tripStartDate+'T00:00:00'),
            tripEndDate: new Date(person.tripEndDate+'T00:00:00'),
            tripPeriod: person.tripPeriod,
            arrivalDate: person.arrivalDate?new Date(person.arrivalDate+'T00:00:00'):null,
            travelType: person.travelPurposeType,
            tripType:  person.tripType,
            tripDepartureDate: null, // for Top-up
            tripArrivalDate: null, // for Top-up
            tripTotalDays: 0,  // for Top-up        
            tripOtherCoverageDays: 0,  // for Top-up
            multiTripDays: person.multiTripDays?person.multiTripDays:0,
            preExistCond: false,
            eligilbeIns: person.eligilbeIns,
            physicalCard: person.insuranceCardIssue,
            deliverDateInsuranceCard: person.insuranceCardDeliveryDate?new Date(person.insuranceCardDeliveryDate+'T00:00:00'):person.insuranceCardDeliveryDate,
            insurancePlans: [],
            selectedPlan: [],
            selectedMedQuesAnswer: [],
            optionalCarewellService: {},
            optionalAddOnPlans: [],
            // renewalInsurance: isRenew
            selectedWhenSave:{
                insured_group_type: draftFormData.insured_group_type,
                insuranceCompany: person.compnayName,
                coverage : person.coverage,
                deductible: person.deductible,
                optionPlan: person.optionPlan,
                carewellService: { packageName: person.carewellService, 
                                    packageAmount: person.carewellServiceAmount, 
                                    isSelected: person.carewellService?true:false },  
                medicalQuestion: person.medicalAnswer.length > 0 
                                    ?
                                        { answered: true,
                                            quesAnswer: person.medicalAnswer,
                                            chargeRate: person.chargeRate,
                                            confirmEligibility: true,
                                            discount:0,   //shoud be changed  - get data form saved data
                                            surcharge: person.planMedicalSurcharge 
                                        } 
                                    : person.medicalAnswer
            },
            // use for 'Modifying' validation
            currentStatus: draftFormData.app_status,
        })
    });
    formData.contactEmail = draftFormData.email
    formData.contactPhone = draftFormData.phone
    formData.maillingInCanada = draftFormData.mailling_in

    // address information
    if(mailingAddress){
        formData.mailCity =  mailingAddress.city
        formData.mailProvince = mailingAddress.province
        formData.mailStreetName = mailingAddress.street
        formData.mailUnitApartmentNo = mailingAddress.suiteNo
        formData.mailPostalCode = mailingAddress.postalcode
        formData.isMailing = mailingAddress.isMailing
    } 
  
    // payment information
    formData.paymentByClient = draftFormData.payment[0].PaymentBy==='Client'?true:false 
    formData.paymentMethod = draftFormData.payment[0].paymentMethod
    formData.creditCardType = draftFormData.payment[0].creditCardType
    formData.creditCardNumber = draftFormData.payment[0].creditCardNumber
    formData.cardHolderName = draftFormData.payment[0].cardHolderName
    formData.cardExpired = draftFormData.payment[0].cardExpired
    formData.cardcvv = draftFormData.payment[0].cardcvv
    formData.senderName = draftFormData.payment[0].senderName

    if(billingAddress){
        formData.billCity =  billingAddress.city
        formData.billProvince = billingAddress.province
        formData.billStreetName = billingAddress.street
        formData.billUnitApartmentNo = billingAddress.suiteNo
        formData.billPostalCode = billingAddress.postalcode
        formData.billCountry = billingAddress.country
    } 

    formData.vendorID = draftFormData.vendor_id
    formData.userID = draftFormData.user_id
    formData.sourceFrom = (draftFormData.source_from==='M' ||draftFormData.source_from==='P')?draftFormData.source_from:'V';

    formData.applicationID = draftFormData.application_id
    formData.note = draftFormData.note.length > 0 && draftFormData.note.filter(f=>f.status === 'Applying' ||f.status === '' ).length > 0? draftFormData.note.filter(f=>f.status === 'Applying' ||f.status === '' )[0].note:''
    formData.sourceChnnel = draftFormData.source_chnnel
    formData.preferLanguage = draftFormData.prefer_language
    formData.vendorAddress = draftFormData.vendor_address[0]

    if (draftFormData.app_status==='Modifying'){
        formData.currentStatus = 'Modifying'
    }

    return( formData )
}

//
export const renewalApplication = (application, user, isRenew, userRole) => {

    const mailingAddress = application.address.find(f=>f.useType === 'Mailling')

    // set formInitial
    const renewApplication = travelQuoteInit()

    // set data from previous application
    renewApplication.application = {
            applicationCompany: application.companyName,
            applicationType: application.insured_type
            }

    renewApplication.insuredType = application.insured_type;
    renewApplication.tripDirection = application.travel_direction_type;
    renewApplication.originCountry = application.insuredpersons[0].originCountryCode?application.insuredpersons[0].originCountryCode:(application.insured_type==='CANADIAN'?'CA':'');
    renewApplication.originCountryName = application.insuredpersons[0].originCountry?application.insuredpersons[0].originCountry:(application.insured_type==='CANADIAN'?'CANADA':'');
    renewApplication.destCountry = application.insuredpersons[0].destCountryCode?application.insuredpersons[0].destCountryCode:(application.insured_type!=='CANADIAN'?'CA':'');
    renewApplication.destCountryName = application.insuredpersons[0].destCountry?application.insuredpersons[0].destCountry:(application.insured_type!=='CANADIAN'?'CANADA':'');
    renewApplication.tripType= application.insuredpersons[0].tripType;
    renewApplication.insuredNumber = application.insured_person_num;
    renewApplication.insuredPersons = []
    application.insuredpersons.forEach((person, index) => {
    renewApplication.insuredPersons.push({
        firstName: person.firstName,
        lastName: person.lastName,
        gender: person.gender,
        birthDate: new Date(person.birthdate+'T00:00:00'),
        age: person.age?person.age:0,
        relationship: person.relationship?person.relationship:(index===0?'Primary':''),
        beneficiaryName: person.beneficiaryName?person.beneficiaryName:'',
        beneficiaryRelationship: person.beneficiaryRelationship?person.beneficiaryRelationship:'',
        attendSchoolName:'',
        graduatedDate: null,
        yearDateAfterGraduated: null,
        sameDate: true,
        tripStartDate: null,
        tripEndDate: null,
        tripPeriod: 0,
        arrivalDate: null,
        travelType: person.travelPurposeType,
        tripType:  person.tripType?person.tripType:'',
        tripDepartureDate: null, // for Top-up
        tripArrivalDate: null, // for Top-up
        tripTotalDays: 0,  // for Top-up        
        tripOtherCoverageDays: 0,  // for Top-up
        multiTripDays: 0,
        preExistCond: false,
        eligilbeIns: person.eligilbeIns,
        physicalCard: person.insuranceCardIssue?person.insuranceCardIssue:false,
        deliverDateInsuranceCard: null,
        insurancePlans: [],
        selectedPlan: [],
        selectedMedQuesAnswer: [],
        // optionalCarewellService: { packageName: 'Package', packageAmount: 0, isSelected: false },
        optionalCarewellService: {},
        optionalAddOnPlans: [],
        renewalInsurance: isRenew
    })
    });
    renewApplication.contactEmail = application.email?application.email:''
    renewApplication.contactPhone = application.phone?application.phone:''
    renewApplication.maillingInCanada = application.mailling_in

    if(mailingAddress){
    renewApplication.mailCity =  mailingAddress.city?mailingAddress.city:''
    renewApplication.mailProvince = mailingAddress.province?mailingAddress.province:''
    renewApplication.mailStreetName = mailingAddress.street?mailingAddress.street:''
    renewApplication.mailUnitApartmentNo = mailingAddress.suiteNo?mailingAddress.suiteNo:''
    renewApplication.mailPostalCode = mailingAddress.postalcode?mailingAddress.postalcode:''
    renewApplication.isMailing = mailingAddress.isMailing?mailingAddress.isMailing:''
    } 

    renewApplication.vendorID = application.vendor_id
    renewApplication.userID = user 
    renewApplication.userRole = userRole?userRole:''  
    renewApplication.sourceFrom = 'V'
    renewApplication.renewal = isRenew
                            
    return( renewApplication )
}
