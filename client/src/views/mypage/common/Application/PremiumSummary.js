import { Grid, Box, makeStyles } from '@material-ui/core'
import React from 'react'
// components
import { Text } from '../../../../components/common/LanguageProvider'

import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'
//
import { amountFormat } from '../../../../controllers/dataFormat'

const useStyles = makeStyles(vendorFormStyle)

const PremiumSummary = (props) => {
  const classes = useStyles()

  const { values } = props
  var total = 0

  return (
    <>
      <Box style={{ margin: 20 }}>
        <Grid container className={classes.premium}>
          <Grid item xs={12} sm={8}></Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              fontWeight: '500',
              color: '#2a2f71',
              fontSize: '20px',
              // padding: '20px',
              // border: '1px solid #222',
              // borderRadius: '10px',
              textAlign:'end'
            }}
          >
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
            <Text tid={'Vendor.Step3.TotalPaymentAmount'} />
            <span style={{ marginLeft:'30px' }}>{amountFormat(total)}</span>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PremiumSummary
