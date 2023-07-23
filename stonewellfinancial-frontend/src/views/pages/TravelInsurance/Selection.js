import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
      root: {
        padding: '0 2em'
      },
      cardBox: {
        margin: '0.5vh 0.1vh',
        boxShadow: 'none',
        border: '1px solid #dae0e5'
      },

      media: {
        height: '20vh',
      },
}))


const travelPlan = [
  {
    title: 'ComingCanada',
    src: '/imgs/card/coming-canada.jpg',
  },
  {
    title: 'GoingOutsideCanada',
    src: '/imgs/card/out-from-canada.jpg',
  },
]


export default () => {
  const classes = useStyles()
  return (
    <>
        <Grid container className={classes.root} spacing={2}>

          {travelPlan.map((tp, index) => (     
          <Grid item xs={12} sm={6} md={5}key ={tp.title}>
            <Card className={classes.cardBox}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={`${tp.src}`}
                  title= {`${tp.title}`}
                />
              </CardActionArea>
              <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                      <Text tid={`TravelInsurace.WhichPlan.list.${tp.title}`} />
                  </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
                <Button size="small" color="primary">
                  Get a Quote
                </Button>
              </CardActions>
            </Card>
          </Grid>
          ))}

        </Grid>
     
    </>
  )
}
