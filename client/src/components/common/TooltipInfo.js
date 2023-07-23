import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../assets/jss/styles/formStyle';

//setup form style
const useStyles = makeStyles(formStyle)

export default function TooltipInfo(props) {
  const { info } = props

  //set to form style
  const classes = useStyles()

  return(
    <Tooltip title={info} placement="right-end" enterTouchDelay={0}>
        <InfoIcon className={classes.infoIcon}/>
    </Tooltip> 
  )
}