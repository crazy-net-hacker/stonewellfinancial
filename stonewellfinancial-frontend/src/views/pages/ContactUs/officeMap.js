import React from 'react' 
import { makeStyles } from '@material-ui/core/styles';
import GoogleMapReact from 'google-map-react';
import { FaMapMarker } from 'react-icons/fa';
import { Grid } from "@material-ui/core";
//components
import { Text } from '../../../components/common/LanguageProvider';
//icon
import locationIcon from "../../../assets/imgs/icons/location.svg"

const Marker = ({ text }) => <div><FaMapMarker style={{color: 'red', fontSize: '20px'}} />{text}</div>;

const useStyles = makeStyles((theme) => ({
  // root: {
  //   paddingTop: '2em',
  // },
  sectionContainer: {
    padding: theme.spacing(2,4),
    '& p': {
      // marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    '& ul': {
      marginTop: theme.spacing(1),
    },
  },
  iconImg: {
    marginTop: '15px'
  },
  iconTitle: {
    paddingLeft:"1em", 
    fontWeight:'600', 
    marginTop:'-5px' 
  },
  iconDesc: {
    paddingLeft:"45px", 
    fontSize: '0.8em', 
    marginTop:'-15px'
  }
}));

const officeInfo = [
  { 
    office: <Text tid={'Contact.Office'}/>, 
    province: 'Ontario',
    address: '4576 Yonge Street, Suite 608, North York, ON M2N 6N4',
    phone: '1-416-645-3858',
    email: 'info@stonewellfinancial.com',
    mailto: 'mailto:info@stonewellfinancial.com',
    location: {lat: 43.756120, lng: -79.410090},
    makerText: ''
  },
//   { 
//     office: 'Quebec', 
//     province: 'Quebec',
//     address: '1200 McGill College Ave, Suite 1100, Montreal, QC H3B 4G7',
//     phone: '1-833-645-3858',
//     email: 'info@stonewellfinancial.com',
//     mailto: 'mailto:info@stonewellfinancial.com',
//     location: {lat: 43.756120, lng: -79.410090},
//     makerText: ''
//   },
//   { 
//     office: 'British Columbia', 
//     province: 'British Columbia',
//     address: '4170 Still Creek Drive, Suite 200, Burnaby, BC V5C 6C6                 ',
//     phone: '1-833-645-3858',
//     email: 'info@stonewellfinancial.com',
//     mailto: 'mailto:info@stonewellfinancial.com',
//     location: {lat: 43.756120, lng: -79.410090},
//     makerText: ''
//   },

]

export const OfficeMap = (props) => {
    const classes = useStyles();

    return (
    <>
       <Grid container spacing={3} className={classes.root} >

       {officeInfo.map((office) => (
       <Grid item container xs={12}
            className={classes.sectionContainer} 
            key={office.province}>
          <Grid item xs={12}>
            <img src={locationIcon} className={classes.iconImg} alt="head office location"/>
            <span className={classes.iconTitle} >{office.office}</span>
            <p className={classes.iconDesc}>{office.address}</p>
          </Grid>
          {/* <ul className={classes.nostyleLi}>
            <li>{office.address}</li>
            <li>{office.phone}</li>
            <li>Email: <a href={office.mailto}>{office.email}</a></li>
          </ul> */}
          
          
          <div style={{ height: '20vh', width: '100%' }}>
          <GoogleMapReact
            // bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API_KEY }}
            bootstrapURLKeys={{ key: "AIzaSyDg6ZgVRqfwmdkl3-XVn6bl5ikbtij5kWY" }}
            // defaultCenter={{lat: 43.756120, lng: -79.410090}}
            defaultCenter={office.location}
            defaultZoom={12} 
          >
            <Marker
              lat={office.location.lat}
              lng={office.location.lng}
              text={office.makerText}
            />
          </GoogleMapReact>       
          </div>

        </Grid>
         ))} 
        </Grid>   
       
        
    </>
  )
}
