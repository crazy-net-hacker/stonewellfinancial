import React, { useEffect } from 'react'
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getPlanDocument } from '../../../redux/actions/insurancePlans';
// core components 
import { Container, Typography, Box } from '@material-ui/core'
//components
import Banner from '../../../components/common/Banner'
import { Text } from '../../../components/common/LanguageProvider'
//
import RefundProcess from './RefundProcess'
import DownloadForm from '../../../components/common/DownloadForm'

// banner Title
const bannerTitle = ['Refund Process']
// Breadcrumbs
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/refund',
    name: 'Refund Process',
  },
]


export default function ProcessRefund() {  

  const dispatch = useDispatch();
  const documents = useSelector(state => state.insurancePlanReducer.documents)

  const requiredInfo = [
    {label: 'ProcessRefund.RequiredInfo.list1'},
    {label: 'ProcessRefund.RequiredInfo.list2'},
    {label: 'ProcessRefund.RequiredInfo.list3'},
    {label: 'ProcessRefund.RequiredInfo.list4'}
  ]

  // useEffect
  useEffect(() => {
    dispatch(getPlanDocument())
  }, [dispatch]);


  return (
    <>
    <Container>
      <>
      <Banner
        title={bannerTitle}
        links={links}
      />

      <Box my={10}>
        <Typography variant="h2">
          <Text tid={'ProcessRefund.RequiredInfo.label'} />
        </Typography>
        <Typography variant="body1">
          <Text tid={'ProcessRefund.RequiredInfo.desc'} />
        </Typography>
        <ul>
        {requiredInfo.map((info, index) => (
          <li key={index}>
            <Typography variant="body1">
              <Text tid={info.label} />
            </Typography>
          </li>
        ))}
        </ul>
      </Box>

      <Box my={10}>
        <RefundProcess />
      </Box>
      
      <Box my={10}>
        <Typography variant="h2">
        <Text tid={'ProcessRefund.DownloadRefundForm.label'} />
        </Typography>
        <DownloadForm lists={documents.filter(f=>f.document_type === 'Refund')} />
      </Box>
      </>

    </Container>
    </>
  )
}
