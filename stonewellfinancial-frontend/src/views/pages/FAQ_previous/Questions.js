import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    greenlineBox: {
        paddingBottom: '1em'
    },
    greenline: {
        width: "2.5rem",
        height: "3px",
        background: "#8EC641",
        display: "inline-block",
        borderRadius: '100px'
    },
}))

/* question and answers are ordered with keys in 1-based indexing system where first digit is the section and second digit is the question number within the section
   if a new question is added follow the key convention and also add the question with same key to SearchBar.js*/
const LifeInsuranceFAQ = {
    11: ["LifeInsurance.FAQ.list.ShouldIBuy", "LifeInsurance.FAQ.list.ShouldIBuy.detail"],
    12: ["LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage", "LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage.detail"],
    13: ["LifeInsurance.FAQ.list.WhichInsuranceCompany", "LifeInsurance.FAQ.list.WhichInsuranceCompany.detail"],
    14: ["LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost", "LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost.detail"],
    15: ["LifeInsurance.FAQ.list.CanBeDeclined", "LifeInsurance.FAQ.list.CanBeDeclined.detail"],
    16: ["LifeInsurance.FAQ.list.HowLongShouldNonSmoke", "LifeInsurance.FAQ.list.HowLongShouldNonSmoke.detail"]
}

const HealthInsuranceFAQ = {
    21: ["HealthInsurance.WhenNeed.label", "HealthInsurance.WhenNeed.detail"]
}

const TravelInsuranceFAQ = {
    31: ["TravelInsurace.FAQ.list.WhoContact", "TravelInsurace.FAQ.list.WhoContact.detail"],
    32: ["TravelInsurace.FAQ.list.Pre-existing", "TravelInsurace.FAQ.list.Pre-existing.detail"],
    33: ["TravelInsurace.FAQ.list.OutofPocket", "TravelInsurace.FAQ.list.OutofPocket.detail"]
}

const GroupBenefitFAQ = {
    41: ["GroupBenefits.What.label", "GroupBenefits.What.detail"],
    42: ["GroupBenefits.WhyNeed.label", "GroupBenefits.WhyNeed.detail"],
    43: ["GroupBenefits.Type.label", "GroupBenefits.Type.detail"],
    44: ["GroupBenefits.WhenNeed.label", "GroupBenefits.WhenNeed.detail"]
}

function mapQuestions(questions) {
    var QandAs = [];
    for (var i in questions) {
        QandAs.push(<Accordion >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="question-content"
                id={"question" + i}
            >
                <Typography variant="h4" align='center'>
                    <Text tid={questions[i][0]} />
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <Text tid={questions[i][1]} />
                </Typography>
            </AccordionDetails>
        </Accordion>)
    }
    return (QandAs)
}

export default function Questions(props) {
    const classes = useStyles();
    return (
        <>
            <Grid container justify='center' spacing={3}>
                <Grid id="header0" item xs={12} >
                    <div className={classes.greenlineBox}>
                        <span className={classes.greenline}></span>
                    </div>
                    <Typography variant="h2">
                        <Text tid={'FAQ.Header1'} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {mapQuestions(TravelInsuranceFAQ)}
                </Grid>
                <Grid id="header1" item xs={12} >
                    <div className={classes.greenlineBox}>
                        <span className={classes.greenline}></span>
                    </div>
                    <Typography variant="h2">
                        <Text tid={'FAQ.Header2'} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {mapQuestions(LifeInsuranceFAQ)}
                </Grid>
                <Grid id="header2" item xs={12} >
                    <div className={classes.greenlineBox}>
                        <span className={classes.greenline}></span>
                    </div>
                    <Typography variant="h2">
                        <Text tid={'FAQ.Header3'} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {mapQuestions(HealthInsuranceFAQ)}
                </Grid>
                <Grid id="header3" item xs={12} >
                    <div className={classes.greenlineBox}>
                        <span className={classes.greenline}></span>
                    </div>
                    <Typography variant="h2">
                        <Text tid={'FAQ.Header4'} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {mapQuestions(GroupBenefitFAQ)}
                </Grid>
            </Grid>
        </>
    )
}