import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    
    maxWidth:'1000px',
    '& > *': {
      borderBottom: 'unset',
    },
  },
  boxWrapper: {
    width:"10%",
    
  }
});

function createData(name) {
  return {
    name,
    benefits: [
      { title: 'Sum insured', amount: '$2 million or $5 million' },
      { title: 'Included in the overall maximum :', amount: '' },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment >
      <TableRow className={classes.root}>
        <TableCell className={classes.boxWrapper}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
             
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Plan</TableCell>
                    <TableCell>Maximum coverage amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.benefits.map((benefitsRow) => (
                    <TableRow key={benefitsRow.title}>
                      <TableCell component="th" scope="row">
                        {benefitsRow.title}
                      </TableCell>
                      <TableCell>{benefitsRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


const rows = [
  createData('See Benefits Detail'),
 
];

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}  >
      <Table aria-label="collapsible table">
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}