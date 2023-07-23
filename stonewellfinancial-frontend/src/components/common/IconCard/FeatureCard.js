import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Container } from '@material-ui/core'
import { Text } from '../LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding:'10px'
  },
  featureCardImg: {
    border: '3px solid',
    borderColor: theme.palette.secondary.main,
    borderRadius: 50,
    width: '5em',
    height: '5em',
    padding: 16,
  },
  featureCardTitle: {
    color: theme.palette.neutral.dark,
    marginTop: '0.5em',
    fontSize: '1.1em',
    fontWeight: '600',
  },
}))



export default function FeatureCard(props) {
  const { titles } = props;
  const classes = useStyles()
  return (
    <>
      <Container className={classes.root}>
        <Grid container>
          {titles.map((img, index) => (
            <Grid
              className={classes.featureCard}
              item
              xs={6}
              sm={3}
              key={index}
            >
              <img
                className={classes.featureCardImg}
                src={img.src}
                alt="Why need life insurance"
                
              />
              <Typography variant="h3" className={classes.featureCardTitle}>
                <Text tid={`FeatureCard.list.${img.title}`} />
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
