import React from 'react';
//import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider'
import { Link } from 'react-router-dom'
import Button from '../../../components/common/CustomButtons/Button'

export default function ProcessInfo(props) {
    //const classes = useStyles()
    const { process_url, label, desc } = props

    return (
        <>
            <Typography variant="h2">
                <Text tid={label} />
            </Typography>
            <Typography style={{whiteSpace: 'pre-wrap'}} variant="body1">
                <Text tid={desc} />
            </Typography>
            <Box mt={2}>
                <Link to={process_url} style={{ textDecoration: 'none' }}>
                    <Button
                        color="secondary"
                        size="md"
                    >
                        <Text tid={"ProcessApplication.ProcessInfo.LearnMoreBtn"} />
                    </Button>
                </Link>
            </Box>
        </>
    );
};