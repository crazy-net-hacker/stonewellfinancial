// import React, { useState, useRef } from 'react';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { makeStyles, IconButton, Grid, Typography, TextField } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@material-ui/icons/Send';
import { MdClose } from 'react-icons/md'
import clsx from 'clsx'
import axios from "axios/index";

import ReplyCard from './ReplyCard';

import QuickReplies from './QuickReplies';
// const { Configuration, OpenAIApi } = require("openai");

import API_URL from "../../../../../utils/api_url";

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
  user: {
    backgroundColor: '#04DE71',
    display: 'flex',
    justifyContent: 'flex-end',
    // maxWidth: "90%",
  },
  bot: {
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


const ChatBotDialogFlow = (props) => {
  const { openChat, closeChat } = props;

  const classes = useStyles()

  const [messages, setMessage]=useState([])
  const [question, setQuestion] = useState('');
  const [isLoaded, setisLoaded] = useState(false)
  const [errors, setErrors] = useState({question: ''})


  const handleClose = () => {
    closeChat(false)
  }

  // Check Validation
  function isValidated() {
    let errors = {};
    let isValid = true;

    if (!question) {
      isValid = false;
      errors.question = "error"
    }
    setErrors(errors);

    return isValid;
  }



  const messagesEnd = useRef(null);
  const scrollToMessagesEnd = () => messagesEnd.current.scrollIntoView();
 

  const df_event_query = useCallback(async(event, answer) => {
    const res = await axios.post(`${API_URL}api/v1/chatbot_dialogflow/df_event_query`,  {event: event});

    if (event !== 'Welcome' && answer){
        const says = {
          speaks: 'user',
          msg: {
              text : {
                  text: answer
              }
          }
      }

      setMessage(prev => ([
        ...prev,
        ...[says]
      ]));

    }

    for (let msg of res.data.fulfillmentMessages) {
      const says = {
            speaks: 'bot',
            msg: msg
        }
        setMessage(prev => ([
          ...prev,
          ...[says]
        ]));
    }

    scrollToMessagesEnd();

 }, []);

 
 useEffect(()=>{
  if (isLoaded===false){
      df_event_query('Welcome')
      setisLoaded(true)
  }
}, [isLoaded, df_event_query]);


const df_text_query = async(text) => {
  if (text){
    let queryText = text;

    const says = {
        speaks: 'user',
        msg: {
            text : {
                text: queryText
            }
        }
    }

    setMessage(prev => ([
      ...prev,
      ...[says]
    ]));
    // message= [...messages, says];
    const res = await axios.post(`${API_URL}api/v1/chatbot_dialogflow/df_test_query`,  {text: queryText});

      for (let msg of res.data.fulfillmentMessages) {
          const says = {
              speaks: 'bot',
              msg: msg
          }
          setMessage(prev => ([
            ...prev,
            ...[says]
          ]));
      }

    
    setQuestion('');
    scrollToMessagesEnd();
  }
  };


  function renderMessages(returnedMessages) {
    if (returnedMessages) {
        return returnedMessages.map((message, i) => {
            return renderOneMessage(message, i);
            }
        )
    } else {
        return null;
    }
  }



function renderOneMessage(message, i) {

    if (message.msg && message.msg.text && message.msg.text.text) {
        return (
            <Typography
              key={i}
              className={clsx((message.speaks==='user'?classes.user:classes.bot), classes.chatBubble, classes.msgText)}
              style={{color:'purple'}}
              >
                  {message.msg.text.text}
            </Typography>
        );
    } else if (message.msg && message.msg.payload.fields.cards) { //message.msg.payload.fields.cards.listValue.values
        return <div key={i}>
            <div className="card-panel grey lighten-5 z-depth-1">
                <div style={{overflow: 'hidden'}}>
                    <div className="col s2">
                        <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                    </div>
                    <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                        <div style={{ height: 300, width:message.msg.payload.fields.cards.listValue.values.length * 270}}>
                            {renderCards(message.msg.payload.fields.cards.listValue.values)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        } else if (message.msg &&
                    message.msg.payload &&
                    message.msg.payload.fields &&
                    message.msg.payload.fields.quick_replies
                ) {
                    return (
                        <QuickReplies
                            text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                            key={i}
                            replyClick={handleQuickReplyPayload}
                            speaks={message.speaks}
                            payload={message.msg.payload.fields.quick_replies.listValue.values}
                        />                            
                    );
          }
    
}

function handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case 'studying_no':
          df_event_query('FamilyMemberStudy', text);
          break;
      default:
          df_text_query(text);
          break;
  }

}


function renderCards(cards) {
    return cards.map((card, i) => <ReplyCard key={i} payload={card.structValue}/>);
}


  return (
    <div >
      <Dialog
        PaperProps={{ sx: { width: "100%", height: "70%" } }}
        open={openChat}
      >
        <DialogTitle id="scroll-dialog-title">
          ChatBot - DialogFlow
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent >
        <div>
          <div id="chatbot" style={{height: '100%', width: '100%', overflow: 'auto'}}>
              {renderMessages(messages)}
              <div 
                ref={messagesEnd}
                style={{ float:"left", clear: "both" }}>
              </div>

          </div>
      </div>
          
        </DialogContent>

        <DialogActions>
          <Grid container >
            <Grid item xs={11}>
              <TextField
                id = 'question'
                className={classes.input}
                autoFocus
                name="question"
                value={question}
                onChange={(e)=>{
                  setQuestion(e.currentTarget.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (isValidated() === true){
                    df_text_query(e.target.value)
                  };
                  }
                }}
                helperText={errors.question?'Please Type the message':''}
                error={!!errors.question}
                placeholder='Type the message'
              />
            </Grid>
            <Grid item xs={1}>
              <SendIcon
                id = 'send_click'
                onClick={()=>{
                  if (isValidated() === true){
                    df_text_query(question)
                  };
                }}
              />
            </Grid>

          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ChatBotDialogFlow;