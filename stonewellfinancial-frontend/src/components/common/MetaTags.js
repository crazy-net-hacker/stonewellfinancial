// components/Meta
/* eslint-disable no-undefined */
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageContext, Text, supportLanguages } from './LanguageProvider';


const MetaTags = ({ data }) => {
  let lang = useContext(LanguageContext).userLanguage
  const htmlLang =  supportLanguages.filter(f=>f.navigatorLanguage===lang).length>0?supportLanguages.filter(f=>f.navigatorLanguage===lang)[0].lang:'en'

  const title = Text({tid:data.title}); //data.title;
  const description = Text({tid:data.description}); //data.description;
  // const image = data.image !== undefined && `${data.image}`;
  const canonical = `https://www.stonewellfinancial.com${data.canonical}`;  
  const type = 'website';
  // const width = data.image && (data.width || 1200);
  // const height = data.image && (data.height || 630);

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title} | Stonewell Financial Service</title>
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {/* {image ? <link rel="image_src" href={image} /> : null}
      {image ? <meta itemprop="image" content={image} /> : null} */}

      {/* <meta property="og:site_name" content="Stonewell Financial Service" /> */}
      <meta property="og:title" content={title} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:locale" content={lang} />
      <meta property="og:type" content={type} />
      {/* {image ? <meta property="og:image" content={image} /> : null}
      {width ? <meta property="og:image:width" content={width} /> : null}
      {height ? <meta property="og:image:height" content={height} /> : null} */}
      {/* <meta property="fb:pages" content="Stonewell Financial Service" /> */}

      {/* change type of twitter if there is no image? */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      {/* {image ? <meta name="twitter:image" content={image} /> : null} */}
      <meta name="twitter:site" content="https://www.stonewellfinancial.com" />

      {canonical 
          ? <link rel="alternate" href={canonical} hreflang={htmlLang} />
          : <link rel="alternate" href={`https://www.stonewellfinancial.com`} hreflang={htmlLang}/>
      }

    </Helmet>
  );
};

export default MetaTags;