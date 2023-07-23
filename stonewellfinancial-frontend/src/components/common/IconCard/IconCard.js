import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Container } from '@material-ui/core'
import { Text } from '../LanguageProvider'
import HoverIconCard from '../HoverIconCard'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '3rem',
    // marginBottom: '80px',
    maxWidth: '1000px',
    paddingLeft:'32px',
    paddingRight:'32px',

  },
  eventsCard: {
    border: '1px solid #c7c7c7',
    margin: '8px',
    padding: '34px 16px',
    height: '100%',
    borderRadius: '25px 0 25px',
    display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
  },
  eventsCardTitle: {
    margin: '36px',
  },
}))



export default function IconCard(props) {  
  const { Content } = props
  const classes = useStyles()
  let number = Content.length
  return (
    <>
      <Container
        // maxWidth="md"
        className={classes.root}
      >
        <Grid container spacing={3}>
          {Content.map((el, index) => (
            <Grid
         
              item
              xs={12}
              sm={6}
              md={number === 4 ? 3 : 4 }
             
              key={index}
              style={
                {
                  // display: 'flex',
                  // flexDirection: 'column',
                  // alignItems: 'center',
                  // textAlign: 'center',
                  // padding: '2rem',
                }
              }
            >
              {/* <div className={classes.eventsCard} style={{ width: '100%' }}>
                <img src={`${el.src}`} alt="When do you need life insurance" />
                <Typography className={classes.eventsCardTitle} variant="h4">
                  <Text tid={`IconCard.list.${el.title}`} />
                </Typography>
                <Typography variant="body2">
                  <Text tid={`LifeInsurance.WhenNeed.detail.${el.title}`} />
                </Typography>
              </div> */}
              <HoverIconCard
                title={<Text tid={`IconCard.list.${el.title}`} />}
                content={
                  <Text tid={`IconCard.list.detail.${el.title}`} />
                }
                icon={`${el.src}`}
                iconBk={`${el.src2}`}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}