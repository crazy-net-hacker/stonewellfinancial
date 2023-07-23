import React from 'react';
import SalesReport from '../../common/SalesReport'


export default function VendorReports(props) { 
  const { vendorID } = props;

  // title
  document.title = 'Dashboard - Sales Report';

  return(
    <SalesReport 
      vendorID = {vendorID}
    />
  )

}
