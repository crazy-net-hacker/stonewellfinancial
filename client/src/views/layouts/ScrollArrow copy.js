import React, {useState, useEffect } from 'react';
// import {FaArrowCircleUp} from 'react-icons/fa';
import '../../App.css';
import ArrowUp from '../../assets/imgs/icons/up-chevron.svg'

const ScrollArrow = () =>{

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

  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 250){
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 250){
      setShowScroll(false)
    }
    
  };

  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => {
      window.removeEventListener('scroll', checkScrollTop)
    }
  } )


  return (
//         <FaArrowCircleUp className={ window.pageYOffset > 400 ? "scrollBottom" : "scrollTop"} onClick={scrollTop} 
//           style={{height: 40, width:'auto', color: '#8DC63F',  display: showScroll ? 'flex' : 'none'}}/>
        <img
        className="scrollTop"
        onClick={scrollTop} 
        src={ArrowUp}
        alt="Insurance icon"
        style={{ display: showScroll ? 'flex' : 'none', width: !isMobile ? '40px' : '30px', height: !isMobile ? '40px' : '30px', background:'#fff'}} 
        />
  );
}

export default ScrollArrow;
