import React, { useEffect, useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import { Link } from 'react-router-dom'
//common components
import Typography from '@material-ui/core/Typography'
// import Hidden from '@material-ui/core/Hidden'
//components
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import Button from '../../../components/common/CustomButtons/Button'

//style
import featuresStyle from '../../../assets/jss/styles/featuresStyle'
import { Card, CardContent  } from '@mui/material';


const useStyles = makeStyles(featuresStyle)

export default function Benefits(props) {

  const { title, subTitle, benefitsDescriptions, buttonTitle, cardTitle, cardContents } = props

  const classes = useStyles()

  const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    
    let isMobile = (width < 769);
  
  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // set userLanguage if url incluede /language
  // const { userLanguage, userLanguageChange } = useContext(LanguageContext)


  // brochures
  const company = 'Tugo'

  const brochures = [
    {company:'Allianz',
      documents: [{"language" : "EN", "document_url" : "Brochures/Allianz-International-Student-English.pdf"}, 
                  {"language" : "KO", "document_url" : "Brochures/Allianz-International-Student-Korean.pdf"}, 
                  {"language" : "AR", "document_url" : "Brochures/Allianz-International-Student-Arabic.pdf"}, 
                  {"language" : "CH_S", "document_url" : "Brochures/Allianz-International-Student-Chinese(Simplified).pdf"}, 
                  {"language" : "CH_T", "document_url" : "Brochures/Allianz-International-Student-Chinese(Traditional).pdf"}, 
                  {"language" : "PT_BR", "document_url" : "Brochures/Allianz-International-Student-Portuguese(Brazil).pdf"}, 
                  {"language" : "ES", "document_url" : "Brochures/Allianz-International-Student-Spanish.pdf"}]
    },
    {company:'Tugo',
      documents: [{"language" : "EN", "document_url" : "Brochures/Tugo-International-Student-English.pdf"}, 
                  {"language" : "KO", "document_url" : "Brochures/Tugo-International-Student-Korean.pdf"}, 
                  {"language" : "AR", "document_url" : "Brochures/Tugo-International-Student-Arabic.pdf"}, 
                  {"language" : "CH_S", "document_url" : "Brochures/Tugo-International-Student-Chinese(Simplified).pdf"}, 
                  {"language" : "JA", "document_url" : "Brochures/Tugo-International-Student-Japanese.pdf"}, 
                  {"language" : "ES", "document_url" : "Brochures/Tugo-International-Student-Spanish.pdf"}]
    }
  ]

  return (
    <>
      <Typography variant="h2">
        <div className={classes.adSectionTitle}>
          <h3 className={classes.subTitle} style={{ fontSize:'1rem', padding:'0' }}><Text tid={subTitle} /></h3>
          <Text tid={title} />
        </div>
      </Typography>

        <Grid container>

            {/* Right Information */}
            <Grid item container xs={12} md={6} style={{ margin:'3vh 0', paddingRight: isMobile? '0':'10vh' }}> 
              <Grid item container>
                  {benefitsDescriptions.map((des, index) => (
                    <Typography variant="body1" gutterBottom key={index} style={{ margin: '1vh 2vh 2vh 0'}}>
                      {des.value}
                    </Typography>
                  ))} 
              </Grid>  
                <Button 
                  className={classes.carouselBtn} 
                  style={{ height:'fit-content' }}
                  onClick={() => {
                    let url = ''
                      const companyBrochure = brochures.filter(f => f.company.toLowerCase() === company.toLowerCase())
                      if (companyBrochure.length>0){
                        const brochure = companyBrochure[0].documents.filter(f => f.language === currentLanguage.toUpperCase())
                        if (brochure.length>0){
                          url = process.env.REACT_APP_S3_URL + brochure[0].document_url
                        }else{
                          const enBrochure = companyBrochure[0].documents.filter(f => f.language === 'EN')
                          if (enBrochure.length>0){
                            url = process.env.REACT_APP_S3_URL + enBrochure[0].document_url
                          }
                        }
                      }
                    window.open(url, '_blank')
                  }}
                >
                <Text tid={ buttonTitle ? buttonTitle : `See Benefits Detail`} />
                </Button>

            </Grid>

            {/* Left Card Information */}
            <Grid item container xs={12} md={6}>
                <Grid item container xs={12} style={{ marginTop:'4vh', fontSize:'18px', color: '#2a2f71', fontWeight: '700', marginBottom:'2vh'}}>
                    <div><Text tid={ cardTitle ? cardTitle : `Top 4 Benefits Most Used`} /></div>
                </Grid>
                {cardContents.map((con, index) => (
                  <Grid item key={index} xs={12} sm={12} md={6}>
                    <Card sx={{ minWidth: 240, height: isMobile? 'fit-content':'35vh', margin:'5px', borderTop:'5px solid #92BD01' }}>
                    <CardContent style={{ textAlign:'center', padding: isMobile ? '3vh':'5vh 2vh' }}>
                        <div style={{ fontSize:'20px', fontWeight:'500', lineHeight:'30px', color:'#2a2f71'}}>
                            {con.title}
                        </div>
                        <div style={{ fontSize: isMobile ? '14px':'16px', marginTop: '1vh', fontWeight:'300' }}>
                            {con.value}
                        </div>
                    </CardContent>
                    </Card>
                  </Grid>
                ))}       
            </Grid>

        </Grid>

    </>
  )
}