import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider';

export default function ClinicInfo(props) {

    return (
        <>
            <Container>
                <Grid container justify="center">
                    <Grid item xs={12}>
                    <Typography style={{ whiteSpace: 'pre-wrap' }} variant="h2">
                            <Text tid={'ClinicFinder.ClinicInfo.Label1'} />
                        </Typography> 
                        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                            <Text tid={'ClinicFinder.ClinicInfo.Detail1'} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="h4">
                            <Text tid={'ClinicFinder.ClinicInfo.Label2'} />
                        </Typography>
                        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                            <Text tid={'ClinicFinder.ClinicInfo.Detail2'} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="h4">
                            <Text tid={'ClinicFinder.ClinicInfo.Label3'} />
                        </Typography>
                        <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                            <Text tid={'ClinicFinder.ClinicInfo.Detail3'} />
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};