import React, { useState, useEffect }  from 'react'
//core components
import { Grid } from '@material-ui/core'
//common components
import { Application } from './Application';
import { QuoteBanner2 } from '../../../../../components/common/QuoteBanner2';
import { Text } from '../../../../../components/common/LanguageProvider';
//style
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
    // border:'1px solid #efefef', 
    // boxShadow:'5px 5px 20px #efefef',
    // padding: '0 2vh'
  },
}));

// export const NewApplication = ({match, user, vendorID, props}) => {
export const NewApplication = (props) => {
    const { match, user, userRole, vendorID, vendorAddress } = props;

    // console.log('user',user)
    // console.log('userRole',userRole)
    // console.log('vendorID',vendorID)
    // console.log('vendorAddress',vendorAddress)

    const classes = useStyles();
 
    const savedData = props.location.state?props.location.state.savedData:''
    
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
    
    let isMobile = (width < 769);

    return (
        <>
        <Grid container justify="center" style={{ background:'#fff',marginTop: isMobile?'0px':'-37px' }}>
        <QuoteBanner2 title={<Text tid={`${match.params.type.toUpperCase()} Plan Application`}/>} subTitle={'Quote.TravelIns.SubTitle'} links={[]} />

            <Grid item xs={12} sm={12} md={11}>
                <main className={classes.form} style={{ padding:isMobile?'0':'0 2vh', margin:isMobile?'1vh':'0' }}>
                    <Application 
                        insuraceType = {match.params.type}
                        userID = {user}
                        userRole = {userRole}
                        vendorID = {vendorID}
                        vendorAddress = {vendorAddress}
                        savedData = {savedData}
                    />
                </main>
            </Grid>
        </Grid>
        </>
    )
}

export default NewApplication
