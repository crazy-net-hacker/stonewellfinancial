import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
//Card components
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
//components
import { Text } from '../LanguageProvider'
//styles
import productStyles from '../../../assets/jss/styles/productStyle'

const useStyles = makeStyles(productStyles)

export default function Product(props) { 
 const { Products } = props
  const classes = useStyles()

  let number = Products.length
  
  if(number === 3){
    return (
      <>
        <Grid container className={classes.root} spacing={0} justify="space-evenly" >
          
          {Products.map((Products, index) => (
            
          
            <Grid item xs={12} sm={6} md={4} key={index}>
      
              <Box mt={5}>

                  <div className={classes.grid}>
                    <figure
                      className={classNames(classes.grid, classes.figureEffect)}
                    >
                        <img
                          src={require('../../../assets/imgs/used/' +
                            Products.img +
                            '.jpg').default}
                          alt="Card-img-cap"
                          style={{ width:'100%', height:'auto' }}
                        />
                        <figcaption>
                        <div className={classes.cardText}>
                          <Typography variant="h4" style={{ color: 'white'}}>
                          {Products.description}<br></br>
                          <Link to={`/` + Products.url} style={{textDecoration:'none'}} >
                            <Button className={classes.carouselBtn}  variant="contained" size="small"><Text tid={`Learn more`} /></Button>
                          </Link>
                          </Typography>
                          
                        </div>
                        </figcaption>
                      
                    </figure>
                    
                    <div>
                  
                  </div>
              
                </div> 
                <div className={classes.cardTitle}>
                <Typography variant="h4" >
                  {Products.title}
                </Typography>
                </div>
            
              </Box>
            
            </Grid>
          
            
          ))}
          
        </Grid>
      </>
    )
  } else if (number>3) {
    return (
      <>
        <Grid container className={classes.root} spacing={0} justify="space-evenly" >
          
          {Products.map((Products, index) => (
            
          
            <Grid item xs={12} sm={6} md={3} key={index}>
      
              <Box mt={5}>

                  <div className={classes.grid}>
                    <figure
                      className={classNames(classes.grid, classes.figureEffect)}
                    >
                        <img
                          src={require('../../../assets/imgs/used/' +
                            Products.img +
                            '.jpg').default}
                          alt="Card-img-cap"
                          style={{ width:'100%', height:'auto' }}
                        />
                        <figcaption>
                        <div className={classes.cardText}>
                          <Typography variant="h4" style={{ color: 'white' }} >
                            {Products.description}<br></br>
                            <Link to={`/` + Products.url} style={{textDecoration:'none'}} >
                              <Button className={classes.carouselBtn}  variant="contained" size="small"><Text tid={`Learn more`} /></Button>
                            </Link>
                          </Typography>
                          
                        </div>
                        </figcaption>
                      
                    </figure>
                    
                    <div>
                  
                  </div>
              
                </div> 
                <div className={classes.cardTitle}>
                <Typography variant="h4" >
                  {Products.title}
                </Typography>
                </div>
            
              </Box>
            
            </Grid>
          
            
          ))}
          
        </Grid>
      </>
    )
  } else {
    return (
      <>
        <Grid container className={classes.root} spacing={0} justify="space-evenly" >
          
          {Products.map((Products, index) => (
            
          
            <Grid item xs={12} sm={6} md={5} key={index}>
      
              <Box mt={5}>

                  <div className={classes.grid}>
                    <figure
                      className={classNames(classes.grid, classes.figureEffect)}
                    >
                        <img
                          src={require('../../../assets/imgs/used/' +
                            Products.img +
                            '.jpg').default}
                          alt="Card-img-cap"
                          style={{ width:'100%', height:'auto' }}
                        />
                        <figcaption>
                        <div className={classes.cardText}>
                          <Typography variant="h3">
                          {Products.description}<br></br>
                          <Link to={`/` + Products.url}  style={{textDecoration:'none'}} >
                            <Button className={classes.carouselBtn} variant="contained" size="small"><Text tid={`Learn more`} /></Button>
                          </Link>
                          </Typography>
                          
                        </div>
                        </figcaption>
                      
                    </figure>
                    
                    <div>
                  
                  </div>
              
                </div> 
                <div className={classes.cardTitle}>
                <Typography variant="h3" >
                  {Products.title}
                </Typography>
                </div>
            
              </Box>
            
            </Grid>
          
            
          ))}
          
        </Grid>
      </>
    )
  }
}
