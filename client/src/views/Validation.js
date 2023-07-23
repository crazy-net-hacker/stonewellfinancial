import * as Yup from 'yup'

export function validRequiredField() {
  // return Yup.string().required('This field is required!')
  return Yup.string().required('FieldIsRequired')
}

export function validEmail() {
  return (
    Yup.string()
      .email('InvalidEmailFormat')
      // .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,"Invalid email format")
      .required('FieldIsRequired')
      .test('AcceptEmail', function(value) {
        const emailAccount = value&&value.split(/[@.]+/)[1] ? value.split(/[@.]+/)[1].toLowerCase() : '';
        const notAccpetEmail = value ? ['hanmail','daum'].filter(f=>f === emailAccount).length : 0;
        if (value && notAccpetEmail === 0) {
          return true
        } else { 
          return this.createError({ message: `EnterOtherEmail` })
        }
      })
  )
}

export function validPhoneNumber() {
  // using MuiPhoneInput
  return Yup.string()
    .required('FieldIsRequired')
    .test('Phone Number length', function(value) {
      if (value && (value.toString().length === 17 || value.toString().length === 14)) {
        return true
      } else { 
        return this.createError({ message: `InvalidPhoneNumber` })
      }
    })
}

export function validPostalCode() {
  const caPostalCodeRegExp = new RegExp(/^[a-zA-Z]\d[a-zA-Z]( )?\d[a-zA-Z]\d$/i)
  return (
    Yup.string()
      .required('FieldIsRequired')
      .matches(caPostalCodeRegExp, 'InvalidPostalCode')
      // .matches(caPostalCodeRegExp, {message:'Postal Code is not valid'})
  )
}

export function validRequiredNumberField() {
  return Yup.number()
    .required('FieldIsRequired')
    .min(0, 'Not negative number')
}

export function validRequiredNumberMin1Field() {
  return Yup.number()
    .required('FieldIsRequired')
    .min(1, 'MinimunNumberShouldBeGreaterThan1')
}

export function validRequiredArrayField() {
  return Yup.array()
    .min(1, 'This field is required!')
    .required('FieldIsRequired')
}


export function validRequiredDateField() {
  return Yup.date()
    .nullable()
    .required('FieldIsRequired')
    .typeError('InvalidDateFormat')
}

export function validRequiredBrithDateField() {
  return Yup.date()
    .nullable()
    .required('FieldIsRequired')
    .typeError('InvalidDateFormat')
    // .max(new Date(new Date().setDate(new Date().getDate())), 'BirthDateShouldBeLessThanToday')
    .max(new Date(new Date().setDate(new Date().getDate() -15)), 'BirthDateShouldBe15DaysBefore')
}


export function validPassword() {
  return Yup.string()
    .required('PasswordIsRequired')
    .test(
      'regex',
      'Minimum eight characters, at least one letter, one number and one special character',
      value => {
        let regExp = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
        )
        //  console.log(regExp.test(value), regExp, value);
        return regExp.test(value)
      }
    )
}

export function confirmPassword() {
  return Yup.string()
    .required('PasswordIsRequired!')
    .oneOf([Yup.ref('password'), null], 'PasswordsNotMatch')
}

export function validPasswordRequired() {
  return Yup.string().required('PasswordIsRequired!')
}


export function validCreditCardNumber() {
  // MasterCard: 5212 3456 7890 1234 (16 digits)
  // Visa: 4123 4567 8901 2345 (16 digits)
  // AMEX : 3712 345678 90123 (15 digits)
  // Discover: 6011 1234 5678 901234
  const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  const amexpRegEx = /^(?:3[47][0-9]{13})$/;
  // const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  return (
    Yup.string()
      .required('FieldIsRequired')
      .min(15, "Enter more than 15 digits number")
      .test('Credit Card Number', function(value) {
        if (!value) {
          // return false
          return this.createError({ message: `FieldIsRequired` })
        }
        else
        {
          if (visaRegEx.test(value.replace(/\s/g, ''))) {
            return true;
            } else if(mastercardRegEx.test(value.replace(/\s/g, ''))) {
              return true;
            } else if(amexpRegEx.test(value.replace(/\s/g, ''))) {
              return true;
            // } else if(discovRegEx.test(value)) {
            //   return = true;
            } else {
            return this.createError({ message: `InvalidCreditCardNumber` })
          } 
        }
      })
  )
}

export function validCardEexpirationDate () {
  return (
    Yup.string()
      .required("FieldIsRequired")
      // .required("Expiration date is required")
      .typeError('InvalidExpirationDate')
      .max(5, 'InvalidExpirationDate')
      .matches(
        /([0-9]{2})\/([0-9]{2})/,
        'InvalidExpirationDate'
      )  
      .test(
        'credit-card-expiration-date',
        'CardExpirationDateHasPast',
        expirationDate => {
          if (!expirationDate) {
            return false
          }
          const today = new Date()
          const monthToday = today.getMonth() + 1
          const yearToday = today
            .getFullYear()
            .toString()
            .substr(-2)
    
          const [expMonth, expYear] = expirationDate.split('/')
    
          if (Number(expYear) < Number(yearToday)) {
            return false
          } else if (
            Number(expMonth) < monthToday &&
            Number(expYear) <= Number(yearToday)
          ) {
            return false
          }

          return true
        }
      )
      .test(
        'credit-card-expiration-date',
        'InvalidExpirationMonth',
        expirationDate => {
          if (!expirationDate) {
            return false
          }
              
          const [expMonth] = expirationDate.split('/')
    
          if (Number(expMonth) > 12) {
            return false
          }
    
          return true
        }
      )
  )
}

export function validRequiredChooseFile() {
  return Yup.string().required('Please choose your file.')
}