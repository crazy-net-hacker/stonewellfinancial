import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid' 

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom'
import { Text } from '../LanguageProvider'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    padding: '0 24px',
    // justifyContent: 'center',
    maxWidth: '1280px'
  },
 
}));



export default function CustomSeparator(props) {
 const classes = useStyles()
 const { links } = props;
  
  return (
    
    <Grid container className={classes.root} >
    
      <Grid item xs={10} >
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" >
    
      {links.map(link => (<Link to={link.to} key={link} ><Text tid={link.name}/></Link> ))}
    
      </Breadcrumbs>
      </Grid>
    
    </Grid>
  );
}
