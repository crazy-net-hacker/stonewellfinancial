import React from 'react'

//core components
import { Grid, Card, Button } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider';
import { Link } from 'react-router-dom';

//style
//import { makeStyles } from '@material-ui/core'
// //const useStyles = makeStyles((theme) => ({

// }));

export const NewQACard = (props) => {
//    const classes = useStyles();
    const { title, quoteURL, viewURL } = props

    return (
        <>
            <Card>
            <Grid container direction='column'>
                <Grid item style={{textAlign: 'center', padding: '5%', background: '#2a2f71'}}>
                    <h4 style={{color: 'white'}}>{title}</h4>
                </Grid>
                <Grid item style={{ textAlign: 'center', padding: '5%'}}>
                    <p>Life insurance is a legal contract between an insurance company and person, where the insurance company obliged to pay beneficiaries a sum of life insurance benefits upon the death of an insured person.</p>
                </Grid>
                <Grid item style={{textAlign: 'center', }}>
                    <Link to={quoteURL}>
                    <Button style={{backgroundColor: '#2a2f71', color: 'white'}}>
                        <Text tid={'Get a Quote'} />
                    </Button>
                    </Link> 
                </Grid>
                <Grid item style={{textAlign: 'center', padding: '5%'}}>
                    <Link to={viewURL} target='_blank'>View details</Link>
                </Grid>
            </Grid>
            </Card>
        </>
    )
}

