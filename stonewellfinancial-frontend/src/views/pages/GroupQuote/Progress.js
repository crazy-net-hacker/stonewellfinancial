 // Progress Format
 export const pathDirection = (currentPath) => {
    const direction = {
        prevStep: '/group-benefits/quote/product-selection', 
        nextStep: '/group-benefits/quote/product-selection'
    } 

    const productSelection = '/group-benefits/quote/product-selection';
    const personalInfo = '/group-benefits/quote/personal-info';
    const review = '/group-benefits/quote/review';
    const submission = '/group-benefits/quote/submission';
    

    switch (currentPath) {
        case '/group-benefits/quote/product-selection': 
                direction.prevStep = productSelection
                direction.nextStep = personalInfo
                break;
        case '/group-benefits/quote/personal-info': 
                direction.prevStep = productSelection
                direction.nextStep = review
                break;
        case '/group-benefits/quote/review':
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

