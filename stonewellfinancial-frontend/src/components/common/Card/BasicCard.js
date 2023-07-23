import * as React from 'react';
// import Box from '@mui/material/Box';
import Grid from '@material-ui/core/Grid'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

export default function BasicCard(props) {

  const { cardContents } = props;

  return (
    <>
       
        {cardContents.map((con, index) => (
          <Grid item key={index} xs={12} sm={12} md={4} lg={3}>
            <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {con.title}
                </Typography>
                <Typography variant="h5" component="div">
                {con.amount}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">{con.button}</Button>
            </CardActions>
            </Card>
          </Grid>
        ))}
        
    </>
  );
}
