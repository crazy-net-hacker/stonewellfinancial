import React, { useState } from 'react'
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Modal,
} from '@material-ui/core'
import MuiDialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { makeStyles } from '@material-ui/core/styles'
import Rating from './Rating'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

const useStyles = makeStyles((theme) => ({
  root: {
    // height: 230,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(2),
    borderRadius: 5,
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      display: 'block',
      height: 450,
      padding: theme.spacing(1),
      overflowY: 'auto !important'
    },
    marginBottom: theme.spacing(1.5),
  },
  modalContainer: {
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(1),
    borderRadius: 5,
    [theme.breakpoints.down('md')]: {
      width: '95%',
      display: 'block',
      height: 450,
      padding: theme.spacing(1),
      overflowY: 'auto !important',
      ['@media (max-height : 380px)']: { // eslint-disable-line no-useless-computed-key
        height: 200,
      },
    },
  },
  descContainer: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
  },
  imgContainer: {
    display: 'flex',
    margin: '0 auto',
  },
  testimonialImg: {
    width: 280,
    height: 200,
    objectFit: 'cover',
    margin: '0 auto',
    padding: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
    [theme.breakpoints.down('sm')]: {        
      width: '100%',
    },
  },
  testimonialDesc: {
    marginTop: theme.spacing(1),
    overflowY: 'scroll',
    [theme.breakpoints.down('sm')]: {        
      height: 100,
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  ratings: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {        
      flexDirection: 'column',
    },
  },
  Modalratings: {
    display: 'blcok'
  },
  totalRating: {
    color: '#778899',
    '& b': { color: '#FF8C00' },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'right'
    },
  },
  ModaltotalRating: {
    color: '#778899',
    '& b': { color: '#FF8C00' },
    textAlign: 'right'
  },
  modalRoot: {
    position: 'absolute',
    width: '80%',
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: "95%"
    }

  },
  modalImgContainer: {
    color: theme.palette.secondary,
    display: 'flex',
  },
  modalImg: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    margin: '0 auto',
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  testimonialCaption: {
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'break-word !important',
      whiteSpace: 'initial'
    },
  }
}))

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
}

function TestimonialCard(props) {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const modalBody = (
    <div style={modalStyle} className={classes.modalRoot}>
      <MuiDialogTitle id="customized-dialog-title">
        Review Detail
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
          style={{ position: "absolute", right: 24, top: 24 }}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>

      <Container
        variant="outlined"
        className={classes.modalContainer}
        key={props.review_id}
      >
        <Grid container spacing={0} direction="row">
          <Grid sm={12} md={5} item style={{width: '100%'}}>
            <AliceCarousel fadeOutAnimation={true} disableDotsControls={true}>
              {props.photos.length > 0 ? (
                props.photos.map((photo) => (
                  <div key={photo}>
                    <Box className={classes.modalImgContainer}>
                      <img
                        src={process.env.REACT_APP_S3_IMAGE_URL + photo}
                        alt="customer img"
                        className={classes.modalImg}
                      />
                    </Box>
                  </div>
                ))
              ) : (
                <div>
                  <Box className={classes.modalImgContainer}>
                    <img
                      src="imgs/img01.jpg"
                      alt="customer img"
                      className={classes.modalImg}
                    />
                  </Box>
                </div>
              )}
            </AliceCarousel>
          </Grid>
          <Grid sm={12} md={7} item>
            <div className={classes.descContainer}>
              <Typography variant="h5">{props.name}</Typography>
              <Typography className={classes.testimonialCaption} variant="caption" color="textSecondary">
                {props.type} | {props.company} | {props.address} |{' '}
                {props.date.substring(0, 10)}
              </Typography>
              <div className={classes.Modalratings}>
                <Typography variant="h5" className={classes.ModaltotalRating}>
                  <b>{(props.rate_sum / 3).toFixed(2)}</b>/5
                </Typography>
                <Rating label="Service" value={props.rate_service} />
                <Rating label="Quality" value={props.rate_quality} />
                <Rating label="Consulting" value={props.rate_consulting} />
              </div>
              <Box style={{ maxHeight: 400, overflow: 'auto', marginTop: 10 }}>
                <Typography>{props.contents}</Typography>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )

  return (
    <>
      <Card variant="outlined" className={classes.root} key={props.review_id}>
        <Grid container spacing={0} direction="row">
          <Grid sm={12} md={8} item>
            <div className={classes.descContainer}>
              <Typography variant="h5">{props.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {props.type} | {props.company} | {props.address} |{' '}
                {props.date.substring(0, 10)}
              </Typography>
              <div className={classes.ratings}>
                <Typography variant="h5" className={classes.totalRating}>
                  <b>{(props.rate_sum / 3).toFixed(2)}</b>/5
                </Typography>
                <Rating label="Service" value={props.rate_service} />
                <Rating label="Quality" value={props.rate_quality} />
                <Rating label="Consulting" value={props.rate_consulting} />
              </div>
              <Typography
                className={classes.testimonialDesc}
                onClick={handleOpen}
              >
                {props.contents}
              </Typography>
            </div>
          </Grid>
          <Grid sm={12} md={4} item className={classes.imgContainer}>
            <img
              src={
                props.photos.length > 0
                  ? process.env.REACT_APP_S3_IMAGE_URL + props.photos[0]
                  : 'imgs/logoMobile.png'
              }
              alt="customer img"
              className={classes.testimonialImg}
              onClick={handleOpen}
            />
          </Grid>
        </Grid>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </>
  )
}

export default TestimonialCard
