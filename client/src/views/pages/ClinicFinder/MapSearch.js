import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Button from '../../../components/common/CustomButtons/Button'
import Box from '@material-ui/core/Box'
const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    width: '100%',
  },
}))


export default function MapSearch(props) { 
  const classes = useStyles()

  return (
    <Box my={3}>
      <Grid className={classes.root} container>
        <Grid container item xs={12} sm={10} spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Postal Code"
              id="postalCode"
              name="postalCode"
              className={classes.formControl}
              value={props.postalCode}
              onChange={props.handleChange}
              helperText={props.errors.postalCode && 'Please enter valid postal code'}
              error={!!props.errors.postalCode}
              /*InputLabelProps={{
                shrink: true,
              }}*/
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                select
                label="Insurance Company"
                value={props.insCompany}
                onChange={props.handleChange}
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
                disabled={!props.enabled}
                inputProps={{
                  name: 'insCompany',
                  id: 'insCompany',
                }}
              >
                <option value="All">All</option>
                <option value="ICO00001">Allianz</option>
                <option value="ICO00002">Tugo</option>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                select
                label="Radius"
                value={props.radius}
                onChange={props.handleChange}
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
                disabled={!props.enabled}
                inputProps={{
                  name: 'radius',
                  id: 'radius',
                }}
              >
                <option value="All">All</option>
                <option value={10}>10 Km</option>
                <option value={25}>25 Km</option>
                <option value={50}>50 Km</option>
                <option value={100}>100 Km</option>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                select
                label="Results"
                value={props.results}
                onChange={props.handleChange}
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
                disabled={!props.enabled}
                inputProps={{
                  name: 'radius',
                  id: 'radius',
                }}
              >
                <option value="All">All</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={props.clickEvent}
            color="secondary"
            fullWidth
            style={{ margin: 2, marginTop: '13px' }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}



// export default (props) => {
//   const classes = useStyles()

//   return (
//     <Box my={3}>
//       <Grid className={classes.root} container>
//         <Grid container item xs={12} sm={10} spacing={2}>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               className={classes.formControl}
//               label="Postal Code"
//               id="postalCode"
//               name="postalCode"
//               value={props.postalCode}
//               onChange={props.handleChange}
//             />
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <FormControl className={classes.formControl}>
//               <InputLabel shrink htmlFor="insCompany">
//                 Insurance Company
//               </InputLabel>
//               <NativeSelect
//                 value={props.insCompany}
//                 onChange={props.handleChange}
//                 inputProps={{
//                   name: 'insCompany',
//                   id: 'insCompany',
//                 }}
//               >
//                 <option value="All">All</option>
//                 <option value="ICO00001">Allianz</option>
//                 <option value="ICO00002">Tugo</option>
//               </NativeSelect>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <FormControl className={classes.formControl}>
//               <InputLabel shrink htmlFor="radius">
//                 Radius
//               </InputLabel>
//               <NativeSelect
//                 value={props.radius}
//                 onChange={props.handleChange}
//                 SelectProps={{
//                   native: true,
//                 }}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 inputProps={{
//                   name: 'radius',
//                   id: 'radius',
//                 }}
//               >
//                 <option value="All">All</option>
//                 <option value={10}>10 Km</option>
//                 <option value={25}>25 Km</option>
//                 <option value={50}>50 Km</option>
//                 <option value={100}>100 Km</option>
//               </NativeSelect>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={3}>

//             <FormControl className={classes.formControl}>
//               <InputLabel shrink htmlFor="results">
//                 Results
//               </InputLabel>
//               <NativeSelect
//                 value={props.results}
//                 onChange={props.handleChange}
//                 inputProps={{
//                   name: 'results',
//                   id: 'results',
//                 }}
//               >
//                 <option value="All">All</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </NativeSelect>
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Grid item xs={12} sm={2}>
//           <Button
//             onClick={props.clickEvent}
//             color="secondary"
//             fullWidth
//             style={{ margin: 2 }}
//           >
//             Search
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

