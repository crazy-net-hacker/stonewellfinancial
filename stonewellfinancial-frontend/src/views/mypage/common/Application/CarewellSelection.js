import React, { useState, useContext } from 'react'
import { PropTypes } from 'prop-types'
import { Formik, Form } from 'formik'
//
import { makeStyles, Grid, Box,
  TableContainer, Table, TableBody, TableCell,TableHead,TableRow, Typography
} from '@material-ui/core'
//common components
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider'
import Button from '../../../../components/common/CustomButtons/Button'
import PremiumSummary from './PremiumSummary'
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
//
import { amountFormat } from '../../../../controllers/dataFormat'
import { calculatePackageAmount } from '../../../../controllers/CalculateValue';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'
//icons
// import { CgChevronRightO } from "react-icons/cg";
//logos
import carewellLogo from '../../../../assets/imgs/logo/carewell-logo.png'

const useStyles = makeStyles(vendorFormStyle)

const carewellService = [
  { name: 'Package', dayValue: 0.6, yearValue: 99, minValue: 79, boundType:['InBound', 'OutBound'] },
  { name: 'Package + Plus', dayValue: 1.4, yearValue: 299, minValue: 199, boundType:['InBound'] }
]

const ProductSelection = ({ formData, setFormData, nextStep, prevStep }) => {
  const classes = useStyles()
  const [direction, setDirection] = useState('back')

  //current language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
    let url = ''
    if (kind === 'plan'){
      if (insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase())).length > 0){
            url = process.env.REACT_APP_S3_URL + insurance.coverages[0].documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))[0].document_url
      }
    } else if (kind === 'carewell') {
      // set carewell brochure url
      if(currentLanguage==='ko'){
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-Korean.pdf'
      }else{
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-English.pdf'
      } 
    } else
    {
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : kind === 'plan'? `${insurance.coverages[0].compnay_name}  ${insurance.coverages[0].generic_name}` : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }

  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={(values) => {
          setFormData(values)
          direction === 'back' ? prevStep() : nextStep()
        }}
      >
        {({ values, setFieldValue }) => (
          <Form style={{ width:'100%' }}>
            <TableContainer className={classes.table_container}>

              <Table style={{ tableLayout: 'auto', border:'1px solid #ddd' }}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cell_title}>
                      <Text tid={'Vendor.Step3.AddServices'}/> 
                      {/* optionalCarewellService */}
                      {values.insuredPersons.filter(f=>f.selectedWhenSave&&f.selectedWhenSave.carewellService&&f.selectedWhenSave.carewellService.isSelected).length > 0 &&
                        values.insuredPersons.filter(f=>f.optionalCarewellService.isSelected).length === 0 &&
                        <Button
                          id='getSelectedPlan'
                          onClick = {()=>{
                              values.insuredPersons.forEach((person, index) => {
                                if (person.selectedWhenSave && person.selectedWhenSave.carewellService && person.selectedWhenSave.carewellService.isSelected){
                                  const selectedCarewell = person.selectedWhenSave.carewellService.packageName
                                  document.getElementById(`${selectedCarewell}_${index}_button`).click()
                                }
                              });
                          }}
                        >
                          선택된 패키지 불러오기
                        </Button>    
                    }
                    </TableCell>         
                    {values.insuredPersons.map((column, index) => (
                      <TableCell key={index} className={classes.cell_applicant}>
                        {column.lastName}, {column.firstName} 
                        {index !== 0 && values.insuredType==='Student' && values.insuredGroupType==='Individual' ? ( 
                        <div className={classes.cell_applicant_age}>{column.relationship}, {column.age} yrs</div>
                        ):(
                          <div className={classes.cell_applicant_age}>{column.age} yrs</div>
                        )}
                        </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>                           
                  {carewellService
                    .map((c)=> ({name: c.name, numIncludedType: c.boundType.filter(f => f === values.tripDirection).length}))
                                        .filter( i => i.numIncludedType > 0)
                                        .map(carewell => (
                                              <TableRow key={carewell.name}>
                                                {/* Plan Row */}
                                                <TableCell>
                                                  <Grid item xs={12} className={classes.row_title}>
                                                    {/* Product Name */}
                                                    <Grid item container style={{ marginBottom:'10px' }}>
                                                      <Grid item xs={12} sm={12} md={2}>
                                                        <img
                                                          src={carewellLogo}
                                                          alt='logo'
                                                          style={{ width: '90%'}}
                                                        />
                                                      </Grid>
                                                      <Grid item xs={12} sm={12} md={10} style={{ alignSelf: 'center'}}>
                                                        {carewell.name}
                                                      </Grid>
                                                    </Grid>

                                                    {/* Brochure */}
                                                    <Grid item xs={12} sm={12} md={6}>
                                                      <Button 
                                                        color="secondary"
                                                        size="sm"
                                                        // style={{ borderRadius:'0'}} 
                                                        onClick={() => {
                                                          handleOpenPDFViewer('carewell', values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName=== values.familyGroup.selectedCompnayName)[0])
                                                        }}
                                                      >
                                                        <Text tid={'Vendor.Step2.Brochure'} />
                                                      </Button>
                                                    </Grid>
                                                  {/* <div className={classes.subButton} style={{marginTop:'5px'}}><CgChevronRightO/> Benefit Summary</div> */}
                                                  {/* <div className={classes.subButton}><CgChevronRightO/> Policy Wording </div> */}
                                                  </Grid>
                                              </TableCell>
                                              {/* optionalCarewellService */}
                                              {values.insuredPersons.map((rowInsuredPerson, colIndex) => (
                                                <TableCell key = {colIndex}>
                                                    <Button
                                                      id = {carewell.name+'_'+colIndex+'_button'}
                                                      className={classes.toggleButtonGroup}
                                                      style={{ border:'1px solid #efefef', background:rowInsuredPerson.optionalCarewellService.packageName === carewell.name && rowInsuredPerson.optionalCarewellService.isSelected === true ? '#3f51b5' : '#FFFFFF' }}
                                                      onClick={() => {
                                                        let prviousPackageName = rowInsuredPerson.optionalCarewellService.isSelected=== false? '': rowInsuredPerson.optionalCarewellService.packageName
                                                        if (prviousPackageName === carewell.name){
                                                                      rowInsuredPerson.optionalCarewellService.isSelected = false
                                                                      rowInsuredPerson.optionalCarewellService.packageName = ''
                                                                      rowInsuredPerson.optionalCarewellService.packageAmount = 0
                                                        }else{
                                                              rowInsuredPerson.optionalCarewellService.isSelected = true
                                                              rowInsuredPerson.optionalCarewellService.packageName = carewell.name
                                                              rowInsuredPerson.optionalCarewellService.packageAmount = calculatePackageAmount(carewellService, carewell.name, rowInsuredPerson.tripPeriod)
                                                        }
                                                        setFieldValue(`rowInsuredPerson.optionalCarewellService.packageName`, carewellService.name)
                                                      }}
                                                    >
                                                      <div>                                  
                                                        <Typography component={'div'} className={classes.toggleButton} 
                                                                    style={{ color:rowInsuredPerson.optionalCarewellService.packageName === carewell.name && rowInsuredPerson.optionalCarewellService.isSelected  === true ? '#fff':'#3f51b5' }}
                                                        >
                                                          {amountFormat((calculatePackageAmount(carewellService, carewell.name, rowInsuredPerson.tripPeriod)), 2)}
                                                          <div className={classes.tripLength}>
                                                            {rowInsuredPerson.tripPeriod} <Text tid={'Quote.Days'}/>
                                                          </div>
                                                        </Typography>
                                                      </div>
                                                    </Button> 
                                                </TableCell>
                                              ))}
                      
                  </TableRow> 
                  ))}
                </TableBody>

              </Table>
            </TableContainer>

            <Grid container>
              <Grid item xs>
                <Box>
                  <Grid container className={classes.premium}>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid
                      item xs={12} sm={6}
                      style={{
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '16px',
                        textAlign:'end',
                        paddingRight: '20px'
                      }}
                    >
                      <Text tid={'Vendor.Step3.TotalCarewellAmount'} />
                      {/* {amountFormat(totalCarewellServicePrice,2)} */}
                      <span style={{ marginLeft:'30px' }}>
                        {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.optionalCarewellService.isSelected === true ?v.optionalCarewellService.packageAmount:0), 0),2)}
                      </span>
                    </Grid>
                    <Grid item xs  style={{  background:'#f9f9f9', marginTop:'2vh' }}>
                      
                      <PremiumSummary values={values} />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Grid container style={{ margin: '5vh 0 5vh 0' }} spacing={1}
                  className={classes.textEnd} >
                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        type="submit" 
                        color="secondary" 
                        className={classes.back_button} 
                        onClick={() => { setDirection('back')}}
                    >
                        <Text tid={'Button.Previous'}/>
                    </Button>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        type='submit' 
                        color="dark" 
                        className={classes.next_button} 
                        onClick={() => {
                          setDirection('forward')
                        }}
                    >
                        <Text tid={'Button.Next'} />
                    </Button>
                  </Grid>
            </Grid>
            {/* PDF Viewer Modal  */}
            {openPDFViewer === true &&
              <PDFViewer
                title={pdfOption.title}
                pdf={pdfOption.brochures_url} 
                openPDFViewer={openPDFViewer}
                setOpenPDFViewer={setOpenPDFViewer}
              />
            }
        </Form>
        
        )}
         
      </Formik>
     
    </>
  )
}

ProductSelection.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
}

export default ProductSelection