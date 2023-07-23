import React, { useContext } from 'react';
import { LanguageContext } from '../common/LanguageProvider';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Dialog, DialogContent, DialogActions,
  Button, Typography
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
// import { MdClose } from 'react-icons/md';
import { SelectTextFieldSmall } from '../../components/common/CustomTextFields/TextFieldSmall'

const useStyles = makeStyles((theme) => ({
  formTitle: { 
    fontSize: '1.4rem',
    marginTop:'3vh'
 },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

// Lanugages
const languages = [
    { code: 'en', name: 'English'},
    { code: 'fr', name: 'Français'},
    { code: 'ko', name: '한국어'},
    { code: 'ar', name: 'عربي'},
    { code: 'yue', name: '粵語'},
    { code: 'ch_s', name: '简体中文'},
    { code: 'ch_t', name: '中国传统的'},
    { code: 'de', name: 'Deutsch'},
    { code: 'es', name: 'Español'},
    { code: 'fa', name: 'فارسی'},
    { code: 'ja', name: '日本語'},
    { code: 'pt_br', name: 'Português (Brasil)'},
    { code: 'vi', name: 'Tiếng Việt'},
]

export default function LanguageModal({ closeModal }) {
  const { userLanguageChange } = useContext(LanguageContext);
  const classes = useStyles();

  const handleLanguageSelect = (language) => {
    userLanguageChange(language);
    // closeModal();
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={true} >
      <MuiDialogTitle disableTypography>
        <Typography variant="h2" align="center" className={classes.formTitle}>
          Select language preference
        </Typography>
        {/* <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={closeModal}
        >
          <MdClose />
        </IconButton> */}
      </MuiDialogTitle>
      <DialogContent>
        {/* <Typography variant="h6">Please select your preferred language:</Typography> */}
        <Grid item container alignItems='center' justify='center'>
            <Grid item xs={12} sm={12} md={10} lg={8}>
                <SelectTextFieldSmall
                    // label= {'Vendor.Language'} 
                    name={`preferLanguage`}
                    // value={values.preferLanguage}
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    // onBlur={handleBlur}
                >
                    <option value="" hidden>Select</option>
                    {languages.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </SelectTextFieldSmall>
            </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={closeModal} color="primary" style={{ margin:'1vh' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
