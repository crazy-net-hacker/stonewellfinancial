import React from 'react';
import SearchRefund from '../../common/SearchRefund'


export default function VendorReports(props) { 
  const { vendorID } = props;   

  // title
  document.title = 'Dashboard - Requested Refunds';

  return(
    <SearchRefund 
      vendorID = {vendorID}
    />
  )

}
