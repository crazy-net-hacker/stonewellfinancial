import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components 
import { Container, Typography, IconButton,
  Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core'
// 
import { Text } from './LanguageProvider'
// icon
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GetAppIcon from '@material-ui/icons/GetApp'

const useStyles = makeStyles((theme) => ({
  accordion: {
    marginBottom: 0,
    marginTop: 0,
  },
  accordion_summary: {
    backgroundColor: '#fafafa',
    borderTop: '1px solid gray',
    borderBottom: '1px solid gray',
  },
  accordion_details: {
    marginBottom: '0',
    display: 'block',
    padding: 0,
  },
  accordion_details_card: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid gray',
    padding: '16px 12px',
  },
}))


export default function DownloadForm(props) {
  const classes = useStyles()
  const documents = props.lists
  
  // group insurace company  
  const listInsCompany = documents.map( i => i.company_name);
  const uniqueListInsCompany = Array.from(new Set(listInsCompany));
  const planDocuments = uniqueListInsCompany.map( c => { 
              return  { company_name:c, 
                        item:[]
                      };
          } ); 
  // set data
  documents.forEach( d => { 
    // set coverages
    planDocuments.find( g => g.company_name === d.company_name).item.push(d); 
  });

  // convert URL t PDF file
  const downloadForm = (e, fileURL) => {
    e.preventDefault()
    fetch(process.env.REACT_APP_S3_URL+fileURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileURL)
        // Append to html link element page
        document.body.appendChild(link)
        // Start download
        link.click()
        // Clean up and remove the link
        link.parentNode.removeChild(link)
      })
  }

  return (
    <div className={classes.root}>
      {planDocuments &&
        planDocuments.map((document, index) => (
          <Accordion
            className={classes.accordion}
            key={index}
            elevation={0}
          >
            <AccordionSummary
              className={classes.accordion_summary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{document.company_name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordion_details}>
              <Typography variant="subtitle1" color="textPrimary">
              </Typography>
              {document.item.length > 0 &&
                document.item.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={classes.accordion_details_card}
                  >
                      {/* <Typography><Text tid={item.insured_type} /></Typography> */}
                      {/* <Typography>{item.insured_type} / {item.generic_name}</Typography> */}
                      <Container>
                        <Typography>
                          {item.document_type !=='Policy' 
                            ? item.insured_type 
                            : item.insured_type + ' - ' +  (item.primary_coverage_type === 'MED'? 'Medical' : item.plan_name ) }
                        </Typography>
                        {document.item[itemIndex].documents.map((doc, docIndex) => (
                          <IconButton
                            key={docIndex}
                            color="primary"
                            aria-label="download form"
                            onClick={(e) => downloadForm(e, doc.document_url)}
                          >
                            <GetAppIcon color="primary" />
                            <Typography variant="subtitle1"><Text tid={`Language.${doc.language}`} /></Typography>
                          </IconButton>
                          ))}
                        </Container>
                  </div>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  )
}
