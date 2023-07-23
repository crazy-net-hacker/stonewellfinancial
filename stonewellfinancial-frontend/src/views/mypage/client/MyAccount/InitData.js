// My Account initial data
export function myAccountInit() {
  const data = {
    firstName: '',
    lastName: '',
    gender:'',
    birthDate: '',
    statusCanada: '',
    ghip: '',
    phone: '',
    family: [{
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: '',
      statusCanada: '',
      ghip: '',
    }],
    addressInCanada:'',
    sameMailAddress:'',
    streetName: '',
    suiteNum: '',
    city: '',
    provinceName: '',
    postalCode: '',
    countryName: '',
    Payment: {
    cardNumber: ''
    }
  }
    return data
  }