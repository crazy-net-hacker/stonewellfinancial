 // Progress Format
 export const pathDirection = (currentPath, data) => {
    const direction = {
        prevStep: '/travel-insurance/quote/trip-info', 
        nextStep: '/travel-insurance/quote/trip-info'
    } 

    const tripInfo = '/travel-insurance/quote/trip-info';
    const personalInfo = '/travel-insurance/quote/personal-info';
    const tripPurpose = '/travel-insurance/quote/trip-purpose';
    const tripPeriod = '/travel-insurance/quote/trip-period';
    const familyInfo = '/travel-insurance/quote/family-info';
    const preExistCondition = '/travel-insurance/quote/pre-existing-condition';
    const maternityCover = '/travel-insurance/quote/maternity-coverage';
    const mentalityCover = '/travel-insurance/quote/mentality-coverage';
    const productSelection = '/travel-insurance/quote/product-selection';
    const summary = '/travel-insurance/quote/summary';
    const application = '/travel-insurance/quote/application';
    const payment = '/travel-insurance/quote/payment';
    const review = '/travel-insurance/quote/review';
//     const submission = '/travel-insurance/quote/submission';
    const submission = '/travel-insurance/quote/submission';
    
    //
    const travelType = data.insuredPersons[0].travelType
    //only student plan is requested simple medical questions  eligilbeIns ==='STUDENT'
    const numEligilbeStudent = data.insuredPersons.filter(person => (person.eligilbeIns ==='STUDENT')).length
    const numPreExited = data.insuredPersons.filter(person => (person.age < 60)).length
    const numMaternity = data.insuredPersons.filter(person => (person.gender === 'female' && person.age > 19 && person.age < 51)).length

    switch (currentPath) {
        case '/travel-insurance/quote/trip-info': 
                direction.prevStep = tripInfo
                direction.nextStep = personalInfo
                break;
        case '/travel-insurance/quote/personal-info': 
                direction.prevStep = tripInfo
                direction.nextStep = tripPurpose
                break;
        case '/travel-insurance/quote/trip-purpose': 
                direction.prevStep = personalInfo
                if (data.tripDirection === 'OutBound'){
                        direction.nextStep = tripPeriod      
                } else{
                        if (travelType === 'SV'){
                                direction.nextStep = productSelection   
                        } else {
                                direction.nextStep = familyInfo      
                        }
                }
                break;          
        case '/travel-insurance/quote/trip-period': 
                direction.prevStep = tripPurpose
                direction.nextStep = familyInfo
                break;     
        case '/travel-insurance/quote/family-info':
                if(data.tripDirection === 'OutBound'){
                        direction.prevStep = tripPeriod
                        direction.nextStep = productSelection
                } else{
                    direction.prevStep = tripPurpose
                    if(numEligilbeStudent > 0){
                        if (numPreExited > 0) {
                                direction.nextStep = preExistCondition
                        }else if(numMaternity > 0){
                                direction.nextStep = maternityCover 
                        }else{
                                direction.nextStep = mentalityCover
                        }
                    } else {
                        direction.nextStep = productSelection
                    }
                }
                break; 
        case '/travel-insurance/quote/pre-existing-condition':
                direction.prevStep = familyInfo
                if (numEligilbeStudent > 0 && numMaternity > 0){
                        direction.nextStep = maternityCover
                }else {
                        direction.nextStep = mentalityCover
                }
                break;      
        case '/travel-insurance/quote/maternity-coverage':
                direction.prevStep = preExistCondition
                if (numEligilbeStudent > 0 && numPreExited > 0) {
                        direction.nextStep = preExistCondition
                }else {
                        direction.nextStep = familyInfo
                }
                direction.nextStep = mentalityCover
                break;   
        case '/travel-insurance/quote/mentality-coverage':
                if(numEligilbeStudent > 0 && numMaternity > 0){
                        direction.prevStep = maternityCover 
                } else if(numPreExited > 0){
                        direction.prevStep = preExistCondition   
                }else {
                        direction.prevStep = familyInfo
                }
                direction.nextStep = productSelection
                break;                      
        case '/travel-insurance/quote/product-selection':
                if(data.tripDirection === 'OutBound'){
                        direction.prevStep = familyInfo
                } else{
                        if (travelType === 'SV'){
                                direction.prevStep = tripPurpose
                        }else{ 
                                if(numEligilbeStudent > 0){
                                    direction.prevStep = mentalityCover
                                }else{
                                    direction.prevStep = familyInfo
                                }
                        }
                }
                direction.nextStep = summary
                break; 
        case '/travel-insurance/quote/summary':
                direction.prevStep = productSelection
                direction.nextStep = application
                break;   
        case '/travel-insurance/quote/application':
                direction.prevStep = summary
                direction.nextStep = payment
                break;   
        case '/travel-insurance/quote/payment':
                direction.prevStep = application
                direction.nextStep = review
                break;    
        case '/travel-insurance/quote/review':
                direction.prevStep = payment
                direction.nextStep = submission
                break;                                                            
        default:
            return (
                direction
            );
    }

    return(
       direction 
    );

    

}

