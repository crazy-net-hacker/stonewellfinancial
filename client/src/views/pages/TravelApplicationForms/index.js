import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import { Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import { Text } from '../../../components/common/LanguageProvider'
import Button from '../../../components/common/CustomButtons/Button'
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
// icons
import FindInPageIcon from '@mui/icons-material/FindInPage';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
  },
  paper: {
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    boxShadow: '0 3px 15px #00000014',
    border: '1px solid #dadada',
    borderRadius: '0',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));


export default function TravelApplicationForms({match}) {  
  const classes = useStyles();

  const linkForms =[
        {insurace: 'Students & Companions', 
          link: [
            {to: `${match.url}/${'student'}/${'allianz'}/${'individual'}`, label:'Allianz'},
            {to: `${match.url}/${'student'}/${'tugo'}/${'individual'}`, label:'Tugo'},
          ]
        },
        {insurace: 'Visitors', 
          link: [
            {to: `${match.url}/${'visitor'}/${'allianz'}/${'individual'}`, label:'Allianz '},
            {to: `${match.url}/${'visitor'}/${'tugo'}/${'individual'}`, label:'Tugo'},
            {to: `${match.url}/${'visitor'}/${'gms'}/${'individual'}`, label:'GMS'},
          ]       
        },
        {insurace: 'Visitor Family', 
          link: [
            {to: `${match.url}/${'visitor'}/${'allianz'}/${'family'}`, label:'Allianz'},
            {to: `${match.url}/${'visitor'}/${'tugo'}/${'family'}`, label:'Tugo'},        
          ]       
        },
        {insurace: 'Canadian Travelers', 
          link: [
            {to: `${match.url}/${'canadian'}/${'allianz'}/${'individual'}`, label:'Allianz' },
            {to: `${match.url}/${'canadian'}/${'tugo'}/${'individual'}`, label:'Tugo'},
            {to: `${match.url}/${'canadian'}/${'bluecross'}/${'individual'}`, label:'Blue Cross'},        
          ]       
        },
        {insurace: 'Canadian Travelers Family', 
          link: [
            {to: `${match.url}/${'canadian'}/${'allianz'}/${'family'}`, label:'Allianz'},
            {to: `${match.url}/${'canadian'}/${'tugo'}/${'family'}`, label:'Tugo'},
            {to: `${match.url}/${'canadian'}/${'bluecross'}/${'family'}`, label:'Blue Cross'}               
          ]       
        },
  ]

   //Mobile responsive
   const [width, setWidth] = useState(window.innerWidth);
   function handleWindowSizeChange() {
       setWidth(window.innerWidth);
   }
   useEffect(() => {
       window.addEventListener('resize', handleWindowSizeChange);
       return () => {
           window.removeEventListener('resize', handleWindowSizeChange);
       }
   }, []);
   
   let isMobile = (width < 768);

  return (
    <>
      <Grid container justify="center"> 
          <Grid item container style={{ marginTop:isMobile?'-37px':'0' }}>
            <QuoteBanner2 icon={<FindInPageIcon style={{ fontSize:'30px' }}/>} title={`TravelApplication.linkListTitle`} subTitle={'TravelApplication.linkListSubtitle'} links={[]} />
          </Grid>
          <Grid item container xs={12} sm={12} md={10} xl={8} spacing={2}  style={{ padding:isMobile?'10px':'10px 0 30px 0'}}>

          {linkForms.map((linkForm, index) => (
            <Grid item xs={12} key={index}>
              <Typography className={classes.title} style={{ display:'inline-block', width: '300px'}}>
                    <FiberManualRecordIcon style={{ fontSize:'14px', marginRight:'10px' }}/> <Text tid={linkForm.insurace}/> 
              </Typography>
              {linkForm.link.map((url, urlIndex) => (
                <Link
                  key={urlIndex}
                  to={url.to}
                >
                    <Button 
                      color="dark" 
                      style={{ margin:'2px'}}
                    >
                      {url.label}
                    </Button>
                </Link>          
              ))}
            </Grid>
            ))}

            {/* <Grid item xs={12}>
                  <Typography className={classes.title} style={{ display:'inline-block', width: '300px'}}>
                    <FiberManualRecordIcon style={{ fontSize:'14px', marginRight:'10px' }}/> <Text tid={'Quote.CreditCard'}/>
                  </Typography>
                    <Link
                      to={`/payment`}
                    >
                        <Button 
                          color="dark" 
                          className={classes.next_button}
                          style={{ margin:'2px'}}
                          onClick={()=>{
                            }}
                          >
                            <Text tid={'TravelApplication.CreditCardInfo'}/>
                        </Button>
                    </Link>          
            </Grid> */}

          </Grid>
      </Grid>
    </>
  )
}
