import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components
import { Grid, Container, Typography } from '@material-ui/core'
//components (common)
import Banner from '../../../components/common/Banner'
// import { Text } from '../../../components/common/LanguageProvider'


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 2em',
    maxWidth: '1000px',
  },
  greenlineBox: {
    marginTop: '5vh',
    paddingBottom: '1em'
  },
  greenline: {
    width: "2.5rem",
    height: "3px",
    background: "#8EC641",
    display: "inline-block",
    borderRadius: '100px'
  },
  detailContainer: {
    marginBottom: '5vh'
  },
  detail: {
    margin: '2vh 0 2vh'  
  },
}))


// banner Title
const bannerTitle = ['Privacy Policy']

// Breadcrumbs
const links = [
  {
    to: '/',
    name: 'Home'
  },
  {
    to: '/privacy-policy',
    name: 'Privacy Policy'
  },
]  

const privacy = [
  {
    label: '',
    detail: 'Stonewell Financial Services Inc. (“The Company”) is committed to providing safe web sites for visitors of all ages and has implemented this Privacy Policy to demonstrate our firm commitment to your privacy. The Company complies with Canadian Federal and Provincial privacy laws and regulations including the Personal Information and Electronic Documents Act.',
    list: []
  },
  {
    label: '',
    detail: 'The Company, their licensed representatives, employees, directors and officers are committed to respecting the privacy and confidentiality of customers’ information. By “customer” we mean any website visitor that comes to our website; any person that has been referred to our website; anyone who has purchased a policy through the site or by phone; anyone for whom we have come into contact with any personal information for any reason. Personal information refers to any information about an identifiable individual and includes information such as name, address, email address, age, gender, payment card information and health information.',
    list: []
  },
  {
    label: '',
    detail: 'There may be links from our Sites to other web sites. Please note that this Privacy Policy applies only to our Sites and not to web sites of other companies or organizations to which our Sites may be linked. You must check on any linked sites for the privacy policy that applies to that site and/or make any necessary inquiries in respect of that privacy policy with the operator of the linked site. These links to third party websites are provided as a convenience and are for informational purposes only. The Company does not endorse, and is not responsible for, these linked websites.',
    list: []
  },
  {
    label: '',
    detail: 'You may be asked to provide us with personal information when you visit certain sections of our Sites. Your use of our Sites signifies your acknowledgement and consent to our Privacy Policy. If you do not agree to this Privacy Policy, please do not continue to use our Sites. Your continued use of the Sites signifies your acceptance of these terms and any changes in effect at the time of use.',
    list: []
  },
  {
    label: 'COLLECTION OF PERSONAL INFORMATION',
    detail: 'Personal Information is information about you that identifies you as an individual, for example, your name, address, e-mail address, or telephone number. We collect information that you voluntarily provide to us through responses to questionnaires, surveys, search functions, feedback, Quote forms and the like. We may also ask you to provide additional information such as your e-mail address if you want to obtain additional services, information, participate in a contest or to resolve complaints or concerns.',
    list: []
  },
  {
    label: 'DISCLOSURE OF INFORMATION',
    detail: 'The Company may be required by law to disclose customer’s personal information but unless mandated to do so, The Company will never disclose any customer’s personal information with any other outside person, company association or organization except as outlined below in order to perform the natural course of our business – collecting customer’s personal information as their insurance agent and relaying that information to an insurance company of their choice in order to obtain insurance coverage. We only disclose customer’s personal information to our licensed representatives, employees, directors and officers; and to our partnered travel insurance suppliers and service providers. We do not sell, share, trade or provide any of your personal information to others for any purpose.',
    list: []
  },
  {
    label: 'USES OF PERSONAL INFORMATION',
    detail: 'In addition to those uses described above, Customer’s personal information may be collect, stored and used for the following purposes:',
    list: [
      {detail:'To understand customer needs and assess the suitability of insurance products offered'}, 
      {detail:'To assess customer insurability'},
      {detail:'To administer all transactions such as quote requests, payments and policy delivery'},
      {detail:'To determine insurance premiums'},
      {detail:'To provide you with assistance and customer service'},
      {detail:'To identify and mitigate potential risks or losses including fraud'},
      {detail:'To conduct customer research'},
      {detail:'To meet our legal and regulatory obligations'},
    ]
  },
  {
    label: 'RETENTION OF INFORMATION',
    detail: 'We only keep customer information in our records for as long as it is needed for the identified purposes. Information that is no longer required will be destroyed, erased or made anonymous.',
    list: []
  },
  {
    label: 'PROMOTIONAL AND INFORMATIONAL OFFERS',
    detail: 'With the permission of an online visitor, information submitted at the time of registration or submission may be used for marketing and promotional purposes by the Company. If a visitor objects to such use for any reason, he/she may prevent that use, by e-mail request. The Company uses reasonable efforts to maintain visitors’ information in a secure environment. If you have submitted personal information and want to change it or opt-out, please contact us as info@stonewellfinancial.com.',
    list: []
  },
]


export default function PrivacyPolicy() { 
  const classes = useStyles()

  return (
    <>
      <Banner title={bannerTitle} links={links} quote_url= '' />
      <Container className={classes.root}>
        <div className={classes.greenlineBox}>
          <span className={classes.greenline}></span>
        </div>

        <Grid container item xs className={classes.detailContainer} >
        
          {privacy.map((p, index)=> (
            <div key={index} >
              {p.label && (
                <>
                  <div className={classes.greenlineBox}>
                    <span className={classes.greenline}></span>
                  </div>
                            
                  <Typography variant="h4">
                    {/* <Text tid={} /> */}
                    {p.label}
                  </Typography >
                </>
              )}

              <Typography variant="body1" className={classes.detail}>
                {/* <Text tid={} /> */}
                {p.detail}
              </Typography>
              
              {p.list &&
                <ul>
                  {p.list.map((list, listIndex) =>(
                    <li key={listIndex}>
                      <Typography variant="body1" > 
                        {/* <Text tid={} /> */}
                        {list.detail}
                      </Typography>
                    </li>
                  ) )}
                </ul>
              }
            </div>            
          ))}
        
        </Grid>

      </Container>

    </>
  )
}
