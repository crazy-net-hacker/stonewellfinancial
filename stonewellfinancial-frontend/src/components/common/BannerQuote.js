import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Text } from './LanguageProvider'
import Container from '@material-ui/core/Container'
import Button from '../common/CustomButtons/Button'
//styles
import bannerStyles from '../../assets/jss/styles/bannerStyle'
const useStyles = makeStyles(bannerStyles)

export default function BannerQuote(props) {
  const { title, quote_Btn_Disable, quote_url, buttonTitle } = props
  const classes = useStyles()
  return (
    <>
      <Container className={classes.bannerQuoteRoot}>
        <Grid className={classes.bannerQuoteWrapper}
              style={{
                background: `url(/imgs/bannerQuote${window.location.pathname}.png)`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }} 
              container spacing={0}
        >
          <Grid className={classes.bannerQuoteLeft} item xs={12} md={5}>
            <Typography className={classes.bannerQuoteTitle} variant={'h3'}>
              <Text tid={title} />
            </Typography>
            {quote_Btn_Disable === 'false' && (
              <Link to={quote_url} style={{textDecoration: 'none'}}>
                <Button color="secondary" style={{ marginTop: 10 }}>
                  <Text tid={ buttonTitle ? buttonTitle : `Get a quote`} />
                </Button>
              </Link>
            )}
          </Grid>
          <Grid className={classes.bannerQuoteImg} item xs={12} md={7}></Grid>
        </Grid>
        {/* <Grid container>
      <Grid item container xs={12} sm={12} justify="center" direction="column" className={classes.quoteContainer} >
        <Typography className={classes.quoteSubtitle} ><Text tid={props.title}/></Typography>
      </Grid>
    </Grid> */}
      </Container>
    </>
  )
}
