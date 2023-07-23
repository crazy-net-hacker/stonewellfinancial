import React from 'react'

//core components
import { Grid } from '@material-ui/core'

//common components
import { NewQACard } from './NewQACard';

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle';

const useStyles = makeStyles(formStyle);

const newQuoteList = [
    {
        id : 1,
        title : 'Life Insurance',
        quoteURL : '/myportal/client/new-quote/life',
        viewURL : '/life-insurance'
    },
    {
        id : 2,
        title : 'Health Insurance',
        quoteURL : '/myportal/client/new-quote/health',
        viewURL : '/health-insurance'
    },
    {
        id : 3,
        title : 'Travel Insurance',
        quoteURL : '/myportal/client/new-quote/travel',
        viewURL : '/travel-insurance'
    },
    {
        id : 4,
        title : 'Group Insurance',
        quoteURL : '/myportal/client/new-quote/group',
        viewURL : '/group-benefits'
    }
]

export const NewQA = () => {
    const classes = useStyles();

    return (
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
            <Grid container direction='column' alignItems='center' spacing={4}>

                <Grid item className={classes.title}>
                    <h3>New Quote & Application</h3>
                </Grid>

                <Grid item style={{textAlign: 'center', color: '#2a2f71'}}>
                    <h5>
                        We recommend insurance products tailored to your
                        personal situation to everyone living in Canada
                        from visitors to permanent residents to citizens
                    </h5>
                </Grid>

                <Grid item container spacing={5} justify='flex-start'>
                    {newQuoteList.map((quote) => (
                        <Grid item xs={12} sm={4} key={quote.id}>
                            <NewQACard 
                                title={quote.title} 
                                quoteURL={quote.quoteURL} 
                                viewURL={quote.viewURL}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </div>
    )
}

export default NewQA
