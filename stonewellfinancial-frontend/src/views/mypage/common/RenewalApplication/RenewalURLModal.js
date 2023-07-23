import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components
import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Container,
          Grid, Typography, IconButton,
} from '@material-ui/core'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'


const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    padding: theme.spacing(1)
  },
  label: { 
    // marginTop: theme.spacing(1),
    fontWeight:"700",
    // color:'#777'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  copyURLButtonArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(0, 0, 1),
  },
  // submit: {
  //   margin: theme.spacing(3, 0, 2),
  // },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3, 0, 2),
  },
}))

const group = (insuredpersons) => {
  var obj = Object.create(null);
  const group = [];
  insuredpersons.forEach(function (o) {
      var key = ['companyName', 'eligilbeIns'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = {companyName: o.companyName, 
                      eligilbeIns: o.eligilbeIns,
                      persons: [] 
                    };
        group.push(obj[key]);
      }
      obj[key].persons.push(o);
    });  
  return (group)
}  

const addaDay = (dateTime) => {
  const date = new Date(dateTime+'T00:00:00');
  return new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0,10);
}


const RenewalURLModal = (props) => {
  const { data, originData, open, setOpen } = props
  // declaration
  const classes = useStyles()


  // vendor 사용 가능 하도록
  // data.vendor_id = 'VEN0000010';
  
  data.insuredPersons = data.insuredPersons 
    ? data.insuredPersons.map(row => {
      const updatedRow = {
        ...row,
        birthDate: originData.insuredpersons.filter(person => person.firstName === row.firstName && person.lastName === row.lastName)[0].birthdate,
        companyName : originData.insuredpersons.filter(person => person.firstName === row.firstName && person.lastName === row.lastName)[0].compnayName,
        tripStartDate : originData.insuredpersons.filter(person => person.firstName === row.firstName && person.lastName === row.lastName)[0].tripStartDate,
        tripEndDate : originData.insuredpersons.filter(person => person.firstName === row.firstName && person.lastName === row.lastName)[0].tripEndDate,
        renewalStartData : addaDay(originData.insuredpersons.filter(person => person.firstName === row.firstName && person.lastName === row.lastName)[0].tripEndDate)
      };
      return updatedRow;
    })
    : [];

  const ManualFormURL = group(data.insuredPersons);

  //
  // 
  const handleClose = () => {
    setOpen(false)
  }
  

  return (
    <>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Manual Form Renewal Application URL 
          </Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton>
        </MuiDialogTitle>

        <Container component="main" maxWidth="md">
          {/* <div className={classes.paper}> */}
          <Grid item  container direction="column" spacing={0} className={classes.form}>
          <Grid item  container spacing={1} >
            <Grid item xs={12} sm={2}>
              <label className={classes.label}>Email :</label>
            </Grid>
            <Grid item xs={12} sm={10}>
              {data.contactEmail}
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className={classes.label}>Phone :</label>
            </Grid>
            <Grid item xs={12} sm={10}>
              {data.contactPhone}
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className={classes.label}>Address :</label>
            </Grid>
            <Grid item xs={12} sm={10}>
              {data.mailStreetName} {data.mailUnitApartmentNo} {data.mailCity} {data.mailProvince} {data.mailPostalCode} {data.mailCountry}
            </Grid>
            
            <Grid item container >
              <Grid item xs={12} sm={3}><label className={classes.label}>Insurance</label></Grid>
              <Grid item xs={12} sm={6}>
                <Grid item container>
                    <Grid item xs={4}><label className={classes.label}>Name</label></Grid>
                    <Grid item xs={4}><label className={classes.label}>Birth Date</label></Grid>
                    <Grid item xs={4}><label className={classes.label}>Expiry Date</label></Grid>
                </Grid>
              </Grid>
            </Grid>

            {ManualFormURL.map((i, index)=>(
              <React.Fragment key={index}>
                <Grid item container spacing={1}>
                  <Grid item container>
                    <Grid item xs={12} sm={3}>
                      {i.companyName} - {i.eligilbeIns}
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>                  
                      {i.persons.map(p=>(
                          <Grid item container key={p.firstName}>
                            <Grid item xs={4}>
                              {`${p.firstName} ${p.lastName}`}
                            </Grid>
                            <Grid item xs={4}>
                              {p.birthDate}
                            </Grid>
                            <Grid item xs={4}>
                              {p.tripEndDate}
                              </Grid>
                          </Grid>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                    {/* <Grid item xs={3}> */}
                      {/* <Grid item container style={{justifyContent: 'flex-end', margin:'0 7vh 0'}}> */}
                      <Grid item container className={classes.copyURLButtonArea}>
                        <Button
                          color="primary"
                          onClick={() => {
                            const insured = JSON.stringify(
                                      i.persons.map(p => ({
                                        firstName: p.firstName,
                                        lastName: p.lastName,
                                        birthDate: p.birthDate,
                                        gender: p.gender,
                                        tripStartDate: p.renewalStartData
                                    }))
                                  );
                            
                            const contact = JSON.stringify({street: data.mailStreetName?data.mailStreetName.replace('#', ' '):'', 
                                                            suiteNo: data.mailUnitApartmentNo, 
                                                            city: data.mailCity, 
                                                            province: data.mailProvince, 
                                                            postalcode: data.mailPostalCode, 
                                                            country: data.mailCountry,
                                                            email: data.contactEmail,
                                                            phone: data.contactPhone
                                  });

                            if(i.eligilbeIns && i.companyName){
                              // const baseURL = 'http://localhost:3000'
                              const baseURL = 'https://www.stonewellfinancial.com'
                              const URL = `${baseURL}/travel-insurance/d8bb983bb932b31/application/${i.eligilbeIns.toLowerCase()}/${i.companyName.toLowerCase()}/individual?renewal=true&insured=${insured}&contact=${contact}`
                              // window.open(URL, '_blank')    
                              navigator.clipboard.writeText(URL)   
                            }else{
                              console.log('can not get URL')
                            }                 
                          }}
                        >
                          Copy URL
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))
            }
          </Grid>
          </Grid>

          <div className={classes.submitArea}>
            <Button
              color="secondary"
              onClick={() => {handleClose(false)}}
            >
              Close
            </Button>
          </div>
        </Container>
      </Dialog>
    </>
  )
}

export default RenewalURLModal