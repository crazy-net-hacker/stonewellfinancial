 // Progress Format
 export const pathDirection = (currentPath) => {
    const direction = {
        prevStep: '/life-insurance/quote/product-selection', 
        nextStep: '/life-insurance/quote/product-selection'
    } 

    const productSelection = '/life-insurance/quote/product-selection';
    const personalInfo = '/life-insurance/quote/personal-info';
    const review = '/life-insurance/quote/review';
    const submission = '/life-insurance/quote/submission';
    

    switch (currentPath) {
        case '/life-insurance/quote/product-selection': 
                direction.prevStep = productSelection
                direction.nextStep = personalInfo
                break;
        case '/life-insurance/quote/personal-info': 
                direction.prevStep = productSelection
                direction.nextStep = review
                break;
        case '/life-insurance/quote/review':
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

