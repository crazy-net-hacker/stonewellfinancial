// Calculate Age
export  const CalculateAge = (bod) => {
   
  const current = new Date()
  var timeDifference = 0;
  var differMonths =  0;

  if (bod){
    var birthOfDate = bod
    var currentDate = current
  
    // calculate age
    var birdate_unixtime = parseInt(birthOfDate.getTime() / 1000);
    var curDate_unixtime = parseInt(currentDate.getTime() / 1000);
  
    timeDifference = curDate_unixtime - birdate_unixtime;
    differMonths = Math.floor((timeDifference / (60 * 60 * 24 * 365.25))) ;
    differMonths = differMonths > 0 ? differMonths : 0 ;
  }

  return (isNaN(differMonths) ? 0: parseInt(differMonths));
}


// Calculate Age based on the effective date
export  const CalculateAgeBaseEffectiveDate = (bod, startDate) => {
  
  const sDate = new Date(startDate)
  var timeDifference = 0;
  var differMonths =  0;

  if (bod){
    var birthOfDate = bod
    var effectiveDate = sDate
  
    // calculate age
    var birthDate_unixtime = parseInt(birthOfDate.getTime() / 1000);
    var effectiveDate_unixtime = parseInt(effectiveDate.getTime() / 1000);
  
    timeDifference = effectiveDate_unixtime - birthDate_unixtime;
    differMonths = Math.floor((timeDifference / (60 * 60 * 24 * 365.25))) ;

    differMonths = differMonths > 0 ? differMonths : 0 ;

  }

  return (isNaN(differMonths) ? 0: parseInt(differMonths));
}


// Calculate Age days
export  const CalculateAgeDays = (bod, startDate) => {

  const sDate = new Date(startDate)
  var timeDifference = 0;
  var differDays =  0;

  if (bod){
    var birthOfDate = bod
    var effectiveDate = sDate
  
    // calculate age
    var birthDate_unixtime = parseInt(birthOfDate.getTime() / 1000);
    var effectiveDate_unixtime = parseInt(effectiveDate.getTime() / 1000);
  
    timeDifference = effectiveDate_unixtime - birthDate_unixtime;

    differDays = Math.floor((timeDifference / (60 * 60 * 24))) ;

    differDays = differDays > 0 ? differDays : 0 ;

  }

  return (isNaN(differDays) ? 0: parseInt(differDays));
}


// Calculate Trip Days - original
// export const CalculateTripDays = (startDate, endDate) => {  

//   let tripPeriod = 0
  
//   if ( startDate && endDate) {
//     if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
//       // if (startDate <= endDate) {
//       //   tripPeriod = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
//       // }    

//       const sDate = new Date(startDate.toISOString().substring(0,10))
//       const eDate = new Date(endDate.toISOString().substring(0,10))

//       if (sDate <= endDate) {
//         tripPeriod = Math.ceil(Math.abs(eDate - sDate) / (1000 * 60 * 60 * 24)) + 1
//       }
//     }
//   }
//   return (tripPeriod);
// }

// no time zone affected
export const CalculateTripDays = (startDate, endDate) => {
  let tripPeriod = 0;

  if (startDate && endDate) {
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const eDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      // Calculate the difference in milliseconds
      const timeDifference = eDate.getTime() - sDate.getTime();

      // Convert milliseconds to days
      tripPeriod = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  return tripPeriod;
};






// Calculate Trip EndDate - original
// export const CalculateTripEndDate = (startDate, tripDays) => {  

//   let expDate = null

//   if (tripDays && tripDays > 0) {

//     let result = new Date(startDate)

//     result = result.setTime(result.getTime() + (parseInt(tripDays)-1) * 24 * 60 * 60 * 1000) 
//     expDate = new Date(result)
//   }

//   return (expDate);
// }

// no time zone
export const CalculateTripEndDate = (startDate, tripDays) => {
  let expDate = null;

  if (tripDays && tripDays > 0) {
    let result = new Date(startDate);
    result.setDate(result.getDate() + (parseInt(tripDays) - 1));
    expDate = result;
  }

  return expDate;
};


// function isDate(date) { 
//   var objDate,  // date object initialized from the ExpiryDate string 
//       mSeconds, // ExpiryDate in milliseconds 
//       day,      // day 
//       month,    // month 
//       year;     // year 
//   // date length should be 10 characters (no more no less) 
//   if (date.length !== 10) { 
//       return false; 
//   } 
//   // third and sixth character should be '/' 
//   if (ExpiryDate.substring(2, 3) !== '/' || ExpiryDate.substring(5, 6) !== '/') { 
//       return false; 
//   } 
//   // extract month, day and year from the ExpiryDate (expected format is mm/dd/yyyy) 
//   // subtraction will cast variables to integer implicitly (needed 
//   // for !== comparing) 
//   month = ExpiryDate.substring(0, 2) - 1; // because months in JS start from 0 
//   day = ExpiryDate.substring(3, 5) - 0; 
//   year = ExpiryDate.substring(6, 10) - 0; 
//   // test year range 
//   if (year < 1000 || year > 3000) { 
//       return false; 
//   } 
//   // convert ExpiryDate to milliseconds 
//   mSeconds = (new Date(year, month, day)).getTime(); 
//   // initialize Date() object from calculated milliseconds 
//   objDate = new Date(); 
//   objDate.setTime(mSeconds); 
//   // compare input date and parts from Date() object 
//   // if difference exists then date isn't valid 
//   if (objDate.getFullYear() !== year || 
//       objDate.getMonth() !== month || 
//       objDate.getDate() !== day) { 
//       return false; 
//   } 
//   // otherwise return true 
//   return true; 
// }

// Get UTC Date
export const getUTCDate = () => {
  const currentDate = new Date();
  const options = {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return currentDate.toLocaleDateString('en-CA', options).replace(/\//g, '-');
};


export const calculatePackageAmount = (carewellService, pkgName, tripPeriod) => {

  const carewellAmount = carewellService.filter(c => c.name === pkgName)
                                        .map(c => ({ dayValue: c.dayValue, yearValue: c.yearValue, minValue: c.minValue }))[0]

  let carewellServiceAmount = parseInt(tripPeriod) === 365 ? carewellAmount.yearValue : parseInt(tripPeriod) * carewellAmount.dayValue    
  
  // check the service minimum amount
  if (carewellServiceAmount < carewellAmount.minValue) {carewellServiceAmount = carewellAmount.minValue }
  // check the sevice maximum amount as yearValue
  else if (carewellServiceAmount > carewellAmount.yearValue) {carewellServiceAmount = carewellAmount.yearValue }
  
  return (
    carewellServiceAmount
  )
}
