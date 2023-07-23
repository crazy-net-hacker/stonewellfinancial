import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, InputBase, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Text } from '../../../components/common/LanguageProvider'
import ReactDOMServer from 'react-dom/server'
import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';

//questions are ordered specifcally in the array to be indexed in search bar aligning to order in Questions.js
const questions = {
    11: "LifeInsurance.FAQ.list.ShouldIBuy",
    12: "LifeInsurance.FAQ.list.HowMuchLifeInsuranceCoverage",
    13: "LifeInsurance.FAQ.list.WhichInsuranceCompany",
    14: "LifeInsurance.FAQ.list.HouwMuchLifeInsuranceCost",
    15: "LifeInsurance.FAQ.list.CanBeDeclined",
    16: "LifeInsurance.FAQ.list.HowLongShouldNonSmoke",
    21: "HealthInsurance.WhenNeed.label",
    31: "TravelInsurace.FAQ.list.WhoContact",
    32: "TravelInsurace.FAQ.list.Pre-existing",
    33: "TravelInsurace.FAQ.list.OutofPocket",
    41: "GroupBenefits.What.label",
    42: "GroupBenefits.WhyNeed.label",
    43: "GroupBenefits.Type.label",
    44: "GroupBenefits.WhenNeed.label"
}
const questionsStrings =
    Object.entries(questions).map(([key, value]) => ReactDOMServer.renderToString(<Text tid={value} />))

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        border: 2,
        borderColor: '#000',
        boxShadow: 'none',
    },
    boxStyle: {
        justify: 'center',
        border: "1px solid black",

    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        width: '100%'
    },
    iconButton: {
        padding: 10,
        float: 'right'
    },
    autoComplete: {
        width: '100%'
    }
}))

export default function SearchBar(props) {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState(0);

    const changeHandler = (e) => {
        setSearchInput(e.target.value);
    }

    const scrollToQ = (question) => {
        setSearchInput(question);
        questionsStrings.indexOf(question);
        var element = document.getElementById("question" + Object.keys(questions)[questionsStrings.indexOf(question)]);
        //scrolling to question that was searched
        if (element != null) {
            var pos = element.style.position;
            var top = element.style.top;
            element.style.position = 'relative';
            element.style.top = '-90px';//scrolling offset
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.style.top = top;
            element.style.position = pos;
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        scrollToQ(searchInput);
    }

    const autocompleteHandler = (event, value) => {
        setSearchInput(value);
        scrollToQ(value);
    }

    return (
        <>
            <Box className={classes.boxStyle} >
                <Paper component="form" className={classes.root}>
                    <form style={{ width: '100%' }} onSubmit={submitHandler}>
                        <Autocomplete
                            className={classes.autoComplete}
                            freeSolo
                            onInputChange={autocompleteHandler}
                            id="search bar"
                            options={questionsStrings}
                            renderInput={(params) => (
                                <InputBase
                                    ref={params.InputProps.ref}
                                    placeholder="Search Here"
                                    inputProps={params.inputProps}
                                    className={classes.input}
                                    onChange={changeHandler}
                                />
                            )}
                        />
                    </form>
                    <form onSubmit={submitHandler}>
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </form>
                </Paper>
            </Box>
        </>
    )
}