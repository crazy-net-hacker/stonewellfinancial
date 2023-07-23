import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Grid, Typography, Box } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider'

import MuiAccordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '../../../components/common/CustomButtons/Button'
import { Link } from 'react-router-dom'

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
}))

export default function ApplicationProcess(props) {
    const classes = useStyles()
    const Accordion = withStyles({
        root: {
            boxShadow: 'none',
            '&:before': {
                display: 'none',
            }
        },
    })(MuiAccordion)

    const AccordionSummary = withStyles({
        root: {
            border: 'none',
        },

        expandIcon: {
            order: -1
        },
        '@global': {
            '.MuiButtonBase-root': {
                alignItems: 'flex-start',
            },
        }
    })(MuiAccordionSummary);

    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const handleClick = (e, btn) => {
        if (btn === 1) {
            setAnchorEl1(e.currentTarget);
        } else if (btn === 2) {
            setAnchorEl2(e.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl1(null);
        setAnchorEl2(null);
    };

    return (
        <>
            <Typography variant="h2">
                <Text tid={'ProcessApplication.ApplicationProcess.label'} />
            </Typography>
            <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 1</span>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={'ProcessApplication.ApplicationProcess.First.title'} />
                        </Typography>

                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />

                        <Box mb={5}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.First.subtitle'} />
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} >
                                            <Typography variant="body1">
                                                <Text tid={'ProcessApplication.ApplicationProcess.First.detail'} />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                        <Button color="secondary" size="md" aria-controls="menu1" aria-haspopup="true" onClick={(e) => handleClick(e, 1)} >
                            <Text tid={'ProcessApplication.ApplicationProcess.button1'} />
                        </Button>
                        <Menu
                            id="menu1"
                            anchorEl={anchorEl1}
                            keepMounted
                            open={Boolean(anchorEl1)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Link to={'/life-insurance'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem1'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                            <Link to={'/health-insurance'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem2'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                            <Link to={'/travel-insurance'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem3'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                        </Menu>

                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 2</span>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={'ProcessApplication.ApplicationProcess.Second.title'} />
                        </Typography>

                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />
                        <Box mb={5}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.Second.subtitle'} />
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.Second.detail'} />
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Box>

                        <Button color="secondary" size="md" aria-controls="menu2" aria-haspopup="true" onClick={(e) => handleClick(e, 2)}>
                            <Text tid={'ProcessApplication.ApplicationProcess.button2'} />
                        </Button>
                        <Menu
                            id="menu2"
                            anchorEl={anchorEl2}
                            keepMounted
                            open={Boolean(anchorEl2)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Link to={'/life-insurance/quote'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem1'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                            <Link to={'/health-insurance/quote'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem2'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                            <Link to={'/travel-insurance/quote'} style={{ textDecoration: 'none' }}>
                                <MenuItem >
                                    <Typography variant="body1">
                                        <Text tid={'ProcessApplication.ApplicationProcess.menuitem3'} />
                                    </Typography>
                                </MenuItem>
                            </Link>
                        </Menu>
                    </div>

                </Grid>
                <Grid item xs={12} sm={4}>
                    <div>
                        <span className={classes.step}>Step 3</span>
                        <Typography variant="h4" gutterBottom>
                            <Text tid={'ProcessApplication.ApplicationProcess.Third.title'} />
                        </Typography>

                        <img
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                            alt="supporting document"
                            className={classes.image}
                        />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">
                                    <Text tid={'ProcessApplication.ApplicationProcess.Third.subtitle'} />
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1">
                                    <Text tid={'ProcessApplication.ApplicationProcess.Third.detail'} />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </Grid>
            </Grid>
        </>
    );
};