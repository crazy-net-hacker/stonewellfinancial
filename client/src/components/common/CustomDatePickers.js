import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { useField } from "formik";
import { MuiPickersUtilsProvider, KeyboardDatePicker, 
  // DatePicker
 } from "@material-ui/pickers";
//  import { theme } from "../../assets/jss/theme";


export const KeyboardDatePickerField = ({ ...props }) => {
  const [field] = useField(props);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} >
      <KeyboardDatePicker
        {...field}
        {...props}
        autoOk
         // variant="inline"  // no display clear cancel ok buttons
        // name={field.name}
        inputVariant="outlined"
        format="MM/dd/yyyy"
        placeholder="mm/dd/yyyy"
        InputAdornmentProps={{ position: "start"}}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
        views={["year", "month", "date"]}
        showTodayButton
        helperText={''}
        // style={{
        //   marginLeft:'0',
        //   width:'100%',
        //   [theme.breakpoints.down('md')]: {
        //     marginLeft:'10',
        //   },
        // }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default KeyboardDatePickerField;


// export const DatePickerField = ({ ...props }) => {
//   const { setFieldValue } = useFormikContext();
//   const [field] = useField(props);
//   return (
//     <MuiPickersUtilsProvider utils={DateFnsUtils}>
//       <DatePicker
//         {...field}
//         {...props}
//         autoOk
//           name={field.name}
//           variant="inline"
//           // label="Date"
//           format="MM/dd/yyyy"
//           placeholder="MM/dd/yyyy"
//           onChange={value => {
//             // console.log("setting value to", value);
//             setFieldValue(field.name, value) 
//           }}
//           // value={value}
//           animateYearScrolling={false}
//           views={["year", "month", "date"]}
//       />
//     </MuiPickersUtilsProvider>
//   );
// };

// export default DatePickerField;