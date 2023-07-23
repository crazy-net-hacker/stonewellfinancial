import React, {useState, useEffect, useContext } from 'react';
import { languageOptions } from '../languages'
import { LanguageContext } from '../common/LanguageProvider'
import LanguageModal from './LanguageModal';

export default function LanguageSelector(props) {
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  // set selected language by calling context method
  const handleLanguageChange = (e) => userLanguageChange(e.target.value)
 
  // check if modal should be displayed on first visit
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const visitedBefore = localStorage.getItem('visitedBefore');
    if (!visitedBefore) {
      setShowModal(true);
      localStorage.setItem('visitedBefore', true);
    }
  }, []);

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
      <select
        className={props.className}
        onChange={handleLanguageChange}
        value={userLanguage}
        style={{ marginLeft: 10, background:'#fafbfd', border:0, fontSize:'13px', marginTop:isMobile?'14px':'0' }}
      >
        {Object.entries(languageOptions).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {showModal && <LanguageModal closeModal={() => setShowModal(false)} />}
    </>
  )
}
