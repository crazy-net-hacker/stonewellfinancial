import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import {Link} from "react-router-dom"
//components
import { Text } from './LanguageProvider';

const useStyles = makeStyles(theme => ({
  textCenter: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing(3,1,1,1)
  }
}));


export const SuccessSubmit = ({
  title,
  quoteLabel,
  quoteNo,
  content
}) => {
  const classes = useStyles();
  
  return (
    <div className={classes.textCenter}>

      
      <Typography variant="h2"> {title} </Typography>

      <br/>
      <Typography variant="h6"> {quoteLabel} : {quoteNo}</Typography>
      <Typography variant="h6"> {content} </Typography>
      <Link to={'/'}>
        <Button variant="contained" color='primary' className={classes.button}> <Text tid={'Button.Home'}/></Button>
      </Link>

    </div>
  );
};
