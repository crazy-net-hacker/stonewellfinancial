import React, { useState, useRef } from 'react';
import { makeStyles, IconButton, Grid, Typography, TextField } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@material-ui/icons/Send';
import { MdClose } from 'react-icons/md'
import clsx from 'clsx'
import spinner from "../../../../assets/imgs/icons/spinner.gif";
// const { Configuration, OpenAIApi } = require("openai");
const { Configuration } = require("openai");


const useStyles = makeStyles((theme) => ({
  input: {
    borderWidth: 2,
    borderColor: '#91D8E4',
    width: '100%',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EAFDFC',
    paddingHorizontal: 14,
    fontWeight: '700',
    color: '#000',
    shadowColor: '#82AAE3',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
    backgroundColor: '#fffc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sent: {
    backgroundColor: '#04DE71',
    display: 'flex',
    justifyContent: 'flex-end',
    // maxWidth: "90%",
  },
  received: {
    backgroundColor: '#2094FA',
    display: 'flex',
    justifyContent: 'flex-start',
    // maxWidth: "90%",
  },
  chatBubble: {
    borderRadius: 10,
    marginBottom: 8,
    // maxWidth: "90%",
  },
  msgText: {
    fontWeight: '500',
    color: '#fffff',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

}))


const ChatBotOpenAI = (props) => {
  const { dataSet, openChat, closeChat } = props;

  const classes = useStyles()

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState({received1: 'How can I help you today?'});
  const [errors, setErrors] = useState({question: ''})

  // dataSet = `Currnt time is ${new Date()}. 
  //                   You are an AI assistant for Stonewell financial service. Your are helpful, creative, clever, and very friendly. Give me answer related to Stonewell financial service.
  //                   Your name is SW created by OpenAI.
  //                   The website for Stonewell Financial Service is www.stonewellfinancial.com.
  //                   We offer Student insurances, Visitor insurances and Canadian's travel insurances.
  //                 `

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPEN_API_KEY
  });

  const MessagesEnd = useRef();
  const scrollToElement = () => MessagesEnd.current.scrollIntoView();

  const handleClose = () => {
    closeChat(false)
  }

  // Check Validation
  function validate() {
    let errors = {};
    let isValid = true;

    if (!question) {
      isValid = false;
      errors.question = "error"
    }
    setErrors(errors);

    return isValid;
  }


  // getAnswer
  const getAnswer = async () =>{
    const prompt = question;
    var answer = '';
    try{
      // using openai.createCompletion
      // const openai = new OpenAIApi(configuration);
      // const response = await openai.createCompletion({
      //   "model": "text-davinci-003",
      //   "prompt": `You give me answers
      //             Human: ${prompt}
      //             AI: `,
      //   "temperature": 0,
      //   "max_tokens": 150,
      //   // "top_p": 0,
      //   // "frequency_penalty": 0.0,
      //   // "presence_penalty": 0.6,
      //   "stop": [" Human:", " AI:"]
      // });
      // answer = response.data.choices[0].text;

      // using fetch
      const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions";
      const body={
        prompt: ` ${dataSet} Give answer.
                  Human: ${prompt}
                  AI: `,
        temperature: 0.9,
        max_tokens: 512,
        // top_p: 0,
        // "frequency_penalty": 0.0,
        // "presence_penalty": 0.6,
        stop: [" Human:", " AI:"]
      }
      const response = await fetch(endpoint, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'organization': "org-uNIpJh2H9o8iBwoivTvEjZ9d",
                                      'Authorization': `Bearer ${configuration.apiKey}`
                                    },
                                    body: JSON.stringify(body)
                                  })
    const data = await response.json()
    answer = data.choices[0].text

  } catch (error) {
    // console.log(error);
    answer = 'Sorry, something is wrong. Please type message again.';
  }
  
    return(answer)
  }


  const handleSend = async () => {
    if (validate()===true){
      setConversation(prev => ({
        ...prev,
        ...{[`sent${Object.keys(prev)?.length}`]: question},
      }));
      setQuestion('');
      setLoading(true);
      const answer =  await getAnswer();
      setConversation(prev => ({
        ...prev,
        ...{[`received${Object.keys(prev)?.length}`]: answer},
      }));
      setLoading(false);
      scrollToElement();
    }
  };


  return (
    <div >
      <Dialog
        PaperProps={{ sx: { width: "100%", height: "70%" } }}
        open={openChat}
      >
        <DialogTitle id="scroll-dialog-title">
          ChatBot - OpenAI
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          {Object?.keys(conversation)?.map(keyName => (
              <React.Fragment key={keyName}>
                <Typography
                  className={clsx((keyName.slice(0,1)==='s'?classes.sent:classes.received), classes.chatBubble, classes.msgText)}
                  style={{color:'purple'}}
                  >
                    {conversation?.[keyName]}
                </Typography>
              </React.Fragment>
            ))
          }

          {loading && (
            <div className={clsx(classes.received, classes.chatBubble, classes.typingLoader)} >
            <img 
              src={spinner} 
              style={{ height:'3vh'}} 
              alt="typing" />
            </div>
          )}

          <div 
            ref={MessagesEnd}
            style={{ float:"left", clear: "both" }}>
          </div>

          
        </DialogContent>

        <DialogActions>
          <Grid container >
            <Grid item xs={11}>
              <TextField
                className={classes.input}
                autoFocus
                name="question"
                value={question}
                onChange={(e)=>{
                  setQuestion(e.currentTarget.value)
                }}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    handleSend();
                  }
                }}
                helperText={errors.question?'Please Type the message':''}
                error={!!errors.question}
                placeholder='Type the message'
              />
            </Grid>
            <Grid item xs={1}>
              <SendIcon
                onClick={handleSend}
              />
            </Grid>

          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ChatBotOpenAI;