import React from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        padding: '0 2em',
        maxWidth: '1000px',

    },
    media: {
        height: 140,
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
    cards: {
        maxWidth: 345,
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
    },

});

export default function TypeBenefit(props) {
    const classes = useStyles();
    const { Products } = props

    return (
        <>
            <Container className={classes.root}>
                <div className={classes.greenlineBox}>
                    <span className={classes.greenline}></span>
                </div>
                <Typography variant="h2">
                    <Text tid={'HSA.TypeBenefit.Label'} />
                </Typography>
                <Grid container spacing={2}  >
                    {Products.map((Products, index) => (
                        <Grid item xs={12} sm={4} key={index}>

                            <img className={classes.image}
                                src={require('../../../assets/imgs/used/' +
                                    Products.img +
                                    '.jpg')}
                                alt="Card-img-cap"
                            />
                            <Typography variant="h4" >
                                {Products.title}
                            </Typography>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Link to={`/group-benefits`} style={{ textDecoration: 'none' }}>
                            <Button color="secondary" size="md">
                                <Text tid={'HSA.TypeBenefit.LearnMoreBtn'} />
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};