import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
// import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2em',
    // maxWidth: '1000px',
    [theme.breakpoints.down('sm')]: {
      padding:'0'
    },
    '& span': {
      display: 'block',
      fontSize: '0.8rem',
    },
    '& h4': {
      fontSize: '2rem',
      fontWeight: '400',
    },

  },
  heading: {
    fontSize: '20px',
    fontWeight: '400',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    },
  },
  answer: {
    lineHeight:'1.8',
    marginTop:'2vh'
  }
  // box: {
  //   marginTop: '10vh',
  //   marginBottom: '10vh',
  // },
  // subtitle: {
  //   marginTop: '2vh',
  //   marginBottom: '5vh',
  //   lineHeight: '1.4',
  // },
}))

export default function AccordionFAQ(props) {
  const { faqLists } = props
  const classes = useStyles()

  return (
    <Container
      // maxWidth="md"
      className={classes.root}
    >
      {faqLists.map((el, index) => (
        <Accordion key={index} style={{ marginBottom:'2vh'}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            style={{background:'#fafafa', borderBottom:'2px solid #92BD01'}}
          >
            <div className={classes.heading}>
              {!el.isTranslated? <Text tid={el.question} /> : el.question }
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.answer}>
              {/* <Text tid={el.answer} /> */}
              {!el.isTranslated? <Text tid={el.answer} /> : el.answer }
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  )
}


AccordionFAQ.propTypes = {
  faqLists: PropTypes.arrayOf(PropTypes.object).isRequired,
}