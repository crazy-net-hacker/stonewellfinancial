 // date Format
export const dateFormat = (date) => {
  
    if (!!date) {
      return (
        // (date).toISOString().split('T')[0]
          date.toLocaleDateString('en-CA', {
            day: 'numeric', month: 'short', year: 'numeric'
          })
      )  
    }
    else{
      return null;
    }

}

export const monthFormat = (date) => {
  
  if (!!date) {
    return (
        date.toLocaleDateString('en-CA', {
         month: 'long', year: 'numeric'
        })
    )  
  }
  else{
    return null;
  }

}


export const amountFormat = (amount, decimal) => {
  return (
    parseFloat(isNaN(amount) ? 0 : amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
  )
}
