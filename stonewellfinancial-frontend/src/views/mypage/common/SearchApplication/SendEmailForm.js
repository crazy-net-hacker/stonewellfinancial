import React from 'react';
//core components
import { Grid } from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { IconButton, Dialog, DialogContent, DialogActions, 
          Typography, Button 
} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// common components
import CustomButton from '../../../../components/common/CustomButtons/Button'
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle'
//
import { DocumntViewer } from '../../../../components/common/PDFViewer/DocumntViewer';
import TabMenu from '../../../../components/common/Tabs/tabMenu'
//setup form style
const useStyles = makeStyles(formStyle)

export default function SendEamilModal({ data, attachments, open, handleClose, onSendingEmail  }) {

  const classes = useStyles();
  
  
  return (
    <Dialog 
        fullScreen
        open={open} 
        onClose={() => handleClose(false)}
    >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
            <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
                Policy
            </Typography>
            <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
        >
            <MdClose />
            </IconButton>
        </MuiDialogTitle>

        <DialogContent style={{ padding:'0 5vh', marginTop:'2vh' }}>
            <Grid container spacing={1}>
              <Grid item container style={{ justifyContent:'end', margin:'0 2vh 0'}}>
                <CustomButton color="primary" 
                    onClick={() => onSendingEmail({ from:data.from ,to: data.to, bcc: data.bcc, 
                                                    attachments: attachments, 
                                                    sourceType: 'Travel', applicationId: data.applicationId,  contentType:'Policy', user: data.user})}
                >
                  Send Email
                </CustomButton>
              </Grid>
                <Grid item xs={2}>
                  From
                </Grid>
                <Grid item xs={10}>
                  {data.from}
                </Grid>
                <Grid item xs={2}>
                  To
                </Grid>
                <Grid item xs={10}>
                  {data.to}
                </Grid>
                <Grid item xs={2}>
                  BCC
                </Grid>
                <Grid item xs={10}>
                  {data.bcc}
                </Grid>
                <Grid item container>
                <Grid item xs={2}>
                  Attachments
                </Grid>
                <Grid item xs={10}>
                  <TabMenu tabs={attachments.map((a, index)=>({
                                  id: index,
                                  label: a.fileName,
                                  value : (
                                            <Grid item xs={12} style={{margin:'0 -24px'}}>
                                            { attachments && a.file.Body?
                                              <DocumntViewer
                                                file={new Uint8Array(a.file.Body.data).buffer}
                                              />
                                              :'Not found this file'
                                            }
                                            </Grid>
                                          )
                                  }))
                            }
                  />
              </Grid>
              
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions>
          <Button autoFocus
            onClick={() => {
              handleClose(false)
            }}
            color="primary"
          >
            Close
          </Button>
      </DialogActions>

    </Dialog>
  )

}