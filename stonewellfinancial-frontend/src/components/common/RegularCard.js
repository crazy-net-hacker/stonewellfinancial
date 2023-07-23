import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import RegularButton from '../common/CustomButtons/Button'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  cardTitle: {
    color: theme.palette.primary.main,
  },
}))

const RegularCard = (props) => {
  const { title, content, link, src } = props
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      {/* <CardActionArea> */}
      <CardMedia
        component="img"
        alt={title}
        height="150"
        image={require('./../../assets/imgs/used/' + src + '.jpg')}
        title={title}
      />
      <CardContent>
        <Typography className={classes.cardTitle} gutterBottom variant="h4">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {content}
        </Typography>

        {link ? (
          <Link className={classes.cardBtn} to={'/' + link}>
            <RegularButton
              outlined={true}
              color="primary"
              size="sm"
              style={{ marginTop: 10 }}
            >
              Learn{' '}
            </RegularButton>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default RegularCard
