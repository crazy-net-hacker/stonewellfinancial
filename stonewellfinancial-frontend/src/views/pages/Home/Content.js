import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Banner from './Banner'

const useStyles = makeStyles((theme) => ({
    about_header: {
      width: "auto",
      background: 'url("/imgs/ab.jpg")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: 200,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      '& h1': {
        color: 'black'
      },
    },
  }));


export default () => {
    const classes = useStyles();

    return (
        <Fragment>
            <Banner />
        </Fragment>
    )
}