import React, {useState, useContext} from 'react'
//core components
import { Grid, Typography, IconButton,
          Card, CardContent,
        } from '@material-ui/core'
// import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
//common components
import Button from '../../../components/common/CustomButtons/Button';
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import { SelectTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import { amountFormat } from '../../../controllers/dataFormat'
import { calculateInsuranceAmount } from '../../../functionalities/CalculateInsurance';
import TooltipInfo from '../../../components/common/TooltipInfo';
// AddOnProduct (Optional plan) 
import AddOnProduct from './AddOnProduct';
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../assets/jss/styles/formStyle'
//logos
import allianzLogo from '../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../assets/imgs/logo/tugo-logo.png'
import blueCrossLogo from '../../../assets/imgs/logo/blueCross-logo.png'
// icon
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import Insurance from '../../../assets/imgs/icons/insurance.svg'
import Add from '../../../assets/imgs/icons/add.svg'
import Support from '../../../assets/imgs/icons/support.svg'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

//setup form style
const useStyles = makeStyles(formStyle)

const ProductSelFamily = (props) => {
    const { values,
        setFieldValue,
        // handleChange
    } = props;

    const classes = useStyles() 

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage
    
    let isMobile = (window.innerWidth < 769);

    const [isOpened, setIsOpened] = useState(false)
    const [isShown, setIsShown] = useState(false)

    // Selection optional Product Modal
    const [openSelectPlan, setOpenSelectPlan] = useState(false);

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


    let isFamilyRate = false;  

    isFamilyRate =  values.insuredPersons.filter(f=>f.eligilbeIns !== 'STUDENT' && 
                                            (f.relationship === 'Primary' || f.relationship === 'Spouse'  || f.relationship === 'Child') && 
                                            f.age < (f.relationship === 'Child'? 22 : 60)  &&
                                            f.tripStartDate.toISOString().slice(0,10) === values.insuredPersons[0].tripStartDate.toISOString().slice(0,10) &&
                                            f.tripEndDate.toISOString().slice(0,10) === values.insuredPersons[0].tripEndDate.toISOString().slice(0,10)
                                            ).length === values.insuredPersons.length
    
    if (isFamilyRate === true){
        values.familyGroup.isSelected = true
        values.familyGroup.selectedCompnayName =  values.application.applicationCompany       

        values.familyGroup.totalPremium =  values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.insuranceAmount), 0)

        // set familyPremium
        const birthDateArray = values.insuredPersons.map(i=>i.birthDate)

        let eldestBirthDate = new Date(Math.min(...birthDateArray))

        const eldest = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === eldestBirthDate.toISOString().slice(0,10))[0].insurancePlans
    
        eldest.forEach(e => {
        if (e.compnayName === 'Allianz' || e.compnayName === 'Tugo'){
            values.familyGroup.familyPremium  = e.insuranceAmount * 2 
        } else if (e.compnayName === 'BlueCross'){
            // get 2nd insured insurance & insurance amount
            const birthDate2ndArray = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) !== eldestBirthDate.toISOString().slice(0,10)).map(i=>i.birthDate)
            let birthDate2nd = new Date(Math.min(...birthDate2ndArray))
    
            const insuraceAmount2nd = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === birthDate2nd.toISOString().slice(0,10))[0]
                                                .insurancePlans.filter(f=>f.compnayName ==='BlueCross')[0].insuranceAmount
    
            values.familyGroup.familyPremium  = e.insuranceAmount  + insuraceAmount2nd
        }
        
        });

        // set family discount
        values.familyGroup.discountPremium = values.familyGroup.totalPremium - values.familyGroup.familyPremium

        // optionplan sub total array
        let optionPlanSubTotal = [];

        return ( 
            <>
                {values.familyGroup.isSelected!==false 
                    ?               
                        values.familyGroup.totalPremium > 0 &&
                        <Grid item container xs={12} sm={12}>  
                            {/* Family plan */}
                            <Grid item container xs={12} sm={12} md={12}>
                                <Card style={{ borderTop: '10px solid #2a2f71', width: isMobile ? '100%':'90%'}}>
                                    <CardContent style={{ padding: isMobile ? '0': '16px' }}>
                                    <Grid item container xs={12}>
                                        <Grid item xs={12} sm={3} style={{ textAlign: !isMobile ? 'left' : 'center', background: !isMobile ? 'none' : '#f9f9f9'}}>
                                                <img
                                                src={values.application.applicationCompany === 'Tugo' 
                                                        ? tugoLogo : values.application.applicationCompany === 'Allianz' 
                                                        ? allianzLogo : values.application.applicationCompany === 'BlueCross'
                                                            ? blueCrossLogo : null}
                                                alt='logo'
                                                style={{width: values.application.applicationCompany === 'Allianz' ? '100px' : values.application.applicationCompany ==='Tugo' ? '110px' : 'auto', height: values.application.applicationCompany ==='BlueCross' ? '70px' : 'auto'}}
                                                />
                                        </Grid>
                                        {/* Plan Name and See more Benefit */}
                                        <Grid item container xs={12} sm={9} justify="center">
                                            <p style={{ fontWeight: '600', fontSize:'16px', marginBottom:'0', textAlign: 'center', padding: isMobile ? '1vh': 'none', width: '100%' }}>
                                                {values.tripDirection === 'InBound'? "Visitor Family Plan" : "Canadian Family Plan"}
                                            </p> 
                                            <IconButton aria-label="view" color="primary" 
                                            onClick={() =>handleOpenPDFViewer('plan',values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName=== values.familyGroup.selectedCompnayName)[0])}
                                            >
                                            <DescriptionIcon />
                                            <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                                <Text tid={'Quote.SeeMoreBenefit'}/>
                                            </Typography>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    </CardContent>
                                    {values.familyGroup.isSelected && 
                                      <>
                                        {/* Coverage */}
                                        <Grid item xs={12} style={{textAlign:'center'}}>
                                            <Grid item xs={12} container justify="center" style={{paddingTop:'2vh', borderTop:'1px solid #eee'}}> 
                                                {values.insuredPersons[0].insurancePlans
                                                    .filter(fp=>fp.compnayName === values.familyGroup.selectedCompnayName)
                                                    .map((insurance, insIndex) => (
                                                        <React.Fragment key={insIndex}>
                                                            <Grid item container xs={12} spacing={1}>
                                                                    {insurance.coverages
                                                                        .filter(f=>f.price_code=== insurance.selectedCoverage)
                                                                        .map((coverage, cIndex)=>(
                                                                            <React.Fragment key={cIndex}>   
                                                                                <Grid item xs={6} md={4}>
                                                                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                                        <Text tid={'Quote.SumInsured'}/>
                                                                                        <TooltipInfo info={<Text tid={'Tooltip.SumInsured'}/>}/>
                                                                                    </span>
                                                                                    {insurance.coverages.length > 1 
                                                                                        ?
                                                                                        <SelectTextFieldSmall
                                                                                            name={`insurance.selectedCoverage`}
                                                                                            style={{width:'100%'}}
                                                                                            defaultValue={insurance.selectedCoverage}
                                                                                            onChange={(e) => {
                                                                                            for (const i in values.insuredPersons) { 
                                                                                                values.insuredPersons[i].insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                                    [0].selectedCoverage = e.currentTarget.value
                                                                                            }
                                                                                            setFieldValue(`insurance.selectedCoverage`, e.currentTarget.value)
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                            values.insuredPersons[0].eligilbeIns !== 'CANADIAN' ?
                                                                                                <>
                                                                                                {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                                                    <option key={coverage.price_code} value={coverage.price_code}>
                                                                                                    {amountFormat(coverage.price_code, 0)}
                                                                                                    </option>
                                                                                                ))}
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                {insurance.coverages.sort((a,b)=> a.price_code - b.price_code).map((coverage) => (
                                                                                                    <option key={coverage.price_code} value={coverage.price_code}>
                                                                                                    {amountFormat(coverage.price_code, 0)}
                                                                                                    </option>
                                                                                                ))[0]}
                                                                                                </>
                                                                                            }
                                                                                        </SelectTextFieldSmall>
                                                                                        :
                                                                                        <Typography color="textSecondary" gutterBottom style={{ marginLeft: '13px' }}>
                                                                                            {amountFormat(insurance.coverages[0].price_code, 0)}
                                                                                        </Typography>
                                                                                    }
                                                                                </Grid>
                                                                                <Grid item xs={6} md={4}>
                                                                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                                                        <Text tid={'Quote.Deductible'}/>
                                                                                        <TooltipInfo info={<Text tid={'Tooltip.Deductible'}/>}/>
                                                                                    </span>
                                                                                    
                                                                                    {coverage.type_deduct.length > 0 
                                                                                        ?                                                            
                                                                                        <SelectTextFieldSmall
                                                                                            name={`insurance.selectedCoverage.deduct`}
                                                                                            style={{width:'100%'}}
                                                                                            value={coverage.deduct ? coverage.deduct : coverage.type_deduct.filter(d => d.default === true)[0].discount}
                                                                                            onChange={(e) => {
                                                                                            for (const i in values.insuredPersons) { 
                                                                                                values.insuredPersons[i].insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                                    [0].coverages.filter(fc=>fc.price_code=== insurance.selectedCoverage)[0].deduct = e.currentTarget.value
                                                                                            }
                                                                                            setFieldValue(`insurance.selectedCoverage.deduct`, e.currentTarget.value)
                                                                                            }}
                                                                                        >
                                                                                            {coverage.type_deduct.sort((a,b)=> a.value - b.value).map((deduct) => (
                                                                                            <option key={deduct.price_code} value={deduct.discount}>
                                                                                                {amountFormat(deduct.lable, 0)}
                                                                                            </option>
                                                                                            ))}
                                                                                        </SelectTextFieldSmall>
                                                                                        :
                                                                                        <Typography color="textSecondary" gutterBottom style={{ padding: '1.5vh' }}>
                                                                                        $0.00
                                                                                        </Typography>
                                                                                    }

                                                                                    {values.insuredPersons.map((person, i) => (
                                                                                      <div key={i} style={{ display: 'none' }}>
                                                                                        {/* selectedDeduct */}
                                                                                        {person.insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                                [0].selectedDeduct = (coverage.deduct 
                                                                                                                        ? coverage.type_deduct.filter(d => d.discount === parseFloat(coverage.deduct)).map(i => i.value) 
                                                                                                                        : coverage.type_deduct&&
                                                                                                                          coverage.type_deduct.filter(d => d.default === true).map(i => i.value)) }
                                                                                        {/* calculatedDeductAmount */}
                                                                                        {person.insurancePlans.filter(f=>f.compnayName===insurance.compnayName)
                                                                                                [0].calculatedDeductAmount = (coverage.calculate_rate === 'D'
                                                                                                                              ? (coverage.value * person.tripPeriod * coverage.deduct)
                                                                                                                              : (coverage.value * 1 * coverage.deduct))}                                  
                                                                                      </div>
                                                                                      ))
                                                                                    }
                                                                                    
                                                                                </Grid>
                                                                                <Grid item xs={12} md={4} style={{textAlign:'center', marginTop: isMobile ? '2vh' : '0', borderTop: isMobile ? '1px solid #efefef' : '0', paddingTop: isMobile ? '2vh' : '0' }}>
                                                                                    <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                                                        <Text tid={'Quote.Premium'}/>
                                                                                    </Typography>
                                                                                    <Typography variant="body2" style={{color:'#1261C9', fontWeight:'700', fontSize:'1.2rem'}}>
                                                                                    {amountFormat(values.familyGroup.familyPremium,2)}
                                                                                    </Typography> 
                                                                                    <Typography style={{ fontSize:'14px', fontWeight:'300' }}>
                                                                                        <Text tid={'Quote.CoveredPeriod'}/> {values.insuredPersons[0].tripPeriod} <Text tid={'Quote.Days'}/>
                                                                                        {/* multi trip days */}
                                                                                        {values.insuredPersons[0].multiTripDays > 0 && (
                                                                                            <>
                                                                                            <br/>
                                                                                            {/* Multi Trip for {coverage.trip_length_max} days */}
                                                                                            <Text tid={'Quote.MultiTripDays'}/> {coverage.trip_length_max} <Text tid={'Quote.Days'}/>
                                                                                            </>
                                                                                        )}
                                                                                    </Typography> 
                                                                                </Grid>
                                                                            </React.Fragment>
                                                                ))}
                                                            </Grid>
                                                        </React.Fragment>

                                                ))}
                                            </Grid>
                                        </Grid>
                                      </>
                                    }

                                    <div style={{ display: 'none' }}>
                                    {calculateInsuranceAmount(values)}
                                    </div>

                                    <Grid item container xs={12} sm={12} style={{ textAlign: isMobile ? 'center': 'right', padding: '1vh', marginTop:'2vh', borderTop:'1px solid #efefef' }}>
                                        <Grid item xs={12}>
                                            <IconButton aria-label="view" color="primary" 
                                                style={{ borderRadius:'0', padding:'0' }}
                                                onClick={() => setIsShown(!isShown)}
                                            >
                                            {!isShown ?     
                                                <ExpandMoreIcon />
                                                :<ExpandLessIcon/>
                                            }
                                            <Typography variant="body2"  style={{ fontSize: isMobile ? '12px':'14px', fontWeight: '600', marginRight: isMobile ? '0' : '3vh'  }}>
                                                <Text tid={'TravelApplication.Product.SummaryDetail'}/>
                                            </Typography>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                
                                    { isShown ? 
                                        <Grid item container xs={12} justify="center" style={{ padding:'2vh 1vh', background:'#efefef' }}>
                                            <Grid item container xs={12} sm={12} md={10} style={{ marginBottom:'1vh' }}>
                                                <Grid item xs={ isMobile ? 8 : 9 }>
                                                    <Typography variant="body2" color="primary">
                                                        <Text tid={'Quote.RegularPremium'}/>
                                                        <TooltipInfo info={<Text tid={'Tooltip.RegularPremium'}/>}/>
                                                    </Typography>  
                                                </Grid>
                                                <Grid item xs={ isMobile ? 4 : 3 } style={{textAlign:'right'}}>
                                                    <Typography variant="body2" color="primary">
                                                    {amountFormat(values.familyGroup.totalPremium,2)}
                                                    </Typography>  
                                                </Grid>
                                            </Grid>

                                            <Grid item container xs={12} sm={12} md={10} style={{ borderBottom:'1px solid #bbb', paddingBottom:'1vh'}}>
                                                <Grid item xs={isMobile ? 8 : 9}>
                                                    <Typography variant="body2" style={{color:'red'}}>
                                                        <Text tid={'Quote.FamilyDiscountAmount'}/>
                                                        <TooltipInfo info={<Text tid={'Tooltip.FamilyDiscountAmount'}/>}/>
                                                    </Typography>  
                                                </Grid>
                                                <Grid item xs={isMobile ? 4 : 3} style={{textAlign:'right'}}>
                                                    <Typography variant="body2" style={{color:'red'}}>
                                                        - {amountFormat(values.familyGroup.discountPremium,2)}
                                                    </Typography>  
                                                </Grid>
                                            </Grid>

                                            
                                            <Grid item container xs={12} sm={12} md={10} style={{ borderTop:'1px solid #eee', paddingTop:'1vh' }}>
                                                <Grid item xs={isMobile ? 8 : 9} style={{ alignSelf:'center'}}>
                                                    <Typography variant="body2" style={{color:'#1261C9'}}>
                                                        <Text tid={'Quote.FamilyPlanPremium'}/>
                                                        <TooltipInfo info={<Text tid={'Tooltip.FamilyPlanPremium'}/>}/>
                                                    </Typography>  
                                                </Grid>
                                                <Grid item xs={isMobile ? 4 : 3} style={{textAlign:'right'}}>
                                                    <Typography variant="body2" style={{color:'#1261C9', fontWeight:'700', fontSize:'1.2rem'}}>
                                                    {amountFormat(values.familyGroup.familyPremium,2)}
                                                    </Typography>  
                                                </Grid>
                                            </Grid>
    {/* 
                                            <Grid item container xs={12} sm={12} justify="center" style={{ marginTop:'3vh' }}>
                                                <IconButton aria-label="view" color="primary" 
                                                onClick={() =>handleOpenPDFViewer('plan',values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName=== values.familyGroup.selectedCompnayName)[0])}
                                                >
                                                <DescriptionIcon />
                                                <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                                    <Text tid={'Quote.SeeMoreBenefit'}/>
                                                </Typography>
                                                </IconButton>
                                            </Grid> */}

                                        </Grid>
                                    :null }
                                   
                                </Card>
                            </Grid>

                            {/* Optional plan  */}
                            {/* Add optional plan btn */}
                            <Grid item xs={12} sm={12} >
                                <Grid container style={{ marginTop: '2vh', width: isMobile ? '100%' : '90%'}}>
                                    {values.insuredPersons[0].optionalAddOnPlans.find(f=>f.compnayName === values.familyGroup.selectedCompnayName) &&
                                        <Button
                                            color= 'dark'
                                            onClick={() => {setOpenSelectPlan(true)}}
                                            style={{ width: '100%', fontSize:'14px' }}
                                            >
                                                <AddCircleOutlineIcon/>
                                                <Text tid={'Add Optional Plan'}/>
                                        </Button>
                                    }
                                </Grid>   
                            </Grid>

                            {/* Physical Card  */}
                            {/* <Grid item xs={12} sm={12}>
                                <Grid container justify="center" style={{ marginTop: '2vh', width: isMobile ? '100%' : '90%'}}>
                                    <Grid item container spacing={3} style={{ 
                                        alignItems: 'center', 
                                        backgroundColor: 'white', 
                                        padding:!isMobile ? 0 : '3px', 
                                        border: !isMobile ? 'none' : '1px solid #ddd', 
                                        margin: !isMobile ? '1vh 0' : '1px',
                                        marginTop: !isMobile ? '1vh' : '2vh'
                                        }}>
                                        
                                        <Grid item xs={12} sm={12} md={8} lg={6}>
                                            <Typography variant="h5" style={{ fontWeight:'600' }}>
                                                <Text tid={'Quote.PhysicalCard'}/>
                                                <TooltipInfo info={<Text tid={'Tooltip.PhysicalCard'}/>}/>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={4} lg={6}>
                                            <ToggleButtonGroup
                                                name={`insuredPersons.${0}.physicalCard`}
                                                value={values.insuredPersons[0].physicalCard}
                                                exclusive
                                                style={{ width:'100%' }}
                                                onChange={(e) => {
                                                    const val = e.currentTarget.value === 'true' ? true : false
                                                    for (const i in values.insuredPersons) { 
                                                      values.insuredPersons[i].physicalCard = val
                                                      if (val === true){
                                                          values.insuredPersons[i].physicalCardFee 
                                                              = (parseFloat(values.insuredPersons[i].selectedPlan.insuranceAmount) < 114 ? 7.99 :0)
                                                      }else{
                                                          values.insuredPersons[i].physicalCardFee = 0
                                                      }
                                                    }
                                                    setFieldValue(`insuredPersons.${0}.physicalCard`, val)
                                                }}
                                            >
                                                <ToggleButton value={true} className={classes.toggleButton}>
                                                    <Text tid={'Button.Yes'}/>
                                                </ToggleButton>
                                                <ToggleButton value={false} className={classes.toggleButton}>
                                                    <Text tid={'Button.No'}/>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>

                                      </Grid>
                                </Grid>
                            </Grid> */}

                            {/* Summary detail  */}
                            <Grid item container xs={12} sm={12} md={12}>
                                    {/* You selected */}
                                    {values.insuredPersons.filter(i=>i.selectedPlan && i.selectedPlan.compnayName).length === values.insuredPersons.length && (
                                      <>
                                        <Grid item container xs={12} sm={12} md={12} >
                                            <Card style={{ textAlign: 'left', background:'#f9f9f9', borderRadius:'0', boxShadow:'none', marginTop:'1vh', width: isMobile ? '100%' : '90%'}}>
                                                <CardContent className={classes.cardContentBox}>
                                                    
                                                    <Grid item container xs={12} sm={12} justify="center" style={{ paddingBottom: isOpened ? '2vh' : '0', fontWeight:'600' }}>
                                                        <Grid item container xs={12} sm={6}>
                                                            <Text tid={'TravelApplication.Product.SummaryTitle'}/>
                                                        </Grid>
                                                        <Grid item container xs={12} sm={6} style={{ textAlign: 'right', padding: isMobile ? '0':'1vh', paddingBottom: isMobile ? '1vh' : '1vh' }}>
                                                            <Grid item xs={12}>
                                                                <IconButton aria-label="view" color="primary" 
                                                                 style={{ borderRadius:'0', padding:'0' }}
                                                                    onClick={() => setIsOpened(!isOpened)}
                                                                >
                                                                {!isOpened ?     
                                                                    <ExpandMoreIcon />
                                                                    :<ExpandLessIcon/>
                                                                }
                                                                <Typography variant="body2"  style={{ fontSize: isMobile ? '12px':'14px', fontWeight: '600', paddingLeft:'5px'  }}>
                                                                    <Text tid={'TravelApplication.Product.SummaryDetail'}/>
                                                                </Typography>
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    {isOpened ? 
                                                    <>
                                                    <Grid item container>
                                                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                            <Typography className={classes.title2} color="secondary" gutterBottom>
                                                            <img
                                                                src={Insurance}
                                                                alt="Insurance icon"
                                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                            />
                                                                <Text tid={'Quote.RegularPremium'}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                            <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.insuranceAmount), 0),2)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item container>
                                                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                            <Typography className={classes.title2} color="secondary" gutterBottom>
                                                              <img
                                                                  src={Insurance}
                                                                  alt="Insurance icon"
                                                                  style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                              />
                                                              <Text tid={'Quote.FamilyDiscountAmount'}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                            <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                              {amountFormat(values.familyGroup.discountPremium,2)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item container>
                                                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                            <Typography className={classes.title2} color="secondary" gutterBottom>
                                                              <img
                                                                  src={Insurance}
                                                                  alt="Insurance icon"
                                                                  style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                              />
                                                              <Text tid={'Quote.FamilyPlanPremium'}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                            <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                {amountFormat(values.familyGroup.familyPremium,2)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                   
                                                    
                                                    <Grid item container>
                                                      <div style={{ display: 'none' }}>
                                                        {values.insuredPersons
                                                                      .map( i => i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName) 
                                                                                  ? i.optionalAddOnPlans.find(plan => plan.compnayName === i.selectedPlan.compnayName)
                                                                                                          .planTypes.filter(pt => pt.isSelected === true)
                                                                                                                    .map((pt) => ( optionPlanSubTotal.push({name : pt.planName,  
                                                                                                                                              nameKr : pt.planNameKr,
                                                                                                                                              premium: parseFloat(pt.calculatedAddOnAmount)
                                                                                                                                          })))
                                                                                  :null
                                                                      )
                                                        }
                                                      </div>
                                                    

                                                      {optionPlanSubTotal && 
                                                        optionPlanSubTotal.reduce((total, val)=>{
                                                            let foundItemIndex = total.findIndex((obj)=>obj.name === val.name);
                                                            if(foundItemIndex < 0) total.push(val) 
                                                            else total[foundItemIndex].premium += parseFloat(val.premium);
                                                            return total;
                                                            }, []).map((i, index)=> (
                                                                    <React.Fragment key={index}>
                                                                      <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                                        <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                          <img
                                                                          src={Add}
                                                                          alt="Add icon"
                                                                          style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                          />
                                                                          {(currentLanguage === 'ko' ? (i.nameKr? i.nameKr: i.name) : i.name)}
                                                                        </Typography>
                                                                      </Grid>
                                                                      <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                                        <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                          {amountFormat(i.premium)}
                                                                        </Typography>  
                                                                      </Grid>
                                                                    </React.Fragment>
                                                            ))
                                                      }
                                                    </Grid>
                                                    

                                                    {values.insuredPersons[0].physicalCard && (
                                                        <>
                                                        <Grid item container>
                                                            <Grid item xs={9}>
                                                                <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                <img
                                                                    src={Add}
                                                                    alt="Add icon"
                                                                    style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                />
                                                                    <Text tid={'TravelApplication.PhysicalCardFee'}/>
                                                                    <TooltipInfo info={<Text tid={'TravelApplication.PhysicalCardFee.Free'}/>}/>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                                <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.physicalCardFee), 0),2)}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        </>
                                                    )}

                                                    {values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.optionalCarewellService.isSelected === true ?v.optionalCarewellService.packageAmount:0), 0) > 0 &&
                                                    <Grid item container>
                                                        <Grid item xs={9} style={{ marginBottom:'0.5vh' }}>
                                                            <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                <img
                                                                src={Support}
                                                                alt="Insurance icon"
                                                                style={{marginRight:'10px', paddingBottom:'3px'}} 
                                                                />
                                                                <Text tid={'CarewellServices'}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} style={{ marginBottom:'0.5vh', textAlign:'right' }}>
                                                        
                                                            <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                                                {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.optionalCarewellService.isSelected === true ?v.optionalCarewellService.packageAmount:0), 0),2)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    }

                                                    </>:null}
                                                
                                                    <Grid item container xs={12} style={{color:'#3f51b5', background:'#fff', padding:'1.5vh', marginTop: isMobile ? '0':'2vh'}}>
                                                       {/* Total Premium  */}
                                                        <div style={{ display: 'none' }}>
                                                          {values.insuredPersons.map(person => (
                                                              person.selectedPlan.calculatedInsuranceAmount = person.selectedPlan.insuranceAmount
                                                                      + (person.optionalAddOnPlans
                                                                                .find(plan => plan.compnayName === person.selectedPlan.compnayName)
                                                                          ? person.optionalAddOnPlans
                                                                                .find(plan => plan.compnayName === person.selectedPlan.compnayName).planTypes
                                                                                .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                                                          :0)
                                                                      + parseFloat(person.physicalCardFee)
                                                                      + (person.optionalCarewellService.isSelected ? person.optionalCarewellService.packageAmount : 0)
                                                            ))
                                                          }
                                                        </div>
                                                        <Grid item xs={12} sm={4}>
                                                            <span style={{fontWeight:400, fontSize:'14px', color:'#000000DE'}}>
                                                            <Text tid={'TravelApplication.YourTotal'}/> : 
                                                            </span>
                                                        </Grid>
                                                        <Grid item xs={12} sm={8} style={{ textAlign:'right', fontWeight:'600', fontSize:'18px' }}>
                                                            <span>
                                                            {amountFormat(values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium,2)}
                                                            </span>
                                                        </Grid>
                                                    </Grid>

                                                    
                                                </CardContent>
                                            </Card>
                                        </Grid>  
                                      </>)
                                    }

                            </Grid>

                            {/* PDF Viewer Modal  */}
                            {
                              openPDFViewer === true &&
                              <PDFViewer
                                title={pdfOption.title}
                                pdf={pdfOption.brochures_url} 
                                openPDFViewer={openPDFViewer}
                                setOpenPDFViewer={setOpenPDFViewer}
                              />
                            }

                            {/*  Add On Plan Modal*/}
                            {
                                openSelectPlan === true &&
                                <AddOnProduct
                                    openSelectPlan={openSelectPlan}
                                    setOpenSelectPlan={setOpenSelectPlan}
                                    applyType={'family'}
                                    personInfo={{ person : values.insuredPersons[0],
                                        personIndex : 0}}
                                    values={values}
                                    // handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    currentLanguage={currentLanguage}
                                />
                            }

                        </Grid>
                                
                    : null
                }
            </>
        )
    
    }else{
        // reset
        values.familyGroup = { 
            isSelected: '', 
            selectedCompnayName: '',
            totalPremium: 0,
            discountPremium: 0,
            familyPremium: 0
        }

        return null
    }

}

export default ProductSelFamily;