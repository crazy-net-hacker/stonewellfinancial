import React, { useState, useEffect, useCallback } from 'react';
import '../../App.css';
import ArrowUp from '../../assets/imgs/icons/up-chevron.svg';

const ScrollArrow = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [showScroll, setShowScroll] = useState(false);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 250) {
      setShowScroll(true);
    } else if (showScroll && (window.pageYOffset <= 250 || !document.documentElement)) {
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      checkScrollTop();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [checkScrollTop]);

  let isMobile = width <= 768;

  return (
    <React.Fragment>
      {document && (
        <img
          className={showScroll ? 'scrollTop' : 'hideScroll'}
          onClick={scrollTop}
          src={ArrowUp}
          alt="Scroll to top"
          style={{
            display: showScroll ? 'flex' : 'none',
            width: !isMobile ? '40px' : '30px',
            height: !isMobile ? '40px' : '30px',
            background: '#fff',
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ScrollArrow;
