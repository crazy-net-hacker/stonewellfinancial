import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider';
import SectionContent from '../../../components/common/SectionContent'

export default function TripleTax(props) {

    return (
        <>
            <Container>
                <Grid container justify="center">
                    <Grid item xs={12}>
                        <SectionContent
                            label="HSA.TripleTax.Label"
                            detail="HSA.TripleTax.Detail" />
                    </Grid>
                    <Grid item xs={12} style={{ padding: '0 2em', maxWidth: '1000px' }}>
                        <ul>
                            <li>
                                <Typography variant="body1">
                                    <Text tid={'HSA.TripleTax.List1'} />
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body1">
                                    <Text tid={'HSA.TripleTax.List2'} />
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body1">
                                    <Text tid={'HSA.TripleTax.List3'} />
                                </Typography>
                            </li>
                        </ul>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};