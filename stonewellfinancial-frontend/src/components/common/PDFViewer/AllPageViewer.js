import React, { Fragment, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog, DialogContent, DialogActions,
  // DialogContentText,  
  Button, Typography, IconButton
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'

const useStyles = makeStyles((theme) => ({
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  button: {
    margin: 10,
    '&:hover': {
      color: '#fff',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  divider: {
    margin: '16px 0',
  },
  btnWrapper: {
    textAlign: 'center',
  },
  nested: {
    paddingLeft: theme.spacing(4)
},
pdfViewer: {
  backgroundColor: '#fff',
  /* Take full size */
  height: '100%',
  width: '100%',
  /* Displayed on top of other elements */
  // zIndex: 9999,
  
},
}))


const AllPageViewer = (props) => {
  const { title, pdf, openPDFViewer, setOpenPDFViewer } = props;

  const classes = useStyles()
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

  const [numPages, setNumPages] = useState(null);

  const insuranceCompany = title.split(" ")[0]

  const companyBackgroundColor = [
    { company:'Allianz', color: '#003781'},
    { company:'Tugo', color: '#29978e'},
    { company:'BlueCross', color: '#007ab4'},
    { company:'GMS', color: '#0032a0'},
    { company:'Carewell', color: '#8EC641'}
  ]


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Fragment>
      <Dialog 
        style={{zIndex: 9999}}
        className={classes.pdfViewer}
        // fullWidth={true}
        // maxWidth="md"
        maxWidth="lg"
        open={openPDFViewer} 
        onClose={() =>setOpenPDFViewer(false)}
        >
        <MuiDialogTitle disableTypography 
          style={{  boxShadow: '2px 2px 10px #efefef', 
                    background : companyBackgroundColor.filter(f=>f.company===insuranceCompany).length > 0
                                ?companyBackgroundColor.filter(f=>f.company===insuranceCompany)[0].color
                                :'#2a2f71'
                }}
        >
          <Typography variant="h2" align="center" className={classes.formTitle}>
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {setOpenPDFViewer(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
          { pdf ? (
            <>
            {/* PDF Viewer - All Page*/}
            <Document
              file={pdf}
              options={{ workerSrc: "/pdf.worker.js" }}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
            </>
          )
          : 'We are preparing this document.'
          }
        </DialogContent>

        <DialogActions>
          <Button autoFocus
            onClick={() => {
              setOpenPDFViewer(false)
            }}
            color="primary"
          >
            Close
          </Button>
      </DialogActions>

      </Dialog>
    </Fragment>
  );
}

export default AllPageViewer;