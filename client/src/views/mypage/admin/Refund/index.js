import React from 'react';
import SearchRefund from '../../common/SearchRefund'


export default function Refund(props) { 

  return(
    <SearchRefund 
      vendorID = {'*'}
      user={props.user}
    />
  )

}
