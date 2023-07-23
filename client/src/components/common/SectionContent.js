import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'
import { Text } from '../common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 2em',
    maxWidth: '1000px',
   
  },
  label: {
    color: theme.palette.primary.main,
    marginBottom:'2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.4rem',
      textAlign:'center'
    },
  },
  detail: {
    marginTop: '16px',
    [theme.breakpoints.down('sm')]: {
      marginBottom:'16px'
    },
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
  subTitle: {
    color: "#666"
  },

}))

export default function SectionContent(props) {
  const { label, detail, align } = props
  const classes = useStyles()

  return (
    <>
      <Container className={classes.root}>
        <div className={classes.greenlineBox}>
          <span className={classes.greenline}></span>
        </div>
        <Typography
          className={classes.label}
          variant="h2"
          align={align ? align : 'inherit'}
        >
          <Text tid={label} />
        </Typography>
        <Typography className={classes.detail} variant="body1">
          <Text tid={detail} />
        </Typography>
      </Container>
    </>
  )
}
SectionContent.propTypes = {
  label: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  center: PropTypes.bool,
}
