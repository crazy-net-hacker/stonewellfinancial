import React  from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, Grid, Typography, Paper
} from '@material-ui/core'
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from '../../../components/common/CustomButtons/Button'
import MUIDataTable from "mui-datatables";
// import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999999,
  },
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  }
}))



const SearchInsuredModal = (props) => {
  const { open, setOpen, insured, person } = props

  // declaration
  const classes = useStyles()

  const handleSelected = (row) => {
    // console.log('handleSelected',row)
    person.firstName = row[1]
    person.lastName = row[2]
    person.gender = row[3]
    person.birthDate = new Date(row[4]+'T00:00:00')
    // row[5] //email
    // row[6] //phone
    setOpen(false)
  }

  //
  const columns = getColumns()
 
  // Column definitions
  function getColumns(){
    const columns=[
        {name: '',
            options: { 
            customBodyRender: (value, tableMeta) => {
              return (
                  <Button 
                    color="dark"
                    onClick={()=>{
                      // console.log('tableMeta',tableMeta)
                      handleSelected(tableMeta.rowData)
                    }}
                    > 
                    Select
                  </Button>
              );
            }
          }
        },
        {name: "firstName", label: "First Name" },
        {name: "lastName", label: "Last Name" },
        {name: "gender", label: "Gender" },
        {name: "birthDate", label: "Date of birth" },
        {name: "email", label: "Email" },
        {name: "phone", label: "Phone" },
      ]
    return (columns)
  }

  const options = {
    filter: false,
    filterType: "dropdown",
    selectableRows: 'none',  //'multiple',
    responsive: "standard",  //"vertical",
    // rowStyle: {height: 30},
    viewColumns: false,
    download: false,
    print: false,   
    expandableRows: false,
    searchOpen: true,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 50, 100, 200],
  };


  return (
    <Dialog
      fullWidth maxWidth="md" 
      open={open}
      onClose={() => setOpen(false)}
    >
      <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
        <Typography variant="h2" className={classes.formTitle}>
          Search insured
        </Typography>
      </MuiDialogTitle>

      <DialogContent style={{ marginTop:'2vh' }}>
        {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
        <Paper sx={{ width: '100%' }}>
            <MUIDataTable
              title= ''
              data={insured}
              columns={columns}
              options={options}
            />
        </Paper>
      </DialogContent>

      <DialogActions>
        <Grid container spacing={2} justify="flex-end"  style={{ margin:'2vh' }}>
          <Button
            color="secondary"
            onClick={() => {setOpen(false)}} 
            >
            Cancel
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>

  )
}

export default SearchInsuredModal