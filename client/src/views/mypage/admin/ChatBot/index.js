import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//
import { Grid, TextField } from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// common customized components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import Button from '../../../../components/common/CustomButtons/Button'
import ChatBotOpenAI from './ChatBotOpenAI';
import ChatBotDialogFlow from './ChatBotDialogFlow/index';
// icon
import { GoFileSymlinkDirectory } from "react-icons/go";

//style
// import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// const useStyles = makeStyles(dashboardStyles)
const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  searchFileIcon: {
    color: blue[900],
    // marginTop: theme.spacing(2),
    fontWeight:"1000"
  },
}))

export default function ChatBot(props) { 

  const classes = useStyles();
  const [dataSet, setDataSet] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [openChat, setOpenChat] = useState(false)
  const [openChatDialogFlow, setOpenChatDialogFlow] = useState(false)

  // Define a function to read the selected file
  const readFile = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (event) => {
      const result = event.target.result;
      setDataSet(result);
    }
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  // Define a function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Define a function to handle file upload
  const handleFileUpload = () => {
    readFile(selectedFile);
  };
  return(
    // "ChatBot"
    <Grid container>
      <Grid item container style={{ marginTop:'-37px' }}>         
        <QuoteBanner2 title={'Chatbot'} subTitle={''} links={[]}/>
      </Grid>  
      <Grid item container style={{ padding:'1vh 5vh 5vh'}}>
          <Grid item container style={{ justifyContent:'end', margin:'0 5vh 0'}}>
            <Button color="primary" 
                onClick={()=>{setOpenChat(true)}}
            >
              OpenAI ChatBot
            </Button>

            <Button color="primary" style ={{marginLeft: '2vh'}}
                onClick={()=>{setOpenChatDialogFlow(true)}}
            >
              DialogFlow ChatBot
            </Button>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              Training OpenAI Chatbot 
            </Grid>
            <Grid container item xs={12} >
              <Grid item xs={3}>
                <label htmlFor={`selectFile`}>
                    <GoFileSymlinkDirectory size={28} className={classes.searchFileIcon}/>
                </label>  
                <input 
                    id= 'selectFile'
                    type="file" 
                    style={{display: 'none'}}
                    accept= ".txt"
                    onChange={handleFileSelect} />
                {selectedFile?selectedFile.name:''}
              </Grid>
              <Grid item xs={6}>
                <Button color="secondary"  onClick={handleFileUpload} disabled={!selectedFile}>
                  Upload DataSet
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              DataSet
            </Grid>
            <Grid item xs={12}>
              <TextField
                  name="dataSet"
                  value={dataSet}
                  multiline
                  variant="filled"
                  rows={20}
                  fullWidth
                  onChange={(e)=>{setDataSet(e.currentTarget.value)}}
              />
            </Grid>
          </Grid>
        </Grid>

        {openChat &&
          <ChatBotOpenAI
            dataSet = {dataSet}
            openChat= {openChat}
            closeChat= {setOpenChat}
          />
        }

        {openChatDialogFlow &&
          <ChatBotDialogFlow
            openChat= {openChatDialogFlow}
            closeChat= {setOpenChatDialogFlow}
          />
        }
      </Grid>

      
  )
}