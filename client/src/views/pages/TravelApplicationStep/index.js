import React, { useState, useEffect }  from 'react'

//core components
import { Grid } from '@material-ui/core'

//common components
// import Application from './Application'
import ApplicationStepper from './ApplicationStepper'

//style
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'auto',
    border:'1px solid #efefef', 
    boxShadow:'5px 5px 20px #efefef',
    // padding: '0 2vh'
  },
}));

export const TravelApplication = ({match}) => {
    const classes = useStyles();

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
        <Grid container justify="center" style={{margin:'1vh 0'}}>
            <Grid item xs={12} sm={12} md={11} lg={8}>
                <main className={classes.form} style={{ padding:isMobile?'0':'0 2vh', border: isMobile ? 'none': '1px solid #efefef', boxShadow: isMobile?'none':'5px 5px 20px #efefef' }}>
                    {/* <Application 
                        insuraceCompany = {match.params.company}
                        insuraceType = {match.params.type}
                        applyType = {match.params.applyType}
                    /> */}
                    <ApplicationStepper
                        insuraceCompany = {match.params.company}
                        insuraceType = {match.params.type}
                        applyType = {match.params.applyType}
                    />
                </main>
            </Grid>
        </Grid>
        </>
    )
}

export default TravelApplication
