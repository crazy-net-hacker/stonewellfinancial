import React from 'react';
//import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, } from '@material-ui/core';
import SectionContent from '../../../components/common/SectionContent'
import FeatureCard from '../../../components/common/IconCard/FeatureCard'

const needLifeIns = [
    {
        title: 'HSA1',
        src: '/imgs/icon/BringPeace.svg',
    },
    {
        title: 'HSA2',
        src: '/imgs/icon/ProtectFamily.svg',
    },
    {
        title: 'HSA3',
        src: '/imgs/icon/PayDebts.svg',
    },
    {
        title: 'HSA4',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA5',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA6',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA7',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA8',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA9',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA10',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA11',
        src: '/imgs/icon/ProtectEstate.svg',
    },
    {
        title: 'HSA12',
        src: '/imgs/icon/ProtectEstate.svg',
    },

]

//const useStyles = makeStyles((theme) => ({
//}))

export default function WhatClaim(props) {
    //const classes = useStyles()

    return (
        <>
            <Container>
                <Grid container justify="center">
                    <Grid item xs={12}>
                        <SectionContent
                            label="HSA.WhatClaim.Label"
                            detail="HSA.WhatClaim.Detail" />
                    </Grid>
                    <Grid item xs={12} style={{ padding: '20px 2em', maxWidth: '1000px' }}>
                        <FeatureCard titles={needLifeIns} />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};