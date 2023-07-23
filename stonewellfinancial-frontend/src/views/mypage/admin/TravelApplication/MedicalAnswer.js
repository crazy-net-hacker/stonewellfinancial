import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplicantMedicalAnswer } from '../../../../redux/actions/travelApplicationAction';
//
import { Box, Typography } from '@material-ui/core'
import queryString from 'query-string';
// medical questionniar
import MedAnswerTugo from './MedAnswerTugo';
import MedAnswerAllianz from './MedAnswerAllianz';
//
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100px - 100%)',
    background: '#ECEEF6',
  },
  xsDown: {
    color: '#111',
    fontSize: '24px',
    paddingTop: '2vh',
    paddingLeft: '24px',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      fontSize: '1.5em',
      justifyContent: 'center',
    },
  },
  containner: {
    padding: '3vh'
  }
}))

export default function MedicalAnswer(match) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const answer = useSelector(state => state.travelApplicationReducer.answer)
  const error = useSelector(state => state.travelApplicationReducer.error)
  const loading = useSelector(state => state.travelApplicationReducer.loading)

  const params =  queryString.parse(match.location.search)

  useEffect(() => {
    dispatch(getTravelApplicantMedicalAnswer({app_id:params.app_id,insrued_id:params.insured_id}))
    }, [dispatch, params.app_id, params.insured_id]);

  if(loading) return (
    <div>
      <CircularProgress/>
    </div>
    )
  if(error && !loading) return('Error')
    
  return (
    <>
    <div>
    <Box style={{ marginBottom: '30px' }}>
      <Typography variant="h2" className={classes.xsDown}>
        Travel Application
      </Typography>
    </Box>

    <div className={classes.containner}>
      <Typography variant="subtitle1" >
        Application # {params.app_id}
      </Typography>
      <Typography variant="subtitle1" style={{marginBottom:'2vh'}}>
        Insrued id {params.insured_id}
      </Typography>

      {answer.length > 0 &&
        params.insurance === 'Tugo' &&
          <MedAnswerTugo
            medAnswer={answer}
          />
      }

      {answer.length > 0 &&
        params.insurance === 'Allianz' && 
        // params.type === 'CANADIAN' &&
          <MedAnswerAllianz
            medAnswer={answer}
          />
      }
      
    </div>


    </div>
    </>
  );
}