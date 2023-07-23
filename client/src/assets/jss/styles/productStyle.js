import { theme } from '../theme'

const productStyles = {
  root: {
    padding: '0 2em',
  },
cardContent: {},
  grid: {
    position: 'relative',
    float: 'left',
    overflow: 'hidden',
    margin: 0,
    width: '100%',
    height: 'auto',
    marginBottom: "0.5em",
    background:"#fff",
 
    textAlign: 'center',
    cursor: 'pointer',
    '& img': {
      minHeight: '100%',
      maxWidth: '100%',
      opacity: '0.8',
    },
  },
  figureEffect: {
    background: '#130317',
    margin: "0 5px",
    '& img': {
      opacity: '0.9',
      transition: 'opacity 0.35s',
     
      //-webkit-transition: 'opacity 0.35s',
    },

    '&:hover': {
      '& img': {
        opacity: '0.4',
      },
      '& p': {
        opacity: 1,
        //-webkit-transform: scale3d(1, 1, 1),
        transform: 'scale3d(1, 1, 1)',
      },
      '& figcaption': {
        backgroundColor: 'rgba(58, 52, 42, 0)',
        '&::before': {
          opacity: 1,
          //-webkit-transform: scale3d(1, 1, 1),
          transform: 'scale3d(0, 0, 1)',
        },
        '& h3' : {
          opacity: 1,
          transition: 'opacity 0.35s',
        },
        '& h4' : {
          opacity: 1,
          transition: 'opacity 0.35s',
        },
        '& h5' : {
          opacity: 1,
          transition: 'opacity 0.35s',
        },
        
       
      },
      // Link: {
      //   opacity: 1,
      // },
    },
    '& figcaption': {
      '&::before': {
        position: 'absolute',
        top: '30px',
        right: '30px',
        bottom: '30px',
        left: '30px',
        border: '2px solid #fff',
        boxShadow: '0 0 0 30px rgba(255, 255, 255, 0.2)',
        content: '""',
        opacity: '0',
        //-webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
        transition: 'opacity 0.35s, transform 0.35s',
        // -webkit-transform: scale3d(1.4, 1.4, 1);
        transform: 'scale3d(1.4, 1.4, 1)',
      },
    },
    '& h3': {
   
      width: '100%',
      color: 'white',
      fontSize:'1.2rem',
      marginBottom: 0,
      paddingBottom: 0,
      transform: 'translateY(-50%)',
      margin: 0,
      padding: 0,
      textShadow: 'black 0.1em 0.1em 0.2em',
      opacity: 0
      
    },
    '& h4': {
   
      width: '100%',
      color: 'white',
     
      marginBottom: 0,
      paddingBottom: 0,
      transform: 'translateY(-50%)',
      margin: 0,
      padding: 0,
      textShadow: 'black 0.1em 0.1em 0.2em',
      opacity: 0
      
    },
    '& h5': {
      width: '100%',
      color: 'white',
     
      marginBottom: 0,
      paddingBottom: 0,
      transform: 'translateY(-50%)',
      margin: 0,
      padding: 0,
      textShadow: 'black 0.1em 0.1em 0.2em',
      opacity: 0
    },
    
  },
  cardTitle: {
    lineHeight: 2,
    opacity: 1,
    '& h3': {
      paddingLeft: '20px',
      fontSize:'1.2rem',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '0',
        textAlign:'center',
        fontSize:'1.2rem'
      },
    },
    '& h4': {
      paddingLeft: '20px',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '0',
        textAlign:'center',
        fontSize:'1.2rem'
      },
    },
    
  },
  carouselBtn: {
    color: '#2a2f71',
    backgroundColor: '#fff',
    border: "2px solid #2a2f71",
    marginTop: '10px',
    
  },
  cardText: {
    top: "50%",
    left: "0",
    position: 'absolute',
    padding: "0 30px",

  }


}

export default productStyles