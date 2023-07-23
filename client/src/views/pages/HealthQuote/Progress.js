 // Progress Format
 export const pathDirection = (currentPath) => {
    const direction = {
        prevStep: '/health-insurance/quote/product-selection', 
        nextStep: '/health-insurance/quote/product-selection'
    } 

    const productSelection = '/health-insurance/quote/product-selection';
    const personalInfo = '/health-insurance/quote/personal-info';
    const review = '/health-insurance/quote/review';
    const submission = '/health-insurance/quote/submission';
    

    switch (currentPath) {
        case '/health-insurance/quote/product-selection': 
                direction.prevStep = productSelection
                direction.nextStep = personalInfo
                break;
        case '/health-insurance/quote/personal-info': 
                direction.prevStep = productSelection
                direction.nextStep = review
                break;
        case '/health-insurance/quote/review':
                direction.prevStep = personalInfo
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

