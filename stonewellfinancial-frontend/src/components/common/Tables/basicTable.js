import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { Text } from '../LanguageProvider';
import { Tooltip } from '@material-ui/core';
//icon
import HelpIcon from '@mui/icons-material/Help';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2a2f71',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function CustomizedTables(props) {
  const { rows } = props
  return (
    <TableContainer style={{ marginTop:'10px', border:'1px solid rgba(224, 224, 224, 1)', width:'100%'}}>
      {/* <Table sx={{ minWidth: 700 }} aria-label="customized table"> */}
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{width:'40%'}}><Text tid={'Benefits'} /></StyledTableCell>
            <StyledTableCell><Text tid={'Insured Amount'} /></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                <Text tid={row.title} />
                {row.tooltip ? 
                <Tooltip title={<Text tid={row.tooltip}/>} placement="right-end" color="primary" enterTouchDelay={0}>
                    <HelpIcon/>
                </Tooltip>
                : null }
              </StyledTableCell>
              <StyledTableCell><Text tid={row.details} /></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
