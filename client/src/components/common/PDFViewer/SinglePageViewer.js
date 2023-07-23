import React, { useState } from "react";
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
  formTitle: { fontSize: '1.4rem' },
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
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255,255,255,0.5)',
  // width: 970,
  marginTop: theme.spacing(2),
  // margin: 'auto !important',
  // height: 330,
  borderRadius: 5,
  [theme.breakpoints.down('md')]: {
    width: '90% !important',
    // height: 500,
    padding: theme.spacing(1),
  },
},
}))


const SinglePageViewer = (props) => {
  const { title, pdf, openPDFViewer, setOpenPDFViewer } = props;

  const classes = useStyles()
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div className={classes.reviews}>
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={openPDFViewer} 
        onClose={() =>setOpenPDFViewer(false)}
        >
        <MuiDialogTitle disableTypography>
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
            {/* PDF Viewer - Single Page*/}
            <Document
              file={pdf}
              // options={{ workerSrc: "/pdf.worker.js" }}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.log("Inside Error", error)}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <div>
              <p>
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
              <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
                Previous
              </button>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
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
    </div>
  );
}

export default SinglePageViewer;