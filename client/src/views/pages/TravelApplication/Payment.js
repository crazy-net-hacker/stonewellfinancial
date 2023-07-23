import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core'
//core components
import { Grid,Typography, IconButton, TextField} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import InputMask from 'react-input-mask'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
//common components
import { Text, LanguageContext } from "../../../components/common/LanguageProvider"; 
import { RegularTextFieldSmall } from '../../../components/common/CustomTextFields/TextFieldSmall'
import Button from '../../../components/common/CustomButtons/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
// functionalities
import { amountFormat } from '../../../controllers/dataFormat'
import { calculatePackageAmount } from '../../../controllers/CalculateValue';
import { isMedicalQuestionAnswered } from '../../../functionalities/MedicalQuestion';
// icon
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import Checked from '../../../assets/imgs/icons/checked.svg'
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

//styles
import formStyle from '../../../assets/jss/styles/formStyle'

const useStyles = makeStyles(formStyle)

const carewellService = [
    { name: 'Package', dayValue: 0.6, yearValue: 99, minValue: 79, boundType:['InBound', 'OutBound'] },
    { name: 'Package + Plus', dayValue: 1.4, yearValue: 299, minValue: 199, boundType:['InBound'] }
  ]

export const Payment = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validMessage,
    countries
}) => {

    const classes = useStyles()

    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage


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

    //
  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insurance) => {
    let url = ''
    if (kind === 'carewell') {
      if(currentLanguage==='ko'){
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-Korean.pdf'
      }else{
          url = process.env.REACT_APP_S3_URL + 'Brochures/Stonewell-Carewell-Package-English.pdf'
      } 
    } else {
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }

    // get credit card icon
    function getCrditCardIcon(cardNumber) {
        switch(cardNumber) {
        case '4':
        return <FaCcVisa style={{ marginLeft:'1vh' }} />
        case '5':
        return <FaCcMastercard style={{ marginLeft:'1vh' }} />
        case '3':
        return <FaCcAmex style={{ marginLeft:'1vh' }} />
        default:
        return <CreditCardIcon style={{ marginLeft:'1vh' }} />
        }
    }

    var total = 0

    return (
        <div>
            <Grid container justify='flex-start' style={{ paddingLeft: width > 1400 ? '22vh' : '0', marginTop: width > 1400 ? '-300px' : '0' }}>
                <Grid item container>
                                
                    <Grid  item xs={12} sm={12} md={12} style={{ marginBottom: '2vh' }}>  
                        {/* <span className={classes.spanTitle}>
                            <Text tid={'Quote.Payment'}/> 
                        </span> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} style={{marginBottom:'1vh'}}>
                        <Grid item container spacing={1}>
                            {/* Total Price */}
                            <Grid item xs={12} sm={12} md={12}>
                                {/* total */}
                                <div style={{ display: 'none' }}>
                                    {total = 0}
                                    {values.insuredPersons.map((person, pIndex) => (
                                        <div key={pIndex}>
                                            {person.selectedPlan.calculatedInsuranceAmount = person.selectedPlan.insuranceAmount
                                                    + (person.optionalAddOnPlans
                                                            .find(plan => plan.compnayName === person.selectedPlan.compnayName)
                                                        ? person.optionalAddOnPlans
                                                            .find(plan => plan.compnayName === person.selectedPlan.compnayName).planTypes
                                                            .filter(plan => plan.isSelected === true).reduce((a, v) => a = a + parseFloat(v.calculatedAddOnAmount), 0)
                                                        :0)
                                                    + person.physicalCardFee
                                                    + (person.optionalCarewellService.isSelected ? person.optionalCarewellService.packageAmount : 0)
                                            }
                                        </div>
                                        ))
                                    }
                                    {total = values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium}
                                    
                                </div>
                                {total > 0 ? 
                                <Typography variant="h5" className={classes.titleSmall} style={{ marginBottom: !isMobile ? 0 : '2vh', padding: '2vh', background: '#f9f9f9'}} >
                                    <span style={{ marginRight:'2vh'}}>
                                        <Text tid={'Quote.TotalPaymentAmount'}/> 
                                    </span>
                                    {values.insuredPersons.filter(i=>i.selectedPlan && i.selectedPlan.compnayName).length === values.insuredPersons.length && 
                                        total > 0 && 
                                        values.insuredPersons.filter(f => f.selectedPlan && f.selectedPlan.medicalQuestion && 
                                                                            isMedicalQuestionAnswered(f.age, f.selectedPlan) === false ).length === 0 
                                        ? amountFormat((total ? total : 0), 2) 
                                        : null}
                                </Typography>
                                : null}
                            </Grid> 
                            {values.tripDirection === 'InBound' &&
                                <Grid item container xs={12} spacing={1} style={{ margin: '2vh 0 2vh 0' }} >
                                    <Alert severity='warning'>   
                                    <AlertTitle><Text tid={'Vendor.Step1.CoverageAgreementTitle'}/></AlertTitle>
                                    <ul>
                                        <li><Text tid={'Quote.CoverageAgreement.List.NoIntention'}/></li>
                                        <li><Text tid={'Quote.CoverageAgreement.List.VisaPurpose'}/></li>
                                    </ul>
                                    </Alert>
                                </Grid> 
                            }

                            {/* Optional Carewell Service  */}
                            <Grid item container xs={12} spacing={1} style={{ margin: '2vh 0 2vh 0' }} >
                                <span className={classes.titleSmall_sub}>
                                <Text tid={'Quote.AddCarewellServices'}/>
                                </span>
                            </Grid>
                            <Grid container spacing={2} >
                                {carewellService.map((c)=> ({name: c.name, numIncludedType: c.boundType.filter(f => f === values.tripDirection).length}))
                                                            .filter( i => i.numIncludedType > 0).map(carewell => (
                                <React.Fragment key={carewell.name}>
                                    <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        color={values.insuredPersons[0].optionalCarewellService.packageName === carewell.name && values.insuredPersons[0].optionalCarewellService.isSelected ? 'primary' : "secondary"}
                                        className={classes.button}
                                        style={{padding:'3vh', width:'100%', margin:'1vh 0 0 0'}}
                                        onClick={() => {
                                        let prviousPackageName = values.insuredPersons[0].optionalCarewellService.isSelected=== false? '': values.insuredPersons[0].optionalCarewellService.packageName
                                        if (prviousPackageName === carewell.name){
                                            for (const i in values.insuredPersons) { 
                                                        values.insuredPersons[i].optionalCarewellService.isSelected = false
                                                        values.insuredPersons[i].optionalCarewellService.packageName = ''
                                                        values.insuredPersons[i].optionalCarewellService.packageAmount = 0
                                                    }
                                        }else{
                                            for (const i in values.insuredPersons) { 
                                                values.insuredPersons[i].optionalCarewellService.isSelected = true
                                                values.insuredPersons[i].optionalCarewellService.packageName = carewell.name
                                                values.insuredPersons[i].optionalCarewellService.packageAmount = calculatePackageAmount(carewellService, carewell.name, values.insuredPersons[i].tripPeriod)
                                            }
                                        }
                                        setFieldValue(`values.insuredPersons.${0}.optionalCarewellService.packageName`, carewellService.name)
                                        }}
                                    >
                                        <div>
                                        {values.insuredPersons[0].optionalCarewellService.isSelected &&
                                            values.insuredPersons[0].optionalCarewellService.packageName === carewell.name
                                            ? (<img
                                                    src={Checked}
                                                alt="Selected mark"
                                                style={{marginRight:'15px', paddingBottom:'3px'}} 
                                                />) 
                                            : null }
                                        {carewell.name}
                                        <Typography style={{marginTop:'1vh', fontSize:'20px', fontWeight:'600', color:values.insuredPersons[0].optionalCarewellService.isSelected && values.insuredPersons[0].optionalCarewellService.packageName === carewell.name ?'#eee':'#666'}}>
                                            {amountFormat((calculatePackageAmount(carewellService, carewell.name, values.insuredPersons[0].tripPeriod) * values.insuredPersons.length), 2)}
                                        </Typography>
                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color: values.insuredPersons[0].optionalCarewellService.isSelected && values.insuredPersons[0].optionalCarewellService.packageName === carewell.name ?'#eee':'#666'}}>
                                             {values.insuredPersons.length} {values.insuredPersons.length > 1 ? <Text tid={'People'}/> : <Text tid={'Person'}/>}
                                        </Typography>
                                        <Typography style={{marginTop:'1vh', fontSize:'14px', color: values.insuredPersons[0].optionalCarewellService.isSelected && values.insuredPersons[0].optionalCarewellService.packageName === carewell.name ?'#eee':'#666'}}>
                                            <Text tid={carewell.name==='Package'?'Quote.CarewellPackage.Description':'Quote.CarewellPackagePlus.Description'}/>
                                        </Typography>
                                        </div>
                                    </Button>
                                    <IconButton aria-label="view" color="primary" style={{ borderRadius:'0', width:'100%', marginTop:'1vh', background:'rgb(240, 248, 255)'}}
                                        onClick={() => handleOpenPDFViewer('carewell',values.insuredPersons[0].insurancePlans.filter(f=>f.compnayName=== values.familyGroup.selectedCompnayName)[0])}
                                    >
                                        <DescriptionIcon />
                                        <Typography variant="body2"  style={{ fontSize: '14px', marginLeft: '3px', fontWeight: '600'  }}>
                                            <Text tid={'Quote.SeeMoreBenefit'}/>            
                                        </Typography>
                                    </IconButton>
                                    </Grid>
                                </React.Fragment>
                                ))}
                            </Grid>

                            {/* Select Your Payment Method */}
                            <Grid item xs={12} style={{ marginTop: '5vh', marginBottom:'2vh' }}>  
                                <span className={classes.titleSmall_sub}>
                                    <Text tid={'Quote.SelectPayment'}/> 
                                </span>
                            </Grid>
                            <Grid item xs={12}>
                                <ToggleButtonGroup
                                    className={classes.toggleButtonGroup}
                                    name="paymentMethod"
                                    value={values.paymentMethod}
                                    exclusive
                                    style={{ width: isMobile ? '100%' : '60%' }}
                                    onChange={(e) => {
                                        if (e.currentTarget.value === 'E-transfer'){
                                            values.cardHolderName = ''
                                            values.creditCardNumber = ''
                                            values.cardcvv = ''
                                            values.cardExpired = ''
                                        }else{
                                            values.senderName = ''
                                        }
                                        setFieldValue('paymentMethod', e.currentTarget.value)
                                    }}
                                    >
                                        <ToggleButton value="Creditcard" className={classes.toggleButton}>
                                            <Text tid="Quote.CreditCard"/>
                                        </ToggleButton>
                                        <ToggleButton value="E-transfer" className={classes.toggleButton}>
                                            <Text tid="Quote.E-transfer"/>
                                        </ToggleButton>
                                </ToggleButtonGroup>
                                {validMessage('paymentMethod')}
                            </Grid>

                            {values.paymentMethod ==='E-transfer' && total > 0 &&(
                                <Grid item container spacing={ !isMobile ? 2 : 1 } style={{padding:'2vh 2vh'}}>
                                    <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                            <span className={classes.spanTitle}>
                                                <Text tid={'TravelApplication.EtransferInfo'}/>
                                            </span>
                                            <Alert severity="info" style={{ marginTop:'2vh' }}>
                                                <AlertTitle><Text tid={'Quote.Etransfer.Title'}/></AlertTitle>
                                                <Text tid={'Quote.Etransfer.Description'}/>
                                            </Alert>
                                    </Grid>
                                    <Grid  item container xs={12} sm={12}  md={6} spacing={1} >
                                        <ul style={{ fontSize:'16px', fontWeight:'600'}}>
                                            <li>
                                            <Text tid={'Quote.Email'}></Text> : justin@stonewellfinancial.com
                                            </li>
                                            {/* <li>
                                            <Text tid={'Quote.Recipient'}></Text> : Jeong Kim
                                            </li>   */}
                                            <li>
                                            <Text tid={'Quote.AmountToSend'}></Text> : {amountFormat(total,2)}
                                            </li>                    
                                        </ul>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>   
                                        <RegularTextFieldSmall
                                            name={`senderName`}
                                            type="text"
                                            value={values.senderName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label={'Quote.SenderName'}
                                        />
                                        {validMessage(`senderName`)}
                                    </Grid>
                                </Grid>
                            )}
                            
                            {values.paymentMethod ==='Creditcard' && (
                            <>              
                                <Grid item container spacing={1} style={{padding:'2vh 0'}}>
                                    <Grid  item xs={12} sm={12} md={12} style={{ margin: '2vh 0' }}>  
                                            <span className={classes.spanTitle}>
                                                <Text tid={'TravelApplication.CreditCardInfo'}/>
                                            </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>   
                                        <RegularTextFieldSmall
                                            name={`cardHolderName`}
                                            type="text"
                                            value={values.cardHolderName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label= {'Quote.CardHolderName'}
                                            // style={{ width: '100%' }}
                                        />
                                        {validMessage(`cardHolderName`)}
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>   
                                        <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CreditCardNumber'}/></label>
                                        <InputMask
                                            name={`creditCardNumber`}
                                            mask= {values.creditCardNumber.substr(0,1) === '3'?"9999 999999 99999":"9999 9999 9999 9999" }
                                            value={values.creditCardNumber}
                                            // style={{ width: '100%' }}
                                            onChange={(e, val)=>{
                                            setFieldValue(`creditCardNumber`,e.target.value )
                                            if (values.creditCardNumber){
                                                let cardType = e.target.value.substr(0,1)
                                                if (cardType === '4'){
                                                setFieldValue(`creditCardType`,'Visa')
                                                } else if (cardType === '5'){
                                                setFieldValue(`creditCardType`,'MasterCard')
                                                } else if (cardType === '3'){
                                                setFieldValue(`creditCardType`,'AmericanExpress')
                                                } else {
                                                setFieldValue(`creditCardType`,'' )
                                                }
                                            }
                                        }}                  >
                                            {() => (
                                            <TextField
                                                type="text"
                                                name="creditCardNumber"
                                                variant="outlined"
                                                size="small" 
                                                style={{ width:'100%' }}
                                                InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {getCrditCardIcon(values.creditCardNumber.substr(0,1))}
                                                    </InputAdornment>
                                                ),
                                                }}
                                            />
                                            )}
                                        </InputMask>
                                        {validMessage(`creditCardNumber`)}
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2}>   
                                        <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardCVV'}/></label>
                                        <br/>
                                        <InputMask
                                            name={`cardcvv`}
                                            mask= {values.creditCardNumber.substr(0,1) === '3'?"9999":"999" }
                                            onChange={handleChange}                      
                                            onBlur={handleBlur}
                                            value={values.cardcvv}
                                            >
                                            {() => (
                                                <TextField
                                                type="text"
                                                name="cardcvv"
                                                variant="outlined"
                                                size="small" 
                                                />
                                            )}
                                        </InputMask>
                                        {validMessage(`cardcvv`)}
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={2}>   
                                        <label className={classes.inputLabel_manualForm}><Text tid={'Quote.CardExpiration'}/></label>
                                        <br/>
                                        <InputMask
                                            name={`cardExpired`}
                                            mask="99/99"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cardExpired}
                                            placeholder="MM/YY"
                                            >
                                            {() => (
                                                <TextField
                                                type="text"
                                                name="cardExpired"
                                                variant="outlined"
                                                size="small"
                                                />
                                            )}
                                        </InputMask>
                                        {validMessage(`cardExpired`)}
                                    </Grid>

                                
                                </Grid>
                                
                            </>)}

                        </Grid>
                    </Grid>
                </Grid>

                {values.paymentMethod ==='Creditcard' &&(
                    <>
                        {/* Billing Address */}
                        <Grid item container>      
                            <Grid  item xs={12} sm={12} md={12} style={{ marginBottom: '2vh' }}>  
                                    <span className={classes.spanTitle}>
                                        <Text tid={'Quote.BillingAddress'}/>
                                    </span>
                            </Grid>
                            
                            <Grid item xs={12} sm={12} md={12}>
                                <Grid item container spacing={2}>
                                    {values.maillingInCanada === true &&
                                         <>
                                         {/* <Grid item xs={12} md={6} lg={4} xl={4}>
                                            <Typography style={{ fontWeight: '600' }} >
                                                <Text tid={'Quote.SameMailingAddress'}/>
                                            </Typography>
                                                <Checkbox
                                                    name='sameMailAddress'
                                                    // checked= {values.sameMailAddress?values.sameMailAddress:false}
                                                    onChange={(e) => {
                                                        if (e.target.checked===true){
                                                            values.billStreetName = values.mailStreetName
                                                            values.billUnitApartmentNo = values.mailUnitApartmentNo
                                                            values.billCity = values.mailCity
                                                            values.billProvince = values.mailProvince
                                                            values.billPostalCode = values.mailPostalCode
                                                            values.billCountry = values.mailCountry
                                                        }else{
                                                            values.billStreetName = ''
                                                            values.billUnitApartmentNo = ''
                                                            values.billCity = ''
                                                            values.billProvince = ''
                                                            values.billPostalCode = ''
                                                            values.billCountry = ''
                                                        }
                                                        setFieldValue('sameMailAddress',e.target.checked)
                                                    }}
                                                />
                                        </Grid> */}
                                        <Grid item xs={12} sm={6} md={6} style={{ marginTop: isMobile ? '0' : '1vh' }}>  
                                            <span style={{fontSize:'14px', fontWeight:'600', marginLeft:'5px' }}>
                                                *<Text tid={'Quote.SameMailingAddress'}/> 
                                            </span>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={6} xl={6}>
                                            <ToggleButtonGroup
                                                className={classes.toggleButtonGroup}
                                                name="sameMailAddress"
                                                value={values.sameMailAddress}
                                                exclusive
                                                style={{ width: '100%'}}
                                                onChange={(e) => {
                                                    const val = e.currentTarget.value === 'true' ? true : false
                                                    if (e.currentTarget.value==='true'){
                                                        values.billStreetName = values.mailStreetName
                                                        values.billUnitApartmentNo = values.mailUnitApartmentNo
                                                        values.billCity = values.mailCity
                                                        values.billProvince = values.mailProvince
                                                        values.billPostalCode = values.mailPostalCode
                                                        values.billCountry = values.mailCountry
                                                    }else{
                                                        values.billStreetName = ''
                                                        values.billUnitApartmentNo = ''
                                                        values.billCity = ''
                                                        values.billProvince = ''
                                                        values.billPostalCode = ''
                                                        values.billCountry = ''
                                                    }
                                                    
                                                    setFieldValue('sameMailAddress', val)
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
                                        </>
                                    }
                                    {/* Street */}
                                    <Grid item xs={12} sm={5} md={5}>   
                                        <RegularTextFieldSmall
                                            name='billStreetName'
                                            label={'Quote.Street'}
                                            value={values.billStreetName}
                                            disabled={values.sameMailAddress===true?true:false}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage('billStreetName')}
                                    </Grid>

                                    {/* Unit Number */}
                                    <Grid item xs={5} sm={3} md={3}>   
                                        <RegularTextFieldSmall
                                            name='billUnitApartmentNo'
                                            label={'Quote.UnitNumber'}
                                            value={values.billUnitApartmentNo}
                                            disabled={values.sameMailAddress===true?true:false}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>

                                    {/* City */}
                                    <Grid item xs={7} sm={4} md={4}>   
                                        <RegularTextFieldSmall
                                            name='billCity'
                                            label={'Quote.City'}
                                            value={values.billCity}
                                            disabled={values.sameMailAddress===true?true:false}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {validMessage('billCity')}
                                    </Grid>

                                    {/* Province */}
                                    <Grid item xs={12} sm={5} md={4}>   
                                        <RegularTextFieldSmall
                                            name='billProvince'
                                            type="text"
                                            value={values.billProvince}
                                            disabled={values.sameMailAddress===true?true:false}
                                            label={'Quote.Province'}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            //label={<Text tid={'Vendor.Step1.PrimaryProvince'} />}
                                        />
                                        {validMessage('billProvince')}
                                    </Grid>

                                    {/* Postal Code */}
                                    <Grid item xs={12} sm={3} md={3}>
                                        {values.billCountry === 'CA'
                                            ?
                                            <>
                                            <label className={classes.inputLabel_manualForm}><Text tid={'Quote.PostalCode'}/></label>
                                            <InputMask
                                                name={`billPostalCode`}
                                                mask= {"a9a 9a9" }
                                                value={values.billPostalCode}
                                                onChange={(e)=>setFieldValue(`billPostalCode`,e.target.value.toUpperCase())}
                                                onBlur={handleBlur}                    
                                                >
                                                {() => (
                                                <RegularTextFieldSmall
                                                    type="text"
                                                    name="billPostalCode"
                                                    variant="outlined"
                                                    size="small" 
                                                />
                                                )}
                                            </InputMask>
                                            </>
                                            :
                                            <RegularTextFieldSmall
                                                name='billPostalCode'
                                                label= {'Quote.PostalCode'}
                                                value={values.billPostalCode}
                                                disabled={values.sameMailAddress===true?true:false}
                                                // onChange={handleChange}
                                                onChange={(e)=>setFieldValue(`billPostalCode`,e.target.value.toUpperCase())}
                                                onBlur={handleBlur}
                                            />
                                        }
                                        {validMessage('billPostalCode')}
                                    </Grid>

                                    {/* Country */}
                                    <Grid item xs={12} sm={4} md={5}>
                                        <Autocomplete        
                                            name={`billCountry`}    
                                            options={countries}
                                            value = {values.billCountry?countries.find(c=>c.country_code===values.billCountry):null}
                                            disabled={values.sameMailAddress===true?true:false}
                                            getOptionLabel={(option) => option.name}
                                            size="small"
                                            renderInput={(params) => 
                                                <RegularTextFieldSmall 
                                                    {...params} 
                                                    label= {'Quote.Country'}
                                                    style={{ width: !isMobile ? '96%' : '95%' }}
                                                />
                                            }
                                            onChange={(e, selectedVal)=>{
                                                values.billCountry = selectedVal? selectedVal.country_code: ''
                                            setFieldValue(`billCountry`, selectedVal?selectedVal.country_code:'')
                                            }}
                                            onBlur={() => setFieldTouched(`billCountry`)}
                                        />
                                        {validMessage('billCountry')}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )} 
                        
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
        </div>
    )
}

export default Payment
