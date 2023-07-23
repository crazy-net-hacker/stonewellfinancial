import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { sellTugoPolicy } from '../../../../redux/actions/travelApplicationAction';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// functionalities
import { amountFormat } from '../../../../controllers/dataFormat';

const TugoSellSubmitResult = (props) => {
  const { id, formData, result } = props;

  const dispatch = useDispatch();
  const sellTugoPolicyResult  = useSelector((state) => state.travelApplicationReducer.sellTugoPolicyResult)
  const sellTugoPolicyLoading = useSelector(state => state.travelApplicationReducer.sellTugoPolicyLoading)
  const sellTugoPolicyError = useSelector(state => state.travelApplicationReducer.sellTugoPolicyError)


  useEffect(()=>{
      dispatch(sellTugoPolicy({application_id:id, data: formData})) 
  }, [dispatch, id, formData]);
    
  
  return(
    <Grid container style={{ margin: '2vh 0 3vh 0' }} spacing={3}>
      {sellTugoPolicyLoading 
        ?
        <Grid item xs={12}>
          <Alert severity='info'>   
              <AlertTitle>Processing</AlertTitle>
                Selling policies ... 
          </Alert>
        </Grid>
        :null
      }

      {!sellTugoPolicyError && !sellTugoPolicyLoading && (sellTugoPolicyResult.length>0 || sellTugoPolicyResult.status === 'error') &&
        <>
          <Grid item xs={12}>
            {(sellTugoPolicyResult.length > 0) && (
              <>
              Result from Tugo
              {sellTugoPolicyResult.map((r, rIndex) => (
                <React.Fragment key ={rIndex}>
                  <Grid item xs={12} style={{marginTop:'1vh'}}>
                    <Alert severity= {r.status} >
                      { r.message === 'Sell' 
                        ? <AlertTitle>{r.message} - {r.status}</AlertTitle>
                        : <AlertTitle>{r.message} </AlertTitle>
                      }
                      {r.status === 'error'
                        ?r.result.map((d, dIndex)=>(
                          <React.Fragment key ={dIndex}>
                            <Grid item container>
                                {d.text?d.text:d.detailMessage}
                            </Grid>
                          </React.Fragment>
                          ))
                        : <Grid item container>
                          { r.message === 'Quote' && 
                            <> 
                              {r.result.selectedPlanPriceBreakDown.map((p, pIndex)=>(
                                <React.Fragment key ={pIndex}>
                                  <Grid item xs={3}>
                                    Age : {p.priceItems.find(f=>f.code === 'AGE').value}
                                  </Grid>
                                  <Grid item xs={9} container>
                                    <Grid item xs={12}>
                                      Plan Name : {p.planName}
                                    </Grid>
                                    <Grid item xs={12}>
                                      Premium : {amountFormat(p.premium,2)}
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              ))}
                              <Grid item xs={12} style={{marginTop: '1vh'}}>
                                Total Premiums :  {amountFormat(r.result.totalPremiums,2)}       
                              </Grid>
                            </>
                          }
                          { r.message === 'Sell' && 
                            <> 
                            {r.result.trip && (
                              <Grid item container spacing={1}>
                                <Grid item xs={3}>
                                  Trip
                                </Grid>
                                <Grid item xs={9}>
                                  {r.result.trip.startDate} - {r.result.trip.endDate}
                                </Grid>
                              </Grid>
                            )}
                            <Grid item container spacing={1}>
                              <Grid item xs={12} style={{marginTop:'1vh'}} > 
                                Insured Person
                              </Grid>
                              {r.result.insuredPersons.length > 0 && 
                                r.result.insuredPersons.map((person, personIndex)=>(
                                  <React.Fragment key ={personIndex}>
                                    <Grid item xs={3}>{`${person.lastName}, ${person.firstName}`}</Grid>
                                    <Grid item xs={9} container>
                                      {person.selectedPlans.map((plan, planIndex)=>(
                                        <React.Fragment key ={planIndex}>
                                          <Grid item xs={12}>
                                            {plan.priceBreakdown.planName}
                                          </Grid>
                                          <Grid item xs={12}>
                                            {amountFormat(plan.priceBreakdown.premium,2)}
                                          </Grid>
                                        </React.Fragment>
                                      ))}
                                    </Grid>

                                  </React.Fragment>
                                ))
                              }
                              <Grid item xs={3}>
                                Total Premiums
                              </Grid>
                              <Grid item xs={9}>
                                {r.result.policyInfo.chargedPrice.total?amountFormat(r.result.policyInfo.chargedPrice.total,2):''} {`(${r.result.policyInfo.paymentStatus})`}
                              </Grid>
                            </Grid>
                            
                            {r.result.policyInfo && (
                              <Grid item container spacing={1} style={{marginTop: '1vh'}}>
                                <Grid item xs={3}>
                                  Policy Status
                                </Grid>
                                <Grid item xs={9}>
                                  {r.result.policyInfo.policyStatus?r.result.policyInfo.policyStatus:''}
                                </Grid>
                                <Grid item xs={3}>
                                  Policy Number
                                </Grid>
                                <Grid item xs={9}>
                                  {r.result.policyInfo.policyNumber?r.result.policyInfo.policyNumber.referenceNumber:''}
                                </Grid>
                              </Grid>
                            )}
                            </>
                          }
                        </Grid>
                      }
                  </Alert>
                  </Grid>
                </React.Fragment>
              ))}
              </>
            )}

            {sellTugoPolicyResult.status === 'error'&&
              <Alert severity={sellTugoPolicyResult.status} >
                <AlertTitle>{sellTugoPolicyResult.status}</AlertTitle>
                {sellTugoPolicyResult.message }
              </Alert>
            }

          </Grid>
          <Grid container justify="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                var sellingResult = '' 
                if (sellTugoPolicyResult.length > 0 && sellTugoPolicyResult.filter(f=>f.message==='Sell').length > 0){
                    sellingResult = (sellTugoPolicyResult.filter(f=>f.message==='Sell').map(r=>r.status)).filter(f=>f==='success').length > 0 
                                      ? 'success' : 'error';
                }                 
                result(sellingResult)
              }}
            >
              OK
            </Button>
          </Grid>
        </>
      }

    </Grid>
  );

};

export default TugoSellSubmitResult;