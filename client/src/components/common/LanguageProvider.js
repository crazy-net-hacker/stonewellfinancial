import React, { useState, createContext, useContext } from 'react';

import { languageOptions, dictionaryList } from '../languages';

export const supportLanguages = [
  {lang:'ko-KR', navigatorLanguage: 'ko'},
  {lang:'ko', navigatorLanguage: 'ko'},
  {lang:'ar-SA', navigatorLanguage: 'ar'},
  {lang:'zh-CN',navigatorLanguage: 'ch_s'},
  {lang:'zh-TW', navigatorLanguage: 'ch_t'},
  {lang:'de-DE', navigatorLanguage: 'de'},
  {lang:'es-ES', navigatorLanguage: 'es'},
  {lang:'fa-IR', navigatorLanguage: 'fa'},
  {lang:'fr-CA', navigatorLanguage: 'fr'},
  {lang:'ja-JP', navigatorLanguage: 'ja'},
  {lang:'pt-BR', navigatorLanguage: 'pt_br'},
  {lang:'zh-HK', navigatorLanguage: 'yue'}
]


// create the language context with default selected language
export const LanguageContext = createContext({
  userLanguage: 'en',
  dictionary: dictionaryList.en
});

// it provides the language context to app
export function LanguageProvider({ children }) {

  const defaultLanguage = window.localStorage.getItem('transl-lang');
  const lang = navigator.language  || navigator.languages[0] || navigator.userLanguage;
  // const navigatorLanguage = (lang === 'ko' || lang === 'ko-KR')? 'ko' : 'en';
  const navigatorLanguage = supportLanguages.filter(f=>f.lang===lang).length>0 ? supportLanguages.filter(f=>f.lang===lang)[0].navigatorLanguage : 'en';
  const [userLanguage, setUserLanguage] = useState(defaultLanguage || navigatorLanguage || 'en');

  const provider = {
    userLanguage,
    dictionary: dictionaryList[userLanguage],
    userLanguageChange: selected => {
      const newLanguage = languageOptions[selected] ? selected : 'en'
      setUserLanguage(newLanguage);
      window.localStorage.setItem('transl-lang', newLanguage);
      // console.log('SetUserLang', newLanguage)
    }
  };

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
};

// get text according to id & current language
export function Text({ tid }) {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary[tid] || tid;
};
