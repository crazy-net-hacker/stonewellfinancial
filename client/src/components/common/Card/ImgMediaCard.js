import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Button from '../CustomButtons/Button';
import Typography from '@mui/material/Typography';

export default function ImgMediaCard(props) {      
  
  const { cardLists } = props;

  //Responsive Design
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  let isMobile = (width <= 768);

  return (
    <>
        {cardLists.map((list, index) => (
        <Card key={index} sx={{ maxWidth: 400, width: isMobile?'100%':'30%' }} style={{ margin:'5px', padding:'10px', height:'fit-content' }}>
            <CardContent style={{ height: list.type ? 'auto' : 250, textAlign:'center'  }}>
                {list.icon}
                <Typography gutterBottom variant="h5" component="div" style={{ paddingBottom:'1vh', fontSize:'18px', fontWeight:'600' }}>
                    {list.title}
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary" style={{ marginTop:'2vh' }}>
                    {list.description}
                </Typography>
            </CardContent>
            {list.button1 ?
                <CardActions style={{ width:'100%' }}>
                    <Link to={list.button1Link} style={{ width:'100%' }}><Button color="dark"  style={{ width:'100%' }}>{list.button1}</Button></Link>
                </CardActions>
            :null}
        </Card>
        ))}
    </>
  );
}
