import React, { useEffect } from 'react'
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getPlanDocument } from '../../../redux/actions/insurancePlans';
// core components 
import { Container, Typography, Box } from '@material-ui/core'
// components
import Banner from '../../../components/common/Banner';
import DownloadForm from '../../../components/common/DownloadForm'
// import { Text } from '../../../components/common/LanguageProvider'

// banner Title
const bannerTitle = ['Download']
// Breadcrumbs
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/download',
    name: 'Download',
  },
]


export default function Download() {  

  const dispatch = useDispatch();
  const documents = useSelector(state => state.insurancePlanReducer.documents)

  // useEffect
  useEffect(() => {
    dispatch(getPlanDocument())
  }, [dispatch]);


  return (
    <>
      <Container>
        <Banner
          title={bannerTitle}
          links={links}
        />
        <Box my={10}>
          <Typography variant="h2">
            {/* <Text tid={'Download.Brochure.label'} /> */}
             Brochures
          </Typography>
          <DownloadForm lists={documents.filter(f=>f.document_type === 'Brochure')} />
        </Box>
        <Box my={10}>
          <Typography variant="h2">
             Claim Forms
          </Typography>
          <DownloadForm lists={documents.filter(f=>f.document_type === 'Claim')} />
        </Box>
        <Box my={10}>
          <Typography variant="h2">
             Refund Forms
          </Typography>
          <DownloadForm lists={documents.filter(f=>f.document_type === 'Refund')} />
        </Box>
        <Box my={10}>
          <Typography variant="h2">
             Policy Forms
          </Typography>
          <DownloadForm lists={documents.filter(f=>f.document_type === 'Policy')} />
        </Box>
      </Container>
    </>
  )
}

