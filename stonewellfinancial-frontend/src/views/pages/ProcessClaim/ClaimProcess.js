import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Box, 
    Menu, MenuItem, IconButton
 } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider'
import ErrorIcon from '@material-ui/icons/Error';
import CallIcon from '@material-ui/icons/Call';

const useStyles = makeStyles((theme) => ({
    step: {
        textTransform: 'uppercase',
        color: theme.palette.secondary.main,
        fontWeight: 700,
        marginBottom: 8,
        fontSize: '1.2rem',
    },
    image: {
        padding: '16px 4px',
        width: '100%',
        height: 'auto',
    },
    callBtn: {
        float: 'right',
        color: 'white',
        borderRadius: '50%',
        backgroundColor: '#8EC641',
        padding: "2px",
    }
}))

export default function ClaimProcess(props) {
    const classes = useStyles()

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <Typography variant="h2">
                <Text tid={'ProcessClaim.ClaimProcess.label'} />
            </Typography>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 1</span>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={'ProcessClaim.ClaimProcess.First.title'} />
                        </Typography>
                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />
                        <Typography variant="body1">
                            <Text tid={'ProcessClaim.ClaimProcess.First.desc'} />
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 2</span>
                        <Grid container>
                            <Grid item>
                                <Typography variant="h4" gutterBottom>
                                    <Text tid={'ProcessClaim.ClaimProcess.Second.title'} />
                                </Typography>
                            </Grid>

                            <Grid item>
                                <IconButton 
                                    style={{ marginTop: '-0.75em' }} aria-label="call"  
                                    onClick={handleClick} >
                                    <CallIcon className={classes.callBtn} />
                                </IconButton>
                                <Menu
                                    id="call-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <MenuItem >Allianz 1-800-995-1662</MenuItem>
                                    <MenuItem >Tugo 1-800-663-0399</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />
                        <Typography variant="body1">
                            <Text tid={'ProcessClaim.ClaimProcess.Second.desc'} />
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 3</span>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={'ProcessClaim.ClaimProcess.Third.title'} />
                        </Typography>
                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />
                        <Typography variant="body1">
                            <Text tid={'ProcessClaim.ClaimProcess.Third.desc'} />
                        </Typography>
                    </div>
                </Grid>
                <Box my={5}>
                    <Grid container>
                        <Grid item xs={1}>
                            <ErrorIcon style={{ color: 'red', float: 'right' }} />
                        </Grid>
                        <Grid item xs={10}>
                            <Box border={1} p={3}>
                                <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                                    <Text tid={'ProcessClaim.ClaimProcess.extraDetail'} />
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </>
    );
};