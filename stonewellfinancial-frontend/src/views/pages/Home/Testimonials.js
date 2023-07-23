import React from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import GridContainer from '../../../components/common/Grid/GridContainer'
import GridItem from '../../../components/common/Grid/GridItem.js'
import Card from '../../../components/common/Card/Card.js'
import CardBody from '../../../components/common/Card/CardBody.js'
import CardAvatar from '../../../components/common/Card/CardAvatar.js'
// import Muted from '../../../components/common/Typography/Muted.js'

// import testimonialsStyle from "../../../assets/jss/styles/testimonialsStyle";
// import cardProfile1Square from "../../../assets/img/faces/card-profile1-square.jpg";

// import cardProfile4Square from "../../../assets/img/faces/card-profile4-square.jpg";
// import cardProfile6Square from "../../../assets/img/faces/card-profile6-square.jpg";

//const useStyles = makeStyles(testimonialsStyle)
const useStyles = makeStyles()

export default function Testimonials({ ...rest }) {
  const classes = useStyles()
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: false,
  // };
  return (
    <div className="cd-section" {...rest}>
      <div className={classes.testimonials}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={6}
              md={6}
              className={
                classes.mlAuto + ' ' + classes.mrAuto + ' ' + classes.textCenter
              }
            ></GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    {/* <img src={cardProfile1Square} alt="..." /> */}
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Mike Andrew</h4>
                  {/* <Muted> */}
                  <h6>Critical illness Insurance</h6>
                  {/* </Muted> */}
                  <h5 className={classes.cardDescription}>
                    {'"'}Seven years ago, I purchased Critical illness insurance
                    at an affordable premium at the recommendation of a
                    Stonewell . Thanks to signing up at that time, I was able to
                    focus on treatment when unfortunated thing happened this
                    time.{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    {/* <img src={cardProfile4Square} alt="..." /> */}
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Tina Thompson</h4>
                  {/* <Muted> */}
                  <h6>Group Benefits</h6>
                  {/* </Muted> */}
                  <h5 className={classes.cardDescription}>
                    {'"'}I got group insurance quotes from several insurance
                    companies, but Stonewell did the most custom design. I
                    believe that I am lucky to be able to manage our group
                    insurance in Stonewell.{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    {/* <img src={cardProfile6Square} alt="..." /> */}
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Gina West</h4>
                  {/* <Muted> */}
                  <h6>Travel Insurance</h6>
                  {/* </Muted> */}
                  <h5 className={classes.cardDescription}>
                    {'"'}I{"'"} didn't have to pay about $30,000 in medical
                    bills in the emergency room. This is because the insurance
                    company paid the premium directly to the hospital.{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  )
}
