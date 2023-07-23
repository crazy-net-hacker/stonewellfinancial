import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Container } from '@material-ui/core'
import { Text } from '../LanguageProvider'
//icons
import CheckIcon from '@mui/icons-material/Check';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
  },
  list: {
    padding:'4px 16px!important'
  }
}))



export default function ListItem(props) {
  const { titles } = props;
  const classes = useStyles()
  return (
    <>
      <Container className={classes.root}>
        <Grid container spacing={1}>
          {titles.map((item, index) => (
            <Grid
              className={classes.list}
              item
              xs={12}
              key={index}
            >
             
         
                <CheckIcon style={{marginRight:'1vw', color:'#8EC641'}}/> 
                <Text tid={`List.${item.title}`} />
            
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
