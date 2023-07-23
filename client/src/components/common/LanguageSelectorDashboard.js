import React, { useContext, useState } from 'react'
// import { languageOptions } from '../languages'
import { LanguageContext } from '../common/LanguageProvider'
//assets/imgs/stonewell_logo.png
import ReactFlagsSelect from 'react-flags-select';



export default function LanguageSelectorDashboard(props) {
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  // set selected language by calling context method
  const handleLanguageChange = (e) => userLanguageChange(e.target.value)

  const [selected, setSelected] = useState('');

 
  return (
    // <select
    //   className={props.className}
    //   onChange={handleLanguageChange}
    //   value={userLanguage}
    //   style={{ marginRight: 10 }}
    // >
    //   {Object.entries(languageOptions).map(([id, name]) => (
    //     <option key={id} value={id}>
    //       {name}
    //     </option>
    //   ))}
    // </select>

    <ReactFlagsSelect
      selected={selected}
      onSelect={code => setSelected(code)}
      onChange={handleLanguageChange}
      value={userLanguage}
      // defaultCountry="CA"
      countries={["CA", "KR"]}
      customLabels={{
        "CA": { primary: "Canada" },
        "KR": { primary: "Korean" }
      }}
    />

    
  
  )
}
