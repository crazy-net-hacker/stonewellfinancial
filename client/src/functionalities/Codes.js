export const branchAddress = (tripDirection, destProvince, destProvinceName, originProvince, originProvinceName, vendorAddress) => {

  let address = {}

  const vendorProvince = vendorAddress && vendorAddress.province ? (vendorAddress.province.replace(/\s/g, '')).toLowerCase() :'';

  const selectedProvinceName = tripDirection==='InBound'
                                ?destProvinceName?(destProvinceName.replace(/\s/g, '')).toLowerCase():''
                                :originProvinceName?(originProvinceName.replace(/\s/g, '')).toLowerCase():'';

  const selectedProvince = tripDirection==='InBound'?destProvince:originProvince

  const offices = [
    {
      street:'4170 Still Creek Drive',
      suiteNo:'200',
      city:'Burnaby',
      province:'British Columbia',
      postalCode:'V5C 6C6',
      phone: '1-833-645-3858',
      targetProvince: ['BC','AB','MB','SK','NT','NU','YT']
    },
    {
      street:'1200 McGill College Ave',
      suiteNo:'1100',
      city:'Montreal',
      province:'Quebec',
      postalCode:'V5C 6C6',
      phone: '1-514-645-3858',
      targetProvince: ['QC','NS','NB','NL','PE']
    },
    {
      street:'4576 Yonge St',
      suiteNo:'608',
      city:' North York',
      province:'Ontario',
      postalCode:'M2N 6N4',
      phone: '1-416-645-3858',
      targetProvince: ['ON']
    }
  ]

  // same vendor address with selected province
  if (vendorProvince === selectedProvinceName){
    address = vendorAddress;
  } else{
      // no vendor address
      // get branch address by selected province
      const branchOfficeAddress = offices.map((a)=> ({street: a.street, suiteNo: a.suiteNo, city: a.city, province: a.province, postalCode: a.postalCode, phone: a.phone,
                                                        includedProvince: a.targetProvince.filter(f => f === selectedProvince).length}))
                                            .filter( i => i.includedProvince > 0)[0]

      // get default branch address
      const HeadOfficeAddress = offices.map((a)=> ({street: a.street, suiteNo: a.suiteNo, city: a.city, province: a.province, postalCode: a.postalCode, phone: a.phone,
                                                          includedProvince: a.targetProvince.filter(f => f === 'ON').length}))
                                              .filter( i => i.includedProvince > 0)[0]

      address = branchOfficeAddress ? branchOfficeAddress: HeadOfficeAddress
  }

  // console.log('address',address)

  return address 

}